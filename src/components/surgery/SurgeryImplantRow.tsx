"use client";

import {
  Control,
  useFieldArray,
  UseFormSetValue,
  useWatch,
  FormState,
} from "react-hook-form";
import CustomFormField from "../atoms/custom-form-field";
import { FormFieldType } from "@/constants/enum";
import { Button } from "../ui/button";

interface SurgeryImplantRowProp {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  formState: FormState<any>;
}

export default function SurgeryImplantRow({
  control,
  setValue,
  formState,
}: SurgeryImplantRowProp) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "data.implants",
  });
  const listImplants = useWatch({ control, name: "data.implants" });

  return (
    <div>
      <div>
        {fields.map((field, index) => (
          <div
            key={index}
            className="grid grid-cols-[40px_3fr_2fr_2fr_2fr_3fr] items-center gap-2 space-y-2"
          >
            <div className="text-center font-semibold">{index + 1}.</div>
            <CustomFormField
              control={control}
              fieldType={FormFieldType.INPUT}
              name={`data.implants.${index}.type`}
            />
            <CustomFormField
              control={control}
              fieldType={FormFieldType.NUMBER}
              name={`data.implants.${index}.quantity`}
            />
            <CustomFormField
              control={control}
              fieldType={FormFieldType.INPUT}
              name={`data.implants.${index}.size`}
            />
            <CustomFormField
              control={control}
              fieldType={FormFieldType.INPUT}
              name={`data.implants.${index}.manufacturer`}
            />
            <CustomFormField
              control={control}
              fieldType={FormFieldType.INPUT}
              name={`data.implants.${index}.notes`}
            />
          </div>
        ))}
        <div className="flex flex-1 items-center gap-2 mt-2">
          <Button
            type="button"
            onClick={() =>
              append({
                type: "",
                quantity: "",
                size: "",
                manufacturer: "",
                notes: "",
              })
            }
          >
            Thêm công cụ
          </Button>
        </div>
      </div>
    </div>
  );
}
