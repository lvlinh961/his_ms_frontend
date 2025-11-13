"use client";

import z from "zod";
import {
  DocumentTypeEnum,
  GenderEnum,
  ProcedureTicketFormSchema,
  SurgeryLevelEnum,
  SurgeryLevelLabels,
} from "@/components/surgery/surgery.types";
import { useEffect, useState } from "react";
import { useAppContext } from "@/providers/app-proviceders";
import surgeryApiRequest from "@/components/surgery/surgeryApiRequest";
import { formatDateTimeString, handleErrorApi } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

export default function ProcedureTicket({
  ticketId,
  documentType,
}: {
  ticketId: string;
  documentType: z.infer<typeof DocumentTypeEnum>;
}) {
  const [data, setData] = useState<ProcedureTicketFormSchema>();
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

  const getDataForPrint = async () => {
    setLoadingOverlay(true);

    try {
      const res = await surgeryApiRequest.getProcedureTicket(
        ticketId,
        documentType
      );

      if (res?.payload?.result) {
        setData(res.payload.result);
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoadingOverlay(false);
    }
  };

  return (
    <div className="w-[210mm] h-[297mm] p-6 mx-auto bg-white text-[12px] leading-tight">
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
        <div className="text-xl text-center font-bold uppercase">
          <p>Phiếu thủ thuật</p>
        </div>
        <div className="text-left">
          <p className="font-bold text-lg"></p>
          <p>MS: 01/BV2</p>
        </div>
      </div>

      <div className="mt-10 p-2 mb-2 space-y-1 text-sm">
        <p className="font-bold">I. Thông tin hành chính:</p>
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
        <p className="font-bold">II. Nội dung:</p>
        <div className="flex">
          <div className="w-full flex">
            <div>Chẩn đoán trước phẫu thuật:</div>
            <div className="flex-1 bg-dot-line ml-2">
              <span className="font-bold">{data?.data?.preDiagnosis}</span>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="w-full flex">
            <div>Chẩn đoán sau phẫu thuật:</div>
            <div className="flex-1 bg-dot-line ml-2">
              <span className="font-bold">{data?.data?.postDiagnosis}</span>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="w-full flex">
            <div>Phương pháp phẫu thuật:</div>
            <div className="flex-1 bg-dot-line ml-2">
              <span className="font-bold">{data?.data?.surgeryMethod}</span>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="w-full flex space-x-2">
            <div>Loại phẫu thuật:</div>
            {SurgeryLevelEnum.options.map((option) => (
              <div className="w-[100px]" key={option}>
                <Checkbox checked={data?.data.surgeryLevel == option} />{" "}
                <span>{SurgeryLevelLabels[option]}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex">
          <div className="w-full flex">
            <div>Phương pháp vô cảm:</div>
            <div className="flex-1 bg-dot-line ml-2">
              <span className="">{data?.data?.disinterestedMethod}</span>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="w-full flex">
            <div>Bác sỹ làm thủ thuật:</div>
            <div className="flex-1 bg-dot-line ml-2">
              <span className="">{data?.data?.surgeon}</span>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="w-full flex">
            <div>Nhân viên phụ:</div>
            <div className="flex-1 bg-dot-line ml-2">
              <span className="">{data?.data?.assistantSurgeons}</span>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="w-full flex">
            <div>Bác sỹ giây mê hồi sức (nếu có):</div>
            <div className="flex-1 bg-dot-line ml-2">
              <span className="">{data?.data?.anesthetist}</span>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="w-full flex">
            <div>Thời gian làm thủ thuật:</div>
            <div className="flex-1 bg-dot-line ml-2">
              <span className="">
                {data?.data && formatDateTimeString(data.data.procedureTime)}
              </span>
            </div>
          </div>
        </div>
        <p className="text-lg font-bold text-center uppercase">
          Tóm tắt quá trình làm thủ thuật
        </p>
        <div className="flex">
          <div className="w-full flex">
            <div className="flex-1 bg-dot-line ml-2 h-[150px]">
              <span className="">{data?.data?.surgicalProcedure}</span>
            </div>
          </div>
        </div>
        <p className="">Các biến chứng trong quá trình làm thủ thuật:</p>
        <div className="flex">
          <div className="w-full flex">
            <div className="flex-1 bg-dot-line ml-2 h-[100px]">
              <span className="">{data?.data?.complications}</span>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-1">
            <div>Lượng máu mất:</div>
            <div className="flex-1 bg-dot-line ml-2">
              <span className="">{data?.data?.bloodLoss}</span>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-1">
            <div>Số mẫu bệnh phẩm (nếu có):</div>
            <div className="flex-1 bg-dot-line ml-2">
              <span className="">{data?.data?.numberOfSamples}</span>
            </div>
          </div>
        </div>
        <div className="flex">
          <div className="flex flex-1">
            <div>Số đăng ký của thiết bị cấy ghép (nếu có):</div>
            <div className="flex-1 bg-dot-line ml-2">
              <span className="">{data?.data?.implants}</span>
            </div>
          </div>
        </div>
        {/* Footer at Bottom */}
        <div className="pt-6">
          <div className="flex w-full justify-between mt-4 pt-2 text-right">
            <div className="w-1/2 text-left"></div>
            <div className="flex flex-col justify-between w-1/2 text-center">
              <p>.....Giờ.....Ngày..../...../......</p>
              <p className="text-sm text-center font-bold uppercase">
                Bác sỹ thực hiện
              </p>
              <p className="font-italic">(Ký, ghi rõ họ tên)</p>
              <div className="mt-15"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
