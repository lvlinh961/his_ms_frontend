import { PharImportStatus } from "@/constants/enum";
import { getFirstDayOfMonthISOString, getTodayISOString } from "@/lib/utils";
import { z } from "zod";
import PharImportOrder from "./PharImportOrder";

export const PharImportOrderSearchSchema = z.object({
  keyword: z.string().optional().or(z.literal("")),
  storeId: z.string().uuid("ID kho không hợp lệ").optional().nullable(),
  supplierId: z
    .string()
    .uuid("ID nhà cung cấp không hợp lệ")
    .optional()
    .nullable(),
  status: z.preprocess(
    (val) => (val === "" || val === "ALL" ? null : val),
    z.nativeEnum(PharImportStatus).optional().nullable(),
  ),
  // Sử dụng coerce để tự động chuyển đổi chuỗi từ input date thành đối tượng Date
  fromDate: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.coerce.date({ invalid_type_error: "Ngày không hợp lệ" }),
  ),

  toDate: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.coerce.date({ invalid_type_error: "Ngày không hợp lệ" }),
  ),
  page: z.number().min(0).default(0),
  size: z.number().min(1).max(100).default(20),
});

export type PharImportOrderSearchRequest = z.infer<
  typeof PharImportOrderSearchSchema
>;

export const pharImportOrderSearchDefault: PharImportOrderSearchRequest = {
  keyword: "",
  // Set ngày hiện tại
  fromDate: getFirstDayOfMonthISOString() as any,
  toDate: getTodayISOString() as any,
  status: PharImportStatus.PENDING,
  page: 0,
  size: 20,
};

export const PharImportOrderItemSchema = z.object({
  id: z.string().uuid(),
  importCode: z.string(),
  invoiceNo: z.string().nullable(),
  invoiceDate: z.string(), // Định dạng YYYY-MM-DD từ LocalDate
  storeName: z.string(),
  supplierName: z.string().nullable(),
  totalAmount: z.number(),
  status: z.nativeEnum(PharImportStatus), // Ép kiểu về Enum
  createdAt: z.string(),
  createdBy: z.string().uuid(),
});

export type PharImportOrderItem = z.infer<typeof PharImportOrderItemSchema>;

export const PharImportDetailCreateSchema = z.object({
  // ID của thuốc/vật tư
  drugMaterialId: z.string().min(1, "Vui lòng chọn thuốc/vật tư"),

  // ID của thuốc/vật tư
  drugMaterialName: z.string().optional().nullable(),

  // ID đơn vị tính
  unitId: z.string().uuid("Đơn vị tính không hợp lệ"),

  // Số lượng (coerce để ép kiểu từ string input sang number)
  quantity: z.coerce.number().min(0.01, "Số lượng phải lớn hơn 0"),

  // Giá nhập
  importPrice: z.coerce.number().min(0, "Giá nhập không được âm"),

  // % VAT (Ví dụ: 5.0)
  vatPercent: z.coerce.number().min(0).max(100).default(0),

  // Giá bán dự kiến
  sellPrice: z.coerce.number().min(0, "Giá bán không được âm"),

  // Số lô (plotNumber trong JSON của bạn)
  plotNumber: z.string().min(1, "Số lô không được để trống"),

  // Hạn sử dụng (YYYY-MM-DD)
  expiryDate: z.coerce
    .date({ invalid_type_error: "Hạn dùng không hợp lệ" })
    .transform((val) => {
      // Chuyển đối tượng Date thành chuỗi YYYY-MM-DD
      return val.toISOString().split("T")[0];
    })
    .pipe(
      z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "Định dạng ngày phải là YYYY-MM-DD"),
    ),

  // Ngày sản xuất (YYYY-MM-DD)
  manufactureDate: z.string().optional().nullable(),

  // Có cho phép bán hay không
  isSellable: z.boolean().default(true),

  // Ghi chú cho từng mặt hàng
  note: z.string().optional().nullable(),
});

