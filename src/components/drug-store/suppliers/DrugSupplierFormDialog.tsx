"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/atoms/custom-form-field";
import { FormFieldType, HttpStatus } from "@/constants/enum";
import { Building2, Save, X } from "lucide-react";
import { DrugSupplier, DrugSupplierSchema } from "../drug-store.schema";
import { useAppContext } from "@/providers/app-proviceders";
import { handleErrorApi } from "@/lib/utils";
import drugStoreApiRequest from "../drugStoreApiRequest";
import { useDashboardContext } from "@/providers/dashboard-providers";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: DrugSupplier | null; // Nếu có data là mode Edit, không có là mode Add
  onSuccess: () => void;
}

export default function DrugSupplierFormDialog({
  open,
  onOpenChange,
  data,
  onSuccess,
}: Props) {
  const isEdit = !!data;

  const { setLoadingOverlay } = useAppContext();
  const { toast } = useToast();

  const form = useForm<DrugSupplier>({
    resolver: zodResolver(DrugSupplierSchema),
    defaultValues: {
      name: "",
      code: "",
      phone: "",
      email: "",
      taxCode: "",
      address: "",
      active: true,
    },
  });

  // Cập nhật giá trị form khi mở mode Edit
  useEffect(() => {
    if (data != null) {
      console.log(data);
      form.reset({
        id: data.id,
        name: data.name,
        code: data.code,
        phone: data.phone || "",
        email: data.email || "",
        taxCode: data.taxCode || "",
        address: data.address || "",
        active: data.active,
      });
    } else {
      form.reset();
    }
  }, [open, data]);

  const onSubmit = async (values: DrugSupplier) => {
    setLoadingOverlay(true);

    try {
      const res = await drugStoreApiRequest.saveSupplier(values);

      if (res.status == HttpStatus.SUCCESS) {
        toast({
          title: "Thông báo",
          description: "Cập nhật nhà cung cấp thành công!",
        });

        onSuccess();
        onOpenChange(false);
        form.reset();
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoadingOverlay(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] gap-0 p-0 overflow-hidden">
        <DialogHeader className="p-6 bg-slate-50 border-b">
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <Building2 className="h-5 w-5" />
            {isEdit ? "Chỉnh sửa nhà cung cấp" : "Thêm nhà cung cấp mới"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="p-6 space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <CustomFormField
                  control={form.control}
                  name="code"
                  label="Mã nhà cung cấp"
                  placeholder="VD: NCC-TW1"
                  fieldType={FormFieldType.INPUT}
                  disabled={isEdit} // Thường mã không cho sửa để tránh sai lệch data
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <CustomFormField
                  control={form.control}
                  name="taxCode"
                  label="Mã số thuế"
                  placeholder="0100xxx..."
                  fieldType={FormFieldType.INPUT}
                />
              </div>

              <div className="col-span-2">
                <CustomFormField
                  control={form.control}
                  name="name"
                  label="Tên nhà cung cấp"
                  placeholder="Nhập tên đầy đủ của công ty/đối tác"
                  fieldType={FormFieldType.INPUT}
                />
              </div>

              <div className="col-span-2 md:col-span-1">
                <CustomFormField
                  control={form.control}
                  name="phone"
                  label="Số điện thoại"
                  placeholder="Số điện thoại liên hệ"
                  fieldType={FormFieldType.INPUT}
                />
              </div>
              <div className="col-span-2 md:col-span-1">
                <CustomFormField
                  control={form.control}
                  name="email"
                  label="Email"
                  placeholder="example@company.com"
                  fieldType={FormFieldType.INPUT}
                />
              </div>

              <div className="col-span-2">
                <CustomFormField
                  control={form.control}
                  name="address"
                  label="Địa chỉ văn phòng"
                  placeholder="Số nhà, tên đường, quận/huyện..."
                  fieldType={FormFieldType.INPUT}
                />
              </div>

              <div className="col-span-2 mt-2">
                <div className="flex items-center justify-between p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium text-blue-900">
                      Trạng thái hoạt động
                    </p>
                    <p className="text-xs text-slate-500">
                      Cho phép nhà cung cấp này xuất hiện trong các giao dịch
                      nhập kho.
                    </p>
                  </div>
                  <CustomFormField
                    control={form.control}
                    name="active"
                    fieldType={FormFieldType.CHECKBOX}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="pt-6 border-t mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10 gap-2"
              >
                <X className="h-4 w-4" /> Hủy
              </Button>
              <Button
                type="submit"
                className="h-10 bg-blue-600 hover:bg-blue-700 gap-2 px-6"
              >
                <Save className="h-4 w-4" />{" "}
                {isEdit ? "Cập nhật thay đổi" : "Lưu nhà cung cấp"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
