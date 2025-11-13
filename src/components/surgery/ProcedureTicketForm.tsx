"use client";

import { useForm } from "react-hook-form";
import {
  procedureTicketFormSchema,
  ProcedureTicketFormSchema,
  defaultProcedureTicketForm,
  GenderEnum,
  GenderLabels,
  SurgeryLevelEnum,
  SurgeryLevelLabels,
  DocumentTypeEnum,
  DocumentTypeLabels,
} from "./surgery.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppContext } from "@/providers/app-proviceders";
import { useDashboardContext } from "@/providers/dashboard-providers";
import { useEffect } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Form } from "../ui/form";
import { logger } from "@/lib/logger";
import CustomFormField from "../atoms/custom-form-field";
import { FormFieldType, HttpStatus } from "@/constants/enum";
import { RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";
import surgeryApiRequest from "./surgeryApiRequest";
import { calculateAge, handleErrorApi } from "@/lib/utils";

export default function ProcedureTicketForm() {
  const procedureTicketForm = useForm<ProcedureTicketFormSchema>({
    resolver: zodResolver(procedureTicketFormSchema),
    defaultValues: defaultProcedureTicketForm,
  });
  const { user, setLoadingOverlay } = useAppContext();
  const { customerSelected } = useDashboardContext();

  useEffect(() => {
    if (customerSelected) {
      getFormData();
    }
  }, []);

  const getFormData = async () => {
    if (customerSelected) {
      setLoadingOverlay(true);

      try {
        const res = await surgeryApiRequest.getProcedureTicket(
          String(customerSelected.ticketId),
          DocumentTypeEnum.enum.PROCEDURE_TICKET
        );

        if (res.status == HttpStatus.SUCCESS && res.payload.result) {
          procedureTicketForm.reset(res.payload.result);
          const dataServer = res.payload.result;
          procedureTicketForm.reset({
            ...dataServer,
            data: {
              ...dataServer.data,
              procedureTime: new Date(dataServer.data.procedureTime),
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
    procedureTicketForm.setValue("patientId", customerSelected.patientId || "");
    procedureTicketForm.setValue(
      "data.patient.name",
      customerSelected?.patientName || ""
    );
    procedureTicketForm.setValue(
      "data.patient.age",
      customerSelected.dateOfBirth
        ? String(calculateAge(new Date(customerSelected.dateOfBirth)))
        : ""
    );
    procedureTicketForm.setValue(
      "data.patient.gender",
      GenderEnum.parse(customerSelected.gender) || GenderEnum.enum.MALE
    );
    procedureTicketForm.setValue("ticketId", customerSelected.ticketId || "");
    procedureTicketForm.setValue("doctorId", String(user.id));
    procedureTicketForm.setValue(
      "documentType",
      DocumentTypeEnum.enum.PROCEDURE_TICKET
    );
    procedureTicketForm.setValue(
      "title",
      DocumentTypeLabels[DocumentTypeEnum.enum.PROCEDURE_TICKET]
    );
    procedureTicketForm.setValue("clinicName", user?.tenant?.name || "");
  };

  const submitFormProcedure = async (data: ProcedureTicketFormSchema) => {
    logger.info("Submit Procedure Ticket Form", data);
    setLoadingOverlay(true);

    try {
      const res = await surgeryApiRequest.saveProcedureTicket(data);

      if (res.status == HttpStatus.SUCCESS) {
        toast({
          title: "Thông báo",
          description: "Tạo phiếu thủ thuật thành công!",
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
    const documentId = procedureTicketForm.getValues("id");

    if (documentId) {
      const printUrl = `print/document/${ticketId}/${DocumentTypeEnum.enum.PROCEDURE_TICKET}`;
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
      <Form {...procedureTicketForm}>
        <form
          onSubmit={procedureTicketForm.handleSubmit(
            submitFormProcedure,
            (errors) => {
              logger.error("submitFormProcedure error: ", errors);
            }
          )}
        >
          <div className="flex-row space-y-0">
            <fieldset className="border border-gray-300 rounded-lg p-4 mb-4">
              <legend className="text-base font-semibold text-gray-700 px-2">
                Thống tin người bệnh
              </legend>
              <div className="flex flex-col w-full space-y-0">
                <div className="flex flex-row justify-end space-x-2 mt-4">
                  <CustomFormField
                    control={procedureTicketForm.control}
                    fieldType={FormFieldType.INPUT}
                    name="data.patient.name"
                    label="Họ tên bệnh nhân:"
                    placeholder="Nhập họ tên bệnh nhân"
                    direction="row"
                    labelWidth="w-[150px]"
                    fieldWidth="w-[250px]"
                  />
                  <CustomFormField
                    control={procedureTicketForm.control}
                    fieldType={FormFieldType.INPUT}
                    name="data.patient.age"
                    label="Tuổi:"
                    placeholder="Tuổi bệnh nhân"
                    direction="row"
                    labelWidth="w-[50px]"
                  />
                </div>
                <div className="flex flex-col w-full space-y-0">
                  <CustomFormField
                    control={procedureTicketForm.control}
                    fieldType={FormFieldType.RADIO}
                    name="data.patient.gender"
                    label="Giới tính:"
                    placeholder=""
                    direction="row"
                    labelWidth="w-[150px]"
                    fieldWidth="w-full"
                  >
                    <div className="flex flex-wrap w-full gap-4">
                      {GenderEnum.options.map((option) => (
                        <div
                          key={option}
                          className="flex items-center space-x-3 space-y-0"
                        >
                          <RadioGroupItem value={option} id={option} />
                          <Label htmlFor={option}>{GenderLabels[option]}</Label>
                        </div>
                      ))}
                    </div>
                  </CustomFormField>
                </div>
              </div>
            </fieldset>
            <CustomFormField
              control={procedureTicketForm.control}
              fieldType={FormFieldType.INPUT}
              name="data.preDiagnosis"
              label="Chẩn đoán trước phẫu thuật:"
              placeholder="Nhập chẩn đoán trước phẫu thuật"
              direction="row"
              labelWidth="w-[150px]"
            />
            <CustomFormField
              control={procedureTicketForm.control}
              fieldType={FormFieldType.INPUT}
              name="data.postDiagnosis"
              label="Chẩn đoán sau phẫu thuật:"
              placeholder="Nhập chẩn đoán sau phẫu thuật"
              direction="row"
              labelWidth="w-[150px]"
            />
            <CustomFormField
              control={procedureTicketForm.control}
              fieldType={FormFieldType.INPUT}
              name="data.surgeryMethod"
              label="Phương pháp phẫu thuật:"
              placeholder="Nhập phương pháp phẫu thuật"
              direction="row"
              labelWidth="w-[150px]"
            />
            <div className="flex flex-col w-full space-y-0">
              <CustomFormField
                control={procedureTicketForm.control}
                fieldType={FormFieldType.RADIO}
                name="data.surgeryLevel"
                label="Loại thủ thuật:"
                placeholder=""
                direction="row"
                labelWidth="w-[150px]"
                fieldWidth="w-full"
              >
                <div className="flex flex-wrap w-full gap-4">
                  {SurgeryLevelEnum.options.map((option) => (
                    <div
                      key={option}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor="male">{SurgeryLevelLabels[option]}</Label>
                    </div>
                  ))}
                </div>
              </CustomFormField>
            </div>
            <CustomFormField
              control={procedureTicketForm.control}
              fieldType={FormFieldType.INPUT}
              name="data.disinterestedMethod"
              label="Phương pháp vô cảm:"
              placeholder="Nhập phương vô cảm"
              direction="row"
              labelWidth="w-[150px]"
            />
            <CustomFormField
              control={procedureTicketForm.control}
              fieldType={FormFieldType.INPUT}
              name="data.surgeon"
              label="Bác sĩ làm thủ thuật:"
              placeholder="Nhập bác sĩ làm thủ thuật"
              direction="row"
              labelWidth="w-[150px]"
            />
            <CustomFormField
              control={procedureTicketForm.control}
              fieldType={FormFieldType.INPUT}
              name="data.assistantSurgeons"
              label="Nhân viên phụ:"
              placeholder="Nhập nhân viên phụ"
              direction="row"
              labelWidth="w-[150px]"
            />
            <CustomFormField
              control={procedureTicketForm.control}
              fieldType={FormFieldType.INPUT}
              name="data.anesthetist"
              label="Bác sĩ giây mê hồi sức:"
              placeholder="Nhập bác sĩ giây mê hồi sức (nếu có)"
              direction="row"
              labelWidth="w-[150px]"
            />
            <CustomFormField
              control={procedureTicketForm.control}
              fieldType={FormFieldType.DATETIME_PICKER}
              name="data.procedureTime"
              label="Thời gian thủ thuật:"
              direction="row"
              labelWidth="w-[150px]"
            />
            <fieldset className="border border-gray-300 rounded-lg p-4 mb-4">
              <legend className="text-base font-semibold text-gray-700 px-2">
                Tóm tắt quá trình làm thủ thuật
              </legend>
              <div className="flex flex-col w-full space-y-2">
                <CustomFormField
                  control={procedureTicketForm.control}
                  fieldType={FormFieldType.TEXTAREA}
                  name="data.surgicalProcedure"
                  placeholder="Nhập tóm tắt quá trình làm thủ thuật:"
                  direction="row"
                  labelWidth="w-[150px]"
                />
                <CustomFormField
                  control={procedureTicketForm.control}
                  fieldType={FormFieldType.TEXTAREA}
                  name="data.complications"
                  placeholder="Các biến chứng trong quá trình làm thủ thuật:"
                  direction="row"
                  labelWidth="w-[150px]"
                />
                <CustomFormField
                  control={procedureTicketForm.control}
                  fieldType={FormFieldType.INPUT}
                  name="data.bloodLoss"
                  label="Lượng máu mất:"
                  placeholder="Nhập lượng máu mất"
                  direction="row"
                  labelWidth="w-[150px]"
                  fieldWidth="w-[250px]"
                />
                <CustomFormField
                  control={procedureTicketForm.control}
                  fieldType={FormFieldType.INPUT}
                  name="data.numberOfSamples"
                  label="Số mẫu bệnh phẩm:"
                  placeholder="Nhập số mẫu bệnh phẩm nếu có"
                  direction="row"
                  labelWidth="w-[150px]"
                  fieldWidth="w-[250px]"
                />
                <CustomFormField
                  control={procedureTicketForm.control}
                  fieldType={FormFieldType.INPUT}
                  name="data.implants"
                  label="Thiết bị cấy ghép:"
                  placeholder="Nhập số đăng ký của thiết bị cấy ghép (nếu có)"
                  direction="row"
                  labelWidth="w-[150px]"
                />
              </div>
            </fieldset>
          </div>
          <div className="flex flex-row w-full items-end justify-end gap-4 mt-4">
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
