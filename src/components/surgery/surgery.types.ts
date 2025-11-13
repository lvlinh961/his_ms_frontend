import z from "zod";
import clinicManagementApiRequest from "../administrator/clinic_management/clinicManagementApiRequest";
import path from "path";

export const DocumentTypeEnum = z.enum([
  "SURGERY_CONSENT",
  "SURGERY_TICKET",
  "PROCEDURE_TICKET",
  "SURGICAL_SAFETY_CHECKLIST",
]);

export const DocumentTypeLabels: Record<
  z.infer<typeof DocumentTypeEnum>,
  string
> = {
  SURGERY_CONSENT: "Phiếu cam kết phẫu thuật",
  SURGERY_TICKET: "Phiếu phẫu thuật",
  PROCEDURE_TICKET: "Phiếu thủ thuật",
  SURGICAL_SAFETY_CHECKLIST: "Bảng kiểm an toàn phẫu thuật",
};

const surgeryDoctor = z.object({
  name: z.string().min(1, { message: "Vui lòng nhập tên bác sĩ!" }),
  title: z.string().min(1, { message: "Vui lòng nhập chức danh!" }),
  department: z.string().min(1, { message: "Vui lòng nhập khoa/phòng!" }),
});

export const SurgeryMethodEnum = z.enum(["PT_MO", "PT_SOI", "THU_THUAT"]);

export const SurgeryMethodLabels: Record<
  z.infer<typeof SurgeryMethodEnum>,
  string
> = {
  PT_MO: "Phẫu thuật mở",
  PT_SOI: "Phẫu thuật nội soi",
  THU_THUAT: "Thủ thuật",
};

export const DisinterestedMethodEnum = z.enum([
  "ME_NOI_KHI_QUAN",
  "ME_MASK",
  "ME_TINH_MACH",
  "ME_TUY_SONG",
  "TE_NGOAI_MC",
  "TE_ROI_TK",
  "TE_TAI_CHO",
  "KHAC",
]);

export const DisinterestedMethodLabels: Record<
  z.infer<typeof DisinterestedMethodEnum>,
  string
> = {
  ME_NOI_KHI_QUAN: "Mê nội khí quản",
  ME_MASK: "Mê mask thanh quản",
  ME_TINH_MACH: "Mê tĩnh mạch",
  ME_TUY_SONG: "Mê tuỷ sống",
  TE_NGOAI_MC: "Tê ngoài màng cứng",
  TE_ROI_TK: "Tê đám rối thần kinh",
  TE_TAI_CHO: "Tiền mê + Tê tại chỗ",
  KHAC: "Khác",
};

export const RiskOfAccidentEnum = z.enum([
  "PHAN_UNG_THUOC",
  "SUY_HO_HAP",
  "CHAY_MAU",
  "NHIEM_TRUNG",
  "TU_VONG",
]);

export const RiskOfAcciedentLabels: Record<
  z.infer<typeof RiskOfAccidentEnum>,
  string
> = {
  PHAN_UNG_THUOC: "Phản ứng thuốc",
  SUY_HO_HAP: "Suy hô hấp",
  CHAY_MAU: "Chảy máu",
  NHIEM_TRUNG: "Nhiễm trùng",
  TU_VONG: "Tử vong",
};

export const SurgeryTypeEnum = z.enum(["EMERGENCY", "SUBACUTE", "SESSIONAL"]);

export const SurgeryTypeLabels: Record<
  z.infer<typeof SurgeryTypeEnum>,
  string
> = {
  EMERGENCY: "Cấp cứu",
  SUBACUTE: "Bán cấp",
  SESSIONAL: "Chương trình/Phiên",
};

export const SurgeryLevelEnum = z.enum(["SPECIAL", "TYPE1", "TYPE2", "TYPE3"]);

export const SurgeryLevelLabels: Record<
  z.infer<typeof SurgeryLevelEnum>,
  string
> = {
  SPECIAL: "Đặc biệt",
  TYPE1: "Loại I",
  TYPE2: "Loại II",
  TYPE3: "Loại III",
};

export const IncisionTypeEnum = z.enum([
  "CLEAN",
  "CLEAN_CONTAMINATED",
  "CONTAMINATED",
  "DIRTY",
]);

export const IncisionTypeLabels: Record<
  z.infer<typeof IncisionTypeEnum>,
  string
