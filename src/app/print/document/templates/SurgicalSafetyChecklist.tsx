"use client";

import {
  DocumentTypeEnum,
  GenderEnum,
} from "@/components/surgery/surgery.types";
import { useAppContext } from "@/providers/app-proviceders";
import { useEffect, useState } from "react";
import z from "zod";
import surgeryApiRequest from "@/components/surgery/surgeryApiRequest";
import { SurgeryTicketFormSchema } from "@/components/surgery/surgery.types";
import { formatDateTimeString, handleErrorApi } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useDashboardContext } from "@/providers/dashboard-providers";

export default function SurgicalSafetyChecklist({
  ticketId,
  documentType,
}: {
  ticketId: string;
  documentType: z.infer<typeof DocumentTypeEnum>;
}) {
  const [data, setData] = useState<SurgeryTicketFormSchema>();
  const { setLoadingOverlay } = useAppContext();
  const { customerSelected } = useDashboardContext();

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
    <div className="w-[297mm] h-[210mm] p-6 mx-auto bg-white text-[12px] leading-tight">
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
          <p>Bảng kiểm an toàn phẫu thuật</p>
        </div>
        <div className="text-left">
          <p className="font-bold text-lg"></p>
          <p>MS: 01/BV2</p>
        </div>
      </div>

      <div className="mt-10 p-2 mb-2 space-y-1 text-sm">
        <div className="flex space-x-2">
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
          <div className="flex w-[200px] ml-4">
            <div>Mã BN:</div>
            <div className="flex-1 bg-dot-line ml-2">
              <span className="">{customerSelected?.patientCode}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <div className="flex flex-1">
            <div>Chẩn đoán:</div>
            <div className="flex-1 bg-dot-line ml-2">
              <span className="">{data?.data?.prePiagnosis}</span>
            </div>
          </div>
          <div className="flex w-[200px]">
            <div>Phòng mổ:</div>
            <div className="flex-1 bg-dot-line ml-2">
              <span className=""></span>
            </div>
          </div>
          <div className="flex w-[300px] ml-4">
            <div className="flex-1 bg-dot-line ml-2">
              <span className="">
                {data?.data &&
                  formatDateTimeString(new Date(data?.data?.surgeryTime))}
              </span>
            </div>
          </div>
        </div>
        <div className="flex border border-black">
          {/* Trước giây tê, giây mê */}
          <div className="flex flex-col w-1/3 border-black border-r">
            <div className="flex-1 border-b border-black pl-2">
              <p className="italic">(Bác sĩ gây mê, KTV/điều dưỡng gây mê)</p>
              <p className="font-bold">
                Người bệnh đã được kiểm tra, xác nhận:
              </p>
              <div className="flex space-x-1">
                <Checkbox checked={false} />
                <span>Họ và tên, tuổi, giới tính, mã người bệnh</span>
              </div>
              <div className="flex space-x-1">
                <Checkbox checked={false} />
                <span>Vị trí phẫu thuật</span>
              </div>
              <div className="flex space-x-1">
                <Checkbox checked={false} />
                <span>Phương pháp phẫu thuật dự kiến</span>
              </div>
              <div className="flex space-x-1">
                <Checkbox checked={false} />
                <span>Giấy cam kết phẫu thuật, thủ thuật, GMHS</span>
              </div>
            </div>

            <div className="flex-1 border-b border-black pl-2">
              <p className="font-bold">Vùng mổ được đánh dấu:</p>
              <div className="flex">
                <div className="flex w-1/2 space-x-1">
                  <Checkbox checked={false} />
                  <span>Có</span>
                </div>
                <div className="flex space-x-1">
                  <Checkbox checked={false} />
                  <span>Không áp dụng</span>
                </div>
              </div>
            </div>
            <div className="flex-1 border-b border-black pl-2">
              <p className="font-bold">
                Thuốc và thiết bị giây mê đầy đủ và sẵn sàng:
              </p>
              <div className="flex w-1/2 space-x-1">
                <Checkbox checked={false} />
                <span>Có</span>
              </div>
              <p className="font-bold">
                Máy đo bão hòa oxy trong máu gắn trên người bệnh và hoạt động
                bình thường:
              </p>
              <div className="flex w-1/2 space-x-1">
                <Checkbox checked={false} />
                <span>Có</span>
              </div>
            </div>
            <div className="flex-1 pl-2">
              <p className="font-bold">
                Người bệnh có tiền sử dị ứng/say tàu xe:
              </p>
              <div className="flex">
                <div className="flex w-1/2 space-x-1">
                  <Checkbox checked={false} />
                  <span>Có</span>
                </div>
                <div className="flex space-x-1">
                  <Checkbox checked={false} />
                  <span>Không</span>
                </div>
              </div>
              <p className="font-bold">
                Người bệnh có khó thở hoặc có nguy cơ sặc:
              </p>
              <div className="flex">
                <div className="flex w-1/3 space-x-1">
                  <Checkbox checked={false} />
                  <span>Không</span>
                </div>
                <div className="flex flex-1 space-x-1">
                  <Checkbox checked={false} />
                  <span>Có (thiết bị/dụng cụ hỗ trợ)</span>
                </div>
              </div>
              <p className="font-bold">
                Người bệnh có nguy cơ mất &gt; 500ml máu (7ml/kg ở trẻ em):
              </p>
              <div className="flex flex-col">
                <div className="flex w-full space-x-1">
                  <Checkbox checked={false} />
                  <span>Không</span>
                </div>
                <div className="flex w-full space-x-1">
                  <Checkbox checked={false} />
                  <span>
                    Có, và có sẵn 2 đường truyền/tĩnh mạch trung tâm và dịch
                    truyền/mạch máu
                  </span>
                </div>
              </div>
            </div>
          </div>
          {/* Trước khi rạch da */}
          <div className="flex flex-col w-1/3 border-black border-r">
            <div className="w-full border-b border-black pl-2">
              <p className="italic">
                (Điều dưỡng phòng mổ, Bác sĩ gây mê, PTV)
              </p>
              <div className="flex space-x-1">
                <Checkbox checked={false} />
                <span className="font-bold">
                  Các thành viên trong kíp giới thiệu tên, nhiệm vụ
                </span>
              </div>
              <div className="flex space-x-1">
                <Checkbox checked={false} />
                <span className="font-bold">
                  Xác nhận lại họ tên người bệnh và vị trí rạch da bằng lời
                </span>
              </div>
            </div>
            <div className="w-full border-b border-black pl-2">
              <p className="font-bold">Kháng sinh dự phòng:</p>
              <div className="flex">
                <div className="flex w-1/2 space-x-1">
                  <Checkbox checked={false} />
                  <span>Có</span>
                </div>
                <div className="flex space-x-1">
                  <Checkbox checked={false} />
                  <span>Không áp dụng</span>
                </div>
              </div>
            </div>
            <div className="w-full pl-2">
              <p className="font-bold">Dự kiến:</p>
              <p className="font-bold">Đối với phẫu thuật (PTV):</p>
              <div className="flex space-x-1">
                <Checkbox checked={false} />
                <span>Những chú ý trong phẫu thuật hoặc diễn biến bắt ngờ</span>
              </div>
              <div className="flex space-x-1">
                <Checkbox checked={false} />
                <span>Thời gian phẫu thuật</span>
              </div>
              <div className="flex space-x-1">
                <Checkbox checked={false} />
                <span>Dụng cụ đặt biệt dùng cho phẫu thuật</span>
              </div>
              <div className="flex space-x-1">
                <Checkbox checked={false} />
                <span>Tiên lượng mất máu</span>
              </div>
              <p className="font-bold">Đối với Bác sỹ giây mê:</p>
              <div className="flex space-x-1">
                <Checkbox checked={false} />
                <span>Điều cần chú ý trong giây mê ở người bệnh</span>
              </div>
              <p className="font-bold">Đối với nhóm Điều dưỡng:</p>
              <div className="flex space-x-1">
                <Checkbox checked={false} />
                <span>
                  Xác nhận tình trạng vô khuẩn bằng lời với các loại dụng cụ
                  dùng cho phẫu thuật
                </span>
              </div>
              <div className="flex flex-row space-x-4">
                <span>Thiết bị bị hỏng, bị thiếu: </span>
                <div className="flex space-x-1">
                  <Checkbox checked={false} />
                  <span>Có</span>
                </div>
                <div className="flex space-x-1">
                  <Checkbox checked={false} />
                  <span>Không</span>
                </div>
              </div>
              <p className="font-bold">
                Chẩn đoán hình ảnh thiết yếu được chiếu:
              </p>
              <div className="flex">
                <div className="flex w-1/2 space-x-1">
                  <Checkbox checked={false} />
                  <span>Có</span>
                </div>
                <div className="flex space-x-1">
                  <Checkbox checked={false} />
                  <span>Không áp dụng</span>
                </div>
              </div>
            </div>
          </div>
          {/* Trước khi rời phòng mổ */}
          <div className="flex flex-col w-1/3">
            <div className="w-full border-b border-black pl-2">
              <p className="italic">
                (Điều dưỡng phòng mổ, Bác sĩ gây mê, PTV)
              </p>
              <p className="font-bold">
                Điều dưỡng viên xác nhận lại bằng lời:
              </p>
              <div className="flex space-x-1">
                <Checkbox checked={false} />
                <span>Tên của phương pháp mổ</span>
              </div>
              <div className="flex space-x-1">
                <Checkbox checked={false} />
                <span>Hoàn thành điếm gạc, kim và dụng cụ phẫu thuật</span>
              </div>
              <div className="flex space-x-1">
                <Checkbox checked={false} />
                <span>Các vấn đề về dụng cụ cần giải quyết</span>
              </div>
              <div className="flex flex-col space-x-4">
                <div className="w-full">
                  Dãn nhãn bệnh phẩm (đọc to các nhãn bệnh phẩm bao gồm cả tên
                  người bệnh):{" "}
                </div>
                <div className="flex flex-row">
                  <div className="flex w-1/2 space-x-1">
                    <Checkbox checked={false} />
                    <span>Có</span>
                  </div>
                  <div className="flex space-x-1">
                    <Checkbox checked={false} />
                    <span>Không áp dụng</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full pl-2">
              <p className="font-bold">Đối với PTV, BS giây mê,, điều dưỡng:</p>
              <p>
                Những vấn đền cần lưu ý đặt biệt về hồi tỉnh và chăm sóc sau mổ
              </p>
              <div className="flex-1 bg-dot-line ml-2 h-[100px]"></div>
            </div>
          </div>
        </div>

        {/* Footer at Bottom */}
        <div className="">
          <div className="flex w-2/3 justify-between mt-4 pt-2 text-left">
            <div className="w-1/3 text-left">
              <div className="flex flex-col justify-between text-center">
                <p className="text-sm text-center">ĐD chạy ngoài/vòng ngoài</p>
                <p className="italic">(Ký, ghi rõ họ tên)</p>
                <div className="mt-15"></div>
              </div>
            </div>
            <div className="w-1/3 text-left">
              <div className="flex flex-col justify-between text-center">
                <p className="text-sm text-center">ĐD dụng cụ/vòng trong</p>
                <p className="italic">(Ký, ghi rõ họ tên)</p>
                <div className="mt-15"></div>
              </div>
            </div>
            <div className="flex flex-col justify-between text-center">
              <p className="text-sm text-center">Phẫu thuật viên</p>
              <p className="italic">(Ký, ghi rõ họ tên)</p>
              <div className="mt-15"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
