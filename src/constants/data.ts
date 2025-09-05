import {
  NavItem,
  Department,
  Customer,
  User,
  FontSize,
  Theme,
  SelectBox,
} from "@/types";

export const users: User[] = [
  {
    id: 1,
    name: "Candice Schiner",
    company: "Dell",
    role: "Frontend Developer",
    verified: false,
    status: "Active",
  },
  {
    id: 2,
    name: "John Doe",
    company: "TechCorp",
    role: "Backend Developer",
    verified: true,
    status: "Active",
  },
  {
    id: 3,
    name: "Alice Johnson",
    company: "WebTech",
    role: "UI Designer",
    verified: true,
    status: "Active",
  },
  {
    id: 4,
    name: "David Smith",
    company: "Innovate Inc.",
    role: "Fullstack Developer",
    verified: false,
    status: "Inactive",
  },
  {
    id: 5,
    name: "Emma Wilson",
    company: "TechGuru",
    role: "Product Manager",
    verified: true,
    status: "Active",
  },
  {
    id: 6,
    name: "James Brown",
    company: "CodeGenius",
    role: "QA Engineer",
    verified: false,
    status: "Active",
  },
  {
    id: 7,
    name: "Laura White",
    company: "SoftWorks",
    role: "UX Designer",
    verified: true,
    status: "Active",
  },
  {
    id: 8,
    name: "Michael Lee",
    company: "DevCraft",
    role: "DevOps Engineer",
    verified: false,
    status: "Active",
  },
  {
    id: 9,
    name: "Olivia Green",
    company: "WebSolutions",
    role: "Frontend Developer",
    verified: true,
    status: "Active",
  },
  {
    id: 10,
    name: "Robert Taylor",
    company: "DataTech",
    role: "Data Analyst",
    verified: false,
    status: "Active",
  },
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};
export const navItems: NavItem[] = [
  // {
  //   title: "HỒ SƠ BỆNH ÁN",
  //   href: "emr",
  //   icon: "dashboard",
  //   label: "Dashboard",
  //   permission: "",
  //   prefix: "info",
  //   level: 1,
  //   // childrens: [
  //   //   {
  //   //     title: "HÀNH CHÍNH",
  //   //     href: "/customer/info",
  //   //     label: "Hành chính",
  //   //     prefix: "info",
  //   //     permission: "",
  //   //     level: 2,
  //   //   },
  //   //   {
  //   //     title: "HÓA ĐƠN",
  //   //     href: "",
  //   //     label: "Hóa đơn",
  //   //     prefix: "info",
  //   //     level: 2,
  //   //     childrens: [
  //   //       {
  //   //         title: "HÓA ĐƠN KIẾN NGHỊ",
  //   //         href: "/customer/invoice/proposal",
  //   //         label: "Hành chính",
  //   //         prefix: "info",
  //   //         permission: "",
  //   //         level: 3,
  //   //       },
  //   //       {
  //   //         title: "HÓA ĐƠN VIỆN PHÍ",
  //   //         href: "#",
  //   //         label: "Hành chính",
  //   //         level: 3,
  //   //       },
  //   //     ],
  //   //   },
  //   //   {
  //   //     title: "PHIẾU",
  //   //     href: "#",
  //   //     label: "Phiếu",
  //   //     prefix: "info",
  //   //     level: 2,
  //   //     childrens: [
  //   //       {
  //   //         title: "PHIẾU ĐÁNH GIÁ BAN ĐẦU",
  //   //         href: "#",
  //   //         prefix: "info",
  //   //         label: "Phiếu đánh gia ban đầu",
  //   //         level: 3,
  //   //       },
  //   //       {
  //   //         title: "PHIẾU SƠ KẾT 15 NGÀY",
  //   //         href: "#",
  //   //         prefix: "info",
  //   //         label: "Phiếu đánh gia ban đầu",
  //   //         level: 3,
  //   //       },
  //   //       {
  //   //         title: "PHIẾU KH CHĂM SÓC",
  //   //         href: "#",
  //   //         prefix: "info",
  //   //         label: "Phiếu kh chăm sóc",
  //   //         level: 3,
  //   //       },
  //   //       {
  //   //         title: "CÁC PHIẾU KHÁC",
  //   //         href: "#",
  //   //         prefix: "info",
  //   //         label: "CÁC PHIẾU KHÁC",
  //   //         level: 3,
  //   //       },
  //   //     ],
  //   //   },
  //   //   {
  //   //     title: "PKVV",
  //   //     href: "#",
  //   //     label: "PKVV",
  //   //     prefix: "info",
  //   //     level: 2,
  //   //   },
  //   //   {
  //   //     title: "BỆNH ÁN",
  //   //     href: "/medical-profile/infomation",
  //   //     label: "Bệnh án",
  //   //     prefix: "info",
  //   //     level: 2,
  //   //   },
  //   //   {
  //   //     title: "TỜ ĐIỀU TRỊ",
  //   //     href: "#",
  //   //     label: "Tờ điều trị",
  //   //     prefix: "info",
  //   //     level: 2,
  //   //   },
  //   //   {
  //   //     title: "THÔNG TIN BỆNH ÁN",
  //   //     href: "#",
  //   //     label: "Thông tin bệnh án",
  //   //     prefix: "info",
  //   //     level: 2,
  //   //   },
  //   //   {
  //   //     title: "XUẤT",
  //   //     href: "#",
  //   //     label: "Phiếu xuất",
  //   //     prefix: "info",
  //   //     level: 2,
  //   //   },
  //   // ],
  // },
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
    ]
  },
  // {
  //   title: "THUỐC - VẬT TƯ",
  //   href: "/medicine",
  //   icon: "user",
  //   label: "",
  //   permission: "",
  //   prefix: "medicine_materials",
  //   level: 1,
  //   childrens: [
  //     {
  //       title: "THUỐC",
  //       label: "user",
  //       level: 2,
  //       childrens: [
  //         {
  //           title: "ĐƠN THUỐC",
  //           href: "/medicine",

  //           label: "user",
  //           level: 3,
  //         },
  //         {
  //           title: "TOA XUẤT VIỆN",
  //           href: "/medicine",
  //           label: "employee",
  //           level: 3,
  //         },
  //         {
  //           title: "QUẢN LÝ PHIẾU LĨNH",
  //           href: "#",
  //           label: "profile",
  //           level: 3,
  //         },
  //         {
  //           title: "BN TRẢ THUỐC",
  //           href: "#",
  //           label: "profile",
  //           level: 3,
  //         },
  //       ],
  //     },
  //     {
  //       title: "VẬT TƯ",
  //       label: "user",
  //       level: 2,
  //       childrens: [
  //         {
  //           title: "BN TRẢ VẬT TƯ",
  //           href: "#",
  //           label: "user",
  //           level: 3,
  //         },
  //         {
  //           title: "KHOA TRẢ VẬT TƯ",
  //           href: "#",
  //           label: "employee",
  //           level: 3,
  //         },
  //         {
  //           title: "KHOA TRẢ Y CỤ",
  //           href: "#",
  //           label: "employee",
  //           level: 3,
  //         },
  //         {
  //           title: "KHOA TRẢ VACCINE",
  //           href: "#",
  //           label: "employee",
  //           level: 3,
  //         },
  //         {
  //           title: "KHOA TRẢ TPCN",
  //           href: "#",
  //           label: "employee",
  //           level: 3,
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   title: "TÌM BỆNH NHÂN",
  //   href: "#",
  //   icon: "employee",
  //   label: "employee",
  //   prefix: "find_patient",
  //   level: 1,
  // },
  // {
  //   title: "THÊM DỊCH VỤ",
  //   href: "#",
  //   icon: "profile",
  //   label: "profile",
  //   prefix: "add_service",
  //   level: 1,
  // },
  // {
  //   title: "GIƯỜNG",
  //   href: "#",
  //   icon: "kanban",
  //   label: "kanban",
  //   prefix: "bed",
  //   level: 1,
  // },
  // {
  //   title: "THANH TOÁN",
  //   href: "#",
  //   icon: "kanban",
  //   label: "kanban",
  //   prefix: "pay",
  //   level: 1,
  // },
  // {
  //   title: "BÁO CÁO",
  //   href: "#",
  //   icon: "kanban",
  //   label: "kanban",
  //   prefix: "report",
  //   level: 1,
  // },
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
    ]
  },
];

