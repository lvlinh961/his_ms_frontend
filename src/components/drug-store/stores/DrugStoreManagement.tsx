"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Edit2,
  Warehouse,
  MapPin,
  Calendar,
  RotateCcw,
} from "lucide-react";
import { format } from "date-fns";
import { cn, handleErrorApi } from "@/lib/utils";
import {
  DrugStore,
  DrugStoreFilter,
  DrugStoreFilterSchema,
} from "../drug-store.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import CustomFormField from "@/components/atoms/custom-form-field";
import { FormFieldType, HttpStatus } from "@/constants/enum";
import { useAppContext } from "@/providers/app-proviceders";
import drugStoreApiRequest from "../drugStoreApiRequest";
import { ApiPagingResponseInterface } from "@/types";
import { SelectItem } from "@/components/ui/select";
import DrugStoreFormDialog from "./DrugStoreFormDialog";
import { Pagination } from "@/components/ui/pagination";
import { PaginationAsyncNew } from "@/components/ui/PaginationAsyncNew";

export default function DrugStoreManagement() {
  const form = useForm<DrugStoreFilter>({
    resolver: zodResolver(DrugStoreFilterSchema),
    defaultValues: {
      keyword: "",
      active: "true",
      page: 0,
      size: 20,
    },
  });
  const [drugStoreData, setDrugStoreData] =
    useState<ApiPagingResponseInterface<DrugStore[]>>();

  const [selectedStore, setSelectedStore] = useState<DrugStore>(null);

  const [openStoreFormDialog, setOpenStoreFormDialog] =
    useState<boolean>(false);

  const { setLoadingOverlay } = useAppContext();

  const handleSearch = useCallback(async (filter: DrugStoreFilter) => {
    setLoadingOverlay(true);

    try {
      const params = new URLSearchParams();
      params.append("keyword", filter.keyword);
      if (filter.active !== "all") {
        params.append("active", filter.active);
      }
      const res = await drugStoreApiRequest.getListDugStore(params);

      if (res.status == HttpStatus.SUCCESS) {
        setDrugStoreData(res.payload);
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoadingOverlay(false);
    }
  }, []);

  const handlePageChange = (newPage: number, newSize: number) => {
    // Cập nhật giá trị trực tiếp vào form
    form.setValue("page", newPage);
    form.setValue("size", newSize);

    // Trigger submit form với dữ liệu mới nhất
    form.handleSubmit(handleSearch)();
  };

  useEffect(() => {
    form.handleSubmit(handleSearch)();
  }, [handleSearch]);

  const onCreateStore = () => {
    form.handleSubmit(handleSearch)();
  };

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
      {/* SECTION: HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Warehouse className="h-6 w-6 text-blue-600" />
            Quản lý Kho / Quầy thuốc
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Danh mục các kho hàng và điểm bán lẻ trong hệ thống
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 flex gap-2 shadow-md"
          onClick={() => {
            setSelectedStore(null);
            setOpenStoreFormDialog(true);
          }}
        >
          <Plus className="h-4 w-4" /> Thêm kho mới
        </Button>

        <DrugStoreFormDialog
          open={openStoreFormDialog}
          onOpenChange={setOpenStoreFormDialog}
          onSuccess={onCreateStore}
          drugStore={selectedStore}
        />
      </div>

      {/* SECTION: QUICK FILTER */}
      <Card className="bg-white shadow-sm border-slate-200 mb-6">
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSearch)}
              className="flex flex-row items-end gap-4 w-full"
            >
              {/* Ô tìm kiếm Keyword */}
              <div className="flex-1 min-w-[300px] space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Keyword (Mã hoặc tên)
                </label>
                <div className="relative">
                  <Input
                    {...form.register("keyword")}
                    placeholder="Nhập tên hoặc mã kho thuốc..."
                    className="pl-10 h-9 bg-slate-50 border-slate-200 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Lọc Trạng thái (Active) */}
              <div className="w-[200px] space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Trạng thái
                </label>
                <CustomFormField
                  control={form.control}
                  name="active"
                  fieldType={FormFieldType.SELECT}
                >
                  <SelectItem value="all">
                    <div className="flex cursor-pointer items-center gap-2 font-medium text-slate-500">
                      <p>Tất cả trạng thái</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="true">
                    <div className="flex cursor-pointer items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-500" />
                      <p>Đang hoạt động</p>
                    </div>
                  </SelectItem>
                  <SelectItem value="false">
                    <div className="flex cursor-pointer items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-slate-300" />
                      <p>Ngừng hoạt động</p>
                    </div>
                  </SelectItem>
                </CustomFormField>
              </div>

              {/* Nhóm Button Action */}
              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex gap-2 transition-all active:scale-95"
                >
                  <Search className="h-4 w-4" />
                  <span className="font-medium">Tìm kiếm</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="h-9 w-9 p-0 text-slate-400 border-slate-200 hover:bg-slate-50"
                  title="Làm mới"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              {/* Spacer đẩy sang trái */}
              <div className="flex-[0.5]" />
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* SECTION: TABLE */}
      <Card className="border-none shadow-md overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead className="w-[150px] font-bold">Mã kho</TableHead>
              <TableHead className="font-bold">Tên kho / Quầy</TableHead>
              <TableHead className="font-bold">Vị trí</TableHead>
              <TableHead className="text-center font-bold">
                Trạng thái
              </TableHead>
              <TableHead className="text-center font-bold">Ngày tạo</TableHead>
              <TableHead className="text-right font-bold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drugStoreData?.data.map((store) => (
              <TableRow
                key={store.id}
                className="hover:bg-slate-50/50 transition-colors group"
              >
                <TableCell>
                  <Badge
                    variant="outline"
                    className="font-mono bg-blue-50 text-blue-700 border-blue-100"
                  >
                    {store.code}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold text-slate-700">
                  {store.name}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-slate-500 text-sm">
                    <MapPin className="h-3.5 w-3.5 opacity-50" />
                    {store.location || "Chưa xác định"}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={cn(
                      "shadow-none",
                      store.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {store.active ? "Đang hoạt động" : "Ngừng hoạt động"}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-slate-500 text-sm">
                  <div className="flex flex-col">
                    <span className="flex items-center justify-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(store.createdAt), "dd/MM/yyyy")}
                    </span>
                    <span className="text-[10px] opacity-70">
                      {format(new Date(store.createdAt), "HH:mm")}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        setSelectedStore(store);
                        setOpenStoreFormDialog(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button> */}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {drugStoreData && (
        <PaginationAsyncNew
          totalPage={drugStoreData.totalPage}
          currentPage={form.getValues("page")}
          pageSize={form.getValues("size")}
          loadList={handlePageChange}
        />
      )}
    </div>
  );
}
