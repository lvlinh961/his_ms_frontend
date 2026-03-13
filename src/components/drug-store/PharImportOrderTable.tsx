import React from "react";
import { PharImportOrderItem } from "./drug-store.schema";
import { Eye, Edit, Trash2, Pen } from "lucide-react"; // Dùng Lucide icon cho action
import {
  AppPermission,
  PharImportStatus,
  PharImportStatusLabel,
} from "@/constants/enum";
import { formatCurrency, formatDateTimeString } from "@/lib/utils";
import { HasPermission } from "../auth/HasPermission";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

interface Props {
  results: PharImportOrderItem[] | null;
  onViewDetail: (id: string) => void;
  onEdit: (id: string) => void;
  onApprove: (id: string) => void;
  onReject?: (id: string) => void;
}

export default function PharImportOrderTable({
  results,
  onViewDetail,
  onEdit,
  onApprove,
  onReject,
}: Props) {
  // Hàm render Badge màu sắc dựa trên status
  const getStatusBadge = (status: PharImportStatus) => {
    const styles = {
      [PharImportStatus.PENDING]:
        "bg-yellow-100 text-yellow-700 border-yellow-200",
      [PharImportStatus.APPROVED]:
        "bg-green-100 text-green-700 border-green-200",
      [PharImportStatus.COMPLETED]: "bg-blue-100 text-blue-700 border-blue-200",
      [PharImportStatus.CANCELLED]: "bg-red-100 text-red-700 border-red-200",
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium border rounded-full ${styles[status]}`}
      >
        {PharImportStatusLabel[status]}
      </span>
    );
  };

  if (!results || results.length === 0)
    return (
      <div className="py-10 text-center text-gray-500 border rounded-lg mt-4">
        Không tìm thấy phiếu nhập nào.
      </div>
    );

  return (
    <div className="mt-6 overflow-hidden border rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3">Mã phiếu</th>
              <th className="px-4 py-3">Số hóa đơn</th>
              <th className="px-4 py-3">Ngày hóa đơn</th>
              <th className="px-4 py-3">Kho / Nhà CC</th>
              <th className="px-4 py-3 text-right">Tổng tiền</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              <th className="px-4 py-3 text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {results.map((item) => (
              <tr
                key={item.id}
                className="bg-white hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-4 font-medium text-blue-600 cursor-pointer hover:underline">
                  <span onClick={() => onViewDetail(item.id)}>
                    {item.importCode}
                  </span>
                </td>
                <td className="px-4 py-4">{item.invoiceNo || "-"}</td>
                <td className="px-4 py-4">
                  {formatDateTimeString(item.invoiceDate)}
                </td>
                <td className="px-4 py-4">
                  <div className="font-medium text-gray-900">
                    {item.storeName}
                  </div>
                  <div className="text-xs text-gray-400">
                    {item.supplierName || "Chưa có NCC"}
                  </div>
                </td>
                <td className="px-4 py-4 text-right font-semibold text-gray-900">
                  {formatCurrency(item.totalAmount)}
                </td>
                <td className="px-4 py-4 text-center">
                  {getStatusBadge(item.status as PharImportStatus)}
                </td>
                <td className="px-4 py-4 text-start">
                  <div className="flex justify-start gap-2">
                    <button
                      title="Xem chi tiết"
                      className="p-1 text-gray-400 hover:text-blue-600"
                      onClick={() => onViewDetail(item.id)}
                    >
                      <Eye size={18} />
                    </button>
                    {item.status === PharImportStatus.PENDING && (
                      <HasPermission
                        permission={AppPermission.UPDATE_IMPORT_ORDER}
                      >
                        <button
                          title="Chỉnh sửa"
                          className="p-1 text-gray-400 hover:text-blue-600"
                          onClick={() => onEdit(item.id)}
                        >
                          <Pen size={18} />
                        </button>
                      </HasPermission>
                    )}

                    {item.status === PharImportStatus.PENDING && (
                      <HasPermission
                        permission={AppPermission.APPROVED_IMPORT_ORDER}
                        fallback={
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="inline-block cursor-not-allowed">
                                  <button
                                    disabled
                                    className="p-1 text-gray-400 hover:text-green-600 cursor-not-allowed"
                                  >
                                    <Edit size={18} />
                                  </button>
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>
                                  Bạn không có quyền thực hiện chức năng này
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        }
                      >
                        <button
                          title="Duyệt phiếu"
                          className="p-1 text-gray-400 hover:text-green-600"
                          onClick={() => onApprove(item.id)}
                        >
                          <Edit size={18} />
                        </button>
                      </HasPermission>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
