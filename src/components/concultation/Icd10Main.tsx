"use client";
import { useFormContext, Control, useFieldArray } from "react-hook-form";
import { X } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useCallback, useState } from "react";
import consultationApiRequest from "./consultationApiRequest";
import { Icd10AutoSuggestItem } from "./consultation.shema";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "../ui/card";

interface Icd10FormProp {
  title: string;
  index: number;
}

export default function Icd10Main({ title, index }: Icd10FormProp) {
  const form = useFormContext();
  const [icd10s, setIcd10s] = useState<Icd10AutoSuggestItem[]>([]);
  const { toast } = useToast();

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

  const clearIcd = () => {
    form.setValue("mainIcd10.code", "");
    form.setValue("mainIcd10.name", "");
  };

  return (
    <FormItem className="flex items-center gap-2">
      <FormLabel className="w-32">{title}</FormLabel>

      <div className="flex flex-1 items-center gap-2">
        <FormField
          control={form.control}
          name="mainIcd10.code"
          render={({ field }) => (
            <FormControl>
              <div className="relative">
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    debouncedFetch(e.target.value);
                  }}
                  placeholder="Mã ICD"
                  autoComplete="off"
                />
              </div>
            </FormControl>
          )}
        />

        <FormField
          control={form.control}
          name="mainIcd10.name"
          render={({ field }) => (
            <FormControl className="flex-1">
              <div className="relative">
                <Input
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    debouncedFetch(e.target.value);
                  }}
                  placeholder="Tên ICD"
                  autoComplete="off"
                />
                {icd10s.length > 0 && (
                  <Card className="absolute z-10 w-full mt-1">
                    <CardContent className="p-1 space-y-1 max-h-60 overflow-y-auto">
                      {icd10s.map((icd, idx) => (
                        <div
                          key={idx}
                          onClick={() => {
                            form.setValue("mainIcd10.icd10Id", icd.icd10Id);
                            form.setValue("mainIcd10.code", icd.icd10Code);
                            form.setValue("mainIcd10.name", icd.icd10Name);
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
                <FormMessage />
              </div>
            </FormControl>
          )}
        />
      </div>
      {/* @ts-ignore */}
      {form.formState.errors?.mainIcd10?.code && (
        <p className="text-red-500 text-sm">
          {/* @ts-ignore */}
          {form.formState.errors.mainIcd10.code.message}
        </p>
      )}
    </FormItem>
  );
}