export type PharImportDetail = z.infer<typeof PharImportDetailCreateSchema>;

export const PharImportCreateSchema = z.object({
  id: z.string().uuid().optional().nullable(),
  // Liên kết hệ thống
  storeId: z
    .string({ required_error: "Vui lòng chọn kho nhập" })
    .uuid("ID kho không hợp lệ"),
  supplierId: z.string().uuid("Vui lòng chọn nhà cung cấp"),

  // Loại hình (Dựa theo mẫu: SUPPLIER, PURCHASE)
  sourceType: z.enum(["SUPPLIER", "OTHER"]).default("SUPPLIER"),
  ticketType: z.enum(["PURCHASE", "RETURN"]).default("PURCHASE"),

  status: z.nativeEnum(PharImportStatus).default(PharImportStatus.PENDING),

  // Thông tin hóa đơn chi tiết
  invoiceNo: z.string().min(1, "Số hóa đơn không được để trống"),
  invoiceForm: z.string().optional().nullable(), // Mẫu số (01GTKT...)
  invoiceSymbol: z.string().optional().nullable(), // Ký hiệu (AA/26P...)
  invoiceDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Ngày hóa đơn không hợp lệ"),

  // Thông tin bổ sung & Tài chính
  note: z.string().optional().nullable(),
  discountAmount: z.coerce.number().min(0).default(0),

  // Danh sách chi tiết (min 1 phần tử)
  details: z
    .array(PharImportDetailCreateSchema)
    .min(1, "Cần ít nhất một mặt hàng để nhập kho"),
});

export type PharImportCreateRequest = z.infer<typeof PharImportCreateSchema>;

export const pharImportDefaultValues: Partial<PharImportCreateRequest> = {
  id: null,
  // Thông tin kho và NCC (Thường để trống để User chọn)
  storeId: "",
  supplierId: "",

  // Các loại hình mặc định
  sourceType: "SUPPLIER",
  ticketType: "PURCHASE",

  // Thông tin hóa đơn
  invoiceNo: "",
  invoiceForm: "01GTKT", // Mẫu hóa đơn phổ biến
  invoiceSymbol: "",
  invoiceDate: getTodayISOString(),

  // Ghi chú và tài chính
  note: "",
  discountAmount: 0,

  // Danh sách chi tiết (Khởi tạo sẵn 1 dòng trống để User dễ nhập liệu)
  details: [
    {
      drugMaterialId: "",
      unitId: "",
      quantity: 1,
      importPrice: 0,
      vatPercent: 5, // Thuế suất dược phẩm phổ biến là 5%
      sellPrice: 0,
      plotNumber: "",
      expiryDate: "", // Để trống bắt buộc user chọn
      manufactureDate: "",
      isSellable: true,
      note: "",
    },
  ],
};

export const DrugSuggestSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  hoatChat: z.string().optional().nullable(),
  hamLuong: z.string().optional().nullable(),
  unit: z.string().optional().nullable(),
  manufacturer: z.string().optional().nullable(),
  dongGoi: z.string().optional().nullable(),
  displayLabel: z.string(),
});

export type DrugMaterialSuggest = z.infer<typeof DrugSuggestSchema>;

export interface SearchStoreRequest {
  keyword: string;
  active: boolean;
}

export interface SearchStoreResponse {
  id: string;
  name: string;
  code: string;
  location: string | null;
}

export const ApprovePharImportOrderSchema = z.object({
  id: z.string().uuid("ID không hợp lệ"),
  approveNote: z
    .string()
    .max(255, "Ghi chú không quá 255 ký tự")
    .optional()
    .default(""),
  accountingDate: z.string().optional().nullable(),
});

export type ApprovePharImportOrderRequest = z.infer<
  typeof ApprovePharImportOrderSchema
>;

