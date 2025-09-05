"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import {
  Clinic,
  CreateClinicSchema,
  createClinicSchema,
  defaultCreateClinicSchema,
} from "./clinicManagement.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/atoms/custom-form-field";
import { FormFieldType, HttpStatus } from "@/constants/enum";
import { handleErrorApi } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import clinicManagementApiRequest from "./clinicManagementApiRequest";

interface CreateClinicDialogProps {
  addClinic: (clinic: Clinic) => void;
}

export default function CreateClinicDialog({
  addClinic,
}: CreateClinicDialogProps) {
  const [createClinicDialogOpen, setCreateClinicDialogOpen] =
    useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const createClinicForm = useForm<CreateClinicSchema>({
    resolver: zodResolver(createClinicSchema),
    defaultValues: defaultCreateClinicSchema,
  });

  const submitCreateClinic = async (data: CreateClinicSchema) => {
    setLoading(true);

    try {
      const res = await clinicManagementApiRequest.createClinic(data);

      if (res.status == HttpStatus.SUCCESS) {
        addClinic(res.payload.result);
        toast({
          title: "Thông báo",
          description: "Tạo phòng khám thành công!",
        });
        createClinicForm.reset(defaultCreateClinicSchema);
        setCreateClinicDialogOpen(false);
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={createClinicDialogOpen}
      onOpenChange={setCreateClinicDialogOpen}
    >
      <DialogTrigger asChild>
        <button className="bg-[hsl(var(--color-custom-1))] text-[hsl(var(--text-color))] px-4 py-2 rounded">
          Thêm mới
        </button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo phòng khám mới</DialogTitle>
        </DialogHeader>
        <Form {...createClinicForm}>
          <form onSubmit={createClinicForm.handleSubmit(submitCreateClinic)}>
            <div className="grid gap-2">
              <CustomFormField
                control={createClinicForm.control}
                name="name"
                label="Tên phòng khám"
                fieldType={FormFieldType.INPUT}
              />

              <CustomFormField
                control={createClinicForm.control}
                name="code"
                label="Mã phòng khám"
                fieldType={FormFieldType.INPUT}
              />
              <CustomFormField
                control={createClinicForm.control}
                name="phone"
                label="Số điện thoại"
                fieldType={FormFieldType.INPUT}
              />
              <CustomFormField
                control={createClinicForm.control}
                name="email"
                label="Email"
                fieldType={FormFieldType.INPUT}
              />
              <CustomFormField
                control={createClinicForm.control}
                name="address"
                label="Địa chỉ"
                fieldType={FormFieldType.INPUT}
              />
            </div>
            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => setCreateClinicDialogOpen(false)}
                >
                  Huỷ
                </Button>
              </DialogClose>
              <Button type="submit">Lưu</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