> = {
  CLEAN: "Sạch",
  CLEAN_CONTAMINATED: "Sạch nhiễm",
  CONTAMINATED: "Nhiễm",
  DIRTY: "Bẩn",
};

export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);

export const GenderLabels: Record<z.infer<typeof GenderEnum>, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Không xác định",
};

/**
 * Thông tin cơ bản mặt định cho các loại phiếu
 */

export const basicDocumentSchema = z.object({
  id: z.string().optional(),
  ticketId: z.string().optional(),
  patientId: z.string().min(1, { message: "Vui lòng chọn bệnh nhân!" }),
  clinicName: z.string().min(1, { message: "Vui lòng nhập tên phòng khám!" }),
  documentType: DocumentTypeEnum,
  title: z.string().optional(),
  doctorId: z.string().optional(),
  doctorName: z.string().optional(),
});

export type BasicDocumentForm = z.infer<typeof basicDocumentSchema>;

export const defaultBasicDocumentForm: BasicDocumentForm = {
  id: undefined,
  ticketId: undefined,
  patientId: "",
  clinicName: "",
  documentType: undefined,
  title: "",
  doctorId: "",
  doctorName: "",
} satisfies BasicDocumentForm;

export const makeDocumentSchema = <T extends z.ZodTypeAny>(dataSchema: T) => {
  return basicDocumentSchema.extend({
    data: dataSchema.optional(),
  });
};

export type DocumentForm<T extends z.ZodTypeAny> = z.infer<
  ReturnType<typeof makeDocumentSchema<T>>
>;

/**
 * Thống tin cơ bản cho phiếu chấp nhận phẫu thuật
 */

export const acceptSurgeryTicketData = z.object({
  surgeryType: SurgeryTypeEnum.optional(),
  doctor: surgeryDoctor,
  otherDoctor: surgeryDoctor.optional(),
  diagnosis: z.string().min(1, { message: "Vui lòng nhập chẩn đoán!" }),
  explanationOfDiagnosis: z.boolean().optional(),
  explanationOfSurgeryReason: z.boolean().optional(),
  explanationOfRisks: z.boolean().optional(),
  explanationOfExpectedResults: z.string().optional(),
  surgeryMethod: SurgeryMethodEnum.optional(),
  disinterestedMethod: DisinterestedMethodEnum.optional(),
  otherMethod: z.string().optional(),
  riskOfAccident: RiskOfAccidentEnum.optional(),
  otherRisk: z.string().optional(),
  patient: z
    .object({
      name: z.string().optional(),
      dateOfBirth: z.string().optional(),
    })
    .optional(),
  relative: z
    .object({
      name: z.string().optional(),
      dateOfBirth: z.string().optional(),
    })
    .optional(),
});

export const acceptSurgeryTicketSchema = makeDocumentSchema(
  acceptSurgeryTicketData
);

export type AcceptSurgeryTicketFormSchema = z.infer<
  typeof acceptSurgeryTicketSchema
>;

export const defaultAcceptSurgeryTicketForm: AcceptSurgeryTicketFormSchema = {
  ...defaultBasicDocumentForm,
  data: {
    surgeryType: undefined,
    doctor: {
      name: "",
      title: "",
      department: "",
    },
    otherDoctor: {
      name: "",
      title: "",
      department: "",
    },
    diagnosis: "",
    explanationOfDiagnosis: false,
    explanationOfSurgeryReason: false,
    explanationOfRisks: false,
    explanationOfExpectedResults: "",
    surgeryMethod: undefined,
    disinterestedMethod: undefined,
    otherMethod: "",
    riskOfAccident: undefined,
    otherRisk: "",
    patient: {
      name: "",
      dateOfBirth: "",
    },
    relative: {
      name: "",
      dateOfBirth: "",
    },
  },
} satisfies AcceptSurgeryTicketFormSchema;

/**
 * Thông tin cho phiếu phẫu thuật
 */