export const DrugStockSuggestSchema = z.object({
  id: z.string().uuid(),
  drugMaterialId: z.number(), // Hoặc z.string() nếu ID của bạn là UUID
  code: z.string(),
  name: z.string(),
  hoatChat: z.string().nullable().optional(),
  unit: z.string(),
  // Sử dụng coerce để tự động ép kiểu từ string sang number nếu cần
  availableQuantity: z.number().default(0),
  sellPrice: z.number().default(0),
  displayLabel: z.string(),
  outOfStock: z.boolean().default(false),
});

// Kiểu dữ liệu để sử dụng trong TypeScript
export type DrugStockSuggest = z.infer<typeof DrugStockSuggestSchema>;

// Schema cho từng lô hàng
const PrescriptionPlotSchema = z.object({
  plotId: z.string().uuid(),
  plotNumber: z.string(),
  expiryDate: z.string(), // Hoặc z.date() nếu bạn đã parse
  currentStock: z.number(),
  sellPrice: z
    .number()
    .nullable()
    .optional()
    .transform((val) => val ?? 0),
});

// Schema cho từng dòng thuốc trong lệnh thanh toán
const PrescriptionPaymentItemSchema = z.object({
  drugMaterialId: z.number(),
  drugName: z.string(),
  unit: z.string(),
  quantityOrdered: z.number(), // Số lượng bác sĩ kê
  quantityToBuy: z.number().min(0), // Số lượng khách thực mua (mặc định = quantityOrdered)
  isSelected: z.boolean().default(true),
  availablePlots: z.array(PrescriptionPlotSchema),
  selectedPlotId: z.string().uuid(), // ID của lô được chọn để trừ kho
  paid: z.boolean().default(false),
});

export const PrescriptionPreparePaymentSchema = z.object({
  prescriptionId: z.string().uuid(),
  storeId: z.string().uuid(),
  isProcessed: z.boolean().default(false),
  diagnosis: z.string(),
  items: z.array(PrescriptionPaymentItemSchema),
});

export type PrescriptionPreparePayment = z.infer<
  typeof PrescriptionPreparePaymentSchema
>;

export const defaultPrescriptionPreparePayment: PrescriptionPreparePayment = {
  prescriptionId: "",
  diagnosis: "",
  items: [],
};

export const PharPaymentItemRequestSchema = z.object({
  drugMaterialId: z.number(),
  plotId: z.string().uuid({ message: "Vui lòng chọn lô thuốc hợp lệ" }),
  quantity: z.number().min(0.0001, "Số lượng phải lớn hơn 0"),
  sellPrice: z.number(),
  vatPercent: z.number().default(0),
});
export type PharPaymentItemRequest = z.infer<
  typeof PharPaymentItemRequestSchema
>;

export const PharPaymentRequestSchema = z.object({
  prescriptionId: z.string().min(1, "ID đơn thuốc không được để trống"),
  storeId: z.string().uuid("ID kho không được để trống"),
  note: z.string().optional().nullable(),
  items: z
    .array(PharPaymentItemRequestSchema)
    .min(1, "Danh sách thanh toán không được để trống"),
});

// Type định nghĩa cho hàm gọi API
export type PharPaymentRequest = z.infer<typeof PharPaymentRequestSchema>;

export const PharInvoiceItemResponseSchema = z.object({
  drugName: z.string(),
  unitName: z.string(),
  quantity: z.number(),
  sellPrice: z.number(),
  amount: z.number(),
});
export type PharInvoiceItemResponse = z.infer<
  typeof PharInvoiceItemResponseSchema
>;

export const PharInvoiceResponseSchema = z.object({
  id: z.string().uuid(),
  invoiceCode: z.string(),
  finalAmount: z.number(),
  status: z.string(),
  createdAt: z.coerce.date(), // Tự động chuyển Instant (ISO string) sang Date object
  details: z.array(PharInvoiceItemResponseSchema),
});

// Type định nghĩa cho kết quả trả về
export type PharInvoiceResponse = z.infer<typeof PharInvoiceResponseSchema>;
