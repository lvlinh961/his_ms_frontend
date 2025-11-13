"use client";

import z from "zod";
import {
  DocumentTypeEnum,
  AcceptSurgeryTicketFormSchema,
  SurgeryTypeEnum,
  SurgeryTypeLabels,
  SurgeryMethodEnum,
  SurgeryMethodLabels,
  DisinterestedMethodEnum,
  DisinterestedMethodLabels,
  RiskOfAccidentEnum,
  RiskOfAcciedentLabels,
} from "@/components/surgery/surgery.types";
import { useEffect, useState } from "react";
import { useAppContext } from "@/providers/app-proviceders";
import { handleErrorApi } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import surgeryApiRequest from "@/components/surgery/surgeryApiRequest";

export default function AcceptSurgeryTicket({
  ticketId,
  documentType,
}: {
  ticketId: string;
  documentType: z.infer<typeof DocumentTypeEnum>;
}) {
  const [data, setData] = useState<AcceptSurgeryTicketFormSchema>();
  const { setLoadingOverlay } = useAppContext();

  useEffect(() => {
    console.log("ticketId", ticketId);
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
      const res = await surgeryApiRequest.getAcceptSurgeryTicket(
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
          <div className="text-md text-center font-bold uppercase">
            <p>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p>Độc lập - Tự do - Hạnh phúc</p>
          </div>
          <div className="text-left">
            <p className="font-bold text-lg"></p>
            <p>MS: 01/BV2</p>
          </div>
        </div>

        <div className="mt-10 text-lg text-center font-bold uppercase">
          <p>
            GIẤY CAM KẾT CHẤP THUẬN <br /> PHẪU THUẬT, THỦ THUẬT VÀ GÂY MÊ HỒI
            SỨC
          </p>
          <div className="flex w-full justify-center text-xs gap-4 mt-2">
            {SurgeryTypeEnum.options.map((option) => (
              <div key={option}>
                <Checkbox checked={data?.data.surgeryType == option} />{" "}
                <span>{SurgeryTypeLabels[option]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 p-2 mb-2 space-y-1 text-sm">
          <p>Chúng tôi có tên dưới đây cùng làm Bản cam kết như sau:</p>
          <p className="font-bold">
            I. BÁC SỸ PHẪU THUẬT/THỦ THUẬT/GÂY MÊ HỒI SỨC:{" "}
          </p>
          <div className="flex">
            <div className="w-full flex">
              <div>Tôi tên là:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="font-bold uppercase">
                  {data?.data?.doctor.name}
                </span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-1/2 flex">
              <div>Chức danh:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.doctor.title}</span>
              </div>
            </div>
            <div className="w-1/2 flex">
              <div>Khoa:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.doctor.department}</span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-2/5 flex">
              <div>và Bác Sỹ:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.doctor.name}</span>
              </div>
            </div>
            <div className="w-1/5 flex">
              <div>Chức danh:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.otherDoctor.name}</span>
              </div>
            </div>
            <div className="w-2/5 flex">
              <div>(Khoa: {data?.data?.otherDoctor?.department})</div>
            </div>
          </div>
          <div className="flex">
            <div className="w-full flex">
              <div>
                Được phân công thực hiện phẫu thuật/thủ thuật/gây mê cho người
                bệnh:
              </div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.patient?.name}</span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-full flex">
              <div>Chẩn đoán: </div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.diagnosis}</span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-full flex flex-col">
              <div>
                Chúng tôi đã tư vấn, giải thích đầy đủ, rõ ràng những thông tin
                liên quan đến cuộc phẫu thuật/thủ thuật/gây mê hồi sức cho người
                bệnh/thân nhân người bệnh về các vấn đề sau:{" "}
              </div>
              <div className="mt-2">
                <Checkbox checked={data?.data?.explanationOfDiagnosis} />{" "}
                <span>Chẩn đoán</span>
              </div>
              <div className="mt-2">
                <Checkbox checked={data?.data?.explanationOfSurgeryReason} />{" "}
                <span>Lý do phẫu thuật/thủ thuật</span>
              </div>
              <div className="mt-2">
                <Checkbox checked={data?.data?.explanationOfRisks} />{" "}
                <span>
                  Rủi ro, nguy cơ nếu không thực hiện phẫu thuật/thủ thuật
                </span>
              </div>
              <div className="flex mt-2">
                <Checkbox
                  checked={data?.data?.explanationOfExpectedResults.length > 0}
                />{" "}
                <div>Kết quả sau phẫu thuật/thủ thuật (Dự kiến)</div>
                <div className="flex-1 bg-dot-line ml-2">
                  <span className="">
                    {data?.data?.explanationOfExpectedResults}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <p>Phương pháp phẫu thuật/thủ thuật dự kiến:</p>
          <div className="flex w-full text-xs gap-4 mt-2">
            {SurgeryMethodEnum.options.map((option) => (
              <div key={option}>
                <Checkbox checked={data?.data.surgeryMethod == option} />{" "}
                <span>{SurgeryMethodLabels[option]}</span>
              </div>
            ))}
          </div>
          <p>Phương pháp gây mê hồi sức dự kiến:</p>
          <div className="flex flex-row flex-wrap w-full text-xs mt-2">
            {DisinterestedMethodEnum.options.map((option) => (
              <div className="w-1/3" key={option}>
                <Checkbox checked={data?.data.disinterestedMethod == option} />{" "}
                <span>{DisinterestedMethodLabels[option]}</span>
              </div>
            ))}
          </div>
          <p>Các phương pháp điều trị khác ngoài phẫu thuật/thủ thuật:</p>
          <div className="flex flex-row flex-wrap w-full text-xs mt-2">
            <div className="w-1/3">
              <Checkbox checked={data?.data.otherMethod.length <= 0} />{" "}
              <span>Không</span>
            </div>
            <div className="flex flex-1">
              <Checkbox checked={data?.data?.otherMethod.length > 0} />{" "}
              <div>Có, cụ thể:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.otherMethod}</span>
              </div>
            </div>
          </div>
          <p>
            Nguy cơ, tai biến trong và sau phẫu thuật/thủ thuật có thể xảy ra:
          </p>
          <div className="flex flex-row flex-wrap w-full text-xs mt-2">
            {RiskOfAccidentEnum.options.map((option) => (
              <div className="w-1/3" key={option}>
                <Checkbox checked={data?.data.riskOfAccident == option} />{" "}
                <span>{RiskOfAcciedentLabels[option]}</span>
              </div>
            ))}
            <div className="flex w-1/3">
              <Checkbox checked={data?.data.otherRisk.length > 0} />{" "}
              <div>Nguy cơ/rủi ro khác:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.otherRisk}</span>
              </div>
            </div>
          </div>
          <p>
            Chúng tôi đã dành đủ thời gian để người bệnh/thân nhân đặt các câu
            hỏi liên quan đến phẫu thuật/thủ thuật/gây mê sẽ được thực hiện hoặc
            các mối quan tâm khác và chúng tôi đã trả lời tất cả các câu hỏi đó.{" "}
          </p>
          <p>
            Chúng tôi cam kết phục vụ người bệnh bằng lương tâm và trách nhiệm
            của người thầy thuốc cùng với tất cả kiến thức, sự hiểu biết về
            chuyên môn và phương tiện hiện có của (Tên cơ sở khám bệnh, chữa
            bệnh)
            .............................................................................................
            để nỗ lực đem lại kết quả tốt nhất cho người bệnh.
          </p>
          <p className="font-bold">II. NGƯỜI BỆNH/THÂN NHÂN: </p>
          <div className="flex">
            <div className="w-3/4 flex">
              <div>Họ và tên người bệnh:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.patient.name}</span>
              </div>
            </div>
            <div className="w-1/4 flex">
              <div>Năm sinh:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.patient.dateOfBirth}</span>
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-3/4 flex">
              <div>Họ và tên thân nhân:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.relative.name}</span>
              </div>
            </div>
            <div className="w-1/4 flex">
              <div>Năm sinh:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="">{data?.data?.relative.dateOfBirth}</span>
              </div>
            </div>
          </div>
          <p>
            Tôi đã được nghe các Bác sỹ giải thích và đã trao đổi với các Bác sỹ
            về tất cả các thông tin của cuộc phẫu thuật/thủ thuật/gây mê, những
            nguy cơ thường gặp có thể xảy ra trong phẫu thuật/thủ thuật/gây mê
            như:
            .....................................................................................................................................................................................
            ...................................................................................................................................................................................
            và mức độ thành công. Tôi đã hiểu lý do phải thực hiện phẫu
            thuật/thủ thuật/gây mê và đồng ý để Bác sỹ phẫu thuật/thủ thuật/gây
            mê cho tôi/thân nhân của tôi.
          </p>
          <p>
            Tôi đã được tư vấn những thông tin về chi phí phẫu thuật/thủ
            thuật/gây mê, vật tư y tế tiêu hao dự kiến sử dụng trong cuộc phẫu
            thuật/thủ thuật/gây mê, tôi cam kết chi trả chi phí khám bệnh, chữa
            bệnh ngoài phạm vi được hưởng và mức hưởng theo quy định của pháp
            luật về bảo hiểm y tế và các quy định khác.
          </p>
          <p>
            Tôi đồng ý để các Bác sỹ thực hiện các phẫu thuật/thủ thuật/gây
            mê/kiểm tra/điều trị nếu việc đó là cần thiết để cứu tính mạng hoặc
            ngăn ngừa tác hại nghiêm trọng cho sức khỏe của tôi/thân nhân của
            tôi.
          </p>
          <p>
            Tôi hiểu rằng các Bác sỹ của (tên cơ sở khám bệnh, chữa bệnh
            )........................................... sẽ làm hết lương tâm,
            trách nhiệm cùng với tất cả kiến thức, sự hiểu biết và phương tiện
            hiện có để nỗ lực đem lại kết quả tốt nhất cho tôi/thân nhân của
            tôi. Tuy nhiên, cũng không thể đảm bảo hoàn toàn với tôi rằng phẫu
            thuật/thủ thuật sẽ cải thiện tình trạng hoặc không làm cho tình
            trạng của tôi/ thân nhân của tôi trở nên xấu đi.{" "}
          </p>
          <p>
            Tôi đã đọc bản cam kết với tinh thần hoàn toàn minh mẫn và hiểu
            biết. Tôi đã hiểu các vấn đề mà Bác sỹ đã giải thích về tiến trình
            phẫu thuật/thủ thuật/gây mê cho tôi/thân nhân của tôi. Tôi xin hoàn
            toàn chịu trách nhiệm với quyết định đồng ý cho Bác sỹ phẫu
            thuật/thủ thuật cho tôi/thân nhân của tôi.
          </p>
          <p>
            Sau khi nghe các Bác sỹ cho biết tình trạng bệnh của tôi/thân nhân
            của tôi, những nguy hiểm của bệnh nếu không thực hiện phẫu thuật/thủ
            thuật/gây mê hồi sức và những rủi ro có thể xảy ra do bệnh tật, do
            khi tiến hành phẫu thuật/thủ thuật/gây mê hồi sức; tôi tự nguyện
            viết giấy cam đoan này:
          </p>
          <div className="flex flex-col text-center w-full">
            <p className="mt-4">
              1. Đồng ý xin phẫu thuật, thủ thuật, gây mê hồi sức và để giấy này
              làm bằng chứng.
            </p>
            <p>
              2. Không đồng ý phẫu thuật, thủ thuật, gây mê hồi sức và để giấy
              này làm bằng chứng.
            </p>
            <p>
              (Câu 1 và câu 2 do người bệnh, thân nhân của người bệnh tự viết
              dưới đây).
            </p>
            <p className="mt-4">
              .....................................................................................................................................................................................
            </p>
          </div>
          <div className="flex">
            <div className="flex-1 bg-dot-line ml-2">
              <span className=""></span>
            </div>
          </div>

          {/* Footer at Bottom */}
          <div className="pt-6">
            <div className="flex w-full justify-between mt-4 pt-2 text-right">
              <div className="w-1/2 text-left">
                <p className="text-sm text-center font-bold uppercase">
                  Phẫu thuật viên/ <br />
                  Bác sỹ thực hiện phẫu thuật
                </p>
                <p className="font-italic text-center">(Ký, ghi rõ họ tên)</p>
                <p className="mt-15"></p>
              </div>
              <div className="flex flex-col justify-between w-1/2 text-center">
                <p>Ngày .... tháng ..... năm ......</p>
                <p className="text-sm text-center font-bold uppercase">
                  Người bệnh/Thân nhân
                </p>
                <p className="font-italic">(Ký, ghi rõ họ tên)</p>
                <p className="mt-15"></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
