// components/MedicationRow.tsx
"use client";

import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency, handleErrorApi } from "@/lib/utils";
import {
  Control,
  useFieldArray,
  UseFormSetValue,
  useWatch,
  FormState,
  UseFormGetValues,
} from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { useCallback, useEffect, useRef, useState } from "react";
import { ItemUnit, ItemUsage } from "./consultation.shema";
import { useAppContext } from "@/providers/app-proviceders";
import drugStoreApiRequest from "../drug-store/drugStoreApiRequest";
import { AutoSuggest } from "../ui/AutoSuggest";
import { DrugStockSuggest } from "../drug-store/drug-store.schema";
import { FormFieldType, HttpStatus } from "@/constants/enum";
import CustomFormField from "../atoms/custom-form-field";

interface MedicationRowProp {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  getValues: UseFormGetValues<any>;
  unitOptions: ItemUnit[];
  usageOptions: ItemUsage[];
  formState: FormState<any>;
  countQuantity: (rowIndex: number | null) => void;
}

export default function MedicationRow({
  control,
  setValue,
  getValues,
  unitOptions,
  usageOptions,
  formState,
  countQuantity,
}: MedicationRowProp) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "listPrescriptionItem",
  });
  const listPresItems = useWatch({ control, name: "listPrescriptionItem" });
  const { currentStore } = useAppContext();
  const storeRef = useRef(currentStore);

  useEffect(() => {
    storeRef.current = currentStore;
  }, [currentStore]);

  const fetchDrugsForPrescription = async (query: string) => {
    const activeStore = storeRef.current;

    if (!query || query.length < 2 || !activeStore?.id) return [];

    try {
      const params = new URLSearchParams();
      params.append("query", query);
      params.append("store", activeStore.id);
      params.append("onlyInStock", String(activeStore.onlyInStock ?? true));

      const res = await drugStoreApiRequest.searchInStock(params);

      if (res.status == HttpStatus.SUCCESS) {
        return res.payload.result.map((item: any, index: number) => ({
          ...item,
          id: item.id ?? item.drugMaterialId,
        }));
      }

      return [];
    } catch (error) {
      handleErrorApi({ error });
      return [];
    }
  };

  const onFocus = (e: any) => {
    const target = e.currentTarget;
    // requestAnimationFrame giúp đồng bộ với chu kỳ vẽ của trình duyệt
    window.requestAnimationFrame(() => {
      // CHỈ select nếu sau một nhịp render, ô này vẫn đang được focus
      if (document.activeElement === target) {
        target.select();
      }
    });
  };

  const onDrugMaterialSelect = (index: number, drug: DrugStockSuggest) => {
    // Fill toàn bộ thông tin vào dòng đơn thuốc
    setValue(`listPrescriptionItem.${index}.drugId`, drug.drugMaterialId);
    setValue(`listPrescriptionItem.${index}.drugName`, drug.name);
    setValue(`listPrescriptionItem.${index}.hoatChat`, drug.hoatChat || "");
    setValue(`listPrescriptionItem.${index}.unit`, drug.usageUnitId);
    setValue(`listPrescriptionItem.${index}.sellingUnit`, drug.unitId);
    setValue(`listPrescriptionItem.${index}.price`, drug.sellPrice);
    setValue(`listPrescriptionItem.${index}.usage`, drug.usageId);

    // Tự động tính toán số lượng hoặc focus ô tiếp theo
    countQuantity(index);

    // Logic focus vào ô số lượng (giả sử ô tiếp theo là quantity)
    setTimeout(() => {
      const nextInput = document.getElementsByName(
        `listPrescriptionItem.${index}.morning`,
      )[0] as HTMLInputElement;
      nextInput?.focus();
    }, 100);
  };

  const debounceFetchDrugsForPrescription = useCallback(
    fetchDrugsForPrescription,
    [],
  );

  let displayOrder = 0;
  return (
    <div>
      {fields.map((field, index) => {
        if (listPresItems[index] && listPresItems[index].deleted) return null;
        displayOrder++;

        return (
          <div key={index} className="border-b py-4 space-y-2">
            <div className="grid grid-cols-[40px_4.5fr_1.5fr_1.5fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr] items-center gap-2">
              {/* Drug Index */}
              <div className="text-center font-semibold">{displayOrder}.</div>
              {/* Tên thuốc */}
              <FormField
                control={control}
                name={`listPrescriptionItem.${index}.drugName`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <AutoSuggest<DrugStockSuggest>
                        // Ép kiểu để tránh lỗi TS(2352) như đã xử lý
                        value={(field.value as unknown as string) || ""}
                        fetchData={debounceFetchDrugsForPrescription}
                        getDisplayValue={(item) => item.name}
                        onSelect={(drug) => onDrugMaterialSelect(index, drug)}
                        renderItem={(item) => (
                          <div
                            className={cn(
                              "flex flex-col py-1 border-b last:border-0",
                              item.outOfStock && "opacity-50",
                            )}
                          >
                            <div className="flex justify-between items-center">
                              <span className="font-bold text-sm text-blue-900">
                                {item.name}
                              </span>
                              {item.sellPrice && item.sellPrice > 0 ? (
                                <span className="text-emerald-700 font-bold text-xs">
                                  {formatCurrency(item.sellPrice)}
                                </span>
                              ) : (
                                <span className="text-slate-400 text-[10px] italic">
                                  Chưa có giá
                                </span>
                              )}
                            </div>
                            <div className="flex justify-between text-[10px] mt-0.5">
                              <span className="text-slate-500 italic truncate max-w-[180px]">
                                {item.hoatChat || "Không rõ hoạt chất"}
                              </span>
                              <span
                                className={cn(
                                  "font-medium",
                                  item.availableQuantity > 0
                                    ? "text-orange-600"
                                    : "text-red-500",
                                )}
                              >
                                Tồn: {item.availableQuantity} {item.unitName}
                              </span>
                            </div>
                          </div>
                        )}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* C.DÙNG */}
              <CustomFormField
                fieldType={FormFieldType.SELECT_SUGGEST}
                control={control}
                name={`listPrescriptionItem.${index}.usage`}
                placeholder="Cách dùng"
                options={usageOptions.map((s) => ({
                  id: s.id,
                  name: s.name,
                  code: s.code,
                }))}
              />

              {/* ĐVSD */}
              <CustomFormField
                fieldType={FormFieldType.SELECT_SUGGEST}
                control={control}
                name={`listPrescriptionItem.${index}.unit`}
                placeholder="ĐV Sử dụng"
                options={unitOptions.map((s) => ({
                  id: s.id,
                  name: s.name,
                  code: s.code,
                }))}
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
                        onFocus={onFocus}
                        onMouseUp={(e) => e.preventDefault()}
                        onWheel={(e) => (e.target as HTMLElement).blur()}
                        onChange={(e) => {
                          const val = e.target.value;
                          field.onChange(
                            val === "" ? 0 : e.target.valueAsNumber,
                          );
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
                        const val = e.target.value;
                        field.onChange(val === "" ? 0 : e.target.valueAsNumber);
                      }}
                      onBlur={(e) => {
                        countQuantity(index);
                      }}
                      onFocus={onFocus}
                      onMouseUp={(e) => e.preventDefault()}
                      onWheel={(e) => (e.target as HTMLElement).blur()}
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
                          const val = e.target.value;
                          field.onChange(
                            val === "" ? 0 : e.target.valueAsNumber,
                          );
                        }}
                        onFocus={onFocus}
                        onMouseUp={(e) => e.preventDefault()}
                        onWheel={(e) => (e.target as HTMLElement).blur()}
                      />
                    </div>
                  )}
                />
                <div></div>
                <CustomFormField
                  fieldType={FormFieldType.SELECT_SUGGEST}
                  control={control}
                  name={`listPrescriptionItem.${index}.sellingUnit`}
                  placeholder="ĐV bán"
                  options={unitOptions.map((s) => ({
                    id: s.id,
                    name: s.name,
                    code: s.code,
                  }))}
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
                <div className="flex flex-row items-start text-left">
                  <div className="w-[150px]">Thuốc gốc:</div>
                  <div
                    className="flex truncate items-start justify-start text-left"
                    title={listPresItems?.[index]?.hoatChat || ""} // Hiện tooltip khi di chuột vào
                  >
                    {listPresItems?.[index]?.hoatChat || "---"}
                  </div>
                </div>
                {/* <p>Thuốc gốc: {listPresItems?.[index]?.hoatChat}</p> */}
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
          onClick={() => {
            const firstItemTime = getValues(`listPrescriptionItem.0.time`) ?? 1;

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
              time: firstItemTime,
              quantity: 0,
              hoatChat: "",
              dongGoi: "",
              instruction: "",
              deleted: false,
            });
          }}
        >
          Thêm thuốc
        </Button>
      </div>
    </div>
  );
}
