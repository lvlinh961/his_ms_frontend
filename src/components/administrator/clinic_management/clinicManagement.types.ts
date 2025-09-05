import z from "zod";

export const clinicSearchSchema = z.object({
  name: z.string(),
});

export type ClinicSearchSchema = z.infer<typeof clinicSearchSchema>;

export const defaultClinicSearchSchema = {
  name: "",
} satisfies ClinicSearchSchema;

export interface Clinic {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  status: string;
  createdAt: Date;
}

export interface GetPagingClinicParams {
  name?: string;
  page?: number;
  size?: number;
}

export const createClinicSchema = z.object({
  name: z.string().min(1, { message: "Vui lòng nhập tên phòng khám" }),
  code: z.string().min(1, { message: "Vui lòng nhập mã phòng khám" }),
  email: z.string(),
  phone: z.string(),
  address: z.string(),
});

export type CreateClinicSchema = z.infer<typeof createClinicSchema>;

export const defaultCreateClinicSchema = {
  name: "",
  code: "",
  email: "",
  phone: "",
  address: "",
};
