"use client";
import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "@/components/ui/pagination";

interface PaginationAsyncProps {
  totalPage: number; // Tổng số trang từ Backend
  currentPage: number; // Trang hiện tại từ Backend (0-based)
  pageSize: number; // Kích thước trang hiện tại
  loadList: (page: number, size: number) => void;
  pageSizeOptions?: number[];
}

export const PaginationAsyncNew: React.FC<PaginationAsyncProps> = ({
  totalPage = 0,
  currentPage = 0,
  pageSize = 20,
  loadList,
  pageSizeOptions = [10, 20, 50, 100],
}) => {
  // Chuyển đổi sang 1-based để hiển thị giao diện
  const displayPage = currentPage + 1;

  const getDisplayedPages = (current: number, total: number) => {
    const pages: (number | string)[] = [];
    if (total <= 6) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 3) pages.push(1, 2, 3, 4, "...", total);
      else if (current >= total - 2)
        pages.push(1, "...", total - 3, total - 2, total - 1, total);
      else
        pages.push(1, "...", current - 1, current, current + 1, "...", total);
    }
    return pages;
  };

  if (totalPage <= 1 && pageSizeOptions.length === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 w-full bg-white p-2 rounded-lg border">
      <div className="text-sm text-gray-500">
        Trang {displayPage} / {totalPage}
      </div>

      <div className="flex flex-1 flex-wrap items-center gap-4">
        <div className="flex flex-1 items-center gap-2">
          <Pagination>
            <PaginationContent>
              {/* Nút Trước */}
              <PaginationItem>
                <button
                  onClick={() => loadList(currentPage - 1, pageSize)}
                  disabled={displayPage === 1}
                  className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Trước
                </button>
              </PaginationItem>

              {/* Danh sách số trang */}
              {getDisplayedPages(displayPage, totalPage).map((page, idx) =>
                page === "..." ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <span className="px-2">...</span>
                  </PaginationItem>
                ) : (
                  <PaginationItem key={page}>
                    <PaginationLink
                      className="cursor-pointer"
                      isActive={displayPage === page}
                      onClick={() => loadList((page as number) - 1, pageSize)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}

              {/* Nút Sau */}
              <PaginationItem>
                <button
                  onClick={() => loadList(currentPage + 1, pageSize)}
                  disabled={displayPage === totalPage || totalPage === 0}
                  className="px-3 py-1.5 rounded-md border text-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
                >
                  Sau
                </button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>

        {/* Chọn Page Size */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 whitespace-nowrap">
            Hiển thị:
          </span>
          <select
            value={pageSize}
            onChange={(e) => loadList(0, parseInt(e.target.value, 10))}
            className="border rounded px-2 py-1 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
