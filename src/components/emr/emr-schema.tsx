import z from "zod";
import { PatientRegisterInDateInfo } from "../concultation/consultation.shema";

export interface EmrItem {
  id?: number;
  documentType?: string;
  documentName?: string;
  date?: Date;
  signedDate?: Date;
  status?: string;
  path?: string;
}

export interface PatientInfo {
  name: string;
  patientCode: number;
  address: string;
  phoneNumber: string;
}

export interface CheckInOutInfo {
  id: number;
  checkInOutHospitalRecordId: number;
  checkInDate: Date;
  checkOutDate: Date;
}

export interface EmrResponse {
  code: number;
  result?: {
    patientInfo: PatientInfo;
    listEmrItems: EmrItem[];
    checkInOutInfo: CheckInOutInfo;
  };
  message?: string;
}

export enum EmrDocumentType {
  EMR = "EMR",
  TreamtmentRecord = "TREATMENT_RECORD",
  XNAppointment = "XN_APPOINTMENT",
  CdhaAppointment = "CDHA_APPOINTMENT",
  TakeCareDocument = "TAKE_CARE_DOCUMENT",
  Transfer = "TRANSFER",
  Agreement = "AGREEMENT",
  Information = "INFORMATION",
  Other = "OTHER",
}

export const EmrDocumentTypeMap: Record<string, string> = {
  EMR: "Bệnh án",
  TREATMENT_RECORD: "Tờ điều trị",
  XN_APPOINTMENT: "Chỉ định xét nghiệm",
  CDHA_APPOINTMENT: "Chỉ định chẩn đoán hình ảnh",
  TAKE_CARE_DOCUMENT: "Phiếu chăm sóc điều dưỡng",
  TRANSFER: "Phiếu bàn giao người bệnh",
  AGREEMENT: "Phiếu cam kết",
  INFORMATION: "Phiếu cung cấp thông tin",
  OTHER: "Các phiếu khác",
};

export function getDocumentKeyByValue(value: string): string | undefined {
  let key = Object.keys(DocumentType).find(
    (key) => EmrDocumentType[key as keyof typeof EmrDocumentType] === value
  );
  return EmrDocumentTypeMap[key];
}

export const dermatologyEmrSchema = z.object({
  id: z.string().optional(),
  ticketId: z.string().optional(),
  reasonForHospitalization: z.string().min(1, "Vui lòng nhập lý do vào viện"),
  dayOfIllness: z.number().optional(),
  diseaseProgress: z.string().optional(), // Quá trình bệnh lý
  personalMedicalHistory: z.string().optional(),
  familyMedicalHistory: z.string().optional(),
  allergies: z.string().optional(), // Dị ứng
  smoking: z.string().optional(), // Thuốc lá
  alcoholUse: z.string().optional(), // Rượu bia
  pipeTobaccoUse: z.string().optional(), // Thuốc lào
  illicitDrugUse: z.string().optional(), // Ma tuý
  otherUse: z.string().optional(), // Khac
  generalExamination: z.string().optional(), // Khám bệnh toàn thân
  subjectiveSymptoms: z.string().optional(), // Triệu chứng cơ năng
  primaryLesions: z.string().optional(), //Thương tổn căn bản
  cardiovascularSystem: z.string().optional(), // Tuần hoàn
  respiratorySystem: z.string().optional(), // Hô hấp
  digestiveSystem: z.string().optional(), // Tiêu hoá
  genitourinarySystem: z.string().optional(), //Thận -Tiết niệu - sinh dục
  peripheralNervousSystem: z.string().optional(), // Thần kinh ngoại biên
  otherOrgans: z.string().optional(), // Các cơ quan khác
  requestedParaclinicalTests: z.string().optional(), // Các xét nghiệm cận lâm sàng cần làm
  medicalRecordSummary: z.string().optional(), // Tóm tắt bệnh án
  primaryDiagnosis: z.string().optional(),
  secondaryDiagnosis: z.string().optional(),
  differentialDiagnosis: z.string().optional(), // Chẩn đoán phân biệt
  prognosis: z.string().optional(), // Tiên lượng
  treatmentPlan: z.string().optional(), // Hướng điều trị
  clinicalCourse: z.string().optional(), // Quá trình bệnh lý và diễn biến lâm sàng
  diagnosticParaclinicalSummary: z.string().optional(), // Tóm tắt kết quả xét nghiệm cận lâm sàng có giá trị chẩn đoán
  treatmentMethod: z.string().optional(), // Phương pháp điều trị
  dischargeCondition: z.string().optional(), // Tình trạng người bệnh ra viện
  postDischargePlan: z.string().optional(), // Hướng điều trị và các chế độ tiếp theo
  xrayAttachments: z.number().optional(),
  ctScanAttachments: z.number().optional(),
  ultrasoundAttachments: z.number().optional(),
  labsAttachments: z.number().optional(),
  otherAttachments: z.number().optional(),
});

