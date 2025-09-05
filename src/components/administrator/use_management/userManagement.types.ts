import { DisableStatus } from "@/constants/enum";
import z from "zod";
import { Role } from "../role_management/role.types";
import { id } from "date-fns/locale";

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  dob: Date;
  tenantId: string;
  status: DisableStatus;
  roles: string[];
  tenantName?: string;
}

export interface GetPagingUserParam {
  name?: string;
  tenantId?: string;
  page?: number;
  size?: number;
}

export const createUserFormSchema = z
  .object({
    id: z.string().optional(),
    username: z.string().min(1, { message: "Vui lòng nhập tên đăng nhập" }),
    password: z.string().optional(),
    firstName: z.string().min(1, { message: "Vui lòng nhập tên người dùng" }),
    lastName: z.string().optional(),
    dob: z.date(),
    roles: z.array(z.string()),
    tenantId: z
      .string()
      .min(1, { message: "Vui lòng chọn phòng khám cho người dùng" }),
    tenantName: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    console.log("update data", data);
    if (!data.id) {
      if (!data.password || data.password.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Vui lòng nhập mật khẩu",
          path: ["password"],
        });
      } else if (data.password.length < 8) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Mật khẩu phải có ít nhất 8 ký tự",
          path: ["password"],
        });
      }
    }
  });

export type CreateUserFormSchema = z.infer<typeof createUserFormSchema>;

export const defaultCreateUserFormSchema = {
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  dob: new Date(),
  roles: [] as string[],
  tenantId: "",
  tenantName: "",
};
