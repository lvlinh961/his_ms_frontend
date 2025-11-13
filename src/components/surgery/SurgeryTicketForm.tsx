"use client";

import { useEffect } from "react";
import {
  surgeryTicketFormSchema,
  SurgeryTicketFormSchema,
  defaultSurgeryTicketForm,
  GenderEnum,
  GenderLabels,
  SurgeryLevelEnum,
  SurgeryLevelLabels,
  IncisionTypeEnum,
  IncisionTypeLabels,
  DocumentTypeEnum,
  DocumentTypeLabels,
} from "./surgery.types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollArea } from "../ui/scroll-area";
import { Form } from "../ui/form";
import { logger } from "@/lib/logger";
import CustomFormField from "../atoms/custom-form-field";
import { FormFieldType, HttpStatus } from "@/constants/enum";
import { RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import SurgeryDrainageRow from "./SurgeryDrainageRow";
import SurgeryImplantRow from "./SurgeryImplantRow";
import { Button } from "../ui/button";
import { useDashboardContext } from "@/providers/dashboard-providers";
import { useAppContext } from "@/providers/app-proviceders";
import { calculateAge, handleErrorApi } from "@/lib/utils";
import surgeryApiRequest from "./surgeryApiRequest";
import { toast } from "../ui/use-toast";

export default function SurgeryTicketForm() {
  const surgeryTicketForm = useForm<SurgeryTicketFormSchema>({
    resolver: zodResolver(surgeryTicketFormSchema),
    defaultValues: defaultSurgeryTicketForm,
  });

  const { customerSelected } = useDashboardContext();
  const { user, setLoadingOverlay } = useAppContext();

  useEffect(() => {
    if (customerSelected) {
      getFormData();
    }
  }, []);

  const getFormData = async () => {
    if (customerSelected) {
      setLoadingOverlay(true);

      const res = await surgeryApiRequest.getSurgeryTicket(
        String(customerSelected.ticketId),
        DocumentTypeEnum.enum.SURGERY_TICKET
      );

      try {
        if (res.status == HttpStatus.SUCCESS && res.payload.result) {
          const dataServer = res.payload.result;
          surgeryTicketForm.reset({
            ...dataServer,
            data: {
              ...dataServer.data,
              checkInDate: new Date(dataServer.data.checkInDate),
              surgeryStartTime: new Date(dataServer.data.surgeryStartTime),
              surgeryEndTime: new Date(dataServer.data.surgeryEndTime),
              surgeryTime: new Date(dataServer.data.surgeryTime),
            },
          });
        } else {
          setDefaultFormValue();
        }
      } catch (error) {
        logger.error(error);
        handleErrorApi({ error });
      } finally {
        setLoadingOverlay(false);
      }
    }
  };

  const setDefaultFormValue = () => {
    surgeryTicketForm.setValue("patientId", customerSelected.patientId || "");
    surgeryTicketForm.setValue(
      "data.patient.name",
      customerSelected?.patientName || ""
    );
    surgeryTicketForm.setValue(
      "data.patient.age",
      customerSelected.dateOfBirth
        ? String(calculateAge(new Date(customerSelected.dateOfBirth)))
        : ""
    );
    surgeryTicketForm.setValue(
      "data.patient.gender",
      GenderEnum.parse(customerSelected.gender) || GenderEnum.enum.MALE
    );
    surgeryTicketForm.setValue("data.address", customerSelected?.address || "");
    surgeryTicketForm.setValue("ticketId", customerSelected.ticketId || "");
    surgeryTicketForm.setValue("clinicName", user?.tenant?.name || "");
    surgeryTicketForm.setValue(
      "doctorName",
      `${user.lastName} ${user.firstName}`
    );
    surgeryTicketForm.setValue("doctorId", String(user.id));
    surgeryTicketForm.setValue(
      "documentType",
      DocumentTypeEnum.enum.SURGERY_TICKET
    );
    surgeryTicketForm.setValue(
      "title",
      DocumentTypeLabels[DocumentTypeEnum.enum.SURGERY_TICKET]
    );
  };

  const onSubmmit = async (data: SurgeryTicketFormSchema) => {
    setLoadingOverlay(true);

    try {
      const res = await surgeryApiRequest.saveSurgeryTicket(data);

      if (res.status == HttpStatus.SUCCESS) {
        toast({
          title: "Thông báo",
          description: "Tạo phiếu phẫu thuật thành công!",
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
    const documentId = surgeryTicketForm.getValues("id");

    if (documentId) {
      const printUrl = `print/document/${ticketId}/${DocumentTypeEnum.enum.SURGERY_TICKET}`;
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

  const printSafetyChecklist = () => {
    const ticketId = String(customerSelected.ticketId);
    const printUrl = `print/document/${ticketId}/${DocumentTypeEnum.enum.SURGICAL_SAFETY_CHECKLIST}`;
    window.open(
      printUrl,
      "_blank",
      "width=800,height=600,left=200,top=100,toolbar=0,scrollbars=0"
    );
  };

  return (
    <ScrollArea className="h-[calc(100vh-180px)]">
      <Form {...surgeryTicketForm}>
        <form
          onSubmit={surgeryTicketForm.handleSubmit(onSubmmit, (error) => {
            logger.error("Surgery Ticket Form Error: ", error);
          })}
        >
          <div className="flex-row space-y-0">
            <fieldset className="border border-gray-300 rounded-lg p-4 mb-4">
              <legend className="text-base font-semibold text-gray-700 px-2">
                Thông tin hành chính
              </legend>
              <div className="flex flex-col w-full space-y-0">
                <div className="flex flex-row justify-end space-x-2 mt-4">
                  <CustomFormField
                    control={surgeryTicketForm.control}
                    fieldType={FormFieldType.INPUT}
                    name="data.patient.name"
                    label="Họ tên bệnh nhân:"
                    placeholder="Nhập họ tên bệnh nhân"
                    direction="row"
                    labelWidth="w-[150px]"
                    fieldWidth="w-[250px]"
                  />
                  <CustomFormField
                    control={surgeryTicketForm.control}
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
                    control={surgeryTicketForm.control}
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
                          <Label htmlFor="male">{GenderLabels[option]}</Label>
                        </div>
                      ))}
                    </div>
                  </CustomFormField>
                </div>
                <CustomFormField
                  control={surgeryTicketForm.control}
                  fieldType={FormFieldType.INPUT}
                  name="data.address"
                  label="Địa chỉ:"
                  placeholder="Nhập địa chỉ"
                  direction="row"
                  labelWidth="w-[150px]"
                />
                <CustomFormField
                  control={surgeryTicketForm.control}
                  fieldType={FormFieldType.DATETIME_PICKER}
                  name="data.checkInDate"
                  label="Vào viện lúc:"
                  direction="row"
                  labelWidth="w-[150px]"
                />
                <CustomFormField
                  control={surgeryTicketForm.control}
                  fieldType={FormFieldType.DATETIME_PICKER}
                  name="data.surgeryStartTime"
                  label="Phẫu thuật bắt đầu lúc:"
                  direction="row"
                  labelWidth="w-[150px]"
                />
                <CustomFormField
                  control={surgeryTicketForm.control}
                  fieldType={FormFieldType.DATETIME_PICKER}
                  name="data.surgeryEndTime"
                  label="Phẫu thuật kết thúc lúc:"
                  direction="row"
                  labelWidth="w-[150px]"
                />
              </div>
            </fieldset>

            <CustomFormField
              control={surgeryTicketForm.control}
              fieldType={FormFieldType.INPUT}
              name="data.prePiagnosis"
              label="Chẩn đoán trước phẫu thuật:"
              placeholder="Nhập chẩn đoán trước phẫu thuật"
              direction="row"
              labelWidth="w-[150px]"
            />
            <CustomFormField
              control={surgeryTicketForm.control}
              fieldType={FormFieldType.INPUT}
              name="data.postDiagnosis"
              label="Chẩn đoán sau phẫu thuật:"
              placeholder="Nhập chẩn đoán sau phẫu thuật"
              direction="row"
              labelWidth="w-[150px]"
            />
            <CustomFormField
              control={surgeryTicketForm.control}
              fieldType={FormFieldType.INPUT}
              name="data.surgeryMethod"
              label="Phương pháp phẫu thuật:"
              placeholder="Nhập phương pháp phẫu thuật"
              direction="row"
              labelWidth="w-[150px]"
            />
            <div className="flex flex-col w-full space-y-0">
              <CustomFormField
                control={surgeryTicketForm.control}
                fieldType={FormFieldType.RADIO}
                name="data.surgeryLevel"
                label="Loại phấu thuật:"
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
            <div className="flex flex-col w-full space-y-0">
              <CustomFormField
                control={surgeryTicketForm.control}
                fieldType={FormFieldType.RADIO}
                name="data.incisionType"
                label="Phân loại vết mổ:"
                placeholder=""
                direction="row"
                labelWidth="w-[150px]"
                fieldWidth="w-full"
              >
                <div className="flex flex-wrap w-full gap-4">
                  {IncisionTypeEnum.options.map((option) => (
                    <div
                      key={option}
                      className="flex items-center space-x-3 space-y-0"
                    >
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor="male">{IncisionTypeLabels[option]}</Label>
                    </div>
                  ))}
                </div>
              </CustomFormField>
            </div>
            <div className="flex flex-col w-full space-y-0">
              <CustomFormField
                control={surgeryTicketForm.control}
                fieldType={FormFieldType.RADIO}
                name="data.pathology"
                label="Giải phẫu bệnh lý:"
                placeholder=""
                direction="row"
                labelWidth="w-[150px]"
                fieldWidth="w-full"
                value={String(surgeryTicketForm.getValues("data.pathology"))}
                onChangeCustom={(value) => {
                  console.log("LINH", value);
                  surgeryTicketForm.setValue("data.pathology", value == "true");
                }}
              >
                <div className="flex flex-wrap w-full gap-4">
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value={"true"} />
                    <Label>Có</Label>
                  </div>
                  <div className="flex items-center space-x-3 space-y-0">
                    <RadioGroupItem value={"false"} />
                    <Label>Không</Label>
                  </div>
                </div>
              </CustomFormField>
            </div>
            <CustomFormField
              control={surgeryTicketForm.control}
              fieldType={FormFieldType.INPUT}
              name="data.disinterestedMethod"
              label="Phương pháp vô cảm:"
              placeholder="Nhập phương vô cảm"
              direction="row"
              labelWidth="w-[150px]"
            />

            <fieldset className="border border-gray-300 rounded-lg p-4 space-y-3">
              <legend className="text-base font-semibold text-gray-700 px-2">
                Ekip phẫu thuật
              </legend>
              <div className="flex flex-col w-full space-y-0">
                <CustomFormField
                  control={surgeryTicketForm.control}
                  fieldType={FormFieldType.INPUT}
                  name="data.surgeon"
                  label="Phẫu thuật viên chính:"
                  placeholder="Nhập phẫu thuật viên chính"
                  direction="row"
                  labelWidth="w-[150px]"
                />
                <CustomFormField
                  control={surgeryTicketForm.control}
                  fieldType={FormFieldType.INPUT}
                  name="data.assistantSurgeons"
                  label="Phẫu thuật viên phụ:"
                  placeholder="Nhập phẫu thuật viên phụ"
                  direction="row"
                  labelWidth="w-[150px]"
                />
                <CustomFormField
                  control={surgeryTicketForm.control}
                  fieldType={FormFieldType.INPUT}
                  name="data.anesthetist"
                  label="Bác sỹ giây mê hồi sức:"
                  placeholder="Nhập bác sỹ giây mê hồi sức"
                  direction="row"
                  labelWidth="w-[150px]"
                />
                <CustomFormField
                  control={surgeryTicketForm.control}
                  fieldType={FormFieldType.INPUT}
                  name="data.anesthesiaNurses"
                  label="Điều dưỡng phụ mê:"
                  placeholder="Nhập điều dưỡng phụ mê"
                  direction="row"
                  labelWidth="w-[150px]"
                />
                <CustomFormField
                  control={surgeryTicketForm.control}
                  fieldType={FormFieldType.INPUT}
                  name="data.instrumentsNurses"
                  label="Điều dưỡng dụng cụ:"
                  placeholder="Nhập điều dưỡng dụng cụ"
                  direction="row"
                  labelWidth="w-[150px]"
                />
                <CustomFormField
                  control={surgeryTicketForm.control}
                  fieldType={FormFieldType.INPUT}
                  name="data.otherNurses"
                  label="Điều dưỡng chạy ngoài:"
                  placeholder="Nhập điều dưỡng chạy ngoài"
                  direction="row"
                  labelWidth="w-[150px]"
                />
              </div>
            </fieldset>
            <CustomFormField
              control={surgeryTicketForm.control}
              fieldType={FormFieldType.DATETIME_PICKER}
              name="data.surgeryTime"
              label="Thời gian phẫu thuật:"
              direction="row"
              labelWidth="w-[150px]"
            />
            <fieldset className="border border-gray-300 rounded-lg p-4 mb-4">
              <legend className="text-base font-semibold text-gray-700 px-2">
                Lượt đồ phẫu thuật
              </legend>

              <div className="flex flex-col w-full space-y-0">
                <CustomFormField
                  control={surgeryTicketForm.control}
                  fieldType={FormFieldType.TEXTAREA}
                  name="data.surgicalSchematic"
                  placeholder="Nhập lượt đồ phẫu thuật:"
                  direction="row"
                  labelWidth="w-[150px]"
                />
                <fieldset className="border border-gray-300 rounded-lg p-4 mb-4">
                  <legend className="text-base font-semibold text-gray-700 px-2">
                    Dẫn lưu
                  </legend>
                  <div className="flex flex-col w-full space-y-0">
                    <div className="grid grid-cols-[1fr_8fr_3fr] gap-2 bg-cyan-700 text-white font-semibold text-sm px-2 py-2 rounded-md mt-4">
                      <div className="text-left">#</div>
                      <div className="text-left">Vị trí</div>
                      <div className="text-left">Số lượng</div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <SurgeryDrainageRow
                      control={surgeryTicketForm.control}
                      setValue={surgeryTicketForm.setValue}
                      formState={surgeryTicketForm.formState}
                    />
                  </div>
                </fieldset>

                <div className="flex flex-row justify-end space-x-2 mt-4">
                  <CustomFormField
                    control={surgeryTicketForm.control}
                    fieldType={FormFieldType.INPUT}
                    name="data.blooldLoss"
                    label="Lượng máu mất:"
                    placeholder="Nhập lượng máu mất"
                    direction="row"
                    labelWidth="w-[150px]"
                    fieldWidth="w-[250px]"
                  />
                  <CustomFormField
                    control={surgeryTicketForm.control}
                    fieldType={FormFieldType.INPUT}
                    name="data.bloodTransfusion"
                    label="Lượng máu truyền vào:"
                    placeholder="Nhập lượng máu truyền vào"
                    direction="row"
                    labelWidth="w-[150px]"
                  />
                </div>
                <CustomFormField
                  control={surgeryTicketForm.control}
                  fieldType={FormFieldType.INPUT}
                  name="data.numberOfSamples"
                  label="Số mẫu bệnh phẩm:"
                  placeholder="Nhập số mẫu bệnh phẩm nếu có"
                  direction="row"
                  labelWidth="w-[150px]"
                />
                <CustomFormField
                  control={surgeryTicketForm.control}
                  fieldType={FormFieldType.INPUT}
                  name="data.other"
                  label="Khác:"
                  placeholder="Nhập thông tin khác nếu có"
                  direction="row"
                  labelWidth="w-[150px]"
                />
              </div>
            </fieldset>

            <fieldset className="border border-gray-300 rounded-lg p-4 mb-4">
              <legend className="text-base font-semibold text-gray-700 px-2">
                Trình tự phẫu thuật
              </legend>

              <div className="flex flex-col w-full space-y-2">
                <CustomFormField
                  control={surgeryTicketForm.control}
                  fieldType={FormFieldType.TEXTAREA}
                  name="data.surgicalProcedure"
                  placeholder="Nhập trình tự phẫu thuật:"
                  direction="row"
                  labelWidth="w-[150px]"
                />
                <CustomFormField
                  control={surgeryTicketForm.control}
                  fieldType={FormFieldType.TEXTAREA}
                  name="data.complications"
                  placeholder="Các biến chứng hoặc các diễn biến bất thường ngoài dự kiến trong quá trình phẫu thuật:"
                  direction="row"
                  labelWidth="w-[150px]"
                />
                <fieldset className="border border-gray-300 rounded-lg p-4 mb-4">
                  <legend className="text-base font-semibold text-gray-700 px-2">
                    Chi tiết công cụ dụng cụ cấy ghép trên người bệnh (nếu có):
                  </legend>
                  <div className="flex flex-col w-full space-y-0">
                    <div className="grid grid-cols-[40px_3fr_2fr_2fr_2fr_3fr] gap-2 bg-cyan-700 text-white font-semibold text-sm px-2 py-2 rounded-md mt-4">
                      <div className="text-left">TT</div>
                      <div className="text-left">Loại cấy ghép</div>
                      <div className="text-left">Số lượng</div>
                      <div className="text-left">Kích thước</div>
                      <div className="text-left">Hãng</div>
                      <div className="text-left">
                        Ghi chú (Ví dụ: Số khía trên đinh vít)
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <SurgeryImplantRow
                      control={surgeryTicketForm.control}
                      setValue={surgeryTicketForm.setValue}
                      formState={surgeryTicketForm.formState}
                    />
                  </div>
                </fieldset>
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
            <Button
              type="button"
              variant="secondary"
              onClick={printSafetyChecklist}
            >
              In bảng kiểm an toàn
            </Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}
