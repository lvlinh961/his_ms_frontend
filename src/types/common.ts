import { Icons } from "@/components/icons";

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

export interface SelectBoxSuggestOption {
  id: string;
  name: string;
  code?: string;
  // Bạn có thể thêm các trường bổ trợ nếu cần
  description?: string;
}

export interface PharStoreInfo {
  id: string;
  name: string;
  code: string;
  onlyInStock?: boolean;
  location: string | null;
}
