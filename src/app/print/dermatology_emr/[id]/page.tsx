"use client";

import emrApiRequest from "@/components/emr/emrApiRequest";
import { useAppContext } from "@/providers/app-proviceders";
import { DermatologyEmrPrint } from "@/components/emr/emr-schema";
import { useEffect, useState } from "react";
import { handleErrorApi } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { dateFormater, calculateAge } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { logger } from "@/lib/logger";

export default function Page({ params }: { params: { id: string } }) {
  const dermatologyEmrId = params.id;
  const { setLoadingOverlay } = useAppContext();
  const [data, setData] = useState<DermatologyEmrPrint>();
  const ageMookup = "34";

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
      const res =
        await emrApiRequest.getDermatologyEmrPrintData(dermatologyEmrId);

      logger.debug("Emr print data: ", res);

      if (res?.payload.result) {
        setData(res.payload.result);
      }
    } catch (error) {
      handleErrorApi({ error });
    } finally {
      setLoadingOverlay(false);
    }
  };

  return (
    <>
      <div className="w-[210mm] h-[297mm] p-6 border mx-auto bg-white text-[12px] leading-tight">
        {/* Header */}
        <div className="flex justify-between mb-2">
          <div className="w-[200px]">
            <div className="flex w-full">
              <div>Sở Y tế:</div>{" "}
              <div className="flex-1 bg-dot-line ml-2"></div>
            </div>
            <div className="flex w-full">
              <div>Bệnh viện:</div>{" "}
              <div className="flex-1 bg-dot-line ml-2"></div>
            </div>
            <div className="flex w-full">
              <div>Khoa:</div> <div className="flex-1 bg-dot-line ml-2"></div>
              <div>Giường:</div> <div className="flex-1 bg-dot-line ml-2"></div>
            </div>
          </div>
          <div className="text-xl font-bold uppercase">BỆNH ÁN DA LIỄU</div>
          <div className="text-left">
            <p className="font-bold text-lg"></p>
            <p>MS: 08/BV-01</p>
            <p>Số lưu trữ: ....................</p>
            <p>Mã YT: .... / .... / .... / ....</p>
          </div>
        </div>

        {/* I. HÀNH CHÍNH */}
        <div className="p-2 mb-2 space-y-1">
          <p className="font-bold">I. HÀNH CHÍNH:</p>
          <div className="flex">
            <div className="w-1/2 flex">
              <div>1. Họ và tên:</div>
              <div className="flex-1 bg-dot-line ml-2">
                <span className="font-bold uppercase">
                  {data?.patientInfo.patientName}
                </span>
              </div>
            </div>
            <div className="w-1/2 flex">
              2. Sinh ngày:
              {data?.patientInfo &&
                dateFormater
                  .format(new Date(data?.patientInfo.dateOfBirth))
                  .split("/")
                  .map((chars, index) => (
                    <div key={index} className="flex mr-1">
                      {chars.split("").map((char, i) => (
                        <div key={i} className="dob-box">
                          {char}
                        </div>
                      ))}
                    </div>
                  ))}
              Tuổi:{" "}
              <div className="flex">
                {data?.patientInfo?.dateOfBirth &&
                  calculateAge(new Date(data.patientInfo.dateOfBirth))
                    .toString()
                    .split("")
                    .map((char, index) => (
                      <div key={index} className="dob-box">
                        {char}
                      </div>
                    ))}
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-1/2 flex">
              <div>3. Giới tính:</div>
              <div className="flex-1 ml-2">
                <Checkbox className="inline" /> Nam{" "}
                <Checkbox className="inline ml-2" /> Nữ
              </div>
            </div>
            <div className="w-1/2 flex">
              <div>4. Nghề nghiệp:</div>
              <div className="flex-1 bg-dot-line ml-2"></div>
            </div>
          </div>
          <div className="flex">
            <div className="w-1/2 flex">
              <div>5. Dân tộc:</div>
              <div className="flex-1 bg-dot-line ml-2"></div>
            </div>
            <div className="w-1/2 flex">
              <div>6. Ngoại kiều:</div>
              <div className="flex-1 bg-dot-line ml-2"></div>
            </div>
          </div>
          <div className="flex">
            <div className="w-1/2 flex">
              <div>7. Địa chỉ: Số nhà</div>
              <div className="w-[50px] bg-dot-line"></div>
              <div>Thôn, phố</div>
              <div className="flex-1 bg-dot-line"></div>
            </div>
            <div className="w-1/2 flex">
              <div>Xã, phường</div>
              <div className="flex-1 bg-dot-line"></div>
            </div>
          </div>
          <div className="flex">
            <div className="w-1/2 flex">
              <div>Huyện (Q, Tx)</div>
              <div className="flex-1 bg-dot-line"></div>
            </div>
            <div className="w-1/2 flex">
              <div>Tỉnh, thành phố</div>
              <div className="flex-1 bg-dot-line"></div>
            </div>
          </div>
          <div className="flex">
            <div className="w-1/2 flex">
              <div>8. Nơi làm việc: </div>
              <div className="flex-1 bg-dot-line"></div>
            </div>
            <div className="w-1/2 flex">
              <div>9. Đối tượng: </div>
              <div className="flex-1">
                <Checkbox className="inline" /> BHYT{" "}
                <Checkbox className="inline ml-2" /> Thu phí{" "}
                <Checkbox className="inline ml-2" /> Miễn{" "}
                <Checkbox className="inline ml-2" /> Khác
              </div>
            </div>
          </div>
          <div className="flex">
            <div className="w-1/2 flex">
              <div>10. BHYT giá trị đến ngày</div>
              <div className="w-[50px] bg-dot-line"></div>
              <div>tháng</div>
              <div className="w-[50px] bg-dot-line"></div>
              <div>năm</div>
              <div className="flex-1 bg-dot-line"></div>
            </div>
            <div className="w-1/2 flex">
              <div>Số thẻ BHYT</div>
              <div className="flex-1 bg-dot-line"></div>
            </div>
          </div>
          <div className="flex">
            <div className="w-full h-[50px] bg-dot-line">
              <span className="bg-white">
                11. Họ tên, địa chỉ người nhà khi cần báo tin:
              </span>
            </div>
          </div>
          <div className="flex">
            <div>Điện thoại số:</div>
            <div className="w-[100px] bg-dot-line"></div>
          </div>
        </div>

        {/* II. QUẢN LÝ NGƯỜI BỆNH */}
        <div>
          <p className="font-bold">II. QUẢN LÝ NGƯỜI BỆNH</p>
        </div>
        <div className="border border-black p-0 mb-2 space-y-">
          <div className="flex border-b border-black p-0">
            <div className="w-1/2 flex flex-col border-r border-black p-1 space-y-2">
              <div className="flex">
                12. Vào viện: <div className="w-[30px] bg-dot-line"></div> giờ
                <div className="w-[30px] bg-dot-line"></div>phút, ngày{" "}
                <div className="w-[30px] bg-dot-line"></div> tháng
                <div className="w-[30px] bg-dot-line"></div> năm{" "}
                <div className="w-[30px] bg-dot-line"></div>
              </div>
              <div className="flex">
                <div className="mr-2">13. Trực tiếp vào: </div>
                <Checkbox className="inline" /> Cấp cứu{" "}
                <Checkbox className="inline ml-2" /> KKB{" "}
                <Checkbox className="inline ml-2" /> Khoa điều trị
              </div>
            </div>
            <div className="w-1/2 flex flex-col space-y-2">
              <div className="flex">
                <div className="mr-2">14. Nơi giới thiệu:</div>
                <Checkbox className="inline" /> Cơ quan y tế{" "}
                <Checkbox className="inline ml-2" /> Tự đến{" "}
                <Checkbox className="inline ml-2" /> Khác
              </div>
              <div className="flex">
                <div className="mr-2">- Vào viện do bệnh này lần thứ </div>
                <div className="dob-box"></div>
              </div>
            </div>
          </div>
          <div className="flex p-0">
            <div className="w-1/2 flex flex-col border-r border-black p-1 space-y-2">
              <div className="flex mb-2">
                15. Vào khoa
                <div className="w-[60px] border border-black p-0 ml-1"></div>
                Ng/th/năm
                <div className="w-[60px] border border-black p-0 ml-1"></div>
                Số ngày ĐT:
                <div className="w-[30px] border border-black p-0 ml-1"></div>
              </div>
              <div className="flex flex-col">
                <div className="flex">16. Chuyển khoa:</div>
                <div className="flex ml-8 mb-4">
                  <div className="w-[60px] border border-black p-0 ml-1"></div>
                  Ng/th/năm
                  <div className="w-[60px] border border-black p-0 ml-1"></div>
                  Số ngày ĐT:
                  <div className="w-[30px] border border-black p-0 ml-1"></div>
                </div>
                <div className="flex ml-8 mb-4">
                  <div className="w-[60px] border border-black p-0 ml-1"></div>
                  Ng/th/năm
                  <div className="w-[60px] border border-black p-0 ml-1"></div>
                  Số ngày ĐT:
                  <div className="w-[30px] border border-black p-0 ml-1"></div>
                </div>
                <div className="flex ml-8">
                  <div className="w-[60px] border border-black p-0 ml-1"></div>
                  Ng/th/năm
                  <div className="w-[60px] border border-black p-0 ml-1"></div>
                  Số ngày ĐT:
                  <div className="w-[30px] border border-black p-0 ml-1"></div>
                </div>
              </div>
            </div>
            <div className="w-1/2 flex flex-col space-y-2 pr-1">
              <div className="flex">
                <span className="mr-1">17. Chuyển viện:</span>
                <Checkbox className="inline" /> Tuyến trên{" "}
                <Checkbox className="inline ml-2" /> Tuyến dưới{" "}
                <Checkbox className="inline ml-2" /> Khác
              </div>
              <div className="bg-dot-line h-[50px]">
                <span className="bg-white">- Chuyển đến</span>
              </div>
              <div className="flex">
                18. Ra viện: <div className="w-[30px] bg-dot-line"></div> giờ
                <div className="w-[30px] bg-dot-line"></div>phút, ngày{" "}
                <div className="w-[30px] bg-dot-line"></div> tháng
                <div className="w-[30px] bg-dot-line"></div> năm{" "}
                <div className="w-[30px] bg-dot-line"></div>
              </div>
              <div className="flex ml-2 space-x-2">
                <span>
                  1. Ra viện <Checkbox className="inline" />
                </span>
                <span>
                  2. Xin về
                  <Checkbox className="inline ml-2" />
                </span>
                <span>
                  3. Bỏ về
                  <Checkbox className="inline ml-2" />
                </span>
                <span>
                  4. Đưa về
                  <Checkbox className="inline ml-2" />
                </span>
              </div>
              <div className="flex mb-2">
                <span>19. Tổng số ngày điều trị:</span>
                <div className="flex-1 bg-dot-line"></div>
                <div className="dob-box ml-1"></div>
                <div className="dob-box"></div>
                <div className="dob-box"></div>
              </div>
            </div>
          </div>
        </div>

        {/* III. CHẨN ĐOÁN */}
        <div>
          <p className="font-bold">III. CHẨN ĐOÁN</p>
        </div>
        <div className="flex border border-black p-0 mb-2 space-y-2">
          <div className="w-1/2 flex flex-col border-r border-black p-1 space-y-2 pr-1">
            <div className="flex">
              <span>20. Nơi chuyển đến:</span>
              <div className="flex-1 bg-dot-line"></div>
              <div className="dob-box ml-1"></div>
              <div className="dob-box"></div>
              <div className="dob-box"></div>
              <div className="dob-box"></div>
            </div>
            <div className="flex">
              <span>21. KKB, cấp cứu:</span>
              <div className="flex-1 bg-dot-line"></div>
              <div className="dob-box ml-1"></div>
              <div className="dob-box"></div>
              <div className="dob-box"></div>
              <div className="dob-box"></div>
            </div>
            <div className="flex">
              <span>22. Khi vào khoa điều trị:</span>
              <div className="flex-1 bg-dot-line"></div>
              <div className="dob-box ml-1"></div>
              <div className="dob-box"></div>
              <div className="dob-box"></div>
              <div className="dob-box"></div>
            </div>
            <div className="flex flex-row w-full">
              <div className="flex w-1/2">
                <span>+ Thủ thuật:</span>
                <span className="dob-box"></span>
              </div>
              <div className="flex">
                <span>+ Phẫu thuật:</span>
                <span className="dob-box"></span>
              </div>
            </div>
          </div>
          <div className="w-1/2 flex flex-col p-1">
            <div>23. Ra viện</div>
            <div className="flex">
              <div className="flex-1 h-[50px] bg-dot-line">
                <span className="bg-white">+ Bệnh chính:</span>
              </div>
              <div className="dob-box ml-1"></div>
              <div className="dob-box"></div>
              <div className="dob-box"></div>
              <div className="dob-box"></div>
            </div>
            <div className="flex">
              <div className="flex-1 h-[50px] bg-dot-line">
                <span className="bg-white">+ Bệnh kèm theo:</span>
              </div>
              <div className="dob-box ml-1"></div>
              <div className="dob-box"></div>
              <div className="dob-box"></div>
              <div className="dob-box"></div>
            </div>
            <div className="flex flex-row w-full">
              <div className="flex w-1/2">
                <span>+ Tai biến:</span>
                <span className="dob-box"></span>
              </div>
              <div className="flex">
                <span>+ Biến chứng:</span>
                <span className="dob-box"></span>
              </div>
            </div>
          </div>
        </div>

        {/* IV. TÌNH TRẠNG RA VIỆN */}
        <div>
          <p className="font-bold">IV. TÌNH TRẠNG RA VIỆN</p>
        </div>
        <div className="flex border border-black p-0 mb-2 space-y-1">
          <div className="w-1/3 flex flex-col border-r border-black p-1 space-y-2 pr-1">
            <div className="flex flex-col w-full space-y-1">
              <div className="w-full">24. Kết quả điều trị:</div>
              <div className="flex flex-row w-full justify-between">
                <div className="flex w-[100px] justify-between">
                  <span>1. Khỏi </span>
                  <Checkbox className="inline" />
                </div>
                <div className="flex w-[100px] justify-between">
                  <span>4. Nặng hơn </span>
                  <Checkbox className="inline" />
                </div>
              </div>
              <div className="flex flex-row w-full justify-between">
                <div className="flex w-[100px] justify-between">
                  <span>2. Đỡ, giảm </span>
                  <Checkbox className="inline" />
                </div>
                <div className="flex w-[100px] justify-between">
                  <span>5. Tử vong </span>
                  <Checkbox className="inline" />
                </div>
              </div>
              <div className="flex flex-row w-full justify-between">
                <div className="flex space-x-4">
                  <span>3. Không thay đổi </span>
                  <Checkbox className="inline" />
                </div>
              </div>
            </div>
            <div className="flex flex-col w-full space-y-1">
              <div className="w-full">
                25. Giải phẩu bệnh (khi có sinh thiết):
              </div>
              <div className="flex flex-row w-full justify-between">
                <div className="flex justify-between">
                  <span>1. Lành tính </span>
                  <Checkbox className="inline" />
                </div>
                <div className="flex justify-between">
                  <span>2. Nghi ngờ </span>
                  <Checkbox className="inline" />
                </div>
                <div className="flex justify-between">
                  <span>3. Ác tính </span>
                  <Checkbox className="inline" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-1 flex-col p-1 pr-1">
            <div className="flex">
              26. Tình hình tử vong:{" "}
              <div className="w-[30px] bg-dot-line"></div> giờ
              <div className="w-[30px] bg-dot-line"></div>phút, ngày{" "}
              <div className="w-[30px] bg-dot-line"></div> tháng
              <div className="w-[30px] bg-dot-line"></div> năm{" "}
              <div className="w-[30px] bg-dot-line"></div>
            </div>
            <div className="flex flex-row w-full justify-between">
              <div className="flex justify-between pl-2 pr-6">
                <span>1. Do bệnh </span>
                <Checkbox className="inline" />
              </div>
              <div className="flex justify-between">
                <span>2. Do tai biến điều trị </span>
                <Checkbox className="inline" />
              </div>
              <div className="flex justify-between">
                <span>3. Khác </span>
                <Checkbox className="inline" />
              </div>
            </div>
            <div className="flex flex-row w-full justify-between">
              <div className="flex justify-start pl-2 pr-6 item-start">
                <span>1. Trong 24 giờ vào viện </span>
                <Checkbox className="inline" />
              </div>
              <div className="flex justify-between">
                <span>2. Sau 24 giờ vào viện </span>
                <Checkbox className="inline" />
              </div>
            </div>
            <div className="flex">
              <div className="flex-1 h-[50px] bg-dot-line">
                <span className="bg-white">27. Nguyên nhân tử vong:</span>
              </div>
              <div className="dob-box ml-1"></div>
              <div className="dob-box"></div>
              <div className="dob-box"></div>
              <div className="dob-box"></div>
            </div>
            <div className="flex">
              <div className="bg-dot-line">
                <span className="bg-white">28. Khám nghiệm tử thi:</span>
              </div>
              <div className="dob-box ml-1"></div>
            </div>
            <div className="flex">
              <div className="flex-1 h-[50px] bg-dot-line">
                <span className="bg-white">
                  29. Chẩn đoán giải phẩu tử thi:
                </span>
              </div>
              <div className="dob-box ml-1"></div>
              <div className="dob-box"></div>
              <div className="dob-box"></div>
              <div className="dob-box"></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between h-[100px]">
          <div className="flex flex-col justify-between w-1/3 text-center">
            <p className="font-bold uppercase">Giám đốc bệnh viện</p>
            <div className="flex mt-8 font-semibold">
              Họ và tên: <div className="w-[150px] bg-dot-line"></div>
            </div>
          </div>
          <div className="flex flex-col justify-between w-1/3 text-center">
            <p className="font-bold uppercase">Trưởng khoa</p>
            <div className="flex mt-8 font-semibold">
              Họ và tên: <div className="w-[150px] bg-dot-line"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-[210mm] p-6 border mx-auto bg-white text-[12px] leading-tight">
        <div>
          <p className="font-bold uppercase">A. Bệnh án</p>
        </div>
        <div className="flex">
          <div className="font-bold">I. Lý do vào viện: </div>
          <div className="flex-1 bg-dot-line pl-2">
            {data?.emrInfo.reasonForHospitalization}
          </div>
          <div>Vào ngày thứ</div>
          <div className="bg-dot-line w-[100px] pl-2">
            {data?.emrInfo.dayOfIllness}
          </div>
          <div>của bệnh</div>
        </div>
        <div>
          <p className="font-bold">II. Hỏi bệnh:</p>
        </div>
        <div>
          <span className="font-bold">1. Quá trình bệnh lý: </span>
        </div>
        <div className="bg-dot-line h-[100px]">
          {data?.emrInfo.diseaseProgress}
        </div>
        <div>
          <p className="font-bold">2. Tiền sử bệnh:</p>
        </div>
        <div className="bg-dot-line h-[50px]">
          <span className="bg-white">+ Bản thân: </span>
          <span>{data?.emrInfo.personalMedicalHistory}</span>
        </div>
        <Table className="border text-black">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[5%] border border-black p-1 h-6 text-xs text-black">
                TT
              </TableHead>
              <TableHead className="w-[15%] border border-black p-1 h-6 text-xs text-black">
                Ký hiệu
              </TableHead>
              <TableHead className="w-[30%] border border-black p-1 h-6 text-xs text-black">
                Thời gian (tính theo tháng)
              </TableHead>
              <TableHead className="w-[5%] border border-black p-1 h-6 text-xs text-black">
                TT
              </TableHead>
              <TableHead className="w-[15%] border border-black p-1 h-6 text-xs text-black">
                Ký hiệu
              </TableHead>
              <TableHead className="w-[30%] border border-black p-1 h-6 text-xs text-black">
                Thời gian (tính theo tháng)
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="border border-black p-1 h-6 text-xs text-black">
                01
              </TableCell>
              <TableCell className="border border-black p-1 h-6 text-xs text-black">
                <div className="flex justify-between pr-2">
                  <span>- Dị ứng</span>
                  <span>
                    <Checkbox checked={data?.emrInfo.allergies.length > 0} />
                  </span>
                </div>
              </TableCell>
              <TableCell className="border border-black p-1 h-6 text-xs text-black">
                {data?.emrInfo.allergies}
              </TableCell>
              <TableCell className="border border-black p-1 h-6 text-xs text-black">
                04
              </TableCell>
              <TableCell className="border border-black p-1 h-6 text-xs text-black">
                <div className="flex justify-between pr-2">
                  <span>- Thuốc lá</span>
                  <span>
                    <Checkbox checked={data?.emrInfo.smoking.length > 0} />
                  </span>
                </div>
              </TableCell>
              <TableCell className="border border-black p-1 h-6 text-xs text-black">
                {data?.emrInfo.smoking}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border border-black p-1 h-6 text-xs text-black">
                02
              </TableCell>
              <TableCell className="border border-black p-1 h-6 text-xs text-black">
                <div className="flex justify-between pr-2">
                  <span>- Ma tuý</span>
                  <span>
                    <Checkbox
                      checked={data?.emrInfo.illicitDrugUse.length > 0}
                    />
                  </span>
                </div>
              </TableCell>
              <TableCell className="border border-black p-1 h-6 text-xs text-black">
                {data?.emrInfo.illicitDrugUse}
              </TableCell>
              <TableCell className="border border-black p-1 h-6 text-xs text-black">
                05
              </TableCell>
              <TableCell className="border border-black p-1 h-6 text-xs text-black">
                <div className="flex justify-between pr-2">
                  <span>- Thuốc lào</span>
                  <span>
                    <Checkbox
                      checked={data?.emrInfo.pipeTobaccoUse.length > 0}
                    />
                  </span>
                </div>
              </TableCell>
              <TableCell className="border border-black p-1 h-6 text-xs text-black">
                {data?.emrInfo.pipeTobaccoUse}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border border-black p-1 h-6 text-xs text-black">
                03
              </TableCell>
              <TableCell className="border border-black p-1 h-6 text-xs text-black">
                <div className="flex justify-between pr-2">
                  <span>- Rượu bia</span>
                  <span>
                    <Checkbox checked={data?.emrInfo.alcoholUse.length > 0} />
                  </span>
                </div>
              </TableCell>
              <TableCell className="border border-black p-1 h-6 text-xs text-black">
                {data?.emrInfo.alcoholUse}
              </TableCell>
              <TableCell className="border border-black p-1 h-6 text-xs text-black">
                06
              </TableCell>
              <TableCell className="border border-black p-1 h-6 text-xs text-black">
                <div className="flex justify-between pr-2">
                  <span>- Khác</span>
                  <span>
                    <Checkbox checked={data?.emrInfo.otherUse.length > 0} />
                  </span>
                </div>
              </TableCell>
              <TableCell className="border border-black p-1 h-6 text-xs text-black">
                {data?.emrInfo.otherUse}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <div className="bg-dot-line h-[50px]">
          <span className="bg-white">+ Gia đình: </span>
          <span>{data?.emrInfo.familyMedicalHistory}</span>
        </div>
        <div>
          <p className="font-bold">III. Khám bệnh:</p>
        </div>
        <div>
          <span className="font-bold">1. Toàn thân: </span>
        </div>
        <div className="flex">
          <div className="flex-1 bg-dot-line h-[100px] mr-4">
            {data?.emrInfo.generalExamination}
          </div>
          <div className="w-[150px] border border-black p-1 italic space-y-1">
            <div className="w-full flex">
              Mạch <div className="flex-1 bg-dot-line"></div> lần/ph
            </div>
            <div className="w-full flex">
              Nhiệt độ <div className="flex-1 bg-dot-line"></div> °C
            </div>
            <div className="w-full flex">
              Huyết áp <div className="flex-1 bg-dot-line"></div>/
              <div className="w-[20px] bg-dot-line"></div> mmHg
            </div>
            <div className="w-full flex">
              Nhịp thở <div className="flex-1 bg-dot-line"></div> lần/ph
            </div>
            <div className="w-full flex">
              Cân nặng <div className="flex-1 bg-dot-line"></div> kg
            </div>
          </div>
        </div>
        <div>
          <span className="font-bold">2. Triệu chứng cơ năng: </span>
        </div>
        <div className="bg-dot-line h-[50px]">
          {data?.emrInfo.subjectiveSymptoms}
        </div>
        <div>
          <span className="font-bold">3. Thương tổn căn bản: </span>
        </div>
        <div className="bg-dot-line h-[150px]">
          {data?.emrInfo.primaryLesions}
        </div>
        <div>
          <span className="font-bold">4. Các cơ quan: </span>
        </div>
        <div className="bg-dot-line h-[50px]">
          <span className="bg-white">
            + Tuần hoàn: {data?.emrInfo.cardiovascularSystem}
          </span>
        </div>
        <div className="bg-dot-line h-[50px]">
          <span className="bg-white">
            + Hô hấp: {data?.emrInfo.respiratorySystem}
          </span>
        </div>
        <div className="bg-dot-line h-[50px]">
          <span className="bg-white">
            + Tiêu hoá: {data?.emrInfo.digestiveSystem}
          </span>
        </div>
        <div className="bg-dot-line h-[50px]">
          <span className="bg-white">
            + Thận-Tiết niệu-sinh dục: {data?.emrInfo.genitourinarySystem}
          </span>
        </div>
        <div className="bg-dot-line h-[50px]">
          <span className="bg-white">
            + Thần kinh ngoại biên: {data?.emrInfo.peripheralNervousSystem}
          </span>
        </div>
        <div className="bg-dot-line h-[75px]">
          <span className="bg-white">
            + Cơ quan khác: {data?.emrInfo.otherOrgans}
          </span>
        </div>
        <div>
          <p className="font-bold">IV. Chẩn đoán khi vào khoa điều trị:</p>
        </div>
        <div className="space-y-2">
          <div className="bg-dot-line">
            <span className="bg-white">
              + Bệnh chính: {data?.emrInfo.primaryDiagnosis}
            </span>
          </div>
          <div className="bg-dot-line">
            <span className="bg-white">
              + Bệnh kèm theo (nếu có): {data?.emrInfo.secondaryDiagnosis}
            </span>
          </div>
          <div className="bg-dot-line">
            <span className="bg-white">
              + Phân biệt: {data?.emrInfo.differentialDiagnosis}
            </span>
          </div>
        </div>
        <div className="bg-dot-line h-[50px] mt-2">
          <span className="font-bold bg-white">V. Tiên lượng:</span>
          <span className="pl-2">{data?.emrInfo.prognosis}</span>
        </div>
        <div className="bg-dot-line h-[75px] mt-2">
          <span className="font-bold bg-white">VI. Hướng điều trị:</span>
          <span className="pl-2">{data?.emrInfo.treatmentPlan}</span>
        </div>
        <div>
          <p className="font-bold uppercase">B. Tổng kết bệnh án</p>
        </div>
        <div className="border border-black p-2">
          <div className="bg-dot-line h-[150px] mt-2">
            <span className="font-bold bg-white">
              1. Quá trình bệnh lý và diễn biến lân sàng:
            </span>
            <span className="pl-2">{data?.emrInfo.clinicalCourse}</span>
          </div>
          <div className="bg-dot-line h-[75px] mt-2">
            <span className="font-bold bg-white">
              2. Tóm tắt kết quả xét nghiệm lâm sàng có giá trị chẩn đoán:
            </span>
            <span className="pl-2">
              {data?.emrInfo.diagnosticParaclinicalSummary}
            </span>
          </div>
          <div className="bg-dot-line h-[75px] mt-2">
            <span className="font-bold bg-white">3. Phương pháp điều trị:</span>
            <span className="pl-2">{data?.emrInfo.treatmentMethod}</span>
          </div>
          <div className="bg-dot-line h-[75px] mt-2">
            <span className="font-bold bg-white">
              4. Tình trạng người bệnh ra viện:
            </span>
            <span className="pl-2">{data?.emrInfo.dischargeCondition}</span>
          </div>
          <div className="bg-dot-line h-[75px] mt-2">
            <span className="font-bold bg-white">
              5. Hướng điều trị và các chế độ tiếp theo:
            </span>
            <span className="pl-2">{data?.emrInfo.postDischargePlan}</span>
          </div>
        </div>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell
                colSpan={2}
                className="text-center border border-black font-bold p-1"
              >
                Hồ sơ, phim, ảnh
              </TableCell>
              <TableCell
                rowSpan={4}
                className="border border-black align-top p-2 text-sm p-1"
              >
                <div className="flex h-[100px] flex-col justify-between">
                  <span className="font-bold">Người giao hồ sơ:</span>
                  <br />
                  <div className="bg-dot-line">
                    <span className="bg-white">Họ tên:</span>
                  </div>
                </div>
              </TableCell>
              <TableCell
                rowSpan={8}
                className="text-center border border-black font-bold p-1"
              >
                Ngày .... tháng ..... năm ......
                <br />
                Bác sỹ điều trị
                <div className="mt-12">
                  Họ tên ....................................
                </div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border border-black text-center p-1">
                Loại
              </TableCell>
              <TableCell className="border border-black text-center p-1">
                Số tờ
              </TableCell>
            </TableRow>
            {/* Danh sách loại hồ sơ */}
            <TableRow>
              <TableCell className="border border-black p-1">
                {"- X - quang"}
              </TableCell>
              <TableCell className="border border-black p-1"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border border-black p-1">
                {"- CT Scanner"}
              </TableCell>
              <TableCell className="border border-black p-1"></TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="border border-black p-1">
                {"- Siêu âm"}
              </TableCell>
              <TableCell className="border border-black p-1"></TableCell>
              <TableCell
                rowSpan={4}
                className="border border-black align-top p-2 text-sm p-1"
              >
                <div className="flex h-[100px] flex-col justify-between">
                  <span className="font-bold">Người nhận hồ sơ:</span>
                  <br />
                  <div className="bg-dot-line">
                    <span className="bg-white">Họ tên:</span>
                  </div>
                </div>
              </TableCell>
            </TableRow>
            {["- Xét nghiệm", "- Khác ……………………..", "- Toàn bộ hồ sơ"].map(
              (type, i) => (
                <TableRow key={i}>
                  <TableCell className="border border-black p-1">
                    {type}
                  </TableCell>
                  <TableCell className="border border-black p-1"></TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