export const surgeryTicketData = z.object({
  patient: z
    .object({
      name: z.string().optional(),
      age: z.string().optional(),
      gender: GenderEnum.optional(),
    })
    .optional(),
  address: z.string().optional(),
  checkInDate: z.date().optional(),
  surgeryStartTime: z.date().optional(),
  surgeryEndTime: z.date().optional(),
  prePiagnosis: z.string().optional(),
  postDiagnosis: z.string().optional(),
  surgeryMethod: z.string().optional(),
  surgeryLevel: SurgeryLevelEnum.optional(),
  incisionType: IncisionTypeEnum.optional(),
  pathology: z.boolean().optional(),
  disinterestedMethod: z.string().optional(),
  surgeon: z.string().optional(),
  assistantSurgeons: z.string().optional(),
  anesthetist: z.string().optional(),
  anesthesiaNurses: z.string().optional(),
  instrumentsNurses: z.string().optional(),
  otherNurses: z.string().optional(),
  surgeryTime: z.date().optional(),
  surgicalSchematic: z.string().optional(),
  drainages: z
    .array(
      z.object({
        position: z.string().optional(),
        quantity: z.number().optional(),
      })
    )
    .optional(),
  blooldLoss: z.string().optional(),
  bloodTransfusion: z.string().optional(),
  numberOfSamples: z.number().optional(),
  other: z.string().optional(),

  surgicalProcedure: z.string().optional(),
  complications: z.string().optional(),
  implants: z
    .array(
      z.object({
        type: z.string().optional(),
        quantity: z.number().optional(),
        size: z.string().optional(),
        manufacturer: z.string().optional(),
        notes: z.string().optional(),
      })
    )
    .optional(),
});

export const surgeryTicketFormSchema = makeDocumentSchema(surgeryTicketData);

export type SurgeryTicketFormSchema = z.infer<typeof surgeryTicketFormSchema>;

export const defaultSurgeryTicketForm: SurgeryTicketFormSchema = {
  ...defaultBasicDocumentForm,
  data: {
    patient: {
      name: "",
      age: "",
      gender: GenderEnum.enum.MALE,
    },
    address: "",
    checkInDate: new Date(),
    surgeryStartTime: new Date(),
    surgeryEndTime: new Date(),
    prePiagnosis: "",
    postDiagnosis: "",
    surgeryMethod: "",
    surgeryLevel: undefined,
    incisionType: undefined,
    pathology: false,
    disinterestedMethod: "",
    surgeon: "",
    assistantSurgeons: "",
    anesthetist: "",
    anesthesiaNurses: "",
    instrumentsNurses: "",
    otherNurses: "",
    surgeryTime: new Date(),
    surgicalSchematic: "",
    drainages: [
      {
        position: "",
        quantity: 0,
      },
    ],
    blooldLoss: "",
    bloodTransfusion: "",
    numberOfSamples: 0,
    other: "",
    surgicalProcedure: "",
    complications: "",
    implants: [
      {
        type: "",
        quantity: 0,
        size: "",
        manufacturer: "",
        notes: "",
      },
    ],
  },
} satisfies SurgeryTicketFormSchema;

/**
 * Thông tin cho phiếu thủ thuật
 */
export const procedureTicketData = z.object({
  patient: z
    .object({
      name: z.string().optional(),
      age: z.string().optional(),
      gender: GenderEnum.optional(),
    })
    .optional(),
  preDiagnosis: z.string().optional(),
  postDiagnosis: z.string().optional(),
  surgeryMethod: z.string().optional(),
  surgeryLevel: SurgeryLevelEnum.optional(),
  incisionType: IncisionTypeEnum.optional(),
  disinterestedMethod: z.string().optional(),
  surgeon: z.string().optional(),
  assistantSurgeons: z.string().optional(),
  anesthetist: z.string().optional(),
  procedureTime: z.date().optional(),
  surgicalProcedure: z.string().optional(),
  complications: z.string().optional(),
  bloodLoss: z.string().optional(),
  numberOfSamples: z.string().optional(),
  implants: z.string().optional(),
});

export const procedureTicketFormSchema =
  makeDocumentSchema(procedureTicketData);

export type ProcedureTicketFormSchema = z.infer<
  typeof procedureTicketFormSchema
>;

export const defaultProcedureTicketForm: ProcedureTicketFormSchema = {
  ...defaultBasicDocumentForm,
  data: {
    patient: {
      name: "",
      age: "",
      gender: GenderEnum.enum.MALE,
    },
    preDiagnosis: "",
    postDiagnosis: "",
    surgeryMethod: "",
    surgeryLevel: undefined,
    disinterestedMethod: "",
    surgeon: "",
    assistantSurgeons: "",
    anesthetist: "",
    procedureTime: new Date(),
    bloodLoss: "",
    numberOfSamples: "",

    surgicalProcedure: "",
    complications: "",
    implants: "",
  },
} satisfies ProcedureTicketFormSchema;