export type DermatologyEmrSchema = z.infer<typeof dermatologyEmrSchema>;

export const defaultDermatologyEmrFormDefault = {
  id: "",
  ticketId: "",
  reasonForHospitalization: "",
  dayOfIllness: 0,
  diseaseProgress: "", // Quá trình bệnh lý
  personalMedicalHistory: "",
  familyMedicalHistory: "",
  allergies: "", // Dị ứng
  smoking: "", // Thuốc lá
  alcoholUse: "", // Rượu bia
  pipeTobaccoUse: "", // Thuốc lào
  illicitDrugUse: "", // Ma tuý
  otherUse: "", // Khac
  generalExamination: "", // Khám bệnh toàn thân
  subjectiveSymptoms: "", // Triệu chứng cơ năng
  primaryLesions: "", //Thương tổn căn bản
  cardiovascularSystem: "", // Tuần hoàn
  respiratorySystem: "", // Hô hấp
  digestiveSystem: "", // Tiêu hoá
  genitourinarySystem: "", //Thận -Tiết niệu - sinh dục
  peripheralNervousSystem: "", // Thần kinh ngoại biên
  otherOrgans: "", // Các cơ quan khác
  requestedParaclinicalTests: "", // Các xét nghiệm cận lâm sàng cần làm
  medicalRecordSummary: "", // Tóm tắt bệnh án
  primaryDiagnosis: "",
  secondaryDiagnosis: "",
  differentialDiagnosis: "", // Chẩn đoán phân biệt
  prognosis: "",
  treatmentPlan: "",
  clinicalCourse: "", // Quá trình bệnh lý và diễn biến lâm sàng
  diagnosticParaclinicalSummary: "", // Tóm tắt kết quả xét nghiệm cận lâm sàng có giá trị chẩn đoán
  treatmentMethod: "", // Phương pháp điều trị
  dischargeCondition: "", // Tình trạng người bệnh ra viện
  postDischargePlan: "", // Hướng điều trị và các chế độ tiếp theo
  xrayAttachments: 0,
  ctScanAttachments: 0,
  ultrasoundAttachments: 0,
  labsAttachments: 0,
  otherAttachments: 0,
} satisfies DermatologyEmrSchema;

export type DermatologyEmr = {
  id: string;
  ticketId: string;
  reasonForHospitalization: string;
  dayOfIllness: number;
  diseaseProgress: string; // Quá trình bệnh lý
  personalMedicalHistory: string;
  familyMedicalHistory: string;
  allergies: string; // Dị ứng
  smoking: string; // Thuốc lá
  alcoholUse: string; // Rượu bia
  pipeTobaccoUse: string; // Thuốc lào
  illicitDrugUse: string; // Ma tuý
  otherUse: string; // Khac
  generalExamination: string; // Khám bệnh toàn thân
  subjectiveSymptoms: string; // Triệu chứng cơ năng
  primaryLesions: string; //Thương tổn căn bản
  cardiovascularSystem: string; // Tuần hoàn
  respiratorySystem: string; // Hô hấp
  digestiveSystem: string; // Tiêu hoá
  genitourinarySystem: string; //Thận -Tiết niệu - sinh dục
  peripheralNervousSystem: string; // Thần kinh ngoại biên
  otherOrgans: string; // Các cơ quan khác
  requestedParaclinicalTests: string; // Các xét nghiệm cận lâm sàng cần làm
  medicalRecordSummary: string; // Tóm tắt bệnh án
  primaryDiagnosis: string;
  secondaryDiagnosis: string;
  differentialDiagnosis: string; // Chẩn đoán phân biệt
  prognosis: string;
  treatmentPlan: string;
  clinicalCourse: string; // Quá trình bệnh lý và diễn biến lâm sàng
  diagnosticParaclinicalSummary: string; // Tóm tắt kết quả xét nghiệm cận lâm sàng có giá trị chẩn đoán
  treatmentMethod: string; // Phương pháp điều trị
  dischargeCondition: string; // Tình trạng người bệnh ra viện
  postDischargePlan: string; // Hướng điều trị và các chế độ tiếp theo
  xrayAttachments: number;
  ctScanAttachments: number;
  ultrasoundAttachments: number;
  labsAttachments: number;
  otherAttachments: number;
};

export interface DermatologyEmrPrint {
  patientInfo: PatientRegisterInDateInfo,
  emrInfo: DermatologyEmr
}