"use client";

import z from "zod";
import {
  DocumentTypeEnum,
  SurgeryTicketFormSchema,
  GenderEnum,
  SurgeryLevelEnum,
  SurgeryLevelLabels,
  IncisionTypeEnum,
  IncisionTypeLabels,
} from "@/components/surgery/surgery.types";
import { useEffect, useState } from "react";
import { useAppContext } from "@/providers/app-proviceders";
import {
  datetimeFormater,
  formatDateTimeString,
  handleErrorApi,
} from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import surgeryApiRequest from "@/components/surgery/surgeryApiRequest";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function SurgeryTicket({
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
  }

  return (
    <>
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
            <p>Phiếu phẫu thuật</p>
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
                    checked={
                      data?.data?.patient.gender === GenderEnum.Enum.MALE
                    }
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
          <div className="flex">
            <div className="w-full flex">
              <div>Địa chỉ:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="font-bold">{data?.data?.address}</span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-full flex">
              <div>Vào viện lúc:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="font-bold">
                  {data?.data &&
                    datetimeFormater.format(new Date(data.data.checkInDate))}
                </span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-full flex">
              <div>Phẫu thuật bắt đầu lúc:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="font-bold">
                  {data?.data &&
                    formatDateTimeString(data.data.surgeryStartTime)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-full flex">
              <div>Phẫu thuật kết thúc lúc:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="font-bold">
                  {data?.data && formatDateTimeString(data.data.surgeryEndTime)}
                </span>
              </div>
            </div>
          </div>
          <p className="font-bold">II. Nội dung:</p>
          <div className="flex">
            <div className="w-full flex">
              <div>Chẩn đoán trước phẫu thuật:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="font-bold">{data?.data?.prePiagnosis}</span>
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
            <div className="w-full flex space-x-2">
              <div>Loại vết mổ:</div>
              {IncisionTypeEnum.options.map((option) => (
                <div className="w-[100px]" key={option}>
                  <Checkbox checked={data?.data.incisionType == option} />{" "}
                  <span>{IncisionTypeLabels[option]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex">
            <div className="w-full flex space-x-2">
              <div>Giải phẩu bệnh lý:</div>
              <div className="flex ml-4 space-x-1">
                <Checkbox checked={data?.data?.pathology === true} />
                <span>Có</span>
              </div>
              <div className="ml-4 flex ml-4 space-x-1">
                <Checkbox checked={data?.data?.pathology === false} />
                <span>Không</span>
              </div>
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
              <div>Phẫu thuật viên chính:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.surgeon}</span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-full flex">
              <div>Phẫu thuật viên phụ:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.assistantSurgeons}</span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-full flex">
              <div>Bác sĩ giây mê hồi sức:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.anesthetist}</span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-full flex">
              <div>Điều dưỡng phụ mê:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.anesthesiaNurses}</span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-full flex">
              <div>Điều dưỡng dụng cụ:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.instrumentsNurses}</span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-full flex">
              <div>Điều dưỡng chạy ngoài:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.otherNurses}</span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-full flex">
              <div>Thời gian phẫu thuật:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">
                  {data?.data && formatDateTimeString(data.data.surgeryTime)}
                </span>
              </div>
            </div>
          </div>
          <p className="text-lg font-bold text-center uppercase">
            Lược đồ phẫu thuật
          </p>
          <div className="flex">
            <div className="w-full flex">
              <div className="flex-1 bg-dot-line ml-2 h-[150px]">
                <span className="font-bold">
                  {data?.data?.surgicalSchematic}
                </span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-full flex space-x-2">
              <div>Dẫn lưu:</div>
              <div className="flex ml-4 space-x-1">
                <Checkbox checked={data?.data?.drainages.length > 0} />
                <span>Có</span>
              </div>
              <div className="ml-4 flex ml-4 space-x-1">
                <Checkbox checked={data?.data?.drainages.length <= 0} />
                <span>Không</span>
              </div>
            </div>
          </div>
          {data?.data?.drainages.length > 0 &&
            data.data.drainages.map((item, index) => (
              <div key={index} className="flex">
                <div className="flex flex-1">
                  <div>Vị trí:</div>
                  <div className="flex-1 bg-dot-line ml-2">
                    <span className="">{item.position}</span>
                  </div>
                </div>
                <div className="flex w-[200px]">
                  <div>Số lượng:</div>
                  <div className="flex-1 bg-dot-line ml-2">
                    <span className="">{item.quantity}</span>
                  </div>
                </div>
              </div>
            ))}
          <div className="flex">
            <div className="flex flex-1">
              <div>Lượng máu mất:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.blooldLoss}</span>
              </div>
            </div>
            <div className="flex w-1/2">
              <div>Lượng máu truyền vào:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.bloodTransfusion}</span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-1">
              <div>Số mẫu bệnh phẩm:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.numberOfSamples}</span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-1">
              <div>Khác:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.other}</span>
              </div>
            </div>
          </div>
          <p className="text-lg font-bold text-center uppercase">
            Trình tự phẫu thuật
          </p>
          <div className="flex">
            <div className="w-full flex">
              <div className="flex-1 bg-dot-line ml-2 h-[150px]">
                <span className="font-bold">
                  {data?.data?.surgicalProcedure}
                </span>
              </div>
            </div>
          </div>
          <p className="">
            Các biến chứng hoặc các diễn biến bất thường ngoài dự kiến trong quá
            trình phẫu thuật:
          </p>
          <div className="flex">
            <div className="w-full flex">
              <div className="flex-1 bg-dot-line ml-2 h-[100px]">
                <span className="font-bold">{data?.data?.complications}</span>
              </div>
            </div>
          </div>
          <p className="">
            Chi tiết công cụ dụng cụ cấy ghép trên người bệnh (nếu có):
          </p>
          <Table className="border">
            <TableHeader className="text-black">
              <TableRow>
                <TableHead>TT</TableHead>
                <TableHead>Loại cấy ghép</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Kích thướt</TableHead>
                <TableHead>Hãng</TableHead>
                <TableHead>Ghi chú (Ví dụ: Số khía trên đinh vít)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.data?.implants.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.size}</TableCell>
                  <TableCell>{item.manufacturer}</TableCell>
                  <TableCell>{item.notes}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Footer at Bottom */}
          <div className="pt-6">
            <div className="flex w-full justify-between mt-4 pt-2 text-right">
              <div className="w-1/2 text-left"></div>
              <div className="flex flex-col justify-between w-1/2 text-center">
                <p>.....Giờ.....Ngày..../...../......</p>
                <p className="text-sm text-center font-bold uppercase">
                  Bác sỹ phẫu thuật
                </p>
                <p className="font-italic">(Ký, ghi rõ họ tên)</p>
                <div className="mt-15"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
