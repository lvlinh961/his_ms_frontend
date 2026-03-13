"use client";

import React, { useState } from "react";
import type { ConsultationReport } from "./consutationReport.types";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  FileDown,
  Search,
  RotateCcw,
  Users,
  CalendarDays,
  Wallet,
} from "lucide-react";
import { cn, handleErrorApi } from "@/lib/utils";
import { useAppContext } from "@/providers/app-proviceders";
import { useToast } from "@/components/ui/use-toast";
import { logger } from "@/lib/logger";
import consultationReportApiRequest from "./consultationReportApiRequest";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function ConsultationReportPage() {
  const [startDate, setStartDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  ); // Mặc định đầu tháng
  const [endDate, setEndDate] = useState<string>(
    format(new Date(), "yyyy-MM-dd"),
  );
  const [reports, setReports] = useState<ConsultationReport[]>([]);

  const { setLoadingOverlay } = useAppContext();
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng chọn khoảng thời gian báo cáo.",
        variant: "destructive",
      });
      return;
    }
    setLoadingOverlay(true);
    try {
      const response =
        await consultationReportApiRequest.getConsultationReports(
          startDate,
          endDate,
        );
      if (response && response.payload.result) {
        setReports(response.payload.result);
      } else {
        setReports([]);
      }
    } catch (error) {
      logger.error("Error fetching consultation reports:", error);
      setReports([]);
      handleErrorApi({ error });
    } finally {
      setLoadingOverlay(false);
    }
  };

  const totalAmount = reports.reduce(
    (total, report) => total + (report.amount || 0),
    0,
  );

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
      {/* SECTION: HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight flex items-center gap-2">
            <Users className="h-6 w-6 text-blue-600" />
            Báo cáo lượt khám bệnh
          </h1>
          <p className="text-sm text-slate-500">
            Thống kê danh sách và doanh thu khám bệnh theo thời gian
          </p>
        </div>
        {/* <Button
          variant="outline"
          className="flex gap-2 border-green-600 text-green-600 hover:bg-green-50 shadow-sm"
        >
          <FileDown className="h-4 w-4" /> Xuất Excel
        </Button> */}
      </div>

      {/* SECTION: FILTER BAR (Một dòng giống Thẻ kho) */}
      <Card className="bg-white shadow-sm border-slate-200">
        <CardContent className="pt-6">
          <div className="flex flex-row items-end justify-between gap-3 w-full">
            <div className="flex flex-row">
              <div className="w-[160px] space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 flex items-center gap-1">
                  Từ ngày
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-9 bg-slate-50 focus:bg-white border-slate-200 cursor-pointer"
                />
              </div>
              <div className="w-[160px] space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">
                  Đến ngày
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-9 bg-slate-50 focus:bg-white border-slate-200 cursor-pointer"
                />
              </div>
            </div>
            <div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSearch}
                  className="h-9 px-6 bg-blue-600 hover:bg-blue-700 shadow-md flex gap-2"
                >
                  <Search className="h-4 w-4" />
                  Lấy báo cáo
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setStartDate("");
                    setEndDate("");
                    setReports([]);
                  }}
                  className="h-9 w-9 p-0 text-slate-400"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SECTION: DATA TABLE */}
      <Card className="shadow-md overflow-hidden border-none">
        <Table>
          <TableHeader className="bg-slate-100">
            <TableRow>
              <TableHead className="w-[60px] text-center">STT</TableHead>
              <TableHead className="w-[140px]">Mã bệnh nhân</TableHead>
              <TableHead>Họ tên bệnh nhân</TableHead>
              <TableHead className="text-center">Ngày sinh</TableHead>
              <TableHead className="text-center">Ngày khám</TableHead>
              <TableHead className="text-right pr-10">Số tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports.length > 0 ? (
              <>
                {reports.map((report, index) => (
                  <TableRow
                    key={index}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <TableCell className="text-center text-slate-500 font-medium">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className="font-mono text-blue-700 bg-blue-50 border-blue-100"
                      >
                        {report.patientCode}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold text-slate-700">
                      {report.patientName}
                    </TableCell>
                    <TableCell className="text-center text-slate-500">
                      {report.dateOfBirth
                        ? format(new Date(report.dateOfBirth), "dd/MM/yyyy")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-1.5 text-slate-600">
                        <CalendarDays className="h-3.5 w-3.5 opacity-50" />
                        {format(new Date(report.date), "dd/MM/yyyy")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-emerald-700 pr-10">
                      {report.amount?.toLocaleString("vi-VN")} đ
                    </TableCell>
                  </TableRow>
                ))}
                {/* Dòng tổng cộng giống footer báo cáo chuyên nghiệp */}
                <TableRow className="bg-slate-50 border-t-2">
                  <TableCell
                    colSpan={5}
                    className="text-right font-bold text-slate-600 uppercase text-xs tracking-wider"
                  >
                    Tổng doanh thu kỳ này:
                  </TableCell>
                  <TableCell className="text-right font-black text-lg text-emerald-800 pr-10">
                    <div className="flex items-center justify-end gap-2">
                      <Wallet className="h-5 w-5 text-emerald-600" />
                      {totalAmount.toLocaleString("vi-VN")} đ
                    </div>
                  </TableCell>
                </TableRow>
              </>
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-64 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400 gap-3">
                    <Users className="h-12 w-12 opacity-10" />
                    <p className="italic">
                      Chưa có dữ liệu lượt khám. Vui lòng chọn ngày và nhấn "Lấy
                      báo cáo".
                    </p>
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