export const customers: Customer[] = [
  {
    patientId: 111111,
    patientCode: "",
    patientName: "Candice Schiner",
    address: "",
    ticketId: "",
    created: null,
    // age: 20,
    gender: "male",
    dateOfBirth: null,
    // insurance: "BHYT đúng tuyến",
    // services: [],
    reason: "",
  },
  // {
  //   id: 22222,
  //   name: "John Doe Candice Schiner	",
  //   age: 22,
  //   gender: "female",
  //   birthday: null,
  //   insurance: "BHYT trái tuyến",
  //   services: [],
  // },
  // {
  //   id: 333333,
  //   name: "Alice Johnson Doe",
  //   age: 38,
  //   gender: "male",
  //   birthday: null,
  //   insurance: "BHYT đúng tuyến",
  //   services: [],
  // },
  // {
  //   id: 444444,
  //   name: "David Smith",
  //   age: 48,
  //   gender: "male",
  //   birthday: null,
  //   services: [],
  // },
  // {
  //   id: 55555,
  //   name: "Emma Wilson Schiner",
  //   age: 48,
  //   gender: "male",
  //   birthday: null,
  //   insurance: "BHYT đúng tuyến",
  //   services: [],
  // },
  // {
  //   id: 564564564,
  //   name: "James Brown",
  //   age: 48,
  //   gender: "male",
  //   birthday: null,
  //   insurance: "BHYT đúng tuyến",
  //   services: [],
  // },
  // {
  //   id: 4455555,
  //   name: "Nguyễn Văn Long",
  //   age: 48,
  //   gender: "male",
  //   birthday: null,
  //   insurance: "BHYT đúng tuyến",
  //   services: [],
  // },
  // {
  //   id: 80987876,
  //   name: "Hà Anh Tuấn",
  //   age: 48,
  //   gender: "male",
  //   birthday: null,
  //   insurance: "BHYT đúng tuyến",
  //   services: [],
  // },
  // {
  //   id: 56457567,
  //   name: "Nguyễn văn Tèo",
  //   age: 48,
  //   gender: "male",
  //   birthday: null,
  //   insurance: "BHYT trái tuyến",
  //   services: [],
  // },
  // {
  //   id: 564575671,
  //   name: "Laura White",
  //   age: 48,
  //   gender: "male",
  //   birthday: null,
  //   insurance: "BHYT đúng tuyến",
  //   services: [],
  // },
  // {
  //   id: 453445345,
  //   name: "Michael Lee Nguyen",
  //   age: 58,
  //   gender: "male",
  //   birthday: null,
  //   insurance: "BHYT đúng tuyến",
  //   services: [],
  // },
  // {
  //   id: 454564,
  //   name: "David Green",
  //   age: 58,
  //   gender: "male",
  //   birthday: null,
  //   insurance: "BHYT trái tuyến",
  //   services: [],
  // },
  // {
  //   id: 456465,
  //   name: "Michael Robert Taylor",
  //   age: 58,
  //   gender: "male",
  //   birthday: null,
  //   insurance: "BHYT trái tuyến",
  //   services: [],
  // },
  // {
  //   id: 898776,
  //   name: "David Robert Johnson End",
  //   age: 28,
  //   gender: "male",
  //   birthday: null,
  //   insurance: "BHYT đúng tuyến",
  //   services: [],
  // },
];

