"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Filter, RotateCcw, Plus } from "lucide-react";
import {
  PharImportOrderSearchSchema,
  PharImportOrderSearchRequest,
  pharImportOrderSearchDefault,
  PharImportOrderItem,
} from "./drug-store.schema"; // Import từ file schema bạn đã định nghĩa
import {
  AppPermission,
  HttpStatus,
  PharImportStatus,
  PharImportStatusLabel,
} from "@/constants/enum";
import { useAppContext } from "@/providers/app-proviceders";
import { formatISODate, handleErrorApi } from "@/lib/utils";
import drugStoreApiRequest from "./drugStoreApiRequest";
import { ApiPagingResponseInterface } from "@/types";
import PharImportOrderTable from "./PharImportOrderTable";
import { PaginationAsyncNew } from "../ui/PaginationAsyncNew";
import PharImportOrderFormDialog from "./PharImportOrderFormDialog";
import { HasPermission } from "../auth/HasPermission";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { logger } from "@/lib/logger";
import { ApproveImportOrderDialog } from "./ApprovePharImportOrderDialog";

export default function PharImportOrder() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<PharImportOrderSearchRequest>({
    resolver: zodResolver(PharImportOrderSearchSchema),
    defaultValues: pharImportOrderSearchDefault,
  });

  const { setLoadingOverlay } = useAppContext();
  const [pharImportOrderData, setPharImportOrderData] =
    useState<ApiPagingResponseInterface<PharImportOrderItem[]>>();
  const [isPharImportOrderFormDialogOpen, setIsPharImportOrderFormDialogOpen] =
    useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>();
  const [dialogMode, setDialogMode] = useState<"create" | "view" | "edit">(
    "create",
  );
  const [isApproveOpen, setIsApproveOpen] = useState(false);

  // 2. Handle Submit
  const fetchApi = useCallback(async (data: PharImportOrderSearchRequest) => {
    setLoadingOverlay(true);

    try {
      const params = new URLSearchParams();

      if (data.keyword) params.append("keyword", data.keyword);
      if (data.status) params.append("status", data.status);
      if (data.storeId) params.append("storeId", data.storeId);
      if (data.supplierId) params.append("supplierId", data.supplierId);

      // Định dạng lại ngày tháng cho đúng chuẩn LocalDate của Spring Boot
      if (data.fromDate)
        params.append("fromDate", formatISODate(data.fromDate)!);
      if (data.toDate) params.append("toDate", formatISODate(data.toDate)!);

      params.append("page", data.page.toString());
      params.append("size", data.size.toString());

      const result = await drugStoreApiRequest.getAll(params);

      if (result.status == HttpStatus.SUCCESS) {
        setPharImportOrderData(result.payload);
      }
    } catch (error) {
      logger.error(error);
      handleErrorApi({ error });
    } finally {
      setLoadingOverlay(false);
    }
  }, []);

  useEffect(() => {
    handleSubmit(fetchApi)();
  }, [handleSubmit, fetchApi]);

  const handlePageChange = (newPage: number, newSize: number) => {
    // Cập nhật giá trị trực tiếp vào form
    setValue("page", newPage);
    setValue("size", newSize);

    // Trigger submit form với dữ liệu mới nhất
    handleSubmit(fetchApi)();
  };

  const handleViewDetail = (id: string) => {
    setSelectedId(id);
    setDialogMode("view");
    setIsPharImportOrderFormDialogOpen(true);
  };

  const handleOpenApprove = (id: string) => {
    setSelectedId(id);
    setIsApproveOpen(true);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Quản lý nhập kho dược
        </h2>
      </div>

      {/* Form tìm kiếm */}
      <form onSubmit={handleSubmit(fetchApi)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Keyword Search */}
          {/* <div className="flex flex-col gap-1">
            <div className="relative">
              <input
                {...register("keyword")}
                placeholder="Mã phiếu, số hóa đơn..."
                className="w-full pl-9 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div> */}

          {/* Status Select */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Trạng thái</label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white 
             appearance-none min-h-[40px] leading-tight"
            >
              <option value="">Tất cả trạng thái</option>
              {Object.values(PharImportStatus).map((status) => (
                <option key={status} value={status}>
                  {PharImportStatusLabel[status]}
                </option>
              ))}
            </select>
          </div>

          {/* From Date */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Từ ngày</label>
            <input
              type="date"
              {...register("fromDate")}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none ${errors.fromDate ? "border-red-500" : "border-gray-300"}`}
            />
            {/* Hiển thị thông báo lỗi nếu có */}
            {errors.fromDate && (
              <span className="text-xs text-red-500 mt-1">
                {errors.fromDate.message}
              </span>
            )}
          </div>

          {/* To Date */}
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Đến ngày</label>
            <input
              type="date"
              {...register("toDate")}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
      </form>

      {/* Nút điều khiển */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => reset()}
          className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="h-4 w-4" /> Làm lại
        </button>
        <button
          type="button"
          className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          onClick={handleSubmit(fetchApi)}
        >
          <Filter className="h-4 w-4" /> Lọc kết quả
        </button>
        <HasPermission
          permission={AppPermission.CREATE_IMPORT_ORDER}
          fallback={
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="inline-block cursor-not-allowed">
                    <Button
                      disabled
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      <Plus size={18} /> Tạo phiếu nhập
                    </Button>
                  </span>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Bạn không có quyền thực hiện chức năng này</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          }
        >
          <PharImportOrderFormDialog
            open={isPharImportOrderFormDialogOpen}
            onOpenChange={setIsPharImportOrderFormDialogOpen}
            onSuccess={() => {
              handleSubmit(fetchApi)();
            }}
            id={selectedId}
            mode={dialogMode}
          />
        </HasPermission>
      </div>

      <PharImportOrderTable
        results={pharImportOrderData?.data}
        onViewDetail={handleViewDetail}
        onApprove={handleOpenApprove}
      />

      {/* Phân trang - Sử dụng dữ liệu từ form để hiển thị trạng thái hiện tại */}
      {pharImportOrderData && (
        <PaginationAsyncNew
          totalPage={pharImportOrderData.totalPage}
          currentPage={getValues("page")}
          pageSize={getValues("size")}
          loadList={handlePageChange}
        />
      )}

      <ApproveImportOrderDialog
        open={isApproveOpen}
        onOpenChange={setIsApproveOpen}
        orderId={selectedId}
        onSuccess={() => {
          handleSubmit(fetchApi)();
        }}
      />
    </div>
  );
}
