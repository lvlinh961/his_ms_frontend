"use client";

import { useState } from "react";
import type { ConsultationReport } from "./consutationReport.types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import DatePickerWithPopover from "@/components/atoms/DatePickerWithPopover";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dateFormater, handleErrorApi } from "@/lib/utils";
import { useAppContext } from "@/providers/app-proviceders";
import { useToast } from "@/components/ui/use-toast";
import { logger } from "@/lib/logger";
import consultationReportApiRequest from "./consultationReportApiRequest";
import { log } from "console";

export default function ConsultationReport() {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [reports, setReports] = useState<ConsultationReport[]>([]);
  const { setLoadingOverlay } = useAppContext();
  const { toast } = useToast();

  const handleStartDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toLocaleDateString("en-CA");
      setStartDate(formattedDate);
    } else {
      setStartDate("");
    }
  };

  const handleEndDateChange = (date: Date | null) => {
    if (date) {
      const formattedDate = date.toLocaleDateString("en-CA");
      setEndDate(formattedDate);
    } else {
      setEndDate("");
    }
  };

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn cả ngày bắt đầu và ngày kết thúc.",
        variant: "destructive",
      });
      return;
    }
    setLoadingOverlay(true);
    try {
      // Fetch data from API
      const response =
        await consultationReportApiRequest.getConsultationReports(
          startDate,
          endDate
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

  return (
    <ScrollArea className="h-[calc(100vh-80px)]">
      <div className="w-full h-full p-2">
        <div className="flex-col border gap-2 p-2 rounded-md">
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <DatePickerWithPopover
                placeholder="Từ ngày"
                value={startDate ? new Date(startDate) : null}
                onChange={handleStartDateChange}
              />
              <DatePickerWithPopover
                placeholder="Đến ngày"
                value={endDate ? new Date(endDate) : null}
                onChange={handleEndDateChange}
              />
            </div>
            <div className="flex">
              <Button onClick={handleSearch}>Tìm</Button>
            </div>
          </div>
          <div className="text-center text-lg font-semibold">
            <h1>Báo cáo số lượt khám bệnh</h1>
          </div>
          <div className="overflow-x-auto pt-2">
            <Table className="min-w-full devide-y shadow rounded-md">
              <TableHeader className="text-[hsl(var(--text-color))] h-8 p-1">
                <TableRow className="bg-[hsl(var(--color-custom-1))]">
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    STT
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Mã bệnh nhân
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Họ tên
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Ngày sinh
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Ngày khám
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">
                    Số tiền
                  </th>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <td colSpan={6} className="text-center p-4">
                      Không có dữ liệu
                    </td>
                  </TableRow>
                ) : (
                  reports.map((report, index) => (
                    <TableRow key={index}>
                      <td className="px-6 text-left">{index + 1}</td>
                      <td className="px-6 text-left">{report.patientCode}</td>
                      <td className="px-6 text-left">{report.patientName}</td>
                      <td className="px-6 text-left">
                        {dateFormater.format(new Date(report.dateOfBirth))}
                      </td>
                      <td className="px-6 text-left">
                        {new Date(report.date).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 text-left">
                        {report?.amount?.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </td>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}
