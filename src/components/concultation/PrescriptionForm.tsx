"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Icd10Main from "./Icd10Main";
import Icd10Secondary from "./Icd10Secondary";
import { Label } from "../ui/label";
import MedicationRow from "./MedicationRow";
import { Button } from "../ui/button";
import { useDashboardContext } from "@/providers/dashboard-providers";
import { useEffect, useRef, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import consultationApiRequest from "./consultationApiRequest";
import {
  ItemUnit,
  ItemUsage,
  PrescriptionSchema,
  prescriptionSchema,
  defaultPrescription,
} from "./consultation.shema";

export default function PrescriptionForm() {
  const form = useForm<PrescriptionSchema>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: defaultPrescription,
  });
  const { customerSelected } = useDashboardContext();
  const { toast } = useToast();
  const [units, setUnits] = useState<ItemUnit[]>([]);
  const [usages, setUsages] = useState<ItemUsage[]>([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (customerSelected?.ticketId.length > 0) {
      form.setValue("ticketId", customerSelected.ticketId, {
        shouldValidate: true,
        shouldDirty: true,
      });

      getPrescriptionByTicket(customerSelected.ticketId);
    }
  }, [customerSelected]);

  useEffect(() => {
    getListUnit();
    getListUsage();
  }, []);

  const getListUnit = async () => {
    try {
      const res = await consultationApiRequest.getListItemUnit();

      if (res.status == 200) {
        setUnits(res.payload.result);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Không thể lấy danh mục dùng chung!",
      });
    }
  };

  const getListUsage = async () => {
    try {
      const res = await consultationApiRequest.getListItemUsage();

      if (res.status == 200) {
        setUsages(res.payload.result);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Không thể lấy danh mục dùng chung!",
      });
    }
  };

  const getPrescriptionByTicket = async (ticketId: string) => {
    try {
      const res =
        await consultationApiRequest.getPrescriptionByTicketId(ticketId);

      if (res.payload?.result?.prescriptionId != null) {
        form.reset(res.payload?.result);
      } else {
        form.reset(defaultPrescription);
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Có lỗi xảy ra!",
      });
    }
  };

  async function onSubmit(data: PrescriptionSchema) {
    if (!customerSelected) {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Vui lòng chọn bệnh nhân khám!",
      });
      return;
    }

    data.ticketId = customerSelected.ticketId;

    if (form.formState.errors) {
      console.log("Form error: ", form.formState.errors);
    }

    try {
      const res = await consultationApiRequest.savePrescription(data);

      if (res.status === 200) {
        const printUrl = `print/prescription/${res.payload?.result?.prescriptionId}`;
        window.open(
          printUrl,
          "_blank",
          "width=800,height=600,left=200,top=100,toolbar=0,scrollbars=0"
        );

        toast({
          title: "Thông báo",
          description: "Lưu toa thành công!",
        });
      }
    } catch (error) {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Có lỗi khi lu lưu toa thuốc!",
      });
    }
  }

  const printPres = () => {
    const prescriptionId = form.getValues("prescriptionId");
    if (prescriptionId) {
      const printUrl = `print/prescription/${prescriptionId}`;
      window.open(
        printUrl,
        "_blank",
        "width=800,height=600,left=200,top=100,toolbar=0,scrollbars=0"
      );
    } else {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Không có toa được chọn!",
      });
    }
  };

  const countQuantity = (rowIndex: number | null) => {
    const presItems = form.getValues("listPrescriptionItem");
    let soNgay = form.getValues("time");

    if (rowIndex !== null) {
      const morning = form.getValues(
        `listPrescriptionItem.${rowIndex}.morning`
      );
      const noon = form.getValues(`listPrescriptionItem.${rowIndex}.noon`);
      const afternoon = form.getValues(
        `listPrescriptionItem.${rowIndex}.afternoon`
      );
      const evening = form.getValues(
        `listPrescriptionItem.${rowIndex}.evening`
      );
      soNgay = form.getValues(`listPrescriptionItem.${rowIndex}.time`);

      const newQuantity = (morning + noon + afternoon + evening) * soNgay;
      form.setValue(`listPrescriptionItem.${rowIndex}.quantity`, newQuantity);
    } else {
      presItems.forEach((item, index) => {
        form.setValue(`listPrescriptionItem.${index}.time`, soNgay);
        const quantity =
          (item.morning + item.noon + item.afternoon + item.evening) * soNgay;
        form.setValue(`listPrescriptionItem.${index}.quantity`, quantity);
      });
    }
  };

  const countBmi = () => {
    const height = form.getValues("height");
    const weight = form.getValues("weight");

    if (height > 0 && weight > 0) {
      const heightInMetter = height / 100;
      const bmi = weight / (heightInMetter * heightInMetter);
      form.setValue("bmi", Math.round(bmi * 100) / 100);
    }
  };

  const handleFocus = () => {
    inputRef.current.select();
  };

  return (
    <div className="flex items-center justify-center p-4">
      <FormProvider {...form}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <fieldset className="border border-border rounded-lg p-4">
              <legend className="text-base font-semibold px-1">
                Chỉ số cơ thể
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <FormField
                  control={form.control}
                  name="height"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormLabel>Chiều cao: </FormLabel>
                      <FormControl className="flex-1">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Chiều cao"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                            onBlur={countBmi}
                          />
                          <span className="text-sm text-muted-foreground">
                            cm
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="weight"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormLabel>Cân nặng: </FormLabel>
                      <FormControl className="flex-1">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Cân nặng"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                            onBlur={countBmi}
                          />
                          <span className="text-sm text-muted-foreground">
                            kg
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="temperature"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormLabel>Nhiệt độ: </FormLabel>
                      <FormControl className="flex-1">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="Nhiệt độ"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                          <span className="text-sm text-muted-foreground">
                            °C
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bmi"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormLabel className="mb-0">BMI: </FormLabel>
                      <FormControl className="flex-1">
                        <div className="flex items-center gap-2">
                          <Input
                            type="number"
                            placeholder="BMI"
                            {...field}
                            onChange={(e) =>
                              field.onChange(e.target.valueAsNumber)
                            }
                          />
                          <span className="text-sm text-muted-foreground">
                            W/H<sup>2</sup>
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </fieldset>
            <fieldset className="border border-border rounded-lg p-4">
              <legend className="text-base font-semibold px-1">
                Thông tin đơn thuốc
              </legend>

              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <FormField
                  control={form.control}
                  name="diagnosis"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormLabel className="w-32">Chẩn đoán:</FormLabel>
                      <FormControl className="flex-1">
                        <div className="flex items-center gap-2">
                          <Textarea
                            {...field}
                            placeholder="Chẩn đoán"
                            className="resize-y min-h-[100px]"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <Icd10Main title="ICD Chính*" index={0} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <Icd10Secondary
                  control={form.control}
                  setValue={form.setValue}
                  formState={form.formState}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-2">
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2 space-y-0">
                      <FormLabel className="w-32">Số ngày: </FormLabel>
                      <FormControl className="w-24">
                        <div className="flex items-center gap-2">
                          <Input
                            {...field}
                            placeholder="Số ngày"
                            type="number"
                            ref={inputRef}
                            onFocus={handleFocus}
                            onChange={(e) => {
                              field.onChange(e.target.valueAsNumber);
                            }}
                            onBlur={(e) => {
                              form.setValue(
                                "reExaminationDays",
                                e.target.valueAsNumber
                              );
                              countQuantity(null);
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-2 space-y-0">
                  <Label className="background">Tổng tiển thuốc: </Label>
                  <span>0 đ</span>
                </div>
              </div>
            </fieldset>

            <div className="grid grid-cols-[40px_4fr_1fr_1fr_1fr_1fr_1fr_1fr_1fr_2fr_1fr] gap-2 bg-cyan-700 text-white font-semibold text-sm px-2 py-2 rounded-md mt-4">
              <div className="text-left">#</div>
              <div className="">TÊN THUỐC HOẶC GỐC</div>
              <div className="text-left">C.DÙNG</div>
              <div className="text-left">ĐVSD</div>
              <div className="text-left">SÁNG</div>
              <div className="text-left">TRƯA</div>
              <div className="text-left">CHIỀU</div>
              <div className="text-left">TỐI</div>
              <div className="text-left">S.NGÀY</div>
              <div className="text-left">SỐ LƯỢNG</div>
              <div className="text-left">Thao tác</div>
            </div>
            <div className="space-y-2">
              <MedicationRow
                control={form.control}
                setValue={form.setValue}
                unitOptions={units}
                usageOptions={usages}
                formState={form.formState}
                countQuantity={countQuantity}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-1 border-b mt-4">
              <FormField
                control={form.control}
                name="advice"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormLabel className="w-32">Dặn dò:</FormLabel>
                    <FormControl className="flex-1">
                      <div className="flex items-center gap-2">
                        <Textarea
                          {...field}
                          placeholder="Chẩn đoán"
                          className="resize-y min-h-[100px]"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-2">
              <FormField
                control={form.control}
                name="reExaminationDays"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 space-y-0">
                    <FormLabel className="w-32">Tái khám sau: </FormLabel>
                    <FormControl className="w-32">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="tái khám"
                          {...field}
                          type="number"
                          min={0}
                          onChange={(e) => {
                            field.onChange(e.target.valueAsNumber);
                          }}
                        />
                        <span className="text-sm text-muted-foreground">
                          ngày
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-2 space-y-0">
                <Label className="background">Tổng tiển thuốc: </Label>
                <span>0 đ</span>
              </div>
            </div>

            <div className="flex flex-row w-full items-end justify-end gap-4">
              <Button type="submit" className="bg-primary">
                Lưu
              </Button>
              <Button type="button" variant="secondary" onClick={printPres}>
                In
              </Button>
            </div>
          </form>
        </Form>
      </FormProvider>
    </div>
  );
}
