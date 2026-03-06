import { Control } from "react-hook-form";
import { FormFieldType } from "@/constants/enum";

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};

export interface Service {
  id: number;
  name: string;
  date: string | null;
  quantity: number;
  doctor?: string;
  diagnostic?: string; // Chẩn đoán
  note?: string;
  from_date?: string; // Format (dd/mm/yyyy)
  to_date?: string; // Format (dd/mm/yyyy)
}

export interface CustomerBAKUP {
  id: number;
  name: string;
  age: number;
  gender: string;
  birthday?: string | null;
  insurance?: string | null; // Bảo hiểm y tế
  services?: Service[];
}
export interface CustomFormFieldProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  fontSize?: string;
  children?: React.ReactNode;
  fieldType: FormFieldType;
  dateFormat?: string;
  showTimeSelect?: boolean;
  onChangeCustom?: (event?: any) => void;
}

export interface Customer {
  patientId: string;
  patientCode: string;
  patientName: string;
  address: string;
  ticketId: string;
  created: Date;
  dateOfBirth: Date;
  gender: string;
  reason: string;
}

export interface CustomFormFieldProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  type?: string;
  fontSize?: string;
  children?: React.ReactNode;
  fieldType: FormFieldType;
  dateFormat?: string;
  showTimeSelect?: boolean;
  value?: string;
  direction?: "row" | "col";
  labelWidth?: string;
  fieldWidth?: string;
  options?: { id: string; name: string; code?: string }[];
  onChangeCustom?: (event?: any) => void;
}

export interface Department {
  id: number;
  name: string;
}