export const departments: Department[] = [
  {
    id: 1,
    name: "Khoa Khám Bệnh",
  },
  {
    id: 2,
    name: "Khoa Dược",
  },
  {
    id: 3,
    name: "Khoa Đông Y",
  },
  {
    id: 4,
    name: "Khoa Nha",
  },
  {
    id: 5,
    name: "Khoa Chẩn Đoán Hình Ảnh",
  },
  {
    id: 6,
    name: "Khoa Vật Lý Trị Liệu",
  },
  {
    id: 7,
    name: "Khoa Tai Mũi Họng",
  },
  {
    id: 10,
    name: "Khoa Đột Quỵ",
  },
  {
    id: 11,
    name: "Khoa Chấn thương chỉnh hình",
  },
  {
    id: 12,
    name: "Khoa Nội - Nhiễm",
  },
  {
    id: 13,
    name: "Khoa Ngoại Tổng Quát",
  },
  {
    id: 14,
    name: "TỔNG QUÁT",
  },
  {
    id: 15,
    name: "Khu Thu Tiền Ngoại Trú",
  },
  {
    id: 16,
    name: "Khu Tiếp Nhận Ngoại Trú",
  },
  {
    id: 17,
    name: "Khoa Cấp cứu",
  },
  {
    id: 18,
    name: "Khoa Thẩm Mỹ",
  },
  {
    id: 19,
    name: "Phòng Kế toán",
  },
  {
    id: 20,
    name: "Khoa Phẫu Thuật",
  },
  {
    id: 22,
    name: "Thu ngân nội trú",
  },
  {
    id: 23,
    name: "Khoa Hồi sức",
  },
  {
    id: 24,
    name: "Phòng Kế hoạch tổng hợp",
  },
  {
    id: 25,
    name: "Phòng Điện cơ",
  },
  {
    id: 26,
    name: "Phòng nội soi 137",
  },
  {
    id: 27,
    name: "Khoa Xét nghiệm",
  },
  {
    id: 28,
    name: "Khoa khám bệnh nội trú",
  },
  {
    id: 29,
    name: "Xét Nghiệm (Chỉ định)",
  },
  {
    id: 30,
    name: "Nội Soi (Chỉ định)",
  },
  {
    id: 31,
    name: "Siêu Âm (Chỉ định)",
  },
  {
    id: 32,
    name: "Điện Não (Chỉ định)",
  },
  {
    id: 33,
    name: "Điện Tim (Chỉ định)",
  },
  {
    id: 34,
    name: "Điện Cơ (Chỉ định)",
  },
  {
    id: 35,
    name: "CT (Chỉ định)",
  },
  {
    id: 36,
    name: "MRI (Chỉ định)",
  },
  {
    id: 37,
    name: "Khoa Lọc Thận",
  },
  {
    id: 38,
    name: "Nội soi TMH (Chỉ định)",
  },
  {
    id: 39,
    name: "Phòng Hành Chánh",
  },
  {
    id: 40,
    name: "Phòng Điện tim",
  },
  {
    id: 41,
    name: "Khoa Chống Nhiễm Khuẩn",
  },
  {
    id: 42,
    name: "Khoa Ung Bướu",
  },
  {
    id: 43,
    name: "Phòng M&E",
  },
  {
    id: 44,
    name: "Phòng Hành Chánh",
  },
  {
    id: 45,
    name: "Khoa Dinh Dưỡng",
  },
  {
    id: 46,
    name: "Phòng CNTT OneHeath",
  },
  {
    id: 47,
    name: "Phòng BHYT",
  },
  {
    id: 48,
    name: "Khoa Nhi",
  },
  {
    id: 49,
    name: "Phòng Chích Ngừa",
  },
  {
    id: 50,
    name: "HSTC và Chống Độc",
  },
  {
    id: 51,
    name: "Điện Não",
  },
  {
    id: 52,
    name: "Khoa Huyết Học",
  },
  {
    id: 53,
    name: "IT",
  },
  {
    id: 54,
    name: "Phòng Bảo Hiểm",
  },
];

