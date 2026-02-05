"use client";

import z from "zod";
import { DocumentTypeEnum, GenderEnum } from "@/types";
import { useEffect, useState } from "react";
import { useAppContext } from "@/providers/app-proviceders";
import { SurgeryTicketFormSchema } from "@/components/surgery/surgery.types";
import surgeryApiRequest from "@/components/surgery/surgeryApiRequest";
import { handleErrorApi } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function TreatmentRecord({
  ticketId,
  documentType,
}: {
  ticketId: string;
  documentType: z.infer<typeof DocumentTypeEnum>;
}) {
  const [data, setData] = useState<SurgeryTicketFormSchema>();
  const { setLoadingOverlay } = useAppContext();

  useEffect(() => {
    getDataForPrint();
  }, []);

  useEffect(() => {
    if (data) {
      setTimeout(() => {
        window.print();
      }, 0);
    }
  }, [data]);

  async function getDataForPrint() {
    setLoadingOverlay(true);

    try {
      const res = await surgeryApiRequest.getSurgeryTicket(
        ticketId,
        DocumentTypeEnum.enum.SURGERY_TICKET
      );

      if (res?.payload?.result) {
        setData(res.payload.result);
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoadingOverlay(false);
    }
  }
  return (
    <div className="w-[210mm] h-[293mm] p-6 mx-auto bg-white text-[12px] leading-tight flex flex-col">
      <div className="flex justify-between mb-2">
        <div className="w-[200px]">
          <div className="flex w-full">
            <div>Sở Y tế:</div>{" "}
            <div className="flex-1 bg-dot-line ml-2">TP. HCM</div>
          </div>
          <div className="flex w-full">
            <div>Bệnh viện:</div>{" "}
            <div className="flex-1 bg-dot-line ml-2">{data?.clinicName}</div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-xl font-bold uppercase">Phiếu theo dõi điều trị</p>
          <div className="flex flex-1 text-md">
            <div className="text-lg">Tờ số:</div>
            <div className="flex-1 bg-dot-line-lg ml-2"></div>
          </div>
        </div>
        <div className="text-left">
          <p className="font-bold text-lg"></p>
          <p>MS: 01/BV2</p>
        </div>
      </div>

      <div className="flex flex-1 flex-col mt-10 p-2 mb-2 space-y-1 text-sm">
        <div className="flex">
          <div className="flex flex-1">
            <div>Họ và tên:</div>
            <div className="flex-1 bg-dot-line ml-2">
              <span className="font-bold uppercase">
                {data?.data?.patient.name}
              </span>
            </div>
          </div>
          <div className="flex w-[100px]">
            <div>Tuổi:</div>
            <div className="flex-1 bg-dot-line ml-2">
              <span className="font-bold uppercase">
                {data?.data?.patient.age}
              </span>
            </div>
          </div>
          <div className="flex w-[180px]">
            <div>Giới tính:</div>
            <div className="flex flex-1">
              <div className="flex ml-4 space-x-1">
                <Checkbox
                  checked={data?.data?.patient.gender === GenderEnum.Enum.MALE}
                />
                <span>Nam</span>
              </div>
              <div className="ml-4 flex ml-4 space-x-1">
                <Checkbox
                  checked={
                    data?.data?.patient.gender === GenderEnum.Enum.FEMALE
                  }
                />
                <span>Nữ</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="flex flex-1">
            <div>Khoa:</div>
            <div className="flex-1 bg-dot-line ml-2">
              <span className="">{data?.data?.prePiagnosis}</span>
            </div>
          </div>
          <div className="flex w-[150px]">
            <div>Phòng:</div>
            <div className="flex-1 bg-dot-line ml-2">
              <span className=""></span>
            </div>
          </div>
          <div className="flex w-[150px]">
            <div>Giường:</div>
            <div className="flex-1 bg-dot-line ml-2">
              <span className=""></span>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="w-full flex">
            <div>Chẩn đoán:</div>
            <div className="flex-1 bg-dot-line ml-2"></div>
          </div>
        </div>
        <div className="flex">
          <div className="w-full flex">
            <div>Chẩn đoán phân biệt:</div>
            <div className="flex-1 bg-dot-line ml-2"></div>
          </div>
        </div>
        <div className="flex-1 flex flex-col border border-black text-black">
          {/* Header row */}
          <div className="flex border-b border-black font-bold text-center">
            <div className="w-[15%] border-r border-black p-1">
              <p>Thời gian</p>
              <p className="font-normal">(ngày/giờ)</p>
            </div>
            <div className="w-[50%] border-r border-black p-1">
              <p>Diễn tiến bệnh</p>
              <p className="font-normal">
                (Viết diễn biến theo cấu trúc như SOAP)
              </p>
            </div>
            <div className="flex-1 p-1">
              <p>Chỉ định</p>
            </div>
          </div>

          {/* Body rows fill remaining height */}
          <div className="flex flex-1 border-b border-black font-bold text-center">
            <div className="w-[15%] border-r border-black p-1"></div>
            <div className="w-[50%] border-r border-black p-1"></div>
            <div className="flex-1 p-1"></div>
          </div>
        </div>
        <div>
          <span className="font-bold">Ghi chú: </span>Bác sỹ ký ngay sau mỗi lần
          ghi chép trong phần &quot;Diễn biến bệnh&quot; hoặc &quot;Chỉ
          định&quot;
        </div>
      </div>
    </div>
  );
}
