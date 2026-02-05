import z from "zod";

export enum DisableStatus {
  ENABLE,
  DISABLE,
}

export const GenderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);

export const GenderLabels: Record<z.infer<typeof GenderEnum>, string> = {
  MALE: "Nam",
  FEMALE: "Nữ",
  OTHER: "Không xác định",
};
