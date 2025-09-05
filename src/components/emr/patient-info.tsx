"use client";

import {
  PatientInfo as PatientInfoType,
  CheckInOutInfo,
} from "@/components/emr/emr-schema";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface PatientInfoProp {
  patientInfo: PatientInfoType;
  checkInOutInfo: CheckInOutInfo;
}

const dateFormater = new Intl.DateTimeFormat("vi-VN", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Ho_Chi_Minh",
});

export default function PatientInfo({
  patientInfo,
  checkInOutInfo,
}: PatientInfoProp) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Thông tin bệnh nhân</CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="w-full flex">
          <div className="w-1/3">
            <p className="">
              Mã bệnh nhân: <strong>{patientInfo?.patientCode}</strong>
            </p>
          </div>
          <div className="w-2/3">
            <p className="">
              Tên bệnh nhân: <strong>{patientInfo?.name}</strong>
            </p>
          </div>
        </div>
        <div className="w-full flex">
          <div className="w-1/3">
            <p className="">
              Số điện thoại: <strong>{patientInfo?.phoneNumber}</strong>
            </p>
          </div>
          <div className="w-2/3">
            <p className="">
              Địa chỉ: <strong>{patientInfo?.address}</strong>
            </p>
          </div>
        </div>
        <div className="w-full flex">
          <div className="w-1/3">
            <p className="">
              Ngày vào:{" "}
              <strong>
                {checkInOutInfo &&
                  dateFormater.format(new Date(checkInOutInfo.checkInDate))}
              </strong>
            </p>
          </div>
          <div className="w-1/3">
            <p className="">
              Ngày ra:{" "}
              <strong>
                {checkInOutInfo &&
                  dateFormater.format(new Date(checkInOutInfo.checkOutDate))}
              </strong>
            </p>
          </div>
          <div className="w-1/3">
            <p className="">
              Mã đợt điều trị:{" "}
              <strong>
                {checkInOutInfo && checkInOutInfo.checkInOutHospitalRecordId}
              </strong>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
