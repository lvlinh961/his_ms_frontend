"use client";

import { useEffect, useState } from "react";
import apiRequest from "./emrApiRequest";
import { EmrItem, EmrDocumentTypeMap } from "./emr-schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import {
  Signature,
  Eye,
  PencilOff,
  SquareX,
  FolderClosed,
  FolderOpenDot,
} from "lucide-react";
import AddDocumentForm from "./add-document-form";
import { Input } from "../ui/input";
import { toast } from "sonner";
import {
  PatientInfo as PatientInfoType,
  CheckInOutInfo,
} from "@/components/emr/emr-schema";

interface EmrListProps {
  setFileUrl: (fileName: string) => void;
  setPatientInfo: (info: PatientInfoType) => void;
  setCheckInOutInfo: (info: CheckInOutInfo) => void;
}

export default function EmrList({
  setFileUrl,
  setPatientInfo,
  setCheckInOutInfo,
}: EmrListProps) {
  const [patientCode, setPatientCode] = useState("");
  const [emrList, setEmrList] = useState(null);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});
  const dateFormater = new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  });

  const toggleGroup = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const groupBy = <T, K extends keyof any>(array: T[], key: (item: T) => K) =>
    array.reduce(
      (result, item) => {
        (result[key(item)] ||= []).push(item);
        return result;
      },
      {} as Record<K, T[]>
    );

  const fetchEmr = async () => {
    try {
      const response = await apiRequest.getListEmr(patientCode);

      if (response?.payload?.code != 200) {
        toast.error("Có lỗi", {
          description: "Không tồn tại đợt điều trị của bệnh nhân!",
        });
      }

      const data = response?.payload.result?.listEmrItems;
      // const groupByType = groupBy(data, (data) => data.documentType);
      const groupedData = data.reduce(
        (acc, item) => {
          acc[item.documentType] = acc[item.documentType] || [];
          acc[item.documentType].push(item);
          return acc;
        },
        {} as Record<string, EmrItem[]>
      );
      setEmrList(groupedData);
      setPatientInfo(response?.payload.result?.patientInfo);
      setCheckInOutInfo(response?.payload.result?.checkInOutInfo);
    } catch (err) {
      console.log("LINH: ", err);
      // toast.error("Có lỗi", {
      //   description: "Không tồn tại đợt điều trị của bệnh nhân!",
      // });
      toast("Không tồn tại đợt điều trị của bệnh nhân!");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      fetchEmr();
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row w-full justify-between p-3">
        <Input
          className="w-300"
          type="text"
          placeholder="Nhập mã bệnh nhân"
          onKeyDown={handleKeyDown}
          onChange={(e) => setPatientCode(e.target.value)}
        />
        <AddDocumentForm />
      </div>
      <Table>
        <TableHeader className="bg-gray-500">
          <TableRow>
            <TableHead className="w-5/10 text-white-500 font-bold">
              Chi tiết
            </TableHead>
            <TableHead className="w-3/10 text-white-500 font-bold">
              Ngày
            </TableHead>
            <TableHead className="w-3/10 text-white-500 font-bold">
              Đã ký
            </TableHead>
            <TableHead className="w-1/10 text-white-500 font-bold">
              Ký số
            </TableHead>
            <TableHead className="w-1/10 text-white-500 font-bold">
              Huỷ ký
            </TableHead>
            <TableHead className="w-1/10 text-white-500 font-bold">
              Xem
            </TableHead>
            <TableHead className="w-1/10 text-white-500 font-bold">
              Xoá
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emrList &&
            Object.entries(emrList).map(([key, items]) => (
              <Collapsible key={key} asChild>
                <>
                  <CollapsibleTrigger asChild>
                    <TableRow
                      onClick={() => toggleGroup(key)}
                      className="cursor-pointer bg-gray-200"
                    >
                      <TableCell colSpan={7}>
                        <div className="flex w-full">
                          {expanded[key] && <FolderOpenDot className="mr-2" />}
                          {!expanded[key] && <FolderClosed className="mr-2" />}
                          <span className="mt-1">
                            {EmrDocumentTypeMap[key]}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  </CollapsibleTrigger>
                  {expanded[key] && (
                    <CollapsibleContent asChild>
                      <>
                        {(items as EmrItem[]).map((item, index) => (
                          <TableRow key={index}>
                            <TableCell className="w-5/10">
                              {index + 1}. {item.documentName}
                            </TableCell>
                            <TableCell>
                              {dateFormater.format(new Date(item.date))}
                            </TableCell>
                            <TableCell>
                              {dateFormater.format(new Date(item.signedDate))}
                            </TableCell>
                            <TableCell>
                              <Signature className="text-blue-500" />
                            </TableCell>
                            <TableCell>
                              <PencilOff className="text-gray-500" />
                            </TableCell>
                            <TableCell>
                              <Eye
                                className="cursor-pointer"
                                onClick={() => setFileUrl(item.path)}
                              />
                            </TableCell>
                            <TableCell className="w-1/10">
                              <SquareX className="text-red-500" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    </CollapsibleContent>
                  )}
                </>
              </Collapsible>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
