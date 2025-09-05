"use client";
import React, { useContext } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { FormFieldType } from "@/constants/enum";
import { SelectBox, Department } from "@/types";
import { SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import CustomFormField from "@/components/atoms/custom-form-field";
import { PatientFormValidation } from "@/schemaValidation/administrative.schema";

import {
  departments,
  nationsSelect,
  countriesSelect,
  educationsSelect,
  careersSelect,
  provincesSelect,
  districtSelect,
  patientObject,
  introductionSelect,
  patientFormDefaultValue,
} from "@/constants/data";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { useAppContext } from "@/providers/app-proviceders";
import { Form, FormLabel } from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function AdministrativeForm() {
  const { fontSize } = useAppContext();

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...patientFormDefaultValue,
    },
  });

  const onSubmit = (data: any) => {
    console.log(data);
    return data;
  };

  return (
    <>
      <ScrollArea className="h-[calc(100vh-80px)]">
        <div className="flex-1 md:p-4 2xl:max-w-screen-xl w-full  h-full">
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-2"
              >
                <Tabs defaultValue="hanh_chinh" className="w-full ">
                  <TabsList
                    className={cn(
                      "grid w-full rounded-none grid-cols-2 sm:grid-cols-3 h-auto dark:bg-accent bg-[hsl(var(--color-custom-3))]",
                      fontSize
                    )}
                  >
                    <TabsTrigger value="hanh_chinh">
                      Thông tin hành chính bệnh nhân
                    </TabsTrigger>
                    <TabsTrigger value="nhap_vien_khoa">
                      Thông tin nhập viện/nhập khoa
                    </TabsTrigger>
                    <TabsTrigger value="lich_su">Lịch sử điều trị</TabsTrigger>
                  </TabsList>

                  {/* Tab Hành chính */}
                  <TabsContent value="hanh_chinh">
                    <Card className="rounded-none shadow-none border p-4">
                      <div className="flex mb-5 p-2 pl-2 sm:pl-0 items-center ">
                        <span className="text-[19px] font-semibold text-[hsl(var(--selected-patient))]">
                          HÀNH CHÍNH
                        </span>
                        <Button
                          className={cn(
                            "w-[180px] rounded ml-auto  my-auto h-8 bg-[hsl(var(--selected-patient))] hover:bg-[hsl(var(--selected-patient))]/80 text-[hsl(var(--text-color))]",
                            fontSize
                          )}
                          type="button"
                        >
                          In tem vòng đeo tay
                        </Button>
                      </div>

                      {/* HÀNH CHÍNH */}
                      {/* sm:flex md:inline-flex flex-wrap w-full gap-4 gap-y-3 */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Tên bệnh nhân* */}
                        <div>
                          <CustomFormField
                            control={form.control}
                            name="patientName"
                            fieldType={FormFieldType.INPUT}
                            label="Tên bệnh nhân"
                          />
                        </div>

                        {/* Giới tính * */}
                        <div>
                          <CustomFormField
                            fieldType={FormFieldType.RADIO}
                            control={form.control}
                            name="gender"
                            label="Giới tính"
                          >
                            <div className="w-full inline-flex gap-4 mt-3">
                              <div className="flex items-center space-x-3 space-y-0">
                                <RadioGroupItem value="male" id="male" />
                                <Label htmlFor="male">Nam</Label>
                              </div>
                              <div className="flex items-center space-x-3 space-y-0">
                                <RadioGroupItem value="female" id="female" />
                                <Label htmlFor="female">Nữ</Label>
                              </div>
                            </div>
                          </CustomFormField>
                        </div>

                        {/* N.Sinh/tuổi */}
                        <div>
                          <div className="flex-row ">
                            <div className="w-full inline-flex gap-2 justify-between items-end">
                              <CustomFormField
                                control={form.control}
                                name="dayOfBirth"
                                placeholder="Ngày"
                                label="N.Sinh/tuổi"
                                fieldType={FormFieldType.INPUT}
                              />
                              <CustomFormField
                                control={form.control}
                                name="monthOfBirth"
                                placeholder="Tháng"
                                fieldType={FormFieldType.INPUT}
                              />
                              <CustomFormField
                                control={form.control}
                                name="yearOfBirth"
                                placeholder="Năm"
                                fieldType={FormFieldType.INPUT}
                              />
                              <CustomFormField
                                control={form.control}
                                name="age"
                                placeholder="Tuổi"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Dân tộc */}
                        <div>
                          <div className="content-center pr-3 pb-1">
                            <FormLabel className={fontSize || ""}>
                              Dân tộc
                            </FormLabel>
                          </div>
                          <div className="inline-flex w-full gap-2">
                            <div className="w-20">
                              <CustomFormField
                                control={form.control}
                                name="ethniCode"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>

                            <div className="w-full space-y-2 flex items-end">
                              <CustomFormField
                                control={form.control}
                                name="ethnic"
                                fieldType={FormFieldType.SELECT}
                              >
                                {nationsSelect.map(
                                  (option: SelectBox, i: number) => (
                                    <SelectItem
                                      key={`${option.value}_${i}`}
                                      value={option.value}
                                    >
                                      <div className="flex cursor-pointer items-center gap-2">
                                        <p>{option.text}</p>
                                      </div>
                                    </SelectItem>
                                  )
                                )}
                              </CustomFormField>
                            </div>
                          </div>
                        </div>

                        {/* Quốc tịch */}
                        <div>
                          <div className="content-center pr-3 pb-1">
                            <FormLabel className={fontSize || ""}>
                              Quốc tịch
                            </FormLabel>
                          </div>
                          <div className="inline-flex w-full gap-2">
                            <div className="w-20">
                              <CustomFormField
                                control={form.control}
                                name="nationalityCode"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>
                            <div className="w-full flex items-end">
                              <CustomFormField
                                control={form.control}
                                name="nationality"
                                fieldType={FormFieldType.SELECT}
                              >
                                {countriesSelect.map(
                                  (option: SelectBox, i: number) => (
                                    <SelectItem
                                      key={`${option.value}_${i}`}
                                      value={option.value}
                                    >
                                      <div className="flex cursor-pointer items-center gap-2">
                                        <p>{option.text}</p>
                                      </div>
                                    </SelectItem>
                                  )
                                )}
                              </CustomFormField>
                            </div>
                          </div>
                        </div>

                        {/* Học vấn */}
                        <div>
                          <div className="content-center pr-3 pb-1">
                            <FormLabel className={fontSize || ""}>
                              Học vấn
                            </FormLabel>
                          </div>
                          <div className="inline-flex w-full gap-2">
                            <div className="w-20">
                              <CustomFormField
                                control={form.control}
                                name="educationCode"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>
                            <div className="w-full flex items-end">
                              <CustomFormField
                                control={form.control}
                                name="education"
                                fieldType={FormFieldType.SELECT}
                              >
                                {educationsSelect.map(
                                  (option: SelectBox, i: number) => (
                                    <SelectItem
                                      key={`${option.value}_${i}`}
                                      value={option.value}
                                    >
                                      <div className="flex cursor-pointer items-center gap-2">
                                        <p>{option.text}</p>
                                      </div>
                                    </SelectItem>
                                  )
                                )}
                              </CustomFormField>
                            </div>
                          </div>
                        </div>

                        {/* Nghề nghiệp */}
                        <div>
                          <div className="content-center pr-3 pb-1">
                            <FormLabel className={fontSize || ""}>
                              Nghề nghiệp
                            </FormLabel>
                          </div>
                          <div className="inline-flex w-full gap-2">
                            <div className="w-20">
                              <CustomFormField
                                control={form.control}
                                name="careerCode"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>

                            <div className="w-full space-y-2 flex items-end">
                              <CustomFormField
                                control={form.control}
                                name="career"
                                fieldType={FormFieldType.SELECT}
                              >
                                {careersSelect.map(
                                  (option: SelectBox, i: number) => (
                                    <SelectItem
                                      key={`${option.value}_${i}`}
                                      value={option.value}
                                    >
                                      <div className="flex cursor-pointer items-center gap-2">
                                        <p>{option.text}</p>
                                      </div>
                                    </SelectItem>
                                  )
                                )}
                              </CustomFormField>
                            </div>
                          </div>
                        </div>

                        {/* Nơi làm việc */}
                        <div>
                          <div className="content-center pr-3 pb-1">
                            <FormLabel className={fontSize || ""}>
                              Nơi làm việc
                            </FormLabel>
                          </div>
                          <div className="inline-flex w-full gap-2">
                            <div className="w-full">
                              <CustomFormField
                                control={form.control}
                                name="careerPlace"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>

                            <div className="w-20 flex items-center">
                              <CustomFormField
                                fieldType={FormFieldType.CHECKBOX}
                                control={form.control}
                                name="isCnv"
                                label="CNV"
                                // onChangeCustom={() => {
                                //   console.log("is cnv ");
                                // }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Đối tượng */}
                        <div>
                          <div className="content-center pr-3 pb-1">
                            <FormLabel className={fontSize || ""}>
                              Đối tượng
                            </FormLabel>
                          </div>
                          <div className="inline-flex w-full gap-2">
                            <div className="w-20">
                              <CustomFormField
                                control={form.control}
                                name="patientObjectCode"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>

                            <div className="w-full space-y-2 flex items-end">
                              <CustomFormField
                                control={form.control}
                                name="patientObject"
                                fieldType={FormFieldType.SELECT}
                              >
                                {patientObject.map(
                                  (option: SelectBox, i: number) => (
                                    <SelectItem
                                      key={`${option.value}_${i}`}
                                      value={option.value}
                                    >
                                      <div className="flex cursor-pointer items-center gap-2">
                                        <p>{option.text}</p>
                                      </div>
                                    </SelectItem>
                                  )
                                )}
                              </CustomFormField>
                            </div>
                          </div>
                        </div>

                        {/* Địa chỉ */}
                        <div className="sm:col-span-2">
                          <CustomFormField
                            control={form.control}
                            name="address"
                            label="Địa chỉ"
                            fieldType={FormFieldType.INPUT}
                          />
                        </div>

                        {/* Tỉnh thành */}
                        <div>
                          <CustomFormField
                            control={form.control}
                            name="province"
                            label="Tỉnh"
                            fieldType={FormFieldType.SELECT}
                          >
                            {provincesSelect.map(
                              (option: SelectBox, i: number) => (
                                <SelectItem
                                  key={`${option.value}_${i}`}
                                  value={option.value}
                                >
                                  <div className="flex cursor-pointer items-center gap-2">
                                    <p>{option.text}</p>
                                  </div>
                                </SelectItem>
                              )
                            )}
                          </CustomFormField>
                        </div>

                        {/* Quận huyện  */}
                        <div>
                          <CustomFormField
                            control={form.control}
                            name="district"
                            label="Huyện"
                            fieldType={FormFieldType.SELECT}
                          >
                            {districtSelect.map(
                              (option: SelectBox, i: number) => (
                                <SelectItem
                                  key={`${option.value}_${i}`}
                                  value={option.value}
                                >
                                  <div className="flex cursor-pointer items-center gap-2">
                                    <p>{option.text}</p>
                                  </div>
                                </SelectItem>
                              )
                            )}
                          </CustomFormField>
                        </div>

                        {/* phường xã */}
                        <div>
                          <CustomFormField
                            control={form.control}
                            name="ward"
                            label="Phường xã"
                            fieldType={FormFieldType.INPUT}
                          />
                        </div>
                        {/* Điện thoại */}
                        <div>
                          <CustomFormField
                            control={form.control}
                            name="phoneNumber"
                            label="Điện thoại"
                            fieldType={FormFieldType.INPUT}
                          />
                        </div>
                        {/* Người thân */}
                        <div className="col-span-1 sm:col-span-2">
                          <CustomFormField
                            control={form.control}
                            name="relatives"
                            label="Người thân"
                            fieldType={FormFieldType.TEXTAREA}
                          />
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  {/* Thông tin nhập viện/nhập khoa */}
                  <TabsContent value="nhap_vien_khoa">
                    <Card className="rounded-none shadow-none border p-4">
                      <div className="flex mb-5 p-2 pl-0 items-center ">
                        <span className="text-[19px] font-semibold text-[hsl(var(--selected-patient))]">
                          NHẬP VIỆN/NHẬP KHOA
                        </span>
                      </div>
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Giờ nhập viện */}
                        <div>
                          <div className="flex-row ">
                            <div className="w-full inline-flex gap-2 justify-between items-end">
                              <div className="flex-row ">
                                <div className="content-center pr-3 pb-1">
                                  <FormLabel>Giờ nhập viện</FormLabel>
                                </div>
                                <div className="w-full inline-flex gap-2 justify-between items-end">
                                  <CustomFormField
                                    control={form.control}
                                    name="checkInDay"
                                    placeholder="Ngày"
                                    fieldType={FormFieldType.INPUT}
                                  />
                                  <CustomFormField
                                    control={form.control}
                                    name="checkInMonth"
                                    placeholder="Tháng"
                                    fieldType={FormFieldType.INPUT}
                                  />
                                  <CustomFormField
                                    control={form.control}
                                    name="checkInYear"
                                    placeholder="Năm"
                                    fieldType={FormFieldType.INPUT}
                                  />
                                  <CustomFormField
                                    control={form.control}
                                    name="checkInTime"
                                    placeholder="Giờ:phút"
                                    fieldType={FormFieldType.INPUT}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Trực tiếp vào */}
                        <div>
                          <CustomFormField
                            control={form.control}
                            name="checkInDepartment"
                            label="Trực tiếp vào"
                            fieldType={FormFieldType.SELECT}
                          >
                            {departments.map(
                              (option: Department, i: number) => (
                                <SelectItem
                                  key={`${option.id}_${i}`}
                                  value={option.id.toString()}
                                >
                                  <div className="flex cursor-pointer items-center gap-2">
                                    <p>{option.name}</p>
                                  </div>
                                </SelectItem>
                              )
                            )}
                          </CustomFormField>
                        </div>
                        {/* Phân loại khám * */}
                        <div>
                          <CustomFormField
                            fieldType={FormFieldType.RADIO}
                            control={form.control}
                            name="examinationType"
                            label="Phân loại khám"
                          >
                            <div className="w-full inline-flex gap-4 pb-3 md:mt-3">
                              <div className="flex items-center space-x-3 space-y-0">
                                <RadioGroupItem
                                  value="1"
                                  id="firstExamination"
                                />
                                <Label htmlFor="firstExamination">
                                  Lần đầu
                                </Label>
                              </div>
                              <div className="flex items-center space-x-3 space-y-0">
                                <RadioGroupItem value="2" id="reExamination" />
                                <Label htmlFor="reExamination">Tái khám</Label>
                              </div>
                            </div>
                          </CustomFormField>
                        </div>

                        {/* Nơi giới thiệu*/}
                        <div>
                          <div className="content-center pr-3 pb-1">
                            <FormLabel className={fontSize || ""}>
                              Nơi giới thiệu
                            </FormLabel>
                          </div>
                          <div className="inline-flex w-full gap-2">
                            <div className="w-20">
                              <CustomFormField
                                control={form.control}
                                name="introductionPlaceCode"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>

                            <div className="w-full space-y-2 flex items-end">
                              <CustomFormField
                                control={form.control}
                                name="introductionPlace"
                                fieldType={FormFieldType.SELECT}
                              >
                                {introductionSelect.map(
                                  (option: SelectBox, i: number) => (
                                    <SelectItem
                                      key={`${option.value}_${i}`}
                                      value={option.value}
                                    >
                                      <div className="flex cursor-pointer items-center gap-2">
                                        <p>{option.text}</p>
                                      </div>
                                    </SelectItem>
                                  )
                                )}
                              </CustomFormField>
                            </div>
                          </div>
                        </div>
                        {/* Nơi giới thiệu (bổ sung & ghi chú) */}
                        <div>
                          <CustomFormField
                            control={form.control}
                            name="introductionText"
                            label="Nơi giới thiệu khác"
                            fieldType={FormFieldType.INPUT}
                          />
                        </div>

                        {/* điện thoại */}
                        <div>
                          <CustomFormField
                            control={form.control}
                            name="checkInPhoneNumber"
                            label="Điện thoại"
                            fieldType={FormFieldType.INPUT}
                          />
                        </div>

                        {/* vào khám lần thứ */}
                        <div>
                          <CustomFormField
                            control={form.control}
                            name="examinationNumber"
                            fieldType={FormFieldType.INPUT}
                            label="Vào khám lần thứ"
                          />
                        </div>

                        {/* Bác sĩ điều trị */}
                        <div>
                          <CustomFormField
                            control={form.control}
                            name="doctorName"
                            fieldType={FormFieldType.INPUT}
                            label="Bác sĩ điều trị"
                          />
                        </div>
                        {/* ICD chuyển đến  */}
                        <div className="sm:col-span-3 inline-flex">
                          <div className="sm:flex md:inline-flex w-full gap-2 gap-x-3 space-y-2">
                            <div className="w-full">
                              <CustomFormField
                                control={form.control}
                                name="icdMoveText"
                                fieldType={FormFieldType.INPUT}
                                label="ICD chuyển đến"
                              />
                            </div>
                            <div className="sm:w-full md:w-[35%] content-end justify-end">
                              <CustomFormField
                                control={form.control}
                                name="icdMoveCode"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>
                            <div className="w-full content-end justify-end">
                              <CustomFormField
                                control={form.control}
                                name="icdMoveName"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>
                          </div>
                          <div className="flex-none border w-auto ml-1 md:mr-3 my-auto mt-7 p-2 rounded content-center bg-accent">
                            <Icons.settings className="remr-2 h-5 w-5" />
                          </div>
                        </div>

                        {/* ICD KKB Cấp cứu */}
                        <div className="sm:col-span-3 inline-flex">
                          <div className="sm:flex md:inline-flex w-full gap-2 gap-x-3 space-y-2">
                            <div className="w-full">
                              <CustomFormField
                                control={form.control}
                                name="icdEmergencyText"
                                fieldType={FormFieldType.INPUT}
                                label="ICD KKB Cấp cứu"
                              />
                            </div>
                            <div className="sm:w-full md:w-[35%] content-end justify-end">
                              <CustomFormField
                                control={form.control}
                                name="icdEmergencyCode"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>
                            <div className="w-full content-end justify-end">
                              <CustomFormField
                                control={form.control}
                                name="icdEmergencyName"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>
                          </div>
                          <div className="flex-none border w-auto ml-1 md:mr-3 my-auto mt-7 p-2 rounded content-center bg-accent">
                            <Icons.settings className="remr-2 h-5 w-5" />
                          </div>
                        </div>

                        {/* ICD khoa điều trị */}
                        <div className="sm:col-span-3 inline-flex">
                          <div className="sm:flex md:inline-flex w-full gap-2 gap-x-3 space-y-2">
                            <div className="w-full">
                              <CustomFormField
                                control={form.control}
                                name="icdTreatmentText"
                                fieldType={FormFieldType.INPUT}
                                label="ICD khoa điều trị"
                              />
                            </div>
                            <div className="sm:w-full md:w-[35%] content-end justify-end">
                              <CustomFormField
                                control={form.control}
                                name="icdTreatmentCode"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>
                            <div className="w-full content-end justify-end">
                              <CustomFormField
                                control={form.control}
                                name="icdTreatmentName"
                                fieldType={FormFieldType.INPUT}
                              />
                            </div>
                          </div>
                          <div className="flex-none border w-auto ml-1 md:mr-3 my-auto mt-7 p-2 rounded content-center bg-accent">
                            <Icons.settings className="remr-2 h-5 w-5" />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  {/* Lịch sử điều trị */}
                  <TabsContent value="lich_su">
                    <Card className="rounded-none shadow-none border p-4">
                      <div className="flex mb-5 p-2 pl-0 items-center ">
                        <span className="text-[19px] font-semibold text-[hsl(var(--selected-patient))]">
                          LỊCH SỬ ĐIỀU TRỊ
                        </span>
                      </div>
                      <div className="flex-col sm:w-full md:w-[80%]">
                        <div className="border shadow">
                          <div className="flex bg-accent border-b p-4 font-semibold text-[hsl(var(--selected-patient))]">
                            <span>HỒ SƠ HIỆN TẠI</span>
                          </div>
                          <div className="flex">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[100px]">
                                    Đợt điều trị
                                  </TableHead>
                                  <TableHead>Khoa điều trị</TableHead>
                                  <TableHead>Ngày nhập khoa</TableHead>
                                  <TableHead>Ngày Xuất khoa</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow className="bg-[hsl(var(--muted))]/40">
                                  <TableCell className="font-medium text-[hsl(var(--selected-patient))]">
                                    22/06/2023
                                  </TableCell>
                                  <TableCell>Khoa tổng quát</TableCell>
                                  <TableCell>22/06/2023</TableCell>
                                  <TableCell>27/06/2023</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </div>

                        <div className="border shadow mt-5 ">
                          <div className="flex bg-accent border-b p-4 font-semibold text-[hsl(var(--selected-patient))]">
                            <span>HỒ SƠ CŨ</span>
                          </div>
                          <div className="flex">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="w-[100px]">
                                    Đợt điều trị
                                  </TableHead>
                                  <TableHead>Khoa điều trị</TableHead>
                                  <TableHead>Ngày nhập khoa</TableHead>
                                  <TableHead>Ngày Xuất khoa</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="font-medium text-[hsl(var(--selected-patient))]">
                                    22/06/2023
                                  </TableCell>
                                  <TableCell>Khoa tổng quát</TableCell>
                                  <TableCell>22/06/2023</TableCell>
                                  <TableCell>22/06/2023</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium text-[hsl(var(--selected-patient))]">
                                    22/06/2023
                                  </TableCell>
                                  <TableCell>Khoa tổng quát</TableCell>
                                  <TableCell>22/04/2023</TableCell>
                                  <TableCell>27/04/2023</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium text-[hsl(var(--selected-patient))]">
                                    22/06/2023
                                  </TableCell>
                                  <TableCell>Khoa tổng quát</TableCell>
                                  <TableCell>02/06/2023</TableCell>
                                  <TableCell>12/06/2023</TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="font-medium text-[hsl(var(--selected-patient))]">
                                    22/06/2023
                                  </TableCell>
                                  <TableCell>Khoa tổng quát</TableCell>
                                  <TableCell>01/02/2023</TableCell>
                                  <TableCell>06/02/2023</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  {/* Footer button submit */}
                  <div className="flex content-center p-5 justify-center bg-[hsl(var(--color-custom-3))]/50 border-l border-r border-b shadow">
                    <Button
                      className={cn(
                        "mr-5 w-[150px] bg-[hsl(var(--color-button))] hover:bg-[hsl(var(--color-button))]/80",
                        fontSize
                      )}
                      type="submit"
                    >
                      Lưu
                    </Button>
                  </div>
                </Tabs>
              </form>
            </Form>
          </div>
        </div>
      </ScrollArea>
    </>
  );
}
