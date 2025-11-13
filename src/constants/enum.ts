export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  CHECKBOX = "checkbox",
  RADIO = "Radio",
  SELECT = "select",
  DATE_PICKER = "datePicker",
  DATE_PICKER_NEW = "datePicker_new",
  DATETIME_PICKER = "datetimePicker",
  NUMBER = "number",
}

// Loại icd chính hoặc là icd kèm theo
export enum ICDType {
  MAIN = "main", // icd chính
}

export enum HttpStatus {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum DisableStatus {
  ENABLE = "ENABLE",
  DISABLE = "DISABLE",
}

export const DisableStatusLabel: Record<DisableStatus, string> = {
  [DisableStatus.ENABLE]: "Hoạt động",
  [DisableStatus.DISABLE]: "Dừng",
};
