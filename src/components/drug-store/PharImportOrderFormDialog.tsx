"use client";

import { useCallback, useEffect, useState } from "react";
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
import { SelectItem } from "../ui/select";
import { Button } from "../ui/button";
import { cn, handleErrorApi } from "@/lib/utils";
import { AutoSuggest } from "../ui/AutoSuggest";
import drugStoreApiRequest from "./drugStoreApiRequest";
import { useAppContext } from "@/providers/app-proviceders";
import { useToast } from "../ui/use-toast";
import { logger } from "@/lib/logger";
import { on } from "events";
import { HasPermission } from "../auth/HasPermission";
import { ApproveImportOrderDialog } from "./ApprovePharImportOrderDialog";

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
  const isViewMode = mode === "view";
  const [isApproveConfirmOpen, setIsApproveConfirmOpen] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "details",
  });

  useEffect(() => {
    const fetchStores = async () => {
      const params = new URLSearchParams();

      params.append("keyword", "");
      params.append("active", String(true));
      const res = await drugStoreApiRequest.searchStore(params);
      setStores(res.payload.result);
    };

    fetchStores();
  }, []);

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

    if (form.formState.errors) {
      // logger.error("Submit PharImportOrder error: ", form.formState.errors);
    }

    try {
      const res = await drugStoreApiRequest.createPharImportOrder(data);

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
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="supplierId"
                label="Nhà cung cấp"
                placeholder="Chọn nhà cung cấp"
              >
                <SelectItem value="2a281867-0c5a-495d-8547-66a908a86789">
                  Công ty Dược phẩm A
                </SelectItem>
                <SelectItem value="other">Nhà cung cấp khác</SelectItem>
              </CustomFormField>

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
                  onClick={() => append(pharImportDefaultValues.details[0])}
                >
                  <Plus className="h-4 w-4 mr-1" /> Thêm dòng
                </Button>
              </div>

              <div className="border rounded-md">
                <table className="w-full text-sm">
                  <thead className="bg-slate-100 sticky top-0 z-10">
                    <tr className="border-b">
                      <th className="p-2 text-left w-[250px]">
                        Tên thuốc/Vật tư
                      </th>
                      <th className="p-2 text-left w-[120px]">Đơn vị</th>
                      <th className="p-2 text-left w-[100px]">Số lượng</th>
                      <th className="p-2 text-left w-[140px]">Giá nhập</th>
                      <th className="p-2 text-left w-[120px]">Số lô</th>
                      <th className="p-2 text-left w-[150px]">
                        Hạn dùng (DD/MM/YYYY)
                      </th>
                      <th className="p-2 text-center w-[80px]">Bán?</th>
                      <th className="p-2 text-center w-[50px]"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {fields.map((field, index) => (
                      <tr
                        key={field.id}
                        className={cn(
                          "border-b transition-colors relative", // Các class cơ bản
                          "hover:bg-slate-50/50", // Hiệu ứng hover
                          "z-[1] focus-within:z-[50]", // Logic Stacking Context quan trọng
                        )}
                      >
                        <td className="p-2 w-[350px] relative focus-within:z-[50]">
                          <AutoSuggest<DrugMaterialSuggest>
                            value={
                              (form.watch(
                                `details.${index}.drugMaterialName`,
                              ) as string) || ""
                            }
                            fetchData={fetchAutoSuggest}
                            getDisplayValue={(item) => item.name}
                            onSelect={(drug: DrugMaterialSuggest) => {
                              logger.info("Chọn thuốc", drug);
                              // Tự động điền thông tin khi chọn thuốc
                              form.setValue(
                                `details.${index}.drugMaterialId`,
                                String(drug.id),
                              );
                              form.setValue(
                                `details.${index}.note`,
                                drug.hoatChat || "",
                              );
                              // Nếu có logic map đơn vị tính:
                              // form.setValue(`details.${index}.unitId`, drug.unit);
                              setTimeout(() => {
                                const qtyInput = document.getElementsByName(
                                  `details.${index}.quantity`,
                                )[0] as HTMLInputElement;
                                qtyInput?.focus();
                                qtyInput?.select(); // Bôi đen để gõ đè số lượng cũ nhanh hơn
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
                                  <span className="text-slate-500 italic truncate max-w-[300px]">
                                    {item.hoatChat || "Không có hoạt chất"}
                                  </span>
                                  <span className="ml-auto text-slate-400 font-medium">
                                    ĐVT: {item.unit}
                                  </span>
                                </div>
                              </div>
                            )}
                          />
                        </td>
                        <td className="p-2">
                          <CustomFormField
                            fieldType={FormFieldType.SELECT}
                            control={form.control}
                            name={`details.${index}.unitId`}
                          >
                            <SelectItem value="7b2e131d-3841-4969-8086-4f40445a5555">
                              Viên
                            </SelectItem>
                            <SelectItem value="hop">Hộp</SelectItem>
                          </CustomFormField>
                        </td>
                        <td className="p-2">
                          <CustomFormField
                            fieldType={FormFieldType.NUMBER}
                            control={form.control}
                            name={`details.${index}.quantity`}
                          />
                        </td>
                        <td className="p-2">
                          <CustomFormField
                            fieldType={FormFieldType.NUMBER}
                            control={form.control}
                            name={`details.${index}.importPrice`}
                          />
                        </td>
                        <td className="p-2">
                          <CustomFormField
                            fieldType={FormFieldType.INPUT}
                            control={form.control}
                            name={`details.${index}.plotNumber`}
                          />
                        </td>
                        <td className="p-2">
                          <CustomFormField
                            fieldType={FormFieldType.DATE_INPUT}
                            control={form.control}
                            name={`details.${index}.expiryDate`}
                          />
                        </td>
                        <td className="p-2 text-center">
                          <CustomFormField
                            fieldType={FormFieldType.CHECKBOX}
                            control={form.control}
                            name={`details.${index}.isSellable`}
                          />
                        </td>
                        <td className="p-2 text-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PHẦN 3: FOOTER ACTION */}
            <div className="w-full p-6 border-t flex justify-end gap-3 bg-white">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Làm lại
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {isViewMode ? "Đóng" : "Hủy"}
              </Button>
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
              {!isViewMode && (
                <Button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Save className="mr-2 h-4 w-4" /> Lưu phiếu
                </Button>
              )}
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
