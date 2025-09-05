"use client";

import { useEffect, useState } from "react";
import apiRequest from "@/components/concultation/consultationApiRequest";
import { PayReceiptForPrint } from "@/components/concultation/consultation.shema";
import { useToast } from "@/components/ui/use-toast";
import { dateFormater } from "@/lib/utils";

export default function Page({ params }: { params: { id: number } }) {
  const receiptId = params.id;
  const [data, setData] = useState<PayReceiptForPrint>();
  const { toast } = useToast();

  const fetchDataForPrint = async () => {
    if (!receiptId) return;

    try {
      const res = await apiRequest.getPayReceiptForPrint(receiptId);
      setData(res.payload?.result);
    } catch (err) {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Hoá đơn không hợp lệ",
      });
    }
  };

  useEffect(() => {
    fetchDataForPrint();
  }, []);

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        window.print();
      }, 0);
    }
  }, [data]);

  return (
    <div className="border border-4 border-black w-[210mm] h-[148mm] p-1 print:p-1 print:bg-white">
      <div className="h-full mx-auto border border-1 border-black px-6 py-4 flex flex-col justify-between text-sm text-black print:shadow-none">
        <div>
          <div className="flex w-full justify-between">
            <div>
              <h2>
                <strong className="uppercase">Phòng khám da liễu</strong>
              </h2>
            </div>
            <div>Mã bệnh nhân: {data?.patientInfo.patientCode}</div>
          </div>
          <div className="flex w-full items-center justify-center mt-5 mb-5">
            <h2 className="text-3xl font-bold mb-4">Phiếu thu tiền</h2>
          </div>
          <div className="flex w-full justify-between">
            <div className="flex w-1/2 items-start">
              <p>
                Nơi thu: <strong>Phòng khám da liễu</strong>
              </p>
            </div>
            <div className="flex w-1/2 items-start">
              <p>
                Ngày:{" "}
                <strong>
                  {data?.receiptInfo.createdTime &&
                    dateFormater.format(new Date(data.receiptInfo.createdTime))}
                </strong>
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="flex w-1/2 items-start">
              <p>
                Mã bệnh nhân: <strong>{data?.patientInfo.patientCode}</strong>
              </p>
            </div>
            <div className="flex w-1/2 items-start">
              <p>
                Số hoá đơn: <strong>{data?.receiptInfo.invoiceCode}</strong>
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="flex w-1/2 items-start">
              <p>
                Họ tên: <strong>{data?.patientInfo.patientName}</strong>
              </p>
            </div>
            <div className="flex w-1/2 items-start">
              <p>
                Ngày sinh:{" "}
                <strong>
                  {data?.patientInfo.dateOfBirth &&
                    dateFormater.format(new Date(data.patientInfo.dateOfBirth))}
                </strong>
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="flex w-1/2 items-start">
              <p>
                Giới tính:{" "}
                <strong>
                  {data?.patientInfo.gender &&
                  data?.patientInfo.gender == "MALE"
                    ? "Name"
                    : "Nữ"}
                </strong>
              </p>
            </div>
            <div className="flex w-1/2 items-start">
              <p>
                Số điện thoại: <strong>{data?.patientInfo.phoneNumber}</strong>
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="flex w-1/2 items-start">
              <p>
                Tổng tiền:{" "}
                <strong>
                  {data?.receiptInfo &&
                    Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(data.receiptInfo.totalPrice)}{" "}
                </strong>
              </p>
            </div>
            <div className="flex w-1/2 items-start">
              <p>
                Giảm giá: <strong></strong>
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="flex w-1/2 items-start">
              <p>
                Tiền đóng:{" "}
                <strong>
                  {data?.receiptInfo &&
                    Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(data.receiptInfo.totalPrice)}{" "}
                </strong>
              </p>
            </div>
            <div className="flex w-1/2 items-start">
              <p></p>
            </div>
          </div>
          <div className="flex w-full justify-between mt-2">
            <div className="flex flex-col items-start">
              <p>
                <strong>Dịch vụ:</strong>
              </p>
              {data?.payPaymentItems &&
                data.payPaymentItems.map((item, index) => (
                  <div key={index}>
                    {index + 1}. {item.serviceName}{" "}
                    <strong>
                      (
                      {Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(item.totalPrice)}{" "}
                      )
                    </strong>
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="flex justify-between h-[100px]">
          <div className="flex w-1/3 items-start justify-center">
            <p className="font-bold uppercase">Bệnh nhân</p>
          </div>
          <div className="flex w-1/3 items-start justify-center">
            <p className="font-bold uppercase">Người thu tiền</p>
          </div>
        </div>
      </div>
    </div>
  );
}
