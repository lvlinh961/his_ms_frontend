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
import { RotateCcw, Search, History } from "lucide-react";
import { cn, formatISODate, handleErrorApi } from "@/lib/utils";
import {
  defaultStockCardFilter, // Giả định bạn đã extend trong schema file
  StockCardFilter,
  StockCardFilterSchema,
  StockCardItem,
} from "./drugStoreReport.schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DrugMaterialSuggest,
  SearchStoreResponse,
} from "@/components/drug-store/drug-store.schema";
import drugStoreApiRequest from "@/components/drug-store/drugStoreApiRequest";
import { logger } from "@/lib/logger";
import CustomFormField from "@/components/atoms/custom-form-field";
import { FormFieldType, HttpStatus } from "@/constants/enum";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAppContext } from "@/providers/app-proviceders";
import drugStoreReportApiRequest from "./drugStoreReportApiRequest";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { AutoSuggest } from "@/components/ui/AutoSuggest";

export default function StockCardReport() {
  const form = useForm<StockCardFilter>({
    resolver: zodResolver(StockCardFilterSchema),
    defaultValues: defaultStockCardFilter,
  });

  const [stores, setStores] = useState<SearchStoreResponse[]>([]);
  const [reportData, setReportData] = useState<StockCardItem[]>([]);
  const { setLoadingOverlay } = useAppContext();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const params = new URLSearchParams();
        params.append("keyword", "");
        params.append("active", String(true));
        const res = await drugStoreApiRequest.searchStore(params);
        setStores(res.payload.result);
      } catch (error) {
        handleErrorApi({ error });
      }
    };
    fetchStores();
  }, []);

  const fetchDrugAutoSuggest = useCallback(async (query: string) => {
    const res = await drugStoreApiRequest.autoSuggest(query);
    return res.payload.result;
  }, []);

  const handleFilter = async (data: StockCardFilter) => {
    setLoadingOverlay(true);
    try {
      const params = new URLSearchParams();
      if (data.storeId) params.append("storeId", data.storeId);
      if (data.drugId) params.append("drugId", data.drugId.toString());
      if (data.fromDate) params.append("from", formatISODate(data.fromDate));
      if (data.toDate) params.append("to", formatISODate(data.toDate));

      const result = await drugStoreReportApiRequest.getStockCardReport(params);

      if (result.status === HttpStatus.SUCCESS) {
        setReportData(result.payload.result);
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoadingOverlay(false);
    }
  };

  const renderTypeBadge = (type: string) => {
    switch (type) {
      case "OPENING":
        return (
          <Badge variant="secondary" className="bg-slate-100 text-slate-600">
            ĐẦU KỲ
          </Badge>
        );
      case "IMPORT":
        return (
          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
            NHẬP
          </Badge>
        );
      case "EXPORT":
        return (
          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
            XUẤT
          </Badge>
        );
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* SECTION: HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Thẻ kho chi tiết
          </h1>
          <p className="text-sm text-slate-500">
            Theo dõi lịch sử biến động của từng mặt hàng thuốc
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
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleFilter, (e) =>
                logger.error("Stock Card report: ", e),
              )}
              className="flex flex-row items-end gap-3 w-full"
            >
              {/* Chọn Kho */}
              <div className="flex-1 min-w-[180px]">
                <CustomFormField
                  fieldType={FormFieldType.SELECT_SUGGEST}
                  control={form.control}
                  name="storeId"
                  label="Cơ sở / Kho"
                  placeholder="Chọn kho..."
                  options={stores.map((s) => ({
                    id: s.id,
                    name: s.name,
                    code: s.code,
                  }))}
                />
              </div>

              {/* Chọn Thuốc (Thêm mới so với báo cáo tổng) */}
              <div className="flex-1 min-w-[220px]">
                <FormField
                  control={form.control}
                  name="drugName"
                  render={({ field }) => (
                    <FormItem className="flex-1 min-w-[300px] space-y-1">
                      <FormLabel className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                        Thuốc / Vật tư
                      </FormLabel>
                      <FormControl>
                        <AutoSuggest<DrugMaterialSuggest>
                          // field.value sẽ chứa drugId (number)
                          // Nếu AutoSuggest cần string để hiển thị, hãy xử lý trong logic nội bộ của nó
                          value={field.value}
                          fetchData={fetchDrugAutoSuggest}
                          getDisplayValue={(item) => item.name}
                          onSelect={(drug: DrugMaterialSuggest) => {
                            // Cập nhật giá trị vào form thông qua field.onChange
                            field.onChange(drug.name);
                            form.setValue("drugId", drug.id);
                          }}
                          renderItem={(item) => (
                            <div className="flex flex-col py-0.5">
                              <div className="font-bold text-sm text-blue-900 leading-snug">
                                {item.name}
                              </div>
                              <div className="text-[10px] flex items-center gap-2 mt-1">
                                <span className="bg-blue-50 text-blue-600 px-1 rounded font-mono border border-blue-100">
                                  {item.code}
                                </span>
                                <span className="text-slate-500 italic truncate max-w-[200px]">
                                  {item.hoatChat || "Không có hoạt chất"}
                                </span>
                                <span className="ml-auto text-slate-400 font-medium">
                                  ĐVT: {item.unitName}
                                </span>
                              </div>
                            </div>
                          )}
                        />
                      </FormControl>
                      <FormMessage className="text-[10px]" />
                    </FormItem>
                  )}
                />
              </div>

              {/* Từ ngày */}
              <div className="w-[150px] space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Từ ngày
                </label>
                <Input
                  type="date"
                  {...form.register("fromDate")}
                  className="h-9 bg-white"
                />
              </div>

              {/* Đến ngày */}
              <div className="w-[150px] space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Đến ngày
                </label>
                <Input
                  type="date"
                  {...form.register("toDate")}
                  className="h-9 bg-white"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  className="h-9 bg-blue-600 hover:bg-blue-700 text-white flex gap-2"
                >
                  <Search className="h-4 w-4" /> Lấy dữ liệu
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

      {/* SECTION: DATA TABLE */}
      <Card className="shadow-md overflow-hidden border-none">
        <Table>
          <TableHeader className="bg-slate-100">
            <TableRow>
              <TableHead className="w-[160px]">Thời gian</TableHead>
              <TableHead className="w-[150px]">Mã chứng từ</TableHead>
              <TableHead className="text-center">Loại</TableHead>
              <TableHead>Nội dung</TableHead>
              <TableHead className="text-right text-blue-600 bg-blue-50/50">
                Nhập
              </TableHead>
              <TableHead className="text-right text-orange-600 bg-orange-50/50">
                Xuất
              </TableHead>
              <TableHead className="text-right font-bold bg-slate-50">
                Tồn cuối
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reportData.length > 0 ? (
              reportData.map((item, index) => (
                <TableRow
                  key={index}
                  className={cn(
                    item.type === "OPENING" && "bg-slate-50/80 italic",
                  )}
                >
                  <TableCell className="text-xs text-slate-500">
                    {item.transactionDate
                      ? format(
                          new Date(item.transactionDate),
                          "dd/MM/yyyy HH:mm",
                        )
                      : "-"}
                  </TableCell>
                  <TableCell className="font-mono text-xs font-bold text-blue-800">
                    {item.referenceCode || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {renderTypeBadge(item.type)}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {item.description ||
                      (item.type === "OPENING" ? "Số dư đầu kỳ" : "")}
                  </TableCell>
                  <TableCell className="text-right font-medium text-blue-600">
                    {item.qtyImport > 0
                      ? `+${item.qtyImport.toLocaleString()}`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right font-medium text-orange-600">
                    {item.qtyExport > 0
                      ? `-${item.qtyExport.toLocaleString()}`
                      : "-"}
                  </TableCell>
                  <TableCell className="text-right font-bold text-slate-900 bg-slate-50/30">
                    {item.closingBalance.toLocaleString()}
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
                    <History className="h-10 w-10 opacity-20" />
                    Vui lòng chọn thuốc và thời gian để xem thẻ kho chi tiết.
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
