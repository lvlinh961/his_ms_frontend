import { getFirstDayOfMonthISOString, getTodayISOString } from "@/lib/utils";
import z from "zod";

// Schema cho từng dòng thuốc trong báo cáo
export const StockTransactionReportItemSchema = z.object({
  drugId: z.number(),
  drugName: z.string(),
  unit: z.string(),
  openingQty: z.number(), // Tồn đầu kỳ
  importQty: z.number(), // Nhập trong kỳ
  exportQty: z.number(), // Xuất trong kỳ
  closingQty: z.number(), // Tồn cuối kỳ
});
export type StockTransactionReportItem = z.infer<
  typeof StockTransactionReportItemSchema
>;

// Schema cho bộ lọc tìm kiếm
export const StockTransactionFilterSchema = z.object({
  storeId: z.string().uuid("Vui lòng chọn kho"),
  fromDate: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.coerce.date({ invalid_type_error: "Ngày không hợp lệ" }),
  ),
  toDate: z.preprocess(
    (val) => (val === "" || val === null ? undefined : val),
    z.coerce.date({ invalid_type_error: "Ngày không hợp lệ" }),
  ),
  searchTerm: z.string().optional(),
});

export type StockTransactionFilter = z.infer<
  typeof StockTransactionFilterSchema
>;

export const defaultStockTransactionFilter: StockTransactionFilter = {
  storeId: "", // Để trống hoặc ID mặc định
  fromDate: getFirstDayOfMonthISOString() as any, // Ngày 1 của tháng hiện tại
  toDate: getTodayISOString() as any, // Cuối ngày hôm nay
  searchTerm: "", // Thêm ô tìm kiếm tên thuốc nhanh
};

// 1. Extend Filter để thêm drugId (bắt buộc vì là thẻ kho cho TỪNG thuốc)
export const StockCardFilterSchema = StockTransactionFilterSchema.extend({
  drugId: z.number({ required_error: "Vui lòng chọn thuốc" }),
  drugName: z.string(),
});
export type StockCardFilter = z.infer<typeof StockCardFilterSchema>;

export const defaultStockCardFilter: StockCardFilter = {
  storeId: "", // Để trống hoặc ID mặc định
  drugId: 0,
  drugName: "",
  fromDate: getFirstDayOfMonthISOString() as any, // Ngày 1 của tháng hiện tại
  toDate: getTodayISOString() as any, // Cuối ngày hôm nay
  searchTerm: "", // Thêm ô tìm kiếm tên thuốc nhanh
};

// 2. Schema cho dữ liệu trả về (danh sách các giao dịch)
export const StockCardItemSchema = z.object({
  transactionDate: z.coerce.date(),
  referenceCode: z.string().nullable(),
  type: z.enum(["OPENING", "IMPORT", "EXPORT", "ADJUST"]), // Enum dựa trên data mẫu
  description: z.string().optional().nullable(),
  qtyImport: z.number(),
  qtyExport: z.number(),
  closingBalance: z.number(),
});
export type StockCardItem = z.infer<typeof StockCardItemSchema>;
