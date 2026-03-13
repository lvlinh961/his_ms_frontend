"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Form } from "@/components/ui/form";
import {
  Plus,
  Search,
  RotateCcw,
  Building2,
  Phone,
  Mail,
  MapPin,
  ReceiptText,
  Edit2,
} from "lucide-react";
import CustomFormField from "@/components/atoms/custom-form-field";
import { FormFieldType, HttpStatus } from "@/constants/enum";
import { SelectItem } from "@/components/ui/select";
import {
  DrugSupplier,
  SupplierFilterSchema,
  SupplierFilterValues,
} from "../drug-store.schema";
import { useAppContext } from "@/providers/app-proviceders";
import { cn, handleErrorApi } from "@/lib/utils";
import drugStoreApiRequest from "../drugStoreApiRequest";
import { ApiPagingResponseInterface } from "@/types";
import { PaginationAsyncNew } from "@/components/ui/PaginationAsyncNew";
import DrugSupplierFormDialog from "./DrugSupplierFormDialog";

export default function DrugSupplierManagement() {
  const [suppliersResponse, setSuppliersResponse] =
    useState<ApiPagingResponseInterface<DrugSupplier[]>>();
  const { setLoadingOverlay } = useAppContext();
  const [selectedSupplier, setSelectedSupplier] = useState<DrugSupplier | null>(
    null,
  );
  const [openSupplierForm, setOpenSupplierForm] = useState(false);

  const form = useForm<SupplierFilterValues>({
    resolver: zodResolver(SupplierFilterSchema),
    defaultValues: { keyword: "", active: "all", page: 0, size: 20 },
  });

  const handleFilter = useCallback(async (data: SupplierFilterValues) => {
    setLoadingOverlay(true);

    try {
      const params = new URLSearchParams();
      if (data.keyword) params.append("keyword", data.keyword);
      if (data.active !== "all") params.append("active", data.active);

      const res = await drugStoreApiRequest.getListSupplier(params);

      if (res.status == HttpStatus.SUCCESS) {
        setSuppliersResponse(res.payload);
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
    form.handleSubmit(handleFilter)();
  };

  useEffect(() => {
    form.handleSubmit(handleFilter)();
  }, [handleFilter]);

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Building2 className="h-6 w-6 text-blue-600" />
            Quản lý Nhà cung cấp
          </h1>
          <p className="text-sm text-slate-500">
            Danh mục đối tác cung ứng dược phẩm và vật tư y tế
          </p>
        </div>
        <Button
          className="bg-blue-600 hover:bg-blue-700 flex gap-2"
          onClick={() => {
            setSelectedSupplier(null);
            setOpenSupplierForm(true);
          }}
        >
          <Plus className="h-4 w-4" /> Thêm nhà cung cấp
        </Button>

        <DrugSupplierFormDialog
          key={selectedSupplier?.id || "creare-mode"}
          open={openSupplierForm}
          onOpenChange={setOpenSupplierForm}
          onSuccess={() => form.handleSubmit(handleFilter)()}
          data={selectedSupplier}
        />
      </div>

      {/* FILTER BAR */}
      <Card className="bg-white border-none shadow-sm">
        <CardContent className="pt-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFilter)}
              className="flex flex-row items-end gap-3 w-full"
            >
              <div className="flex-1 space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Tìm kiếm
                </label>
                <div className="relative">
                  {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" /> */}
                  <Input
                    {...form.register("keyword")}
                    placeholder="Tên, mã, SĐT hoặc mã số thuế..."
                    className="pl-10 h-9 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="w-[180px] space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Trạng thái
                </label>
                <CustomFormField
                  control={form.control}
                  name="active"
                  fieldType={FormFieldType.SELECT}
                >
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="true">Đang hoạt động</SelectItem>
                  <SelectItem value="false">Ngừng hoạt động</SelectItem>
                </CustomFormField>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="h-9 px-4 bg-blue-600 hover:bg-blue-700 flex gap-2"
                >
                  <Search className="h-4 w-4" /> Tìm
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  className="h-9 w-9 p-0"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* DATA TABLE */}
      <Card className="border-none shadow-md overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-100">
            <TableRow>
              <TableHead className="w-[140px] font-bold">Mã đối tác</TableHead>
              <TableHead className="font-bold">
                Tên nhà cung cấp / Liên hệ
              </TableHead>
              <TableHead className="font-bold">Mã số thuế</TableHead>
              <TableHead className="font-bold">Địa chỉ</TableHead>
              <TableHead className="text-center font-bold">
                Trạng thái
              </TableHead>
              <TableHead className="text-right font-bold">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Giả lập map dữ liệu mẫu */}
            {suppliersResponse?.data.map((supplier) => (
              <TableRow
                key={supplier.id}
                className="hover:bg-slate-50/50 group"
              >
                <TableCell>
                  <Badge
                    variant="outline"
                    className="font-mono bg-blue-50 text-blue-700 border-blue-100"
                  >
                    {supplier.code}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-semibold text-slate-700">
                      {supplier.name}
                    </span>
                    <div className="flex items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" /> {supplier.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="h-3 w-3" /> {supplier.email}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-slate-600 text-sm italic">
                    <ReceiptText className="h-3.5 w-3.5 text-slate-400" />
                    {supplier.taxCode}
                  </div>
                </TableCell>
                <TableCell className="max-w-[200px]">
                  <div className="flex items-start gap-1.5 text-slate-500 text-xs truncate">
                    <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 opacity-50" />
                    {supplier.address}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    className={cn(
                      "shadow-none",
                      supplier.active
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {supplier.active ? "Đang hoạt động" : "Ngừng hoạt động"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-600 hover:bg-blue-50"
                      onClick={() => {
                        setSelectedSupplier(supplier);
                        setOpenSupplierForm(true);
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

      {suppliersResponse && (
        <PaginationAsyncNew
          totalPage={suppliersResponse.totalPage}
          currentPage={form.getValues("page")}
          pageSize={form.getValues("size")}
          loadList={handlePageChange}
        />
      )}
    </div>
  );
}
