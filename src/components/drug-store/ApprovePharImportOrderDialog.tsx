"use client";

import React, { useEffect, useState } from "react";
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
import { format } from "date-fns";
import CustomFormField from "../atoms/custom-form-field";
import { FormFieldType, HttpStatus } from "@/constants/enum";
import {
  ApprovePharImportOrderRequest,
  ApprovePharImportOrderSchema,
} from "./drug-store.schema";
import { handleErrorApi } from "@/lib/utils";
import drugStoreApiRequest from "./drugStoreApiRequest";
import { useToast } from "../ui/use-toast";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  onSuccess?: () => void;
}

export function ApproveImportOrderDialog({
  open,
  onOpenChange,
  orderId,
  onSuccess,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ApprovePharImportOrderRequest>({
    resolver: zodResolver(ApprovePharImportOrderSchema),
    defaultValues: {
      id: orderId,
      approveNote: "",
      accountingDate: format(new Date(), "yyyy-MM-dd"), // Mặc định là ngày hiện tại
    },
  });

  const { toast } = useToast();

  // Cập nhật ID khi orderId thay đổi
  useEffect(() => {
    if (open) {
      form.setValue("id", orderId);
    }
  }, [orderId, open, form]);

  const onSubmit = async (data: ApprovePharImportOrderRequest) => {
    setIsLoading(true);
    try {
      // Giả sử bạn có hàm api này trong drugStoreApiRequest
      const res = await drugStoreApiRequest.approvePharImportOrder(data);

      if (res.status == HttpStatus.SUCCESS) {
        toast({
          title: "Thông báo",
          description: "Duyệt phiếu nhập kho thành công!",
        });
      }

      onSuccess?.();
      onOpenChange(false);
      form.reset();
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-blue-700">
            Xác nhận duyệt phiếu
          </DialogTitle>
          <DialogDescription>
            Phiếu sau khi duyệt sẽ chính thức tăng tồn kho và không thể sửa đổi
            thông tin hàng hóa.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER} // Sử dụng kiểu DatePicker bạn đã có
              control={form.control}
              name="accountingDate"
              label="Ngày hạch toán"
              placeholder="Chọn ngày hạch toán"
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA} // Sử dụng Textarea cho ghi chú
              control={form.control}
              name="approveNote"
              label="Ghi chú duyệt"
              placeholder="Nhập lý do duyệt hoặc ghi chú (nếu có)..."
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Đang xử lý..." : "Đồng ý Duyệt"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
