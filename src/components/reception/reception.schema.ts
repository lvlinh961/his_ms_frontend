import z from "zod";

export const registServiceInfo = z.object({
  serviceId: z.number(),
  serviceName: z.string().min(1, { message: "Vui lòng chọn dịch vụ khám!" }),
  quantity: z.number(),
  reason: z.string().optional(),
});

export const patientInfo = z.object({
  patientId: z.string().optional(),
  patientCode: z.string().optional(),
  patientName: z.string().min(1, { message: "Vui lòng nhập tên bệnh nhân!" }),
  phoneNumber: z.string(),
  cccd: z.string().optional(),
  dateOfBirth: z.date(),
  // dateOfBirth: z.string(),
  gender: z.enum(["MALE", "FEMALE"]),
  married: z.enum(["married", "single"]).optional(),
  ethnicGroup: z.string().optional(),
  nationality: z.string().optional(),
  career: z.string().optional(),
  address: z.string().optional(),
  province: z.string().optional(),
  district: z.string().optional(),
  ward: z.string().optional(),
});

export type PatientInfo = z.infer<typeof patientInfo>;

export const outPatientRegistSchema = z.object({
  patientInfo: patientInfo,
  serviceInfo: registServiceInfo,
});

export type OutPatientRegistSchema = z.infer<typeof outPatientRegistSchema>;

export const defaultPatientRegist = {
  patientInfo: {
    patientId: "",
    patientCode: "",
    patientName: "",
    phoneNumber: "",
    cccd: "",
    dateOfBirth: new Date(),
    // dateOfBirth: "",
    gender: "MALE",
    married: "single",
    ethnicGroup: "Kinh",
    nationality: "Việt Nam",
    career: "",
    address: "",
    province: "TP. Hồ Chí Minh",
    district: "",
    ward: "",
  },
  serviceInfo: {
    serviceId: 1,
    serviceName: "Khám da liễu",
    quantity: 1,
    reason: "",
  },
} satisfies OutPatientRegistSchema;

// Registration History
export type RegistrationHistory = {
  ticketId: string;
  createdDate: Date;
  patientId: string;
  patientCode: string;
  prescriptionId: string;
};
