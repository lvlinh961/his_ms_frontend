"use client";

import EmrList from "@/components/emr/emr-list";
import PatientInfo from "@/components/emr/patient-info";
import { useState } from "react";
import { Files } from "lucide-react";
import {
  PatientInfo as PatientInfoType,
  CheckInOutInfo,
} from "@/components/emr/emr-schema";

export default function Page() {
  const [fileUrl, setFileUrl] = useState("");
  const [patientInfo, setPatientInfo] = useState<PatientInfoType>();
  const [checkInOutInfo, setCheckInOutInfo] = useState<CheckInOutInfo>();

  const openFile = (filename: string) => {
    setFileUrl("/api/hsba_file?filename=" + filename);
  };

  const setPatient = (info: PatientInfoType) => {
    setPatientInfo(info);
  };

  const setCheckInOut = (info: CheckInOutInfo) => {
    setCheckInOutInfo(info);
  };

  return (
    <div className="flex w-full h-screen">
      <div className="w-1/2 flex items-start justify-center">
        <EmrList
          setFileUrl={openFile}
          setPatientInfo={setPatient}
          setCheckInOutInfo={setCheckInOut}
        />
      </div>
      <div className="w-1/2 flex flex-col border items-center justify-center">
        <div className="flex-4 w-full">
          <PatientInfo
            patientInfo={patientInfo}
            checkInOutInfo={checkInOutInfo}
          />
        </div>
        <div className="flex flex-1 w-full items-center justify-center">
          {fileUrl && (
            <iframe src={fileUrl} className="w-full h-full border shadow-lg" />
          )}
          {!fileUrl && <Files size={200} />}
        </div>
      </div>
    </div>
  );
}
