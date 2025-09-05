"use client";

import { useEffect, useState } from "react";
import { PrescriptionForPrint } from "@/components/concultation/consultation.shema";
import consultationApiRequest from "@/components/concultation/consultationApiRequest";
import { useToast } from "@/components/ui/use-toast";
import { dateFormater } from "@/lib/utils";

export default function Page({ params }: { params: { id: string } }) {
  const presId = params.id;
  const [data, setData] = useState<PrescriptionForPrint>();
  const { toast } = useToast();

  const fetchDataForPrint = async () => {
    if (!presId) return;

    try {
      const res = await consultationApiRequest.getPrescriptionForPrint(presId);
      setData(res.payload?.result);
    } catch (err) {
      toast({
        title: "Lỗi",
        variant: "destructive",
        description: "Toa không hợp lệ",
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
    <div className="p-4 print:p-0 print:bg-white">
      <div className="mx-auto border max-w-a5 h-a5 px-6 py-4 flex flex-col justify-between text-sm text-black print:shadow-none print:border-none print:max-w-a5 print:h-a5">
        <div>
          <div className="flex w-full justify-between">
            <div>
              <h2>
                <strong className="uppercase">Phòng khám da liễu</strong>
              </h2>
            </div>
            <div>Mã bệnh nhân: {data?.patientInfo?.patientCode}</div>
          </div>
          <div className="flex w-full items-center justify-center">
            <h2 className="text-xl font-bold mb-4">Đơn thuốc</h2>
          </div>
          <div className="flex w-full justify-between">
            <div className="flex w-1/2 items-start">
              <p>
                Họ tên: <strong>{data?.patientInfo?.patientName}</strong>
              </p>
            </div>
            <div className="flex w-1/2 items-start">
              <p>
                Ngày sinh:{" "}
                <strong>
                  {data &&
                    dateFormater.format(
                      new Date(data?.patientInfo?.dateOfBirth)
                    )}
                </strong>
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="flex w-1/2 items-start">
              <p>
                Chiều cao: <strong>{data?.prescriptionInfo?.height}</strong>{" "}
                (cm)
              </p>
            </div>
            <div className="flex w-1/2 items-start">
              <p>
                Cân nặng: <strong>{data?.prescriptionInfo?.weight}</strong> (kg)
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="flex w-1/2 items-start">
              <p>
                Giới tính:{" "}
                <strong>
                  {data?.patientInfo && data.patientInfo.gender == "Male"
                    ? "Name"
                    : "Nữ"}
                </strong>
              </p>
            </div>
            <div className="flex w-1/2 items-start">
              <p>
                Điện thoại: <strong>{data?.patientInfo?.phoneNumber}</strong>
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="flex items-start">
              <p>
                Địa chỉ: <strong>{data?.patientInfo?.address}</strong>
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between">
            <div className="flex items-start">
              <p>
                Chẩn đoán: <strong>{data?.prescriptionInfo.diagnosis}</strong>
              </p>
            </div>
          </div>
          <div className="flex w-full justify-between mt-4">
            <div className="flex items-start">
              <p>Thuốc điều trị: </p>
            </div>
          </div>

          {/* Loop to show list prescription item */}
          {data?.prescriptionItem &&
            data.prescriptionItem.map((item, index) => (
              <div key="index" className="flex flex-col w-full">
                <div className="flex w-full justify-between">
                  <div>
                    <span>{`${index + 1})`}</span>
                    <strong className="ml-5">{item.name}</strong>
                  </div>
                  <div>
                    <strong>
                      {item.quantity} {item.sellingUnit}
                    </strong>
                  </div>
                </div>
                <div className="pl-10">
                  <span>{item.usage}</span>
                  <span className="ml-2 gap-6">
                    {item.morning > 0 && (
                      <span>
                        ,Sáng <strong>{item.morning}</strong> ({item.unit})
                      </span>
                    )}
                    {item.noon > 0 && (
                      <span>
                        , Trưa <strong>{item.noon}</strong> ({item.unit})
                      </span>
                    )}
                    {item.afternoon > 0 && (
                      <span>
                        , Chiều <strong>{item.afternoon}</strong> ({item.unit})
                      </span>
                    )}
                    {item.evening > 0 && (
                      <span>
                        , Tối <strong>{item.evening}</strong> ({item.unit})
                      </span>
                    )}
                  </span>
                  ,<span> {item?.instruction}</span> -{" "}
                  <span>({data.prescriptionInfo.time} ngày)</span>
                </div>
              </div>
            ))}
        </div>
        {/* End loop */}
        {/* Footer at Bottom */}
        <div className="pt-6">
          <div className="flex w-full justify-between mt-4 pt-2 text-right">
            <div className="w-1/2 text-left">
              <div>
                <strong>Lời dặn:</strong>
              </div>
              <div>{data?.prescriptionInfo?.advice}</div>
            </div>
            <div className="flex flex-col justify-between w-1/2">
              <p className="text-sm">Bác sĩ điều trị</p>
              <p className="mt-8 font-semibold">BS.CKI. Lê Hữu Bách</p>
            </div>
          </div>
          <div className="flex w-full flex-col justify-between border-t mt-4 pt-2 text-left">
            <i>* Khám lại xin mang theo đơn này</i>
            {/* <i>* Số điện thoại liên hệ: 0988620640</i> */}
          </div>
        </div>
      </div>
    </div>
  );
}
