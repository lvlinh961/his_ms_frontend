import { NavItem } from "@/types";

import AcceptSurgeryTicketForm from "@/components/surgery/AcceptSurgeryTicketForm";
import SurgeryTicketForm from "@/components/surgery/SurgeryTicketForm";
import ProcedureTicketForm from "@/components/surgery/ProcedureTicketForm";
import SurgerySafetyCheckListForm from "@/components/surgery/SurgerySafetyCheckListForm";

export const navItems: NavItem[] = [
  {
    title: "Tiếp nhận",
    href: "/reception",
    icon: "user",
    label: "",
    permission: "",
    prefix: "reception",
    level: 1,
  },
  {
    title: "Khám bệnh",
    href: "/concultation",
    icon: "user",
    label: "",
    permission: "",
    prefix: "concultation",
    level: 1,
  },
  {
    title: "Bệnh án",
    href: "",
    icon: "user",
    label: "",
    permission: "",
    prefix: "out-emr",
    level: 1,
    childrens: [
      {
        title: "Phẫu thuật - Thủ thuật",
        href: "",
        icon: "user",
        label: "",
        permission: "",
        prefix: "surgery",
        level: 2,
        childrens: [
          {
            title: "Giấy cam kết phẫu thuật",
            component: AcceptSurgeryTicketForm,
            label: "Nhập thông tin phiếu cam kết phẫu thuật",
            prefix: "accept-surgery-ticket",
            permission: "",
            level: 3,
          },
          {
            title: "Phiếu phẫu thuật",
            component: SurgeryTicketForm,
            label: "Phiếu phẫu thuật",
            prefix: "surgery-ticket",
            permission: "",
            level: 3,
          },
          {
            title: "Phiếu thủ thuật",
            component: ProcedureTicketForm,
            label: "Phiếu thủ thuật",
            prefix: "procedure-ticket",
            permission: "",
            level: 3,
          },
        ],
      },
    ],
  },
  {
    title: "Thu tiền",
    href: "/cashier",
    icon: "user",
    label: "",
    permission: "",
    prefix: "cashier",
    level: 1,
  },
  {
    title: "Report",
    href: "/report",
    icon: "user",
    label: "",
    permission: "REPORT",
    prefix: "report",
    level: 1,
    childrens: [
      {
        title: "Báo cáo lượt khám",
        href: "/report/consultation",
        label: "Báo cáo lượt khám",
        prefix: "report",
        permission: "CONSULTATION_REPORT",
        level: 2,
      },
    ],
  },
  {
    title: "Quản trị",
    href: "#",
    icon: "kanban",
    label: "kanban",
    prefix: "Quản trị",
    permission: "ROLE_ADMIN",
    level: 1,
    childrens: [
      {
        title: "Quản lý phòng khám",
        href: "/administrator/clinic_management",
        label: "Quản lý phòng khám",
        prefix: "administrator",
        permission: "ROLE_ADMIN",
        level: 2,
      },
      {
        title: "Quản lý người dùng",
        href: "/administrator/user_management",
        label: "Quản lý người dùng",
        prefix: "administrator",
        permission: "ROLE_ADMIN",
        level: 2,
      },
    ],
  },
];