export const fontsSetting: FontSize[] = [
  { label: "Small Size ", value: "text-xs" },
  { label: "Medium Size", value: "text-sm" },
  { label: "Large Size ", value: "text-lg" },
];

export const themesColorSetting: Theme[] = [
  { value: "theme-blue", label: "Theme Blue", color: "blue" },
  { value: "theme-green", label: "Theme Green", color: "green" },
  { value: "theme-orange", label: "Theme Orange", color: "orange" },
  { value: "theme-default", label: "Theme Default", color: "white" },
];

export const mediacalSelect: {
  id: number;
  value: string;
  title: string;
}[] = [
  { id: 1, value: "internal", title: "Bệnh án nội khoa" },
  { id: 2, value: "foreign", title: "Bệnh án ngoại khoa" },
  { id: 3, value: "gynecology", title: "Bệnh án phụ khoa" },
  { id: 4, value: "obstetrics", title: "Bệnh án sản khoa" },
  { id: 5, value: "ent", title: "Bệnh án tai mũi họng" },
  { id: 6, value: "maxillofacial", title: "Bệnh án răng hàm mặt" },
  { id: 7, value: "inpatient_emergency", title: "Bệnh án cấp cứu nội trú" },
  { id: 8, value: "dermatology", title: "Bệnh án Da Liễu" },
  { id: 9, value: "neonatal", title: "Bệnh án sơ sinh" },
  { id: 10, value: "outpatient_emergency", title: "Bệnh án cấp cứu ngoại trú" },
  { id: 11, value: "pediatric", title: "Bệnh án nhi khoa" },
  { id: 12, value: "rehabilitation", title: "Bệnh án phục hồi chức năng" },
  {
    id: 13,
    value: "out_traditional_medicine",
    title: "Bệnh án ngoại trú y học cổ truyền",
  },
  { id: 14, value: "outpatient_dialysis", title: "Bệnh án ngoại trú lọc thận" },
];

export const treatmentResults: SelectBox[] = [
  { text: "Khỏi", value: "1" },
  { text: "Đỡ bệnh", value: "2" },
  { text: "không thay đổi", value: "3" },
  { text: "Nặng hơn", value: "4" },
  { text: "Tử vong", value: "5" },
  { text: "Tiên lượng nặng xin về", value: "6" },
  { text: "Chưa xác định", value: "7" },
];
export const nationsSelect: SelectBox[] = [
  { value: "1", text: "(1) Kinh" },
  { value: "2", text: "(2) Nùng" },
  { value: "3", text: "(3) K'hme" },
  { value: "4", text: "(4) Mèo" },
  { value: "5", text: "(5) H'Mong" },
];

