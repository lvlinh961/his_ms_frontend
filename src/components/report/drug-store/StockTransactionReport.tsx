"use client";

import React, { useEffect, useState } from "react";
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
import { RotateCcw, Search, Warehouse } from "lucide-react";
import { formatISODate, handleErrorApi } from "@/lib/utils";
import {
  defaultStockTransactionFilter,
  StockTransactionFilter,
  StockTransactionFilterSchema,
  StockTransactionReportItem,
} from "./drugStoreReport.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchStoreResponse } from "@/components/drug-store/drug-store.schema";
import drugStoreApiRequest from "@/components/drug-store/drugStoreApiRequest";
import { logger } from "@/lib/logger";
import CustomFormField from "@/components/atoms/custom-form-field";
import { FormFieldType, HttpStatus } from "@/constants/enum";
import { Form } from "@/components/ui/form";
import { useAppContext } from "@/providers/app-proviceders";
import drugStoreReportApiRequest from "./drugStoreReportApiRequest";

export default function StockTransactionReport() {
  const form = useForm<StockTransactionFilter>({
    resolver: zodResolver(StockTransactionFilterSchema),
    defaultValues: defaultStockTransactionFilter,
  });
  const [stores, setStores] = useState<SearchStoreResponse[]>([]);
  const [reportData, setReportData] = useState<StockTransactionReportItem[]>(
    [],
  );
  const { setLoadingOverlay } = useAppContext();

  useEffect(() => {
    const fetchStores = async () => {
      const params = new URLSearchParams();

      params.append("keyword", "");
      params.append("active", String(true));
      const res = await drugStoreApiRequest.searchStore(params);
      setStores(res.payload.result);
    };

    fetchStores();
  }, []);

  // Giả lập logic fetch data
  const handleFilter = async (data: StockTransactionFilter) => {
    setLoadingOverlay(true);

    try {
      const params = new URLSearchParams();

      if (data.storeId) params.append("storeId", data.storeId);

      if (data.fromDate) params.append("from", formatISODate(data.fromDate));
      if (data.toDate) params.append("to", formatISODate(data.toDate));
      const result =
        await drugStoreReportApiRequest.getStockTransactionReport(params);

      if (result.status == HttpStatus.SUCCESS) {
        setReportData(result.payload.result);
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoadingOverlay(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* SECTION: HEADER & ACTIONS */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Báo cáo Nhập - Xuất - Tồn
          </h1>
          <p className="text-sm text-slate-500">
            Theo dõi biến động kho dược theo khoảng thời gian
          </p>
        </div>
        {/* <Button
          variant="outline"
          className="flex gap-2 border-green-600 text-green-600 hover:bg-green-50"
        >
          <FileDown className="h-4 w-4" /> Xuất Excel
        </Button> */}
      </div>

      {/* SECTION: FILTERS */}
      <Card className="bg-slate-50/50 shadow-sm border-slate-200">
        <CardContent className="pt-6">
          <div className="w-full mb-4">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleFilter, (e) =>
                  logger.error("Stock Transaction report: ", e),
                )}
                className="flex flex-row items-end gap-3 w-full"
              >
                {/* Field: Chọn Kho - Co giãn linh hoạt */}
                <div className="flex-1 min-w-[200px] space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Cơ sở / Kho
                  </label>
                  <CustomFormField
                    fieldType={FormFieldType.SELECT_SUGGEST}
                    control={form.control}
                    name="storeId"
                    label="Kho nhập hàng"
                    placeholder="Chọn kho..."
                    options={stores.map((s) => ({
                      id: s.id,
                      name: s.name,
                      code: s.code,
                    }))}
                  />
                </div>

                {/* Field: Từ ngày - Cố định độ rộng */}
                <div className="w-[160px] space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Từ ngày
                  </label>
                  <Input
                    type="date"
                    {...form.register("fromDate")}
                    className="h-9 bg-slate-50 border-slate-200 focus:bg-white cursor-pointer"
                  />
                </div>

                {/* Field: Đến ngày - Cố định độ rộng */}
                <div className="w-[160px] space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                    Đến ngày
                  </label>
                  <Input
                    type="date"
                    {...form.register("toDate")}
                    className="h-9 bg-slate-50 border-slate-200 focus:bg-white cursor-pointer"
                  />
                </div>

                {/* Nút Action - Co cụm lại cuối dòng */}
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-transform active:scale-95 flex gap-2"
                  >
                    <Search className="h-4 w-4" />
                    <span className="hidden lg:inline">Lấy báo cáo</span>
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => form.reset()}
                    className="h-9 w-9 p-0 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </Form>
            {form.formState.errors.storeId && (
              <p className="text-[10px] text-red-500 mt-1 ml-1 font-medium italic">
                * {form.formState.errors.storeId.message}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* SECTION: DATA TABLE */}
      <Card className="shadow-md">
        <Table>
          <TableHeader className="bg-slate-100">
            <TableRow>
              <TableHead className="w-[80px] font-bold">Mã</TableHead>
              <TableHead className="min-w-[200px] font-bold">
                Tên thuốc/Vật tư
              </TableHead>
              <TableHead className="text-center font-bold">ĐVT</TableHead>
              <TableHead className="text-right font-bold text-slate-600 bg-slate-50">
                Tồn đầu
              </TableHead>
              <TableHead className="text-right font-bold text-blue-600 bg-blue-50">
                Nhập
              </TableHead>
              <TableHead className="text-right font-bold text-orange-600 bg-orange-50">
                Xuất
              </TableHead>
              <TableHead className="text-right font-bold text-emerald-600 bg-emerald-50 underline italic">
                Tồn cuối
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportData.length > 0 ? (
              reportData.map((item) => (
                <TableRow
                  key={item.drugId}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <TableCell className="font-mono text-xs">
                    {item.drugId}
                  </TableCell>
                  <TableCell className="font-semibold text-blue-900">
                    {item.drugName}
                  </TableCell>
                  <TableCell className="text-center">{item.unit}</TableCell>
                  <TableCell className="text-right font-medium">
                    {item.openingQty.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium text-blue-600">
                    {item.importQty.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-medium text-orange-600">
                    {item.exportQty.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-bold text-emerald-700">
                    {item.closingQty.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="h-48 text-center text-slate-400 italic"
                >
                  <div className="flex flex-col items-center gap-2">
                    <Warehouse className="h-10 w-10 opacity-20" />
                    Chưa có dữ liệu báo cáo cho khoảng thời gian này.
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
