"use client";

import { useDashboardContext } from "@/providers/dashboard-providers";
import { useAppContext } from "@/providers/app-proviceders";
import { use, useEffect } from "react";

import {
  AcceptSurgeryTicketFormSchema,
  defaultAcceptSurgeryTicketForm,
  acceptSurgeryTicketSchema,
  SurgeryTypeEnum,
  SurgeryTypeLabels,
  SurgeryMethodEnum,
  SurgeryMethodLabels,
  DisinterestedMethodEnum,
  DisinterestedMethodLabels,
  RiskOfAccidentEnum,
  RiskOfAcciedentLabels,
  DocumentTypeEnum,
  DocumentTypeLabels,
} from "@/components/surgery/surgery.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "../ui/form";
import { logger } from "@/lib/logger";
import CustomFormField from "../atoms/custom-form-field";
import { FormFieldType, HttpStatus } from "@/constants/enum";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import surgeryApiRequest from "./surgeryApiRequest";
import { handleErrorApi } from "@/lib/utils";
import { fi } from "date-fns/locale";
import { toast } from "../ui/use-toast";
import { Radio } from "lucide-react";

export default function AcceptSurgeryTicketForm() {
  const { customerSelected } = useDashboardContext();
  const { user, setLoadingOverlay } = useAppContext();

  const acceptForm = useForm<AcceptSurgeryTicketFormSchema>({
    resolver: zodResolver(acceptSurgeryTicketSchema),
    defaultValues: defaultAcceptSurgeryTicketForm,
  });

  useEffect(() => {
    if (customerSelected) {
      getFormData();
    }
  }, [customerSelected]);

  const getFormData = async () => {
    if (customerSelected) {
      setLoadingOverlay(true);
      try {
        const res = await surgeryApiRequest.getAcceptSurgeryTicket(
          String(customerSelected.ticketId),
          DocumentTypeEnum.enum.SURGERY_CONSENT
        );

        if (res.status == HttpStatus.SUCCESS && res.payload.result) {
          logger.info(
            "Get Accept Surgery Ticket Form data from server:",
            res.payload.result
          );
          const serverData = res.payload.result;
          acceptForm.reset({
            ...serverData,
            data: {
              ...serverData.data,
              surgeryType: serverData.data?.surgeryType || undefined,
            },
          });
        } else {
          setDefaultFormValue();
        }
      } catch (error) {
        handleErrorApi({ error });
      } finally {
        setLoadingOverlay(false);
      }
    }
  };

  const setDefaultFormValue = () => {
    acceptForm.setValue("patientId", customerSelected.patientId || "");
    acceptForm.setValue("ticketId", customerSelected.ticketId || "");
    acceptForm.setValue("clinicName", user?.tenant?.name || "");
    acceptForm.setValue(
      "data.doctor.name",
      `${user.lastName} ${user.firstName}`
    );
    acceptForm.setValue("doctorName", `${user.lastName} ${user.firstName}`);
    acceptForm.setValue("doctorId", String(user.id));
    acceptForm.setValue("documentType", DocumentTypeEnum.enum.SURGERY_CONSENT);
    acceptForm.setValue(
      "title",
      DocumentTypeLabels[DocumentTypeEnum.enum.SURGERY_CONSENT]
    );
  };

  const onSubmit = async (data: AcceptSurgeryTicketFormSchema) => {
    setLoadingOverlay(true);
    try {
      const res = await surgeryApiRequest.createNewAcceptTicket(data);

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

  const print = () => {
    const ticketId = String(customerSelected.ticketId);
    const documentId = acceptForm.getValues("id");

    if (documentId) {
      const printUrl = `print/document/${ticketId}/${DocumentTypeEnum.enum.SURGERY_CONSENT}`;
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
    <ScrollArea className="h-[calc(100vh-180px)]">
      <Form {...acceptForm}>
        <form
          onSubmit={acceptForm.handleSubmit(onSubmit, (e) => {
            logger.error("Accept Surgery Ticket Form errors", e);
          })}
          className="space-y-8"
        >
          <div className="flex-row space-y-0">
            <CustomFormField
              control={acceptForm.control}
              fieldType={FormFieldType.RADIO}
              name="data.surgeryType"
              label="Loại phẫu thuật:"
              placeholder=""
              direction="row"
              labelWidth="w-[120px]"
            >
              <div className="w-full inline-flex gap-4">
                {SurgeryTypeEnum.options.map((option) => (
                  <div
                    key={option}
                    className="flex items-center space-x-3 space-y-0"
                  >
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor="male">{SurgeryTypeLabels[option]}</Label>
                  </div>
                ))}
              </div>
            </CustomFormField>
          </div>
          <div className="flex-col space-y-4">
            <CustomFormField
              control={acceptForm.control}
              fieldType={FormFieldType.INPUT}
              name="clinicName"
              label="Tên phòng khám:"
              placeholder="Nhập tên phòng khám"
              direction="row"
              labelWidth="w-[120px]"
            />
            <CustomFormField
              control={acceptForm.control}
              fieldType={FormFieldType.INPUT}
              name="data.doctor.name"
              label="Bác sĩ:"
              placeholder="Nhập tên bác sĩ"
              direction="row"
              labelWidth="w-[120px]"
            />
            <div className="flex flex-row justify-end space-x-2 mt-4">
              <CustomFormField
                control={acceptForm.control}
                fieldType={FormFieldType.INPUT}
                name="data.doctor.title"
                label="Chức danh:"
                placeholder="Nhập mã chức danh bác sĩ"
                direction="row"
                labelWidth="w-[120px]"
                fieldWidth="w-[220px]"
              />
              <CustomFormField
                control={acceptForm.control}
                fieldType={FormFieldType.INPUT}
                name="data.doctor.department"
                label="Khoa:"
                placeholder="Nhập khoa"
                direction="row"
                labelWidth="w-[50px]"
              />
            </div>
            <CustomFormField
              control={acceptForm.control}
              fieldType={FormFieldType.INPUT}
              name="data.otherDoctor.name"
              label="Bác sĩ khác:"
              placeholder="Bác sĩ khác"
              direction="row"
              labelWidth="w-[120px]"
            />
            <div className="flex flex-row justify-end space-x-2 mt-4">
              <CustomFormField
                control={acceptForm.control}
                fieldType={FormFieldType.INPUT}
                name="data.otherDoctor.title"
                label="Chức danh:"
                placeholder="Nhập mã chức danh bác sĩ"
                direction="row"
                labelWidth="w-[120px]"
                fieldWidth="w-[220px]"
              />
              <CustomFormField
                control={acceptForm.control}
                fieldType={FormFieldType.INPUT}
                name="data.otherDoctor.department"
                label="Khoa:"
                placeholder="Nhập khoa"
                direction="row"
                labelWidth="w-[50px]"
              />
            </div>
            <CustomFormField
              control={acceptForm.control}
              fieldType={FormFieldType.TEXTAREA}
              name="data.diagnosis"
              label="Chẩn đoán:"
              placeholder="Nhập chẩn đoán"
              direction="row"
              labelWidth="w-[120px]"
            />
            <div>
              <p className="font-bold">
                Tư vấn, giải thích các thông tin cho người bệnh:
              </p>
            </div>
            <CustomFormField
              control={acceptForm.control}
              fieldType={FormFieldType.CHECKBOX}
              name="data.explanationOfDiagnosis"
              label="Chẩn đoán"
              placeholder=""
              direction="row"
              labelWidth="w-[120px]"
            />
            <CustomFormField
              control={acceptForm.control}
              fieldType={FormFieldType.CHECKBOX}
              name="data.explanationOfSurgeryReason"
              label="Lý do phẫu thuật/thủ thuật"
              placeholder=""
              direction="row"
              labelWidth="w-[120px]"
            />
            <CustomFormField
              control={acceptForm.control}
              fieldType={FormFieldType.CHECKBOX}
              name="data.explanationOfRisks"
              label="Rủi ro, nguy cơ nếu không thực hiện phẫu thuật/thủ thuật"
              placeholder=""
              direction="row"
              labelWidth="w-[120px]"
            />
            <CustomFormField
              control={acceptForm.control}
              fieldType={FormFieldType.TEXTAREA}
              name="data.explanationOfExpectedResults"
              label="Kết quả sau phẫu thuật/thủ thuật (Dự kiến)"
              placeholder=""
              direction="row"
              labelWidth="w-[120px]"
            />
            <div className="font-bold">
              <p>Phương pháp phẫu thuật/thủ thuật dự kiến:</p>
            </div>
            <div className="flex-row space-y-0">
              <CustomFormField
                control={acceptForm.control}
                fieldType={FormFieldType.RADIO}
                name="data.surgeryMethod"
                placeholder=""
                direction="row"
                labelWidth="w-[120px]"
              >
                <div className="w-full inline-flex gap-4">
                  {SurgeryMethodEnum.options.map((option, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor="male">
                        {SurgeryMethodLabels[option]}
                      </Label>
                    </div>
                  ))}
                </div>
              </CustomFormField>
            </div>
            <div className="font-bold">
              <p>Phương pháp giây mê hồi sức dự kiến:</p>
            </div>
            <div className="flex flex-col w-full space-y-0">
              <CustomFormField
                control={acceptForm.control}
                fieldType={FormFieldType.RADIO}
                name="data.disinterestedMethod"
                placeholder=""
                direction="col"
                fieldWidth="w-full"
              >
                <div className="flex flex-wrap w-full gap-4">
                  {DisinterestedMethodEnum.options.map((option) => (
                    <div
                      key={option}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor="male">
                        {DisinterestedMethodLabels[option]}
                      </Label>
                    </div>
                  ))}
                </div>
              </CustomFormField>
            </div>
            <CustomFormField
              control={acceptForm.control}
              fieldType={FormFieldType.TEXTAREA}
              name="data.otherMethod"
              label="Phương pháp điều trị khác (nếu có):"
              placeholder=""
              direction="row"
              labelWidth="w-[120px]"
            />
            <div className="font-bold">
              <p>
                Nguy cơ, tai biến trong và sau phẫu thuật/thủ thuật có thể xảy
                ra:
              </p>
            </div>
            <div className="flex flex-col w-full space-y-0">
              <CustomFormField
                control={acceptForm.control}
                fieldType={FormFieldType.RADIO}
                name="data.riskOfAccident"
                placeholder=""
                direction="col"
                fieldWidth="w-full"
              >
                <div className="flex flex-wrap w-full gap-4">
                  {RiskOfAccidentEnum.options.map((option) => (
                    <div
                      key={option}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor="male">
                        {RiskOfAcciedentLabels[option]}
                      </Label>
                    </div>
                  ))}
                </div>
              </CustomFormField>
            </div>
            <CustomFormField
              control={acceptForm.control}
              fieldType={FormFieldType.TEXTAREA}
              name="data.otherRisk"
              label="Nguy cơ khác (nếu có):"
              placeholder=""
              direction="row"
              labelWidth="w-[120px]"
            />
          </div>
          <div className="flex flex-row w-full items-end justify-end gap-4">
            <Button type="submit" className="bg-primary">
              Lưu
            </Button>
            <Button type="button" variant="secondary" onClick={print}>
              In
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}
