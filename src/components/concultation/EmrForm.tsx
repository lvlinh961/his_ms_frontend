"use client";

import { useForm } from "react-hook-form";
import {
  defaultDermatologyEmrFormDefault,
  dermatologyEmrSchema,
  DermatologyEmrSchema,
} from "../emr/emr-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { dermatologyEmrRightTab } from "./consultation.shema";
import { Form } from "../ui/form";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/providers/app-proviceders";
import { Card } from "../ui/card";
import { RightTap } from "@/types";
import { useCallback, useEffect, useState } from "react";
import CustomFormField from "../atoms/custom-form-field";
import { FormFieldType, HttpStatus } from "@/constants/enum";
import { useDashboardContext } from "@/providers/dashboard-providers";
import { toast } from "../ui/use-toast";
import emrApiRequest from "../emr/emrApiRequest";
import { handleErrorApi } from "@/lib/utils";
import { Button } from "../ui/button";

export default function EmrForm() {
  const dermatologyEmrForm = useForm<DermatologyEmrSchema>({
    resolver: zodResolver(dermatologyEmrSchema),
    defaultValues: defaultDermatologyEmrFormDefault,
  });
  const { fontSize } = useAppContext();
  const [activeTab, setActiveTab] = useState<string>("benh_an");
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const { customerSelected } = useDashboardContext();
  const { setLoadingOverlay } = useAppContext();

  const handleActivetab = useCallback(
    (tab: string) => {
      setActiveTab(tab);
    },
    [activeTab]
  );

  useEffect(() => {
    if (customerSelected?.ticketId.length > 0) {
      getDermatologyEmr(customerSelected.ticketId);
    }
  }, [customerSelected]);

  const toggleGroup = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const getDermatologyEmr = async (ticketId: string) => {
    setLoadingOverlay(true);

    try {
      const res = await emrApiRequest.getDermatologyEmrByTicket(ticketId);

      if (res?.payload?.result?.id != null) {
        dermatologyEmrForm.reset(res.payload.result);
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoadingOverlay(false);
    }
  };

  const onSubmit = async (data: DermatologyEmrSchema) => {
    if (!customerSelected) {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Vui lòng chọn bệnh nhân khám!",
      });
      return;
    }

    setLoadingOverlay(true);

    try {
      data.ticketId = customerSelected.ticketId;
      const res = await emrApiRequest.createDermatologyEmr(data);

      if (res.status == HttpStatus.SUCCESS) {
        toast({
          title: "Thông báo",
          description: "Tạo bệnh án thành công!",
        });
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoadingOverlay(false);
    }
  };

  const printDermatologyEmr = () => {
    const id = dermatologyEmrForm.getValues("id");
    if (id) {
      const printUrl = `print/dermatology_emr/${id}`;
      window.open(
        printUrl,
        "_blank",
        "width=800,height=600,left=200,top=100,toolbar=0,scrollbars=0"
      );
    } else {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Không có bệnh án được chọn!",
      });
    }
  };

  return (
    <>
      <div className="flex content-center justify-center mb-5">
        <span className="text-[19px] font-semibold">Bệnh án da liễu</span>
      </div>
      <Form {...dermatologyEmrForm}>
        <form
          onSubmit={dermatologyEmrForm.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <Card className="rounded-none border shadow-none">
            <div className="flex">
              {/* Right Tab */}
              <div className="w-[200px] max-w-[200px] min-h-[calc(100vh_-_280px)] bg-accent">
                {dermatologyEmrRightTab.map((item: RightTap, index: number) => (
                  <div
                    key={index}
                    className={cn(
                      "p-3 cursor-pointer text-sm text-muted-foreground font-semibold hover:text-foreground",
                      activeTab === item.value
                        ? "border-l-4 border-l-cyan-300 border-r-0 bg-background text-muted-foreground-none"
                        : ""
                    )}
                    onClick={() => handleActivetab(item.value)}
                  >
                    {item.title}
                  </div>
                ))}
              </div>

              {/* Tab bệnh án */}
              <div
                className={cn(
                  "flex gap-4 pl-4 w-full",
                  activeTab === "benh_an" ? "block" : "hidden"
                )}
              >
                {/* I/ Lý do vào viện */}
                <div className="flex-col">
                  <div
                    className="p-3 border border-b-0 bg-accent font-bold cursor-pointer"
                    onClick={() => toggleGroup("ly_do")}
                  >
                    I. Lý do vào viện
                  </div>
                  <div
                    className={cn(
                      "p-4 border gap-4",
                      !expanded["ly_do"] ? "block" : "hidden"
                    )}
                  >
                    <div className="flex-row space-y-4">
                      <div>
                        <CustomFormField
                          control={dermatologyEmrForm.control}
                          name="reasonForHospitalization"
                          fieldType={FormFieldType.TEXTAREA}
                          label="Lý do vào viện"
                        />
                      </div>
                      <div>
                        <CustomFormField
                          control={dermatologyEmrForm.control}
                          name="dayOfIllness"
                          fieldType={FormFieldType.INPUT}
                          label="Vào ngày thứ mấy của bệnh:"
                          type="number"
                          onChangeCustom={(e) =>
                            dermatologyEmrForm.setValue(
                              "dayOfIllness",
                              e.target.valueAsNumber
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hỏi bệnh */}
                <div className="flex-col">
                  <div
                    className="p-3 border border-b-0 bg-accent font-bold cursor-pointer"
                    onClick={() => toggleGroup("hoi_benh")}
                  >
                    II. Hỏi bệnh
                  </div>
                  <div
                    className={cn(
                      "p-4 border gap-4 space-y-4",
                      !expanded["hoi_benh"] ? "block" : "hidden"
                    )}
                  >
                    <div className="flex flex-row space-y-4">
                      <CustomFormField
                        control={dermatologyEmrForm.control}
                        name="diseaseProgress"
                        fieldType={FormFieldType.TEXTAREA}
                        label="1. Quá trình bệnh lý"
                      />
                    </div>
                    <div className="flex flex-col space-y-2">
                      <div>2. Tiền sử bệnh</div>
                      <CustomFormField
                        control={dermatologyEmrForm.control}
                        name="personalMedicalHistory"
                        fieldType={FormFieldType.TEXTAREA}
                        label="+ Bản thân"
                      />
                      <div className="flex flex-wrap">
                        <div className="w-1/3 p-2">
                          <CustomFormField
                            control={dermatologyEmrForm.control}
                            name="allergies"
                            fieldType={FormFieldType.INPUT}
                            label="Dị ứng"
                          />
                        </div>
                        <div className="w-1/3 p-2">
                          <CustomFormField
                            control={dermatologyEmrForm.control}
                            name="smoking"
                            fieldType={FormFieldType.INPUT}
                            label="Thuốc lá"
                          />
                        </div>
                        <div className="w-1/3 p-2">
                          <CustomFormField
                            control={dermatologyEmrForm.control}
                            name="pipeTobaccoUse"
                            fieldType={FormFieldType.INPUT}
                            label="Thuốc lào"
                          />
                        </div>
                        <div className="w-1/3 p-2">
                          <CustomFormField
                            control={dermatologyEmrForm.control}
                            name="alcoholUse"
                            fieldType={FormFieldType.INPUT}
                            label="Rượu/bia"
                          />
                        </div>
                        <div className="w-1/3 p-2">
                          <CustomFormField
                            control={dermatologyEmrForm.control}
                            name="illicitDrugUse"
                            fieldType={FormFieldType.INPUT}
                            label="Ma tuý"
                          />
                        </div>
                        <div className="w-1/3 p-2">
                          <CustomFormField
                            control={dermatologyEmrForm.control}
                            name="otherUse"
                            fieldType={FormFieldType.INPUT}
                            label="Khác"
                          />
                        </div>
                      </div>
                      <CustomFormField
                        control={dermatologyEmrForm.control}
                        name="familyMedicalHistory"
                        fieldType={FormFieldType.TEXTAREA}
                        label="+ Gia đình"
                      />
                    </div>
                  </div>
                </div>

                {/* Khám bệnh */}
                <div className="flex-col">
                  <div
                    className="p-3 border border-b-0 bg-accent font-bold cursor-pointer"
                    onClick={() => toggleGroup("kham_benh")}
                  >
                    III. Khám bệnh
                  </div>
                  <div
                    className={cn(
                      "p-4 border gap-4",
                      !expanded["kham_benh"] ? "block" : "hidden"
                    )}
                  >
                    <CustomFormField
                      control={dermatologyEmrForm.control}
                      name="generalExamination"
                      fieldType={FormFieldType.TEXTAREA}
                      label="1. Toàn thân: (ý thức, da niêm mạc, hệ thống hạch, ...)"
                    />
                    <CustomFormField
                      control={dermatologyEmrForm.control}
                      name="subjectiveSymptoms"
                      fieldType={FormFieldType.TEXTAREA}
                      label="2. Triệu chứng cơ năng:"
                    />
                    <CustomFormField
                      control={dermatologyEmrForm.control}
                      name="primaryLesions"
                      fieldType={FormFieldType.TEXTAREA}
                      label="3. Thương tổn căn bản: (sơ phát, thứ phát, tính chất, loại phân bổ, kích thước, hình dáng, màu sắc vv...)"
                    />
                    <div className="flex flex-col">
                      <div>4. Các cơ quan</div>
                      <CustomFormField
                        control={dermatologyEmrForm.control}
                        name="cardiovascularSystem"
                        fieldType={FormFieldType.INPUT}
                        label="+ Tuần hoàn: "
                      />
                      <CustomFormField
                        control={dermatologyEmrForm.control}
                        name="respiratorySystem"
                        fieldType={FormFieldType.INPUT}
                        label="+ Hô hấp: "
                      />
                      <CustomFormField
                        control={dermatologyEmrForm.control}
                        name="digestiveSystem"
                        fieldType={FormFieldType.INPUT}
                        label="+ Tiêu hoá: "
                      />
                      <CustomFormField
                        control={dermatologyEmrForm.control}
                        name="genitourinarySystem"
                        fieldType={FormFieldType.INPUT}
                        label="+ Thận - Tiết niệu - Sinh dục: "
                      />
                      <CustomFormField
                        control={dermatologyEmrForm.control}
                        name="peripheralNervousSystem"
                        fieldType={FormFieldType.INPUT}
                        label="+ Thần kinh ngoại biên: "
                      />
                      <CustomFormField
                        control={dermatologyEmrForm.control}
                        name="otherOrgans"
                        fieldType={FormFieldType.INPUT}
                        label="+ Các cơ quan khác: "
                      />
                    </div>
                    <CustomFormField
                      control={dermatologyEmrForm.control}
                      name="requestedParaclinicalTests"
                      fieldType={FormFieldType.TEXTAREA}
                      label="5. Các xét nghiệm lân sàng cần làm:"
                    />
                    <CustomFormField
                      control={dermatologyEmrForm.control}
                      name="medicalRecordSummary"
                      fieldType={FormFieldType.TEXTAREA}
                      label="6. Tóm tắt bệnh án:"
                    />
                  </div>
                </div>

                {/* Chẩn đoán */}
                <div className="flex-col">
                  <div
                    className="p-3 border border-b-0 bg-accent font-bold cursor-pointer"
                    onClick={() => toggleGroup("chan_doan")}
                  >
                    IV. Chẩn đoán
                  </div>
                  <div
                    className={cn(
                      "p-4 border gap-4",
                      !expanded["chan_doan"] ? "block" : "hidden"
                    )}
                  >
                    <div className="flex flex-col">
                      <div>Chẩn đoán khi vào khoa điều trị:</div>
                      <CustomFormField
                        control={dermatologyEmrForm.control}
                        name="primaryDiagnosis"
                        fieldType={FormFieldType.INPUT}
                        label="+ Bệnh chính: "
                      />
                      <CustomFormField
                        control={dermatologyEmrForm.control}
                        name="secondaryDiagnosis"
                        fieldType={FormFieldType.INPUT}
                        label="+ Bệnh kèm theo (nếu có): "
                      />
                      <CustomFormField
                        control={dermatologyEmrForm.control}
                        name="differentialDiagnosis"
                        fieldType={FormFieldType.INPUT}
                        label="+ Phân biệt: "
                      />
                    </div>
                  </div>
                </div>

                {/* Tiên lượng */}
                <div className="flex-col">
                  <div
                    className="p-3 border border-b-0 bg-accent font-bold cursor-pointer"
                    onClick={() => toggleGroup("tien_luong")}
                  >
                    V. Tiên lượng
                  </div>
                  <div
                    className={cn(
                      "p-4 border gap-4",
                      !expanded["tien_luong"] ? "block" : "hidden"
                    )}
                  >
                    <CustomFormField
                      control={dermatologyEmrForm.control}
                      name="prognosis"
                      fieldType={FormFieldType.TEXTAREA}
                      label="Tiên lượng:"
                    />
                  </div>
                </div>

                {/* Hướng điều trị */}
                <div className="flex-col">
                  <div
                    className="p-3 border border-b-0 bg-accent font-bold cursor-pointer"
                    onClick={() => toggleGroup("huong_dieu_tri")}
                  >
                    VI. Hướng điều trị
                  </div>
                  <div
                    className={cn(
                      "p-4 border gap-4",
                      !expanded["huong_dieu_tri"] ? "block" : "hidden"
                    )}
                  >
                    <CustomFormField
                      control={dermatologyEmrForm.control}
                      name="treatmentPlan"
                      fieldType={FormFieldType.TEXTAREA}
                      label="Hướng điều trị:"
                    />
                  </div>
                </div>
              </div>
              {/* Tổng kết bệnh án */}
              <div
                className={cn(
                  "flex gap-4 pl-4 w-full",
                  activeTab === "tong_ket_ba" ? "block" : "hidden"
                )}
              >
                <div className="flex flex-col">
                  <CustomFormField
                    control={dermatologyEmrForm.control}
                    name="clinicalCourse"
                    fieldType={FormFieldType.TEXTAREA}
                    label="1. Quá trình bệnh lý và diễn biến lâm sàng:"
                  />
                  <CustomFormField
                    control={dermatologyEmrForm.control}
                    name="diagnosticParaclinicalSummary"
                    fieldType={FormFieldType.TEXTAREA}
                    label="2. Tóm tắt kết quả xét nghiệm cận lâm sàng có giá trị chẩn đoán:"
                  />
                  <CustomFormField
                    control={dermatologyEmrForm.control}
                    name="treatmentMethod"
                    fieldType={FormFieldType.TEXTAREA}
                    label="3. Phương pháp điều trị:"
                  />
                  <CustomFormField
                    control={dermatologyEmrForm.control}
                    name="dischargeCondition"
                    fieldType={FormFieldType.TEXTAREA}
                    label="4. Tình trạng người bệnh ra viện:"
                  />
                  <CustomFormField
                    control={dermatologyEmrForm.control}
                    name="postDischargePlan"
                    fieldType={FormFieldType.TEXTAREA}
                    label="5. Hướng điều trị và các chế độ tiếp theo"
                  />
                  <div className="flex flex-col space-y-2">
                    <div>Hồ sơ, phim, ảnh</div>
                    <div className="flex flex-wrap">
                      <div className="w-1/3 p-2">
                        <CustomFormField
                          control={dermatologyEmrForm.control}
                          name="xrayAttachments"
                          fieldType={FormFieldType.INPUT}
                          label="X - Quang"
                        />
                      </div>
                      <div className="w-1/3 p-2">
                        <CustomFormField
                          control={dermatologyEmrForm.control}
                          name="ctScanAttachments"
                          fieldType={FormFieldType.INPUT}
                          label="CT Scanner"
                        />
                      </div>
                      <div className="w-1/3 p-2">
                        <CustomFormField
                          control={dermatologyEmrForm.control}
                          name="ultrasoundAttachments"
                          fieldType={FormFieldType.INPUT}
                          label="Siêu âm"
                        />
                      </div>
                      <div className="w-1/3 p-2">
                        <CustomFormField
                          control={dermatologyEmrForm.control}
                          name="labsAttachments"
                          fieldType={FormFieldType.INPUT}
                          label="Xét nghiệm"
                        />
                      </div>
                      <div className="w-1/3 p-2">
                        <CustomFormField
                          control={dermatologyEmrForm.control}
                          name="otherAttachments"
                          fieldType={FormFieldType.INPUT}
                          label="Khác"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
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
            <Button
              className={cn(
                "w-[150px] bg-[hsl(var(--color-button))] hover:bg-[hsl(var(--color-button))]/80",
                fontSize
              )}
              type="button"
              onClick={printDermatologyEmr}
            >
              In
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
