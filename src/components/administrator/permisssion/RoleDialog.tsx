"use client";
import * as z from "zod";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import CustomFormField from "@/components/atoms/custom-form-field";
import { FormFieldType } from "@/constants/enum";
import { Button } from "@/components/ui/button";
import {
  roleFormSchema,
  RoleFormSchema,
  RoleDefaultValue,
} from "./permissionSetting.schema";

import { Form } from "@/components/ui/form";
import { Dice1 } from "lucide-react";
import authApiRequest from "./permissionApiRequest";

interface ProductFormProps {
  initialData?: any;
  isEdit: boolean;
  open: boolean;
  onClose: () => void;
  loadList: () => void;
}

export const RoleDialog: React.FC<ProductFormProps> = ({
  initialData,
  open,
  onClose,
  loadList,
  isEdit,
}) => {
  const title = isEdit ? "Cập nhật" : "Thêm mới";

  const form = useForm<RoleFormSchema>({
    resolver: zodResolver(roleFormSchema),
    defaultValues: RoleDefaultValue,
  });

  useEffect(() => {
    if (open) {
      form.reset(isEdit ? initialData : RoleDefaultValue);
      Setdisabled(isEdit);
    }
  }, [initialData, RoleDefaultValue]);

  const [error, setError] = useState("");
  const [disabled, Setdisabled] = useState(isEdit);

  const onSubmit = async (data: any) => {
    if (isEdit == false) {
      data.permissions = ["CREATE_DATA"];
      const result = await authApiRequest.createRole(data);
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
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="p-6 rounded-xl w-full max-w-md shadow-xl bg-white">
            <h2 className="text-xl font-semibold">{title} Role</h2>
            {/* Form nội dung tại đây */}
            <div className="flex-col">
              <Form {...form}>
                <form
                  className="w-full space-y-2"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="flex-col">
                    <div className="flex flex-wrap">
                      <div className="w-full sm:w-1/3 md:w-1/3 lg:w-1/3 gap-3 p-4 ">
                        <span>Name</span>
                      </div>
                      <div className="w-full sm:w-2/3 md:w-2/3 lg:w-2/3 gap-3 p-4 ">
                        <CustomFormField
                          control={form.control}
                          name="name"
                          disabled={disabled}
                          fieldType={FormFieldType.INPUT}
                        />
                      </div>
                    </div>
                    <div className="flex flex-wrap">
                      <div className="w-full sm:w-1/3 md:w-1/3 lg:w-1/3 gap-3 p-4 ">
                        <span>Description</span>
                      </div>
                      <div className="w-full sm:w-2/3 md:w-2/3 lg:w-2/3 gap-3 p-4 ">
                        <CustomFormField
                          control={form.control}
                          name="description"
                          fieldType={FormFieldType.INPUT}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="w-full text-right mt-6 space-x-2">
                    <button
                      className="bg-blue-600 px-4 py-2 rounded text-white"
                      onClick={onClose}
                    >
                      Đóng
                    </button>
                    <button
                      className="bg-blue-600 px-4 py-2 rounded text-white"
                      type="submit"
                    >
                      Lưu
                    </button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
