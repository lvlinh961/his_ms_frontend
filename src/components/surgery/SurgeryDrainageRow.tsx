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

interface SurgeryDrainageRowProp {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  formState: FormState<any>;
}

export default function SurgeryDrainageRow({
  control,
  setValue,
  formState,
}: SurgeryDrainageRowProp) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "data.drainages",
  });
  const listDrainages = useWatch({ control, name: "data.drainages" });

  return (
    <div>
      {fields.map((field, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_8fr_3fr] items-center gap-2 space-y-2"
        >
          <div className="text-center font-semibold">{index + 1}.</div>
          <CustomFormField
            control={control}
            fieldType={FormFieldType.INPUT}
            name={`data.drainages.${index}.position`}
          />
          <CustomFormField
            control={control}
            fieldType={FormFieldType.NUMBER}
            name={`data.drainages.${index}.quantity`}
          />
        </div>
      ))}
      <div className="flex flex-1 items-center gap-2 mt-2">
        <Button
          type="button"
          onClick={() =>
            append({
              position: "",
              quantity: "",
            })
          }
        >
          Thêm dẫn lưu
        </Button>
      </div>
    </div>
  );
}
