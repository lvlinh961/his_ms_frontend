// components/MedicationRow.tsx
"use client";

import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Control,
  useFieldArray,
  UseFormSetValue,
  useWatch,
  FormState,
} from "react-hook-form";
import consultationApiRequest from "./consultationApiRequest";
import { FormControl, FormField, FormLabel } from "../ui/form";
import { useCallback, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "../ui/card";
import {
  DrugMaterialSuggestItem,
  ItemUnit,
  ItemUsage,
} from "./consultation.shema";

interface MedicationRowProp {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  unitOptions: ItemUnit[];
  usageOptions: ItemUsage[];
  formState: FormState<any>;
  countQuantity: (rowIndex: number | null) => void;
}

export default function MedicationRow({
  control,
  setValue,
  unitOptions,
  usageOptions,
  formState,
  countQuantity,
}: MedicationRowProp) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "listPrescriptionItem",
  });
  const [drugMaterials, setDrugMaterials] = useState<DrugMaterialSuggestItem[]>(
    []
  );
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { toast } = useToast();
  const listPresItems = useWatch({ control, name: "listPrescriptionItem" });

  const fetchDrugMaterial = async (query: string) => {
    if (!query) return setDrugMaterials([]);

    try {
      const res =
        await consultationApiRequest.getDrugMaterialAutoSuggest(query);
      setDrugMaterials(res.payload.result);
    } catch (error) {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Không thể lấy danh sách ICD10",
      });
    }
  };

  const debouncedFetch = useCallback(fetchDrugMaterial, []);

  return (
    <div>
      {fields.map((field, index) => {
        if (listPresItems[index] && listPresItems[index].deleted) return null;
        return (
          <div key={index} className="border-b py-4 space-y-2">
            <div className="grid grid-cols-[40px_4.5fr_1.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2">
              {/* Drug Index */}
              <div className="text-center font-semibold">{index + 1}.</div>
              {/* Tên thuốc */}
              <FormField
                control={control}
                name={`listPrescriptionItem.${index}.drugName`}
                render={({ field }) => (
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          debouncedFetch(e.target.value);
                          setOpenIndex(index);
                        }}
                        placeholder="Tên thuốc"
                        autoComplete="off"
                      />
                      {drugMaterials.length > 0 && openIndex == index && (
                        <Card className="absolute z-10 w-full mt-1">
                          <CardContent className="p-1 space-y-1 max-h-60 overflow-y-auto">
                            {drugMaterials.map((drug, idx) => (
                              <div
                                key={idx}
                                onClick={() => {
                                  setValue(
                                    `listPrescriptionItem.${index}.drugId`,
                                    drug.drugId
                                  );
                                  setValue(
                                    `listPrescriptionItem.${index}.drugName`,
                                    drug.drugName
                                  );
                                  setValue(
                                    `listPrescriptionItem.${index}.hoatChat`,
                                    drug.drugOriginalName
                                  );
                                  setValue(
                                    `listPrescriptionItem.${index}.dongGoi`,
                                    drug.dongGoi
                                  );
                                  setValue(
                                    `listPrescriptionItem.${index}.usage`,
                                    drug.usage
                                  );
                                  setValue(
                                    `listPrescriptionItem.${index}.unit`,
                                    drug.unit
                                  );
                                  setValue(
                                    `listPrescriptionItem.${index}.sellingUnit`,
                                    drug.unit
                                  );
                                  countQuantity(index);
                                  setOpenIndex(null);
                                  setDrugMaterials([]);
                                }}
                                className="cursor-pointer px-2 py-1 hover:bg-muted rounded"
                              >
                                {drug.drugName}
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </FormControl>
                )}
              />

              {/* C.DÙNG */}
              <FormField
                control={control}
                name={`listPrescriptionItem.${index}.usage`}
                render={({ field }) => (
                  <FormControl>
                    <div className="relative">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Dùng" />
                        </SelectTrigger>
                        <SelectContent>
                          {usageOptions.map((option, index) => (
                            <SelectItem key={index} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                )}
              />

              {/* ĐVSD */}
              <FormField
                control={control}
                name={`listPrescriptionItem.${index}.unit`}
                render={({ field }) => (
                  <FormControl>
                    <div className="relative">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="ĐV" />
                        </SelectTrigger>
                        <SelectContent>
                          {unitOptions.map((option, index) => (
                            <SelectItem key={index} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </FormControl>
                )}
              />

              {/* Dosage per time of day */}
              {["morning", "noon", "afternoon", "evening"].map((item, i) => (
                <FormField
                  key={i}
                  control={control}
                  name={`listPrescriptionItem.${index}.${item}`}
                  render={({ field }) => (
                    <div className="relative">
                      <Input
                        {...field}
                        key={i}
                        type="number"
                        min={0}
                        className={cn("text-center bg-green-100")}
                        onChange={(e) => {
                          field.onChange(e.target.valueAsNumber);
                        }}
                        onBlur={(e) => {
                          countQuantity(index);
                        }}
                      />
                    </div>
                  )}
                />
              ))}

              {/* Số ngày */}
              <FormField
                control={control}
                name={`listPrescriptionItem.${index}.time`}
                render={({ field }) => (
                  <div className="relative">
                    <Input
                      {...field}
                      className="text-center bg-blue-100"
                      type="number"
                      min={0}
                      onChange={(e) => {
                        field.onChange(e.target.valueAsNumber);
                      }}
                      onBlur={(e) => {
                        countQuantity(index);
                      }}
                    />
                  </div>
                )}
              />

              {/* Số lượng */}
              <div className="flex gap-1">
                <FormField
                  control={control}
                  name={`listPrescriptionItem.${index}.quantity`}
                  render={({ field }) => (
                    <div className="relative">
                      <Input
                        {...field}
                        type="number"
                        className="w-20 bg-blue-100 text-center"
                        onChange={(e) => {
                          field.onChange(e.target.valueAsNumber);
                        }}
                      />
                    </div>
                  )}
                />
                <div></div>
                <FormField
                  control={control}
                  name={`listPrescriptionItem.${index}.sellingUnit`}
                  render={({ field }) => (
                    <div className="relative">
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-20">
                          <SelectValue placeholder="Viên" />
                        </SelectTrigger>
                        <SelectContent>
                          {unitOptions.map((option, index) => (
                            <SelectItem key={index} value={option.id}>
                              {option.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                />
              </div>

              {/* Delete button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setValue(`listPrescriptionItem.${index}.deleted`, true);
                  // remove(index);
                }}
                className="text-destructive"
              >
                <X />
              </Button>
            </div>

            <div className="grid grid-cols-2 items-center gap-2">
              <div className="col-span-1 pl-10">
                <p>Thuốc gốc: {listPresItems?.[index]?.hoatChat}</p>
                <p>Đóng gói: {listPresItems?.[index]?.dongGoi}</p>
              </div>
              {/* Instruction note */}
              <FormField
                control={control}
                name={`listPrescriptionItem.${index}.instruction`}
                render={({ field }) => (
                  <Input
                    {...field}
                    className="col-span-1"
                    placeholder="Hướng dẫn..."
                  />
                )}
              />
            </div>

            {/* @ts-ignore */}
            {formState.errors?.listPrescriptionItem?.[index]?.drugName && (
              <p className="text-red-500 text-sm">
                {
                  /* @ts-ignore */
                  formState.errors?.listPrescriptionItem?.[index]?.drugName
                    .message
                }
              </p>
            )}
          </div>
        );
      })}
      <div className="flex flex-1 items-center gap-2 mt-2">
        <FormLabel className="w-4"></FormLabel>
        <Button
          type="button"
          onClick={() =>
            append({
              drugId: 0,
              drugName: "",
              usage: "",
              unit: "",
              sellingUnit: "",
              morning: 0,
              noon: 0,
              afternoon: 0,
              evening: 0,
              time: 0,
              quantity: 0,
              hoatChat: "",
              dongGoi: "",
              instruction: "",
              deleted: false,
            })
          }
        >
          Thêm thuốc
        </Button>
      </div>
    </div>
  );
}
