"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/atoms/custom-form-field";
import { FormFieldType, HttpStatus } from "@/constants/enum";

import { logger } from "@/lib/logger";
import { Warehouse, Save } from "lucide-react";
import {
  DrugStore,
  DrugStoreRequest,
  DrugStoreRequestSchema,
} from "../drug-store.schema";
import { useAppContext } from "@/providers/app-proviceders";
import { set } from "date-fns";
import { handleErrorApi } from "@/lib/utils";
import drugStoreApiRequest from "../drugStoreApiRequest";

interface CreateStoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  drugStore: DrugStore | null;
}

export default function DrugStoreFormDialog({
  open,
  onOpenChange,
  onSuccess,
  drugStore,
}: CreateStoreDialogProps) {
  const form = useForm<DrugStoreRequest>({
    resolver: zodResolver(DrugStoreRequestSchema),
    defaultValues: {
      name: "",
      code: "",
      location: "",
      active: true,
    },
  });

  const { setLoadingOverlay } = useAppContext();

  useEffect(() => {
    if (drugStore != null) {
      form.setValue("id", drugStore.id);
      form.setValue("name", drugStore.name);
      form.setValue("code", drugStore.code);
      form.setValue("location", drugStore.location);
      form.setValue("active", drugStore.active);
    } else {
      form.reset();
    }
  }, [open, drugStore]);

  const onSubmit = async (data: DrugStoreRequest) => {
    setLoadingOverlay(true);

    try {
      const res = await drugStoreApiRequest.createDrugStore(data);

      if (res.status == HttpStatus.SUCCESS) {
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-blue-700">
            <Warehouse className="h-5 w-5" />
            Thêm kho / quầy mới
          </DialogTitle>
          <DialogDescription>
            Nhập thông tin chi tiết để thiết lập kho dược mới trong hệ thống.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-4"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Tên kho */}
              <div className="col-span-2 md:col-span-1">
                <CustomFormField
                  control={form.control}
                  name="name"
                  label="Tên kho dược"
                  placeholder="VD: Kho lẻ tầng 1"
                  fieldType={FormFieldType.INPUT}
                />
              </div>

              {/* Mã kho */}
              <div className="col-span-2 md:col-span-1">
                <CustomFormField
                  control={form.control}
                  name="code"
                  label="Mã kho"
                  placeholder="VD: KHO-T1"
                  fieldType={FormFieldType.INPUT}
                />
              </div>
            </div>

            {/* Địa chỉ / Vị trí */}
            <CustomFormField
              control={form.control}
              name="location"
              label="Vị trí / Địa chỉ"
              placeholder="Nhập mô tả vị trí kho..."
              fieldType={FormFieldType.INPUT}
            />

            {/* Trạng thái - Sử dụng CHECKBOX hoặc SWITCH */}
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <CustomFormField
                control={form.control}
                name="active"
                label="Cho phép hoạt động"
                fieldType={FormFieldType.CHECKBOX}
              />
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-10"
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 h-10 flex gap-2"
              >
                <Save className="h-4 w-4" />
                Lưu thông tin
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