export const countriesSelect: SelectBox[] = [
  { value: "1", text: "(1) Việt Nam" },
  { value: "2", text: "(2) Lào" },
  { value: "3", text: "(3) Cambodia" },
  { value: "4", text: "(4) Thailand" },
];

export const educationsSelect: SelectBox[] = [
  { value: "1", text: "Đại học" },
  { value: "2", text: "Cao đẳng" },
  { value: "3", text: "Trung cấp" },
  { value: "4", text: "12/12" },
  { value: "5", text: "9/12" },
];

export const careersSelect: SelectBox[] = [
  { value: "NVVP", text: "(NVVP) Nhân viên văn phòng" },
  { value: "SEO", text: "(SEO) Nhân viên SEO" },
  { value: "NVXD", text: "(NVXD) Nhân viên xây dựng" },
];

export const provincesSelect: SelectBox[] = [
  { value: "1", text: "Thành phố Hồ Chí Minh" },
  { value: "2", text: "Hà Nội" },
  { value: "3", text: "Huế" },
  { value: "4", text: "Bình Dương" },
  { value: "5", text: "Tiền Giang" },
  { value: "6", text: "Bến Tre" },
  { value: "7", text: "Vĩnh Long" },
];

export const districtSelect: SelectBox[] = [
  { value: "1", text: "Quận 1" },
  { value: "2", text: "Quận 2" },
  { value: "3", text: "Quận 3" },
  { value: "4", text: "Quận 4" },
  { value: "5", text: "Quận 5" },
  { value: "6", text: "Quận 6" },
  { value: "7", text: "Quận 7" },
  { value: "8", text: "Quận 8" },
  { value: "9", text: "Quận 9" },
  { value: "10", text: "Quận 10" },
  { value: "11", text: "Quận 11" },
  { value: "12", text: "Quận 12" },
  { value: "13", text: "Quận Bình Tân" },
  { value: "14", text: "Quận Tân Bình" },
  { value: "15", text: "Quận Tân Phú" },
  { value: "16", text: "Quận Bình Thạnh" },
  { value: "17", text: "TP. Thủ Đức" },
  { value: "18", text: "Huyện Bình Chánh" },
  { value: "19", text: "Huyện Nhà Bè" },
  { value: "20", text: "Huyện Hóc Môn" },
  { value: "21", text: "Huyện Củ Chi" },
];
export const patientObject: SelectBox[] = [
  { value: "1", text: "Thu Phí" },
  { value: "2", text: "Không thu phí" },
  { value: "3", text: "Có bảo hiểm" },
  { value: "4", text: "Không có bảo hiểm" },
];
export const introductionSelect: SelectBox[] = [
  { value: "1", text: "(1) Cơ quan y tế" },
  { value: "2", text: "(2) Tự đến" },
  { value: "3", text: "(3) Khác" },
  { value: "4", text: "(4) BV Ung Bướu (Đề án)" },
];
export const transferHospitalSelect: SelectBox[] = [
  { value: "1", text: "Tuyến trên" },
  { value: "2", text: "Tuyến dưới" },
  { value: "3", text: "CK" },
];
export const dieSelect: SelectBox[] = [
  { value: "1", text: "Do bệnh" },
  { value: "2", text: "Khác" },
  { value: "3", text: "Do tai biến điều trị" },
];

enum Gender {
  MALE = "male",
  FEMALE = "female",
}

export const patientFormDefaultValue = {
  patientName: "",
  gender: Gender.MALE,
  dayOfBirth: "",
  monthOfBirth: "",
  yearOfBirth: "",
  age: "",
  ethniCode: "",
  ethnic: "",
  nationalityCode: "",
  nationality: "",
  educationCode: "",
  education: "",
  careerCode: "",
  career: "",
  careerPlace: "",
  isCnv: false,
  patientObjectCode: "",
  patientObject: "",
  address: "",
  province: "",
  district: "",
  ward: "",
  phoneNumber: "",
  relatives: "",
  checkInDay: "",
  checkInMonth: "",
  checkInYear: "",
  checkInTime: "",
  checkInDepartment: "",
  examinationType: "",
  introductionPlaceCode: "",
  introductionText: "",
  checkInPhoneNumber: "",
  examinationNumber: "",
  doctorName: "",
  icdMoveText: "",
  icdMoveCode: "",
  icdMoveName: "",
  icdEmergencyText: "",
  icdEmergencyCode: "",
  icdEmergencyName: "",
  icdTreatmentText: "",
  icdTreatmentCode: "",
  icdTreatmentName: "",
};
