"use client";

import React, { useEffect, useMemo } from "react";
import { cn, formatCurrency, handleErrorApi } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { CheckCircle2, CreditCard, X } from "lucide-react";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import consultationApiRequest from "../concultation/consultationApiRequest";
import { useDashboardContext } from "@/providers/dashboard-providers";
import { useAppContext } from "@/providers/app-proviceders";
import {
  defaultPrescriptionPreparePayment,
  PharPaymentRequest,
  PharPaymentRequestSchema,
  PrescriptionPreparePayment,
  PrescriptionPreparePaymentSchema,
} from "../drug-store/drug-store.schema";
import drugStoreApiRequest from "../drug-store/drugStoreApiRequest";
import { HttpStatus } from "@/constants/enum";
import { useToast } from "../ui/use-toast";
import { logger } from "@/lib/logger";
import { Badge } from "../ui/badge";

export default function PrescriptionPaymentForm() {
  const form = useForm<PrescriptionPreparePayment>({
    // Sử dụng any hoặc extend schema để hỗ trợ availablePlots
    resolver: zodResolver(PrescriptionPreparePaymentSchema),
    defaultValues: defaultPrescriptionPreparePayment,
  });
  const isProcessed = form.watch("isProcessed");

  const { customerSelected } = useDashboardContext();
  const { setLoadingOverlay } = useAppContext();
  const { toast } = useToast();

  useEffect(() => {
    if (customerSelected?.ticketId && customerSelected.ticketId.length > 0) {
      getPrescriptionByTicket(customerSelected.ticketId);
    }
  }, [customerSelected]);

  const getPrescriptionByTicket = async (ticketId: string) => {
    setLoadingOverlay(true);
    try {
      const res =
        await consultationApiRequest.getPrescriptionByTicketId(ticketId);

      if (res.payload?.result?.prescriptionId != null) {
        const presData = res.payload.result;

        const preparePaymentRes =
          await drugStoreApiRequest.preparePrescriptionPayment(
            presData.prescriptionId,
          );

        if (preparePaymentRes.status == HttpStatus.SUCCESS) {
          const preparePaymentData = preparePaymentRes.payload?.result;

          // Transform dữ liệu: Thêm isSelected và tự động chọn Plot đầu tiên
          const formattedItems = (preparePaymentData.items || []).map(
            (item: any) => {
              const firstPlot = item.availablePlots?.[0];
              return {
                ...item,
                quantityToBuy: item.quantityOrdered,
                isSelected: true,
                selectedPlotId: firstPlot?.plotId || null,
                // Nếu API chưa có price ở cấp item, lấy sellPrice từ plot đầu tiên
                price: item.price || firstPlot?.sellPrice || 0,
              };
            },
          );

          form.reset({
            ...preparePaymentData,
            items: formattedItems,
          });
        }
      } else {
        form.reset(defaultPrescriptionPreparePayment);
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoadingOverlay(false);
    }
  };

  const onSubmit = async (data: PrescriptionPreparePayment) => {
    try {
      // 1. Mapping từ Form Data (PreparePayment) sang API DTO (ProcessPayment)
      const paymentPayload: PharPaymentRequest = {
        prescriptionId: data.prescriptionId,
        storeId: data.storeId || "", // Lấy từ kết quả prepare payment
        note: "", // Có thể bổ sung input note vào UI nếu cần
        items: data.items
          .filter((item) => item.isSelected && !item.paid) // Chỉ lấy các item được chọn
          .map((item) => {
            // Tìm lô đang được chọn trong danh sách availablePlots
            const selectedPlot = item.availablePlots?.find(
              (p) => p.plotId === item.selectedPlotId,
            );

            return {
              drugMaterialId: item.drugMaterialId,
              plotId: item.selectedPlotId || "",
              quantity: item.quantityOrdered, // Số lượng khách thực mua
              sellPrice: selectedPlot?.sellPrice,
              vatPercent: 0, // Mặc định 0 theo DTO
            };
          }),
      };

      // 2. Validate dữ liệu trước khi gửi (Optional nhưng nên có)
      const validatedData = PharPaymentRequestSchema.parse(paymentPayload);

      // 3. Gọi API
      setLoadingOverlay(true);
      const res =
        await drugStoreApiRequest.processPrescriptionPayment(validatedData);

      if (res.status === HttpStatus.SUCCESS) {
        toast({
          title: "Thành công",
          description: "Đã hoàn tất thanh toán và trừ kho.",
          variant: "default",
        });
        // Logic sau khi thanh toán (In hóa đơn, chuyển trang...)
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoadingOverlay(false);
    }
  };

  const { fields, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchedItems = useWatch({
    control: form.control,
    name: "items",
  });

  // Tính toán tổng tiền dựa trên các item được chọn
  const totalPrescriptionPrice = useMemo(() => {
    if (!watchedItems) return 0;
    return watchedItems.reduce((sum: number, item: any) => {
      if (item?.isSelected && !item?.deleted && !item.paid) {
        // Ưu tiên lấy giá từ lô đã chọn, nếu không có thì lấy giá chung của item
        const selectedPlot = item.availablePlots?.find(
          (p: any) => p.plotId === item.selectedPlotId,
        );
        const price = selectedPlot?.sellPrice ?? item.price ?? 0;
        const qty = Number(item.quantityOrdered) || 0;
        return sum + price * qty;
      }
      return sum;
    }, 0);
  }, [watchedItems]);

  return (
    <div className="flex flex-col items-start justify-end p-4 gap-6 w-full">
      <form
        onSubmit={form.handleSubmit(onSubmit, (error) =>
          logger.error("Form prescription payment", error),
        )}
        className="w-full"
      >
        {/* ALERT TRẠNG THÁI TOA THUỐC */}
        {isProcessed && (
          <div className="w-full mb-6 flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800">
            <CheckCircle2 className="h-6 w-6 text-emerald-600" />
            <div>
              <p className="font-bold">Toa thuốc đã được xử lý hoàn tất</p>
              <p className="text-sm">
                Tất cả các khoản thanh toán cho toa này đã được ghi nhận.
              </p>
            </div>
          </div>
        )}

        <div className="w-full border rounded-lg overflow-hidden shadow-sm mb-6">
          <div className="bg-[hsl(var(--color-custom-1))] text-[hsl(var(--text-color))] px-4 py-2 font-bold flex justify-between uppercase text-sm tracking-wide">
            <span>Danh mục thuốc thanh toán</span>
            {customerSelected?.patientName && (
              <span>Bệnh nhân: {customerSelected.patientName}</span>
            )}
          </div>

          <Table>
            <TableHeader className="bg-slate-100">
              <TableRow>
                <TableHead className="w-[50px]">Mua</TableHead>
                <TableHead>Tên thuốc / Thông tin lô</TableHead>
                <TableHead className="text-center w-[100px]">ĐVT</TableHead>
                <TableHead className="text-center w-[150px]">
                  Số lượng mua
                </TableHead>
                <TableHead className="text-right">Đơn giá</TableHead>
                <TableHead className="text-right">Thành tiền</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field: any, index) => {
                const isSelected = form.watch(`items.${index}.isSelected`);
                const isPaid = field.paid;
                const itemQty =
                  form.watch(`items.${index}.quantityOrdered`) || 0;

                // Lấy thông tin lô đang được chọn
                const currentItem = watchedItems?.[index];
                const selectedPlot = currentItem?.availablePlots?.find(
                  (p: any) => p.plotId === currentItem.selectedPlotId,
                );
                const displayPrice =
                  selectedPlot?.sellPrice ?? field.price ?? 0;

                return (
                  <TableRow
                    key={field.id}
                    className={cn(
                      "transition-opacity",
                      !isSelected && "opacity-40 bg-slate-50",
                    )}
                  >
                    <TableCell>
                      {/* Nếu đã thanh toán thì hiện icon check thay vì checkbox */}
                      {isPaid ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 mx-auto" />
                      ) : (
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={(val) =>
                            form.setValue(`items.${index}.isSelected`, !!val)
                          }
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="font-bold text-blue-900">
                        {field.drugName}
                      </div>
                      {/* Hiển thị thông tin lô hàng ngay bên dưới tên thuốc */}
                      <div className="flex items-center gap-2 mt-1">
                        {isPaid ? (
                          <Badge
                            variant="secondary"
                            className="text-[9px] bg-emerald-100 text-emerald-700 border-none"
                          >
                            ĐÃ THANH TOÁN
                          </Badge>
                        ) : selectedPlot ? (
                          <div className="flex gap-2 items-center">
                            <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-semibold border border-orange-200">
                              Lô: {selectedPlot.plotNumber}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium italic">
                              Hạn: {selectedPlot.expiryDate}
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-red-500 font-bold">
                            ⚠️ Không tìm thấy lô khả dụng!
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {field.unit}
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        disabled={!isSelected}
                        {...form.register(`items.${index}.quantityOrdered`, {
                          valueAsNumber: true,
                        })}
                        className="text-center font-bold bg-green-50 focus:bg-white border-green-200"
                        onFocus={(e) => {
                          const t = e.currentTarget;
                          window.requestAnimationFrame(() => t.select());
                        }}
                        onMouseUp={(e) => e.preventDefault()}
                      />
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatCurrency(displayPrice)}
                    </TableCell>
                    <TableCell className="text-right font-bold text-blue-700 font-mono">
                      {formatCurrency(itemQty * displayPrice)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        type="button"
                        onClick={() => remove(index)}
                        className="hover:bg-red-50 group"
                      >
                        <X className="h-4 w-4 text-slate-300 group-hover:text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50 p-6 rounded-xl border border-dashed border-slate-300 shadow-inner">
          <div className="space-y-1">
            <p className="text-sm text-slate-500 italic font-medium">
              * Lưu ý: Kiểm tra kỹ số lô và hạn dùng trước khi xuất thuốc.
            </p>
            <div className="flex gap-4 mt-4">
              <div className="p-3 bg-white border rounded-lg shadow-sm text-center min-w-[140px] border-blue-100">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                  Tiền Thuốc
                </p>
                <p className="font-black text-blue-700 text-lg">
                  {formatCurrency(totalPrescriptionPrice)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 w-full md:w-auto">
            <div className="flex items-center gap-10">
              <span className="text-slate-600 font-bold uppercase text-sm">
                Tổng thanh toán:
              </span>
              <span className="text-4xl font-black text-emerald-600 tracking-tighter">
                {formatCurrency(totalPrescriptionPrice)}
              </span>
            </div>

            <div className="flex gap-3 mt-4 w-full md:w-auto">
              {/* <Button
                type="button"
                variant="outline"
                className="flex-1 md:flex-none h-12 px-8 border-slate-300"
                onClick={() => form.reset(defaultPrescriptionPreparePayment)}
              >
                Hủy đơn
              </Button> */}
              <Button
                type="submit"
                className="bg-[hsl(var(--color-custom-1))] text-[hsl(var(--text-color))] hover:opacity-90 transition-opacity h-12 px-10 shadow-lg flex-1 md:flex-none font-bold"
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Xác nhận Thanh toán
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
