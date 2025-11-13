import { Icons } from "@/components/icons";
import { Control } from "react-hook-form";
import { FormFieldType } from "@/constants/enum";

export interface NavItem {
  title: string;
  href?: string;
  component?: React.ComponentType;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  permission?: string;
  prefix?: string;
  level?: number;
  childrens?: NavItem[];
}

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export type FontSize = {
  value: string;
  label: string;
};

export type Theme = {
  value: string;
  label: string;
  color: string;
};

export type SelectBox = {
  value: string;
  text: string;
};
export type RightTap = {
  title: string;
  value: string;
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

export interface Department {
  id: number;
  name: string;
}

//Patient
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
  onChangeCustom?: (event?: any) => void;
}

export enum DisableStatus {
  ENABLE,
  DISABLE,
}

export interface ApiResponseInterface<T> {
  code: number;
  message?: string;
  result?: T;
}

export interface ApiPagingResponseInterface<T> {
  code: number;
  message?: string;
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPage: number;
  data?: T;
}
