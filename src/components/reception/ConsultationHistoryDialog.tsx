"use client";

import { useEffect, useState } from "react";
// import {  } from "@radix-ui/react-dialog";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import receptionsApiRequest from "./receptionApiRequest";
import LoadingOverlay from "../layout/loading-overlay";
import { handleErrorApi, datetimeFormater, dateFormater } from "@/lib/utils";
import { RegistrationHistory } from "./reception.schema";
import { es } from "date-fns/locale";
import consultationApiRequest from "@/components/concultation/consultationApiRequest";
import { PrescriptionForPrint } from "@/components/concultation/consultation.shema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { toast } from "../ui/use-toast";

type ConsultationHistoryDialogProps = {
  patientId: string;
};

export default function ConsultationHistoryDialog({
  patientId,
}: ConsultationHistoryDialogProps) {
  const [consultationOpen, setConsultationOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [listHistory, setListHistory] = useState<RegistrationHistory[]>([]);
  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [historyData, setHistoryData] = useState<PrescriptionForPrint>(null);

  useEffect(() => {
    if (patientId != null) {
      fetchPatientRegistrationHistory(patientId);
    }
  }, [patientId]);

  const fetchPatientRegistrationHistory = async (patientId: string) => {
    setLoading(true);

    try {
      const res = await receptionsApiRequest.getRegistrationHistory(patientId);

      if (res.payload?.result?.length > 0) {
        setListHistory(res.payload.result);
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
    }
  };

  const getPrescriptionInfo = async (idx: number, prescriptionId: string) => {
    setActiveIdx(idx);
    setLoading(true);

    try {
      const res =
        await consultationApiRequest.getPrescriptionForPrint(prescriptionId);

      if (res.payload?.result) {
        setHistoryData(res.payload.result);
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoading(false);
    }
  };

  const printPrescription = (prescriptionId: string) => {
    if (prescriptionId) {
      const printUrl = `print/prescription/${prescriptionId}`;
      window.open(
        printUrl,
        "_blank",
        "width=800,height=600,left=200,top=100,toolbar=0,scrollbars=0"
      );
    }
  };

  return (
    <>
      {patientId && (
        <Dialog open={consultationOpen} onOpenChange={setConsultationOpen}>
          <DialogTrigger>
            <Button type="button" onClick={() => setConsultationOpen(true)}>
              Lịch sử khám
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[900px] max-w-none">
            <DialogHeader>
              <DialogTitle>Lịch sử khám bệnh</DialogTitle>
            </DialogHeader>
            <div className="w-full flex flex-col">
              <div className="w-full flex flex-row space-x-2">
                <div className="w-1/4">
                  <Card className="rounded-none">
                    <CardHeader className="p-1">Danh sách ngày khám</CardHeader>
                    <CardContent className="p-1">
                      <div className="mt-2 space-y-1 overflow-auto">
                        {listHistory &&
                          listHistory.map((item, index) => (
                            <div
                              key={index}
                              onClick={() =>
                                getPrescriptionInfo(index, item.prescriptionId)
                              }
                              className={`p-2 rounded-md cursor-pointer text-xs ${
                                activeIdx === index
                                  ? "bg-[hsl(var(--color-custom-1))] text-[hsl(var(--text-color))] font-semibold"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {datetimeFormater.format(
                                new Date(item.createdDate)
                              )}
                            </div>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="w-3/4">
                  <div className="flex w-full justify-between">
                    <div className="flex w-1/2 items-start">
                      <p>
                        Mã BN:{" "}
                        <strong>{historyData?.patientInfo.patientCode}</strong>
                      </p>
                    </div>
                    <div className="flex w-1/2 items-start">
                      <p>
                        Họ tên:{" "}
                        <strong>{historyData?.patientInfo.patientName}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full justify-between">
                    <div className="flex w-1/2 items-start">
                      <p>
                        Ngày sinh:{" "}
                        <strong>
                          {historyData?.patientInfo &&
                            dateFormater.format(
                              new Date(historyData.patientInfo.dateOfBirth)
                            )}
                        </strong>
                      </p>
                    </div>
                    <div className="flex w-1/2 items-start">
                      <p>
                        Giới tính:{" "}
                        <strong>
                          {historyData?.patientInfo.gender == "MALE"
                            ? "Nam"
                            : "Nữ"}
                        </strong>
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full justify-between">
                    <div className="flex w-full items-start">
                      <p>
                        Địa chỉ:{" "}
                        <strong>{historyData?.patientInfo.address}</strong>
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full justify-between">
                    <div className="flex w-1/3 items-start">
                      <p>
                        Chiều cao:{" "}
                        <strong>{historyData?.prescriptionInfo.height}</strong>{" "}
                        (cm)
                      </p>
                    </div>
                    <div className="flex w-1/3 items-start">
                      <p>
                        Cân nặng:{" "}
                        <strong>{historyData?.prescriptionInfo.weight}</strong>{" "}
                        (kg)
                      </p>
                    </div>
                    <div className="flex w-1/3 items-start">
                      <p>
                        Nhiệt độ:{" "}
                        <strong>
                          {historyData?.prescriptionInfo.temperature}
                        </strong>{" "}
                        (°C)
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full justify-between">
                    <div className="flex w-1/3 items-start">
                      <p>
                        Chỉ số BMI:{" "}
                        <strong>{historyData?.prescriptionInfo.bmi}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 mb-2 font-bold">Toa thuốc</div>
              <div className="flex flex-col">
                <Card>
                  <CardContent>
                    <div>
                      <div className="flex flex-rpw pt-2 pb-2 justify-between">
                        <div>
                          Lời dặn:{" "}
                          <strong>
                            {historyData?.prescriptionInfo.advice}
                          </strong>
                        </div>
                        <div>
                          <Button
                            variant="default"
                            className="bg-[hsl(var(--color-custom-1))] text-[hsl(var(--text-color))]"
                            onClick={() =>
                              printPrescription(
                                historyData?.prescriptionInfo.prescriptionId
                              )
                            }
                          >
                            In toa
                          </Button>
                        </div>
                      </div>
                      <Table className="text-xs">
                        <TableHeader className="bg-gray-500 text-white">
                          <TableRow>
                            <TableHead className="w-[300px] text-white-500 font-bold">
                              Tên thuốc
                            </TableHead>
                            <TableHead className="text-white-500 font-bold">
                              ĐVT
                            </TableHead>
                            <TableHead className="text-white-500 font-bold">
                              Số ngày
                            </TableHead>
                            <TableHead className="w-1/10 text-white-500 font-bold">
                              Sáng
                            </TableHead>
                            <TableHead className="w-1/10 text-white-500 font-bold">
                              Trưa
                            </TableHead>
                            <TableHead className="w-1/10 text-white-500 font-bold">
                              Chiều
                            </TableHead>
                            <TableHead className="w-1/10 text-white-500 font-bold">
                              Tối
                            </TableHead>
                            <TableHead className="text-white-500 font-bold">
                              Số lượng
                            </TableHead>
                            <TableHead className="text-white-500 font-bold">
                              Dạng thuốc
                            </TableHead>
                            <TableHead className="text-white-500 font-bold">
                              Cách dùng
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {historyData?.prescriptionItem &&
                            historyData.prescriptionItem.map((item, index) => (
                              <TableRow key={index}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.unit}</TableCell>
                                <TableCell>
                                  {historyData?.prescriptionInfo.time}
                                </TableCell>
                                <TableCell>{item.morning}</TableCell>
                                <TableCell>{item.noon}</TableCell>
                                <TableCell>{item.afternoon}</TableCell>
                                <TableCell>{item.evening}</TableCell>
                                <TableCell>{item.quantity}</TableCell>
                                <TableCell>{item.sellingUnit}</TableCell>
                                <TableCell>{item.usage}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <DialogFooter>
              <DialogClose>
                <Button
                  onClick={() => setConsultationOpen(false)}
                  variant="outline"
                >
                  Đóng
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
          {loading && <LoadingOverlay />}
        </Dialog>
      )}
    </>
  );
}
