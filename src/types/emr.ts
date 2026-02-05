import z from "zod";

export const DocumentTypeEnum = z.enum([
  "SURGERY_CONSENT",
  "SURGERY_TICKET",
  "PROCEDURE_TICKET",
  "SURGICAL_SAFETY_CHECKLIST",
  "TREATMENT_RECORD",
]);

export const DocumentTypeLabels: Record<
  z.infer<typeof DocumentTypeEnum>,
  string
> = {
  SURGERY_CONSENT: "Phiếu cam kết phẫu thuật",
  SURGERY_TICKET: "Phiếu phẫu thuật",
  PROCEDURE_TICKET: "Phiếu thủ thuật",
  SURGICAL_SAFETY_CHECKLIST: "Bảng kiểm an toàn phẫu thuật",
  TREATMENT_RECORD: "Phiếu theo dõi điều trị",
};
