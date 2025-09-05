"use client";
import * as z from "zod";
import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import LoadingOverlay from "@/components/layout/loading-overlay";

interface ProductFormProps {
  totalPage?: number;
  currentPage?: number;
  loadList: (page: number, size: number) => void;
}

export const PaginationAnsyc: React.FC<ProductFormProps> = ({
  totalPage,
  currentPage,
  loadList,
}) => {
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const [pageSize, setPageSize] = useState(10);
  return (
    <>
      <div className="flex items-center justify-end mt-4  ">
        <div className="flex">
          <Pagination className="justify-end">
            <PaginationContent className="justify-end">
              <PaginationItem>
                {/* <PaginationPrevious
                  onClick={() => loadList(currentPage - 1, pageSize)}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                >
                  Trước
                </PaginationPrevious> */}
                <button
                  onClick={() => loadList(currentPage - 1, pageSize)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md border ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100 cursor-pointer"
                  }`}
                >
                  ← Trước
                </button>
              </PaginationItem>

              {Array.from({ length: totalPage }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      className="cursor-pointer"
                      isActive={currentPage === page}
                      onClick={() => loadList(page, pageSize)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                {/* <PaginationNext
                  onClick={() => loadList(currentPage + 1, pageSize)}
                  className={
                    currentPage === totalPage
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                >
                  Sau
                </PaginationNext> */}
                <button
                  onClick={() => loadList(currentPage + 1, pageSize)}
                  disabled={currentPage === totalPage}
                  className={`px-3 py-1 rounded-md border ${
                    currentPage === totalPage
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-100 cursor-pointer"
                  }`}
                >
                  Sau →
                </button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={pageSize}
            onChange={(e) => {
              const size = parseInt(e.target.value, 10);
              setPageSize(size);
              loadList(1, size);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};
