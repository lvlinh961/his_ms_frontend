"use client";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Textarea } from "../ui/textarea";
import receptionsApiRequest from "./receptionApiRequest";
import { useCallback, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "../ui/card";
import DatePickerWithPopover from "../atoms/DatePickerWithPopover";
import LoadingOverlay from "../layout/loading-overlay";
import {
  outPatientRegistSchema,
  OutPatientRegistSchema,
  defaultPatientRegist,
} from "./reception.schema";
import { handleErrorApi } from "@/lib/utils";
import profileApiRequest from "../profile/profileApiRequest";
import {
  CareerAutoSuggest,
  EthnicGroupAutoSuggest,
  NationalityAutoSuggest,
  ProvinceAutoSuggest,
  WardAutoSuggest,
} from "../profile/profile.types";

import ConsultationHistoryDialog from "./ConsultationHistoryDialog";
import { logger } from "@/lib/logger";

export default function ReceptionForm() {
  const form = useForm<OutPatientRegistSchema>({
    resolver: zodResolver(outPatientRegistSchema),
    defaultValues: defaultPatientRegist,
  });
  const [services, setServices] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<ProvinceAutoSuggest[]>([]);
  const [provinceId, setProvinceId] = useState<number>(701);
  const [wards, setWards] = useState<WardAutoSuggest[]>([]);
  const [careers, setCareers] = useState<CareerAutoSuggest[]>([]);
  const [nationalities, setNationalities] = useState<NationalityAutoSuggest[]>(
    []
  );
  const [ethnicGroups, setEthnicGroups] = useState<EthnicGroupAutoSuggest[]>(
    []
  );

  const [loading, setLoading] = useState(false);
  const [patientId, setPatientId] = useState<string>(null);
  const { toast } = useToast();

  async function onSubmit(data: OutPatientRegistSchema) {
    setLoading(true);
    if (form.formState.errors) {
      console.log("Form error: ", form.formState.errors);
    }

    try {
      const res = await receptionsApiRequest.registPatientColsutation(data);

      if (res.status === 200) {
        toast({
          title: "Thông báo",
          description: "Đăng ký thành công!",
          duration: 3000,
        });
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
    }
  }

  const handleKeyPress = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      getPatientInfo(e.currentTarget.value);
    }
  };

  const getPatientInfo = async (patientCode: string) => {
    if (!patientCode) {
      return;
    }

    setLoading(true);

    try {
      const res = await receptionsApiRequest.getPatientInfo(patientCode);

      if (res?.payload?.result) {
        let patientInfo = res.payload.result;
        patientInfo.dateOfBirth = new Date(patientInfo.dateOfBirth);
        patientInfo.married = "single";

        const regisData = {
          ...defaultPatientRegist,
          patientInfo: patientInfo,
        } satisfies OutPatientRegistSchema;

        setPatientId(patientInfo.patientId);

        form.reset(regisData);
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
    }
  };

  const serviceFetchOption = async (query: string) => {
    if (!query) return setServices([]);
    setLoading(true);

    try {
      const res = await receptionsApiRequest.getServiceAutoComplete(query);
      setServices(res.payload.result);
    } catch (error) {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Có lỗi xảy ra",
      });
    } finally {
      setLoading(false);
    }
  };

  const provinceAutoSuggest = async (query: string) => {
    if (!query) return setProvinces([]);

    try {
      const res = await profileApiRequest.provinceAutoSuggest(query);
      setProvinces(res.payload.result);
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const wardAutoSuggest = async (query: string) => {
    if (!query) return setWards([]);

    if (provinceId <= 0) {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Vui lòng chọn Tỉnh/Thành",
      });
      return setWards([]);
    }

    try {
      const res = await profileApiRequest.wardAutoSuggest(provinceId, query);
      setWards(res.payload.result);
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const careerAutoSuggest = async (query: string) => {
    if (!query) return setCareers([]);

    try {
      const res = await profileApiRequest.careerAutoSuggest(query);
      setCareers(res.payload.result);
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const nationalityAutoSuggest = async (query: string) => {
    if (!query) return setNationalities([]);

    try {
      const res = await profileApiRequest.nationalityAutoSuggest(query);
      setNationalities(res.payload.result);
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  const ethnicAutoSuggest = async (query: string) => {
    if (!query) return setEthnicGroups([]);

    try {
      const res = await profileApiRequest.ethnicGroupAutoSuggest(query);
      setEthnicGroups(res.payload.result);
    } catch (error) {
      logger.debug("Lỗi autoSuggest EthicGroup", error);
      handleErrorApi({ error });
    }
  };

  const debouncedFetch = useCallback(serviceFetchOption, []);
  const debouncedProvinceAutoSuggest = useCallback(provinceAutoSuggest, []);
  const debouncedWardAutoSuggest = useCallback(wardAutoSuggest, []);
  const debouncedCareerAutoSuggest = useCallback(careerAutoSuggest, []);
  const debouncedNationalityAutoSuggest = useCallback(
    nationalityAutoSuggest,
    []
  );
  const debouncedEthnicGroupAutoSuggest = useCallback(ethnicAutoSuggest, []);

  return (
    <div className="flex items-center justify-center">
      <div className="w-full p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="patientInfo.patientCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã bệnh nhân</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Mã bệnh nhân"
                        {...field}
                        onBlur={(e) => getPatientInfo(e.target.value)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <FormField
                control={form.control}
                name="patientInfo.patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên bệnh nhân</FormLabel>
                    <FormControl>
                      <Input placeholder="Tên bệnh nhân" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patientInfo.gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Giới tính</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-6"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="MALE" />
                          </FormControl>
                          <FormLabel className="font-normal">Nam</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="FEMALE" />
                          </FormControl>
                          <FormLabel className="font-normal">Nữ</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patientInfo.married"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tình trạng hôn nhân</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex gap-6"
                      >
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="single" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Độc thân
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-2">
                          <FormControl>
                            <RadioGroupItem value="maried" />
                          </FormControl>
                          <FormLabel className="font-normal">Kết hôn</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patientInfo.cccd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CCCD / Hộ chiếu</FormLabel>
                    <FormControl>
                      <Input placeholder="CCCD / Hộ chiếu" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patientInfo.dateOfBirth"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Ngày sinh</FormLabel>
                    <FormControl>
                      <DatePickerWithPopover
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patientInfo.phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="Số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patientInfo.ethnicGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dân tộc</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debouncedEthnicGroupAutoSuggest(e.target.value);
                          }}
                          placeholder="Chọn dân tộc"
                          autoComplete="off"
                        />
                        {ethnicGroups.length > 0 && (
                          <Card className="absolute z-10 w-full mt-1">
                            <CardContent className="p-1 space-y-1 max-h-60 overdlow-auto">
                              {ethnicGroups.map((ethnic, index) => (
                                <div
                                  key={index}
                                  onClick={() => {
                                    form.setValue(
                                      "patientInfo.ethnicGroup",
                                      ethnic.viName
                                    );
                                    setEthnicGroups([]);
                                  }}
                                  className="cursor-pointer px-2 py-1 hover:bg-muted rounded"
                                >
                                  {ethnic.viName}
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="patientInfo.nationality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quốc tịch</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debouncedNationalityAutoSuggest(e.target.value);
                          }}
                          placeholder="Chọn quốc tịch"
                          autoComplete="off"
                        />
                        {nationalities.length > 0 && (
                          <Card className="absolute z-10 w-full mt-1">
                            <CardContent className="p-1 space-y-1 max-h-60 overdlow-auto">
                              {nationalities.map((nationality, index) => (
                                <div
                                  key={index}
                                  onClick={() => {
                                    form.setValue(
                                      "patientInfo.nationality",
                                      nationality.viName
                                    );
                                    setNationalities([]);
                                  }}
                                  className="cursor-pointer px-2 py-1 hover:bg-muted rounded"
                                >
                                  {nationality.viName}
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patientInfo.career"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nghề nghiệp</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debouncedCareerAutoSuggest(e.target.value);
                          }}
                          placeholder="Chọn nghề nghiệp"
                          autoComplete="off"
                        />
                        {careers.length > 0 && (
                          <Card className="absolute z-10 w-full mt-1">
                            <CardContent className="p-1 space-y-1 max-h-60 overdlow-auto">
                              {careers.map((career, index) => (
                                <div
                                  key={index}
                                  onClick={() => {
                                    form.setValue(
                                      "patientInfo.career",
                                      career.viName
                                    );
                                    setCareers([]);
                                  }}
                                  className="cursor-pointer px-2 py-1 hover:bg-muted rounded"
                                >
                                  {career.viName}
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="patientInfo.address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Địa chỉ</FormLabel>
                    <FormControl>
                      <Input placeholder="Địa chỉ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <FormField
                control={form.control}
                name="patientInfo.province"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tỉnh/Thành</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debouncedProvinceAutoSuggest(e.target.value);
                          }}
                          placeholder="Chọn Tỉnh/Thành"
                          autoComplete="off"
                        />
                        {provinces.length > 0 && (
                          <Card className="absolute z-10 w-full mt-1">
                            <CardContent className="p-1 space-y-1 max-h-60 overdlow-auto">
                              {provinces.map((province, index) => (
                                <div
                                  key={index}
                                  onClick={() => {
                                    form.setValue(
                                      "patientInfo.province",
                                      province.viName
                                    );
                                    setProvinces([]);
                                    setProvinceId(province.id);
                                  }}
                                  className="cursor-pointer px-2 py-1 hover:bg-muted rounded"
                                >
                                  {province.viName}
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="patientInfo.ward"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phường/Xã</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debouncedWardAutoSuggest(e.target.value);
                          }}
                          placeholder="Chọn Phường/Xã"
                          autoComplete="off"
                        />
                        {wards.length > 0 && (
                          <Card className="absolute z-10 w-full mt-1">
                            <CardContent className="p-1 space-y-1 max-h-60 overdlow-auto">
                              {wards.map((ward, index) => (
                                <div
                                  key={index}
                                  onClick={() => {
                                    form.setValue(
                                      "patientInfo.ward",
                                      ward.viName
                                    );
                                    setWards([]);
                                  }}
                                  className="cursor-pointer px-2 py-1 hover:bg-muted rounded"
                                >
                                  {ward.viName}
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <FormField
                control={form.control}
                name="serviceInfo.serviceName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dịch vụ khám</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            debouncedFetch(e.target.value);
                          }}
                          placeholder="Nhập dịch vụ khám"
                          autoComplete="off"
                        />
                        {services.length > 0 && (
                          <Card className="absolute z-10 w-full mt-1">
                            <CardContent className="p-1 space-y-1 max-h-60 overdlow-auto">
                              {services.map((service, index) => (
                                <div
                                  key={index}
                                  onClick={() => {
                                    form.setValue(
                                      "serviceInfo.serviceId",
                                      service.serviceId
                                    );
                                    form.setValue(
                                      "serviceInfo.serviceName",
                                      service.serviceName
                                    );
                                    setServices([]);
                                  }}
                                  className="cursor-pointer px-2 py-1 hover:bg-muted rounded"
                                >
                                  {service.serviceName}
                                </div>
                              ))}
                            </CardContent>
                          </Card>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4">
              <FormField
                control={form.control}
                name="serviceInfo.reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lý do khám</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Lý do khám" />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-row items-end justify-end mt-4">
              <Button
                type="submit"
                className="bg-[hsl(var(--color-custom-1))] text-[hsl(var(--text-color))] mr-2"
              >
                Đăng ký
              </Button>
              <ConsultationHistoryDialog patientId={patientId} />
            </div>
          </form>
        </Form>
        {loading && <LoadingOverlay />}
      </div>
    </div>
  );
}
