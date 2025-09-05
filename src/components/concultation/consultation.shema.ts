import z from "zod";
import { RightTap } from "@/types";

const icd10Schema = z.object({
  id: z.number().optional().nullable(),
  icd10Id: z.number(),
  code: z.string().min(1, "Vui lòng chọn ICD"),
  name: z.string(),
  deleted: z.boolean().optional(),
});

type Icd10Schema = z.infer<typeof icd10Schema>;

const medicationSchema = z.object({
  prescriptionItemId: z.number().optional(),
  drugId: z.number(),
  drugName: z.string().min(1, "Vui lòng chọn thuốc!!"),
  usage: z.string(),
  unit: z.string(),
  sellingUnit: z.string(),
  morning: z.number(),
  noon: z.number(),
  afternoon: z.number(),
  evening: z.number(),
  time: z.number(),
  quantity: z.number(),
  hoatChat: z.string(),
  dongGoi: z.string(),
  // price: z.preprocess(
  //   (val) => (val === "" || val === null ? undefined : Number(val)),
  //   z.number().optional()
  // ),
  instruction: z.string(),
  deleted: z.boolean().optional(),
});

export const prescriptionSchema = z.object({
  prescriptionId: z.string().optional().nullable(),
  ticketId: z.string(),
  height: z.number(),
  weight: z.number(),
  temperature: z.number(),
  bmi: z.number(),
  diagnosis: z.string(),
  time: z.number(),
  advice: z.string(),
  reExaminationDays: z.number(),
  reExaminationTime: z.date().optional(),
  mainIcd10: icd10Schema,
  totalPrice: z.preprocess(
    (val) => (val === "" || val === null ? undefined : Number(val)),
    z.number().optional()
  ),
  secondaryIcds: z.array(icd10Schema).optional(),
  listPrescriptionItem: z.array(medicationSchema).min(1),
});

export type PrescriptionSchema = z.infer<typeof prescriptionSchema>;

export const defaultPrescription = {
  ticketId: "",
  height: 0,
  weight: 0,
  temperature: 0,
  bmi: 0,
  diagnosis: "",
  time: 0,
  advice: "",
  reExaminationDays: 0,
  reExaminationTime: new Date(),
  mainIcd10: { code: "", name: "" },
  totalPrice: 0,
  secondaryIcds: [] as Icd10Schema[],
  listPrescriptionItem: [
    {
      drugId: 0,
      drugName: "",
      usage: "",
      unit: "",
      sellingUnit: "",
      morning: 0,
      noon: 0,
      afternoon: 0,
      evening: 0,
      time: 0,
      quantity: 0,
      hoatChat: "",
      dongGoi: "",
      // price: 0,
      instruction: "",
      deleted: false,
    },
  ],
} satisfies PrescriptionSchema;

export interface Icd10AutoSuggestItem {
  icd10Id: number;
  icd10Code: string;
  icd10Name: string;
}

export interface Icd10SuggestResponse {
  code: number;
  result?: Icd10AutoSuggestItem[];
  message?: string;
}

export interface DrugMaterialSuggestItem {
  drugId: number;
  drugCode: string;
  drugName: string;
  drugOriginalName: string;
  usage: string;
  unit: string;
  dongGoi: string;
}

export interface DrugMaterialSuggestResponse {
  code: number;
  result?: DrugMaterialSuggestItem[];
  message?: string;
}

export interface SavePrescriptionResponse {
  code: number;
  result?: {
    prescriptionId: number;
    message: string;
  };
  message?: string;
}

export interface PatientRegisterInDateInfo {
  patientId: number;
  patientName: string;
  patientCode: string;
  gender: string;
  dateOfBirth: Date;
  phoneNumber: string;
  address: string;
}

export interface PrescriptionForPrint {
  prescriptionInfo: {
    prescriptionId: string;
    height: number;
    weight: number;
    temperature: number;
    bmi: number;
    diagnosis: string;
    advice: string;
    time: number;
    reexamDate: Date;
  };

  patientInfo: PatientRegisterInDateInfo;

  prescriptionItem: [
    {
      name: string;
      unit: string;
      sellingUnit: string;
      usage: string;
      instruction: string;
      morning: number;
      noon: number;
      afternoon: number;
      evening: number;
      quantity: number;
    },
  ];
}

export interface PayReceiptForPrint {
  receiptInfo: {
    id: number;
    createdTime: Date;
    totalPrice: number;
    invoiceCode: string;
  };

  patientInfo: {
    patientId: number;
    patientName: string;
    patientCode: string;
    gender: string;
    dateOfBirth: Date;
    phoneNumber: string;
    address: string;
  };

  payPaymentItems: [
    {
      id: number;
      code: string;
      serviceName: string;
      enumItemType: string;
      totalPrice: number;
      quantity: number;
    },
  ];
}

export interface GetPrescriptionForPrintResponse {
  code: number;
  result?: PrescriptionForPrint;
  message?: string;
}

export interface GetPayReceiptResponse {
  code: number;
  result?: PayReceiptForPrint;
  message?: string;
}

export interface GetPrescriptionByTicketResponse {
  code: number;
  result?: PrescriptionSchema;
  message?: string;
}

export const serviceAppointmentSchema = z.object({
  ticketId: z.string(),
  serviceId: z.number(),
  serviceName: z.string(),
  quantity: z.number(),
});

export type ServiceAppointmentSchema = z.infer<typeof serviceAppointmentSchema>;

export const defauleServiceAppointment = {
  ticketId: "",
  serviceId: 0,
  serviceName: "",
  quantity: 1,
} satisfies ServiceAppointmentSchema;

export type ServiceAppointmentItem = {
  id: number;
  code: string;
  name: string;
  type: string;
  price: number;
  quantity: number;
  paid: number;
};

export interface GetServiceAppointmentItemResponse {
  code: number;
  result?: ServiceAppointmentItem[];
  message?: string;
}

export interface SaveServiceAppointmentItemResponse {
  code: number;
  result?: ServiceAppointmentItem;
  message?: string;
}

// Duplicate code
export interface ServiceAutoCompleteItem {
  serviceId: number;
  serviceName: string;
  normalPrice: number;
}

export interface ServiceDateResponse {
  code: number;
  result?: ServiceAutoCompleteItem[];
  message?: string;
}

export interface CancelItemResponse {
  code: number;
  result?: {
    message: string;
  };
  message?: string;
}

export interface CreatePaymentSchema {
  ticketId: string;
  totalPrice: number;
  items: ServiceAppointmentItem[];
}

export interface CreatePaymentResponse {
  code: number;
  result?: {
    payReceiptId: number;
    message: string;
  };
  message?: string;
}

export interface ItemUnit {
  id: string;
  code: string;
  name: string;
}

export interface GetItemUnitResponse {
  code: number;
  result?: ItemUnit[];
  message?: string;
}

export interface ItemUsage {
  id: string;
  code: string;
  name: string;
}

export interface GetItemUsageResponse {
  code: number;
  result?: ItemUsage[];
  message?: string;
}

export const dermatologyEmrRightTab: RightTap[] = [
  { title: "Bệnh án", value: "benh_an" },
  { title: "Tổng kết bệnh án", value: "tong_ket_ba" },
];
