"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { CheckCircle2, Plus, Save, Trash2 } from "lucide-react";
import {
  PharImportCreateSchema,
  PharImportCreateRequest,
  pharImportDefaultValues,
  DrugMaterialSuggest,
  SearchStoreResponse,
  SearchSupplierResponse,
} from "./drug-store.schema";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import CustomFormField from "../atoms/custom-form-field";
import {
  AppPermission,
  FormFieldType,
  HttpStatus,
  PharImportStatus,
} from "@/constants/enum";
import { Button } from "../ui/button";
import { formatCurrency, handleErrorApi } from "@/lib/utils";
import { AutoSuggest } from "../ui/AutoSuggest";
import drugStoreApiRequest from "./drugStoreApiRequest";
import { useAppContext } from "@/providers/app-proviceders";
import { useToast } from "../ui/use-toast";
import { logger } from "@/lib/logger";
import { HasPermission } from "../auth/HasPermission";
import { ApproveImportOrderDialog } from "./ApprovePharImportOrderDialog";
import { ItemUnit } from "../concultation/consultation.shema";
import consultationApiRequest from "../concultation/consultationApiRequest";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id?: string;
  mode?: "create" | "view" | "edit";
  onSuccess: () => void;
}

export default function PharImportOrderFormDialog({
  open,
  onOpenChange,
  id,
  mode = "create",
  onSuccess,
}: Props) {
  const form = useForm<PharImportCreateRequest>({
    resolver: zodResolver(PharImportCreateSchema),
    defaultValues: pharImportDefaultValues,
  });

  const { setLoadingOverlay } = useAppContext();
  const { toast } = useToast();
  const [stores, setStores] = useState<SearchStoreResponse[]>([]);
  const [suppliers, setSuppliers] = useState<SearchSupplierResponse[]>([]);
  const [units, setUnits] = useState<ItemUnit[]>([]);
  const isViewMode = mode === "view";
  const isCreateMode = mode === "create";
  const isEditMode = mode === "edit";
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "details",
  });

  // Chỉ watch các giá trị tổng để UI cập nhật khi setValue được gọi
  const totalRaw = form.watch("subTotal") || 0;
  const totalVat = form.watch("vatAmount") || 0;
  const totalAfterVat = form.watch("totalAfterVat") || 0;
  const finalAmount = form.watch("totalAmount") || 0;

  // Lấy danh sách kho, nhà cung cấp
  useEffect(() => {
    const fetchStores = async () => {
      const params = new URLSearchParams();

      params.append("keyword", "");
      params.append("active", String(true));
      const res = await drugStoreApiRequest.searchStore(params);
      setStores(res.payload.result);
    };

    const fetchSupplier = async () => {
      const params = new URLSearchParams();

      params.append("keyword", "");
      params.append("active", String(true));
      const res = await drugStoreApiRequest.searchSupplier(params);
      setSuppliers(res.payload.result);
    };

    const fetchUnits = async () => {
      try {
        const res = await consultationApiRequest.getListItemUnit();

        if (res.status == 200) {
          setUnits(res.payload.result);
        }
      } catch (error) {
        toast({
          title: "Lỗi",
          variant: "destructive",
          description: "Không thể lấy danh mục dùng chung!",
        });
      }
    };

    fetchStores();
    fetchSupplier();
    fetchUnits();
  }, []);

  // Lấy thông tin phiếu nhập trong trường hợp chỉnh sửa
  useEffect(() => {
    if (open && id) {
      const fetchDetail = async () => {
        setLoadingOverlay(true);
        try {
          const res = await drugStoreApiRequest.getDetail(id);
          // 'reset' sẽ ghi đè toàn bộ giá trị Form bằng dữ liệu từ Backend
          form.reset(res.payload.result);
        } catch (error) {
          handleErrorApi({ error });
          onOpenChange(false);
        } finally {
          setLoadingOverlay(false);
        }
      };
      fetchDetail();
    } else if (open && !id) {
      // Nếu mở để tạo mới, reset về mặc định
      form.reset(pharImportDefaultValues);
    }
  }, [id, open, form]);

  const fetchAutoSuggest = useCallback(async (query: string) => {
    const res = await drugStoreApiRequest.autoSuggest(query);
    return res.payload.result;
  }, []);
  const onSubmit = async (data: PharImportCreateRequest) => {
    setLoadingOverlay(true);

    try {
      let res;
      if (!data.id) {
        res = await drugStoreApiRequest.createPharImportOrder(data);
      } else {
        res = await drugStoreApiRequest.updatePharImportOrder(data);
      }

      if (res.status == HttpStatus.SUCCESS) {
        toast({
          title: "Thông báo",
          description: "Tạo phiếu nhập kho thành công!",
        });
        onOpenChange(false);
        onSuccess();
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoadingOverlay(false);
    }
  };

  const handleApproveSuccess = () => {
    onSuccess(); // Thông báo cho trang danh sách load lại data
    onOpenChange(false); // Đóng luôn cả Dialog chi tiết này
  };

  const handlePriceChange = (
    index: number,
    fieldName: string,
    value: number,
  ) => {
    // --- BƯỚC 1: TÍNH TOÁN CHO DÒNG HIỆN TẠI ---
    const row = form.getValues(`details.${index}`);

    const importPrice =
      fieldName === "importPrice" ? value : Number(row.importPrice) || 0;
    const vatPercent =
      fieldName === "vatPercent" ? value : Number(row.vatPercent) || 0;
    const markupPercent =
      fieldName === "markupPercent" ? value : Number(row.markupPercent) || 0;
    const quantity =
      fieldName === "quantity" ? value : Number(row.quantity) || 0;

    const vatAmount = importPrice * (vatPercent / 100);
    const afterVatAmount = importPrice + vatAmount;
    const salePrice = Math.round(afterVatAmount * (1 + markupPercent / 100));
    const lineTotal = Math.round(afterVatAmount * quantity);

    // Cập nhật giá trị dòng
    form.setValue(`details.${index}.vatAmount`, vatAmount);
    form.setValue(`details.${index}.sellPrice`, salePrice);
    form.setValue(`details.${index}.lineTotal`, lineTotal);
    form.setValue(`details.${index}.afterVatAmount`, afterVatAmount);

    // --- BƯỚC 2: TÍNH TOÁN TỔNG TOÀN PHIẾU (GRAND TOTAL) ---
    // Lấy toàn bộ mảng details sau khi đã được cập nhật giá trị mới nhất
    const allDetails = form.getValues("details");
    const discountAmount = Number(form.getValues("discountAmount")) || 0;

    let totalRaw = 0; // Tổng tiền hàng chưa VAT
    let totalVat = 0; // Tổng tiền thuế

    allDetails.forEach((item, idx) => {
      // Lưu ý: Lấy giá trị vừa tính toán cho dòng hiện tại, các dòng khác lấy từ form
      const isCurrentRow = idx === index;
      const itemPrice = isCurrentRow
        ? importPrice
        : Number(item.importPrice) || 0;
      const itemQty = isCurrentRow ? quantity : Number(item.quantity) || 0;
      const itemVat = isCurrentRow ? vatAmount : Number(item.vatAmount) || 0;

      totalRaw += itemPrice * itemQty;
      totalVat += itemVat * itemQty;
    });

    const totalAfterVat = totalRaw + totalVat;
    const finalAmount = totalAfterVat - discountAmount;

    // Cập nhật các trường tổng vào Form State để hiển thị lên UI
    form.setValue("subTotal", totalRaw);
    form.setValue("vatAmount", totalVat);
    form.setValue("totalAfterVat", totalAfterVat);
    form.setValue("totalAmount", finalAmount); // Đây là trường lưu xuống DB
  };

  const applyGlobalSettings = (
    fieldName: "vatPercent" | "markupPercent",
    globalValue: number,
  ) => {
    const details = form.getValues("details") || [];

    details.forEach((item, index) => {
      // Lấy các giá trị hiện tại của dòng
      const importPrice = Number(item.importPrice) || 0;
      const quantity = Number(item.quantity) || 0;

      // Nếu field thay đổi là VAT, lấy markup cũ của dòng và ngược lại
      const vatPercent =
        fieldName === "vatPercent" ? globalValue : Number(item.vatPercent) || 0;
      const markupPercent =
        fieldName === "markupPercent"
          ? globalValue
          : Number(item.markupPercent) || 0;

      // Tính toán lại theo công thức đã thống nhất
      const vatAmount = importPrice * (vatPercent / 100);
      const afterVatAmount = importPrice + vatAmount;
      const salePrice = Math.round(afterVatAmount * (1 + markupPercent / 100));
      const lineTotal = Math.round(afterVatAmount * quantity);

      // Cập nhật từng dòng
      form.setValue(`details.${index}.vatPercent`, vatPercent);
      form.setValue(`details.${index}.markupPercent`, markupPercent);
      form.setValue(`details.${index}.vatAmount`, vatAmount);
      form.setValue(`details.${index}.afterVatAmount`, afterVatAmount);
      form.setValue(`details.${index}.sellPrice`, salePrice);
      form.setValue(`details.${index}.lineTotal`, lineTotal);
    });

    // Sau khi cập nhật các dòng, tính lại tổng tiền toàn phiếu
    recalculateGrandTotal();
  };

  // Hàm tính tổng toàn phiếu (tách riêng để dùng chung)
  const recalculateGrandTotal = () => {
    const details = form.getValues("details") || [];
    const discountAmount = Number(form.getValues("discountAmount")) || 0;

    let totalRaw = 0;
    let totalVat = 0;

    details.forEach((item) => {
      const price = Number(item.importPrice) || 0;
      const qty = Number(item.quantity) || 0;
      const vat = (Number(item.vatAmount) || 0) * qty;

      totalRaw += price * qty;
      totalVat += vat;
    });

    const totalAfterVat = totalRaw + totalVat;
    form.setValue("subTotal", totalRaw);
    form.setValue("vatAmount", totalVat);
    form.setValue("totalAfterVat", totalAfterVat);
    form.setValue("totalAmount", totalAfterVat - discountAmount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          <Plus size={18} /> Tạo phiếu nhập
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-7xl h-[90vh] flex flex-col overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo phiếu nhập kho</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, (error) => {
              logger.error(
                "Submit PharImportOrder error: ",
                form.formState.errors,
              );
            })}
            className="flex flex-col flex-1 items-start"
          >
            {/* PHẦN 1: THÔNG TIN CHUNG (HEADER) */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4 bg-slate-50/50 border-b">
              <CustomFormField
                fieldType={FormFieldType.SELECT_SUGGEST}
                control={form.control}
                name="storeId"
                label="Kho nhập hàng"
                placeholder="Chọn kho..."
                options={stores.map((s) => ({
                  id: s.id,
                  name: s.name,
                  code: s.code,
                }))}
                disabled={isViewMode}
              />
              <CustomFormField
                fieldType={FormFieldType.SELECT_SUGGEST}
                control={form.control}
                name="supplierId"
                label="Nhà cung cấp"
                placeholder="Chọn nhà cung cấp"
                options={suppliers.map((s) => ({
                  id: s.id,
                  name: s.name,
                  code: s.code,
                }))}
                disabled={isViewMode}
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="invoiceNo"
                label="Số hóa đơn"
                placeholder="VAT-..."
              />

              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="invoiceDate"
                label="Ngày hóa đơn"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="invoiceSymbol"
                label="Ký hiệu mẫu"
                placeholder="AA/26P"
              />

              <CustomFormField
                fieldType={FormFieldType.NUMBER}
                control={form.control}
                name="discountAmount"
                label="Tổng chiết khấu hóa đơn"
              />

              <CustomFormField
                fieldType={FormFieldType.NUMBER}
                control={form.control}
                name="vatPercent"
                label="VAT tổng hóa đơn (%)"
                onChangeCustom={(val) =>
                  applyGlobalSettings("vatPercent", Number(val))
                }
              />

              <CustomFormField
                fieldType={FormFieldType.NUMBER}
                control={form.control}
                name="markupPercent"
                label="% Thặng số áp dụng chung"
                onChangeCustom={(val) =>
                  applyGlobalSettings("markupPercent", Number(val))
                }
              />

              <div className="md:col-span-3">
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="note"
                  label="Ghi chú phiếu nhập"
                  placeholder="Nhập ghi chú..."
                />
              </div>
            </div>

            {/* KHU VỰC HIỂN THỊ TỔNG TIỀN (NEW) */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200">
              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Tổng tiền hàng (Chưa VAT)
                </p>
                <p className="text-lg font-semibold text-slate-700">
                  {/* {totalRaw.toLocaleString()}đ */}
                  {formatCurrency(totalRaw)}
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Tổng tiền thuế VAT
                </p>
                <p className="text-lg font-semibold text-amber-600">
                  +{formatCurrency(totalVat)}
                </p>
              </div>

              <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold text-slate-500 uppercase">
                  Tổng sau thuế (Sau VAT)
                </p>
                <p className="text-lg font-semibold text-slate-700">
                  {formatCurrency(totalAfterVat)}
                </p>
              </div>

              <div className="bg-blue-600 p-3 rounded-lg border border-blue-700 shadow-md">
                <p className="text-[10px] font-bold text-blue-100 uppercase">
                  Tổng tiền thanh toán
                </p>
                <p className="text-xl font-bold text-white leading-tight">
                  {formatCurrency(finalAmount)}
                </p>
              </div>
            </div>

            {/* PHẦN 2: CHI TIẾT HÀNG HÓA (TABLE) */}
            <div className="flex-1 overflow-auto p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-slate-700">
                  DANH SÁCH THUỐC / VẬT TƯ
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newDetail = {
                      ...pharImportDefaultValues.details[0],
                      vatPercent: form.getValues("vatPercent"),
                      markupPercent: form.getValues("markupPercent"),
                    };
                    append(newDetail);
                  }}
                >
                  <Plus className="h-4 w-4 mr-1" /> Thêm dòng
                </Button>
              </div>

              <div className="border rounded-md">
                <table className="w-full text-sm border-collapse">
                  <thead className="bg-slate-100 sticky top-0 z-10">
                    <tr className="border-b text-slate-600">
                      <th className="p-2 text-left w-[300px]">
                        Tên thuốc/Vật tư
                      </th>
                      <th className="p-2 text-left w-[100px]">Đơn vị</th>
                      <th className="p-2 text-left w-[80px]">SL</th>
                      <th className="p-2 text-left w-[120px]">Giá nhập</th>
                      <th className="p-2 text-left w-[80px]">VAT%</th>
                      <th className="p-2 text-left w-[80px]">Thặng số%</th>
                      <th className="p-2 text-left w-[130px] text-blue-700">
                        Giá bán lẻ
                      </th>
                      <th className="p-2 text-left w-[120px]">Số lô</th>
                      <th className="p-2 text-left w-[140px]">Hạn dùng</th>
                      <th className="p-2 text-center w-[40px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => {
                      // Lắng nghe các giá trị tính toán để hiển thị ở dòng phụ
                      const rowData = form.watch(`details.${index}`);

                      return (
                        <React.Fragment key={field.id}>
                          {/* DÒNG 1: NHẬP LIỆU CHÍNH */}
                          <tr className="border-t transition-colors hover:bg-slate-50/30">
                            <td className="p-2 relative">
                              <AutoSuggest<DrugMaterialSuggest>
                                value={
                                  (form.watch(
                                    `details.${index}.drugMaterialName`,
                                  ) as string) || ""
                                }
                                fetchData={fetchAutoSuggest}
                                getDisplayValue={(item) => item.name}
                                onSelect={(drug: DrugMaterialSuggest) => {
                                  form.setValue(
                                    `details.${index}.drugMaterialId`,
                                    drug.id,
                                  );
                                  form.setValue(
                                    `details.${index}.drugMaterialName`,
                                    drug.name,
                                  );
                                  form.setValue(
                                    `details.${index}.unitId`,
                                    drug.unitId,
                                  );
                                  form.setValue(
                                    `details.${index}.note`,
                                    drug.hoatChat || "",
                                  );

                                  setTimeout(() => {
                                    const qtyInput = document.getElementsByName(
                                      `details.${index}.quantity`,
                                    )[0] as HTMLInputElement;
                                    qtyInput?.focus();
                                    qtyInput?.select();
                                  }, 100);
                                }}
                                renderItem={(item) => (
                                  <div className="flex flex-col py-0.5">
                                    <div className="font-bold text-sm text-blue-900 leading-snug">
                                      {item.name}
                                    </div>
                                    <div className="text-[10px] flex items-center gap-2 mt-1">
                                      <span className="bg-blue-50 text-blue-600 px-1 rounded font-mono border border-blue-100">
                                        {item.code}
                                      </span>
                                      <span className="text-slate-500 italic truncate max-w-[200px]">
                                        {item.hoatChat}
                                      </span>
                                      <span className="ml-auto text-slate-400">
                                        ĐVT: {item.unitName}
                                      </span>
                                    </div>
                                  </div>
                                )}
                              />
                            </td>
                            <td className="p-1">
                              <CustomFormField
                                fieldType={FormFieldType.SELECT_SUGGEST}
                                control={form.control}
                                name={`details.${index}.unitId`}
                                options={units.map((s) => ({
                                  id: String(s.id),
                                  name: s.name,
                                  code: s.code,
                                }))}
                              />
                            </td>
                            <td className="p-1">
                              <CustomFormField
                                fieldType={FormFieldType.NUMBER}
                                control={form.control}
                                name={`details.${index}.quantity`}
                                onChangeCustom={(val) =>
                                  handlePriceChange(
                                    index,
                                    "quantity",
                                    Number(val),
                                  )
                                }
                              />
                            </td>
                            <td className="p-1">
                              <CustomFormField
                                fieldType={FormFieldType.NUMBER}
                                control={form.control}
                                name={`details.${index}.importPrice`}
                                onChangeCustom={(val) =>
                                  handlePriceChange(
                                    index,
                                    "importPrice",
                                    Number(val),
                                  )
                                }
                              />
                            </td>
                            <td className="p-1">
                              <CustomFormField
                                fieldType={FormFieldType.NUMBER}
                                control={form.control}
                                name={`details.${index}.vatPercent`}
                                onChangeCustom={(val) =>
                                  handlePriceChange(
                                    index,
                                    "vatPercent",
                                    Number(val),
                                  )
                                }
                              />
                            </td>
                            <td className="p-1">
                              <CustomFormField
                                fieldType={FormFieldType.NUMBER}
                                control={form.control}
                                name={`details.${index}.markupPercent`}
                                onChangeCustom={(val) =>
                                  handlePriceChange(
                                    index,
                                    "markupPercent",
                                    Number(val),
                                  )
                                }
                              />
                            </td>
                            <td className="p-1">
                              <CustomFormField
                                fieldType={FormFieldType.NUMBER}
                                control={form.control}
                                name={`details.${index}.sellPrice`}
                              />
                            </td>
                            <td className="p-1">
                              <CustomFormField
                                fieldType={FormFieldType.INPUT}
                                control={form.control}
                                name={`details.${index}.plotNumber`}
                              />
                            </td>
                            <td className="p-1">
                              <CustomFormField
                                fieldType={FormFieldType.DATE_INPUT}
                                control={form.control}
                                name={`details.${index}.expiryDate`}
                              />
                            </td>
                            <td className="p-1 text-center">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(index)}
                                className="text-red-400 hover:text-red-600 h-8 w-8"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>

                          {/* DÒNG 2: HIỂN THỊ THÔNG TIN TỰ ĐỘNG TÍNH TOÁN */}
                          <tr className="border-b bg-slate-50/40 text-[11px]">
                            <td
                              colSpan={2}
                              className="p-1 px-4 italic text-slate-400 max-w-[200px]"
                            >
                              <div
                                className="truncate"
                                title={rowData.note || ""} // Hiện tooltip khi di chuột vào
                              >
                                {rowData.note || "---"}
                              </div>
                            </td>
                            <td colSpan={8} className="p-1 px-2">
                              <div className="flex gap-6 text-slate-500">
                                <div className="flex gap-1">
                                  <span>Tiền thuế:</span>
                                  <span className="font-medium text-slate-700">
                                    {formatCurrency(
                                      (rowData.vatAmount || 0) *
                                        (rowData.quantity || 0),
                                    )}
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  <span>Giá vốn (+VAT):</span>
                                  <span className="font-medium text-slate-700">
                                    {formatCurrency(
                                      rowData.afterVatAmount || 0,
                                    )}
                                  </span>
                                </div>
                                <div className="flex gap-1">
                                  <span>Thành tiền dòng:</span>
                                  <span className="font-bold text-amber-700">
                                    {formatCurrency(rowData.lineTotal || 0)}
                                  </span>
                                </div>
                                <div className="ml-auto flex gap-2 items-center">
                                  <span className="text-slate-400">
                                    Cho phép bán?
                                  </span>
                                  <CustomFormField
                                    fieldType={FormFieldType.CHECKBOX}
                                    control={form.control}
                                    name={`details.${index}.isSellable`}
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PHẦN 3: FOOTER ACTION */}
            <div className="w-full p-6 border-t flex justify-end gap-3 bg-white">
              {isCreateMode && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                >
                  Làm lại
                </Button>
              )}
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {isViewMode ? "Đóng" : "Hủy"}
              </Button>

              {isCreateMode && (
                <HasPermission permission={AppPermission.CREATE_IMPORT_ORDER}>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="mr-2 h-4 w-4" /> Tạo phiếu
                  </Button>
                </HasPermission>
              )}

              {isEditMode && (
                <HasPermission permission={AppPermission.UPDATE_IMPORT_ORDER}>
                  <Button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="mr-2 h-4 w-4" /> Cập nhật phiếu
                  </Button>
                </HasPermission>
              )}

              <HasPermission permission={AppPermission.APPROVED_IMPORT_ORDER}>
                {form.getValues("status") === PharImportStatus.PENDING && (
                  <Button
                    type="button"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setIsApproveConfirmOpen(true)}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Duyệt phiếu này
                  </Button>
                )}
              </HasPermission>
            </div>
          </form>
        </Form>

        {id && (
          <ApproveImportOrderDialog
            open={isApproveConfirmOpen}
            onOpenChange={setIsApproveConfirmOpen}
            orderId={id}
            onSuccess={handleApproveSuccess}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
