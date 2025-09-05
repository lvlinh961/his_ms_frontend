"use client";
import {
  useFormContext,
  Control,
  useFieldArray,
  UseFormSetValue,
  FormState,
  useWatch,
} from "react-hook-form";
import { X } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCallback, useState } from "react";
import consultationApiRequest from "./consultationApiRequest";
import { Icd10AutoSuggestItem } from "./consultation.shema";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "../ui/card";

interface Icd10SecondaryProp {
  control: Control<any>;
  setValue: UseFormSetValue<any>;
  formState: FormState<any>;
}

export default function Icd10Secondary({
  control,
  setValue,
  formState,
}: Icd10SecondaryProp) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "secondaryIcds",
  });
  const [icd10s, setIcd10s] = useState<Icd10AutoSuggestItem[]>([]);
  const { toast } = useToast();
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const listSecIcds = useWatch({ control, name: "secondaryIcds" });

  const fetchIcd10 = async (query: string) => {
    if (!query) return setIcd10s([]);

    try {
      const res = await consultationApiRequest.getIcd10AutoSuggest(query);
      setIcd10s(res.payload.result);
    } catch (error) {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Không thể lấy danh sách ICD10",
      });
    }
  };

  const debouncedFetch = useCallback(fetchIcd10, []);

  return (
    <div className="space-y-4 mt-4">
      {fields.map((field, index) => {
        if (listSecIcds[index] && listSecIcds[index].deleted) return null;
        return (
          <div key={index} className="flex flex-1 items-center gap-2">
            <FormLabel className="w-32">{`ICD Phụ ${index + 1}`}</FormLabel>
            <FormField
              control={control}
              name={`secondaryIcds.${index}.code`}
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
                      placeholder="Mã ICD"
                      autoComplete="off"
                    />
                  </div>
                </FormControl>
              )}
            />

            <FormField
              control={control}
              name={`secondaryIcds.${index}.name`}
              render={({ field }) => (
                <FormControl className="flex-1">
                  <div className="relative">
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        debouncedFetch(e.target.value);
                        setOpenIndex(index);
                      }}
                      placeholder="Tên ICD"
                      autoComplete="off"
                    />
                    {icd10s.length > 0 && openIndex == index && (
                      <Card className="absolute z-10 w-full mt-1">
                        <CardContent className="p-1 space-y-1 max-h-60 overflow-y-auto">
                          {icd10s.map((icd, idx) => (
                            <div
                              key={idx}
                              onClick={() => {
                                setValue(
                                  `secondaryIcds.${index}.icd10Id`,
                                  icd.icd10Id
                                );
                                setValue(
                                  `secondaryIcds.${index}.code`,
                                  icd.icd10Code
                                );
                                setValue(
                                  `secondaryIcds.${index}.name`,
                                  icd.icd10Name
                                );
                                setOpenIndex(null);
                                setIcd10s([]);
                              }}
                              className="cursor-pointer px-2 py-1 hover:bg-muted rounded"
                            >
                              {icd.icd10Code} - {icd.icd10Name}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </FormControl>
              )}
            />

            {/* @ts-ignore */}
            {formState.errors?.secondaryIcds?.[index]?.code && (
              <p className="text-red-500 text-sm">
                {/* @ts-ignore */}
                {formState.errors.secondaryIcds?.[index].code.message}
              </p>
            )}

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setValue(`secondaryIcds.${index}.deleted`, true);
                // remove(index);
              }}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        );
      })}
      <div className="flex flex-1 items-center gap-2">
        <FormLabel className="w-32"></FormLabel>
        <Button
          type="button"
          onClick={() => append({ code: "", name: "", deleted: false })}
        >
          Thêm ICD phụ
        </Button>
      </div>
    </div>
  );
}
