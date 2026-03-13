"use client";
import * as z from "zod";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomFormField from "@/components/atoms/custom-form-field";
import { FormFieldType } from "@/constants/enum";
import { Button } from "@/components/ui/button";
import {
  permissionFormSchema,
  PermissionFormSchema,
  permissionDefaultValue,
} from "./permissionSetting.schema";

import { Form } from "@/components/ui/form";
import authApiRequest from "./permissionApiRequest";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Info, ShieldCheck } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ProductFormProps {
  initialData?: any;
  isEdit: boolean;
  open: boolean;
  onClose: () => void;
  loadList: () => void;
}

export const PermDialog: React.FC<ProductFormProps> = ({
  initialData,
  open,
  onClose,
  loadList,
  isEdit,
}) => {
  const title = isEdit ? "Cập nhật" : "Thêm mới";

  const form = useForm<PermissionFormSchema>({
    resolver: zodResolver(permissionFormSchema),
    defaultValues: permissionDefaultValue,
  });

  useEffect(() => {
    if (open) {
      form.reset(isEdit ? initialData : permissionDefaultValue);
      Setdisabled(isEdit);
    }
  }, [initialData, permissionDefaultValue]);

  const [error, setError] = useState("");
  const [disabled, Setdisabled] = useState(isEdit);

  const onSubmit = async (data: any) => {
    if (isEdit == false) {
      const result = await authApiRequest.createPerm(data);
      if (result.status == 200) {
        if (result.payload.code == 200) {
          setError(result.payload.message || "Thêm thành công");
          loadList();
        } else {
          setError(result.payload.message || "Lỗi không xác định");
        }
      } else {
        setError("Không thể kết nối đến server");
      }
    } else {
      // const result = await authApiRequest.updateErmDocumentGroup(data);
      // if (result.status == 200) {
      //     if (result.payload.code == 200) {
      //         setError(result.payload.message || 'Cập nhật thành công');
      //         loadList();
      //     } else {
      //         setError(result.payload.message || 'Lỗi không xác định');
      //     }
      // } else {
      //     setError('Không thể kết nối đến server');
      // }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header với Background nhẹ */}
        <DialogHeader className="p-6 pb-0 bg-slate-50/50">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
            </div>
            <DialogTitle className="text-xl font-bold">
              {title} Permission
            </DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground pb-4">
            Cấu hình chi tiết quyền hạn cho hệ thống.
          </p>
        </DialogHeader>

        <Separator />

        <div className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                {/* Field: Name */}
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-sm font-semibold text-slate-600">
                    Tên quyền
                  </label>
                  <div className="col-span-3">
                    <CustomFormField
                      control={form.control}
                      name="name"
                      disabled={disabled}
                      placeholder="VD: USER_VIEW, PATIENT_EDIT..."
                      fieldType={FormFieldType.INPUT}
                    />
                  </div>
                </div>

                {/* Field: Description */}
                <div className="grid grid-cols-4 items-start gap-4">
                  <label className="text-sm font-semibold text-slate-600 pt-2">
                    Mô tả
                  </label>
                  <div className="col-span-3">
                    <CustomFormField
                      control={form.control}
                      name="description"
                      placeholder="Nhập ý nghĩa của quyền này..."
                      fieldType={FormFieldType.INPUT} // Bạn có thể đổi sang TEXTAREA nếu cần mô tả dài
                    />
                    <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                      <Info className="h-3 w-3" /> Hãy mô tả rõ phạm vi tác động
                      của quyền.
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-4 gap-2 sm:gap-0">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="border-slate-200 hover:bg-slate-100"
                >
                  Hủy bỏ
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 shadow-md px-8"
                >
                  Lưu cấu hình
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};
