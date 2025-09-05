"use client";
import { useState } from "react";
import "../../globals.css";
import {
  InternalMedicineDepartment,
  ForeignMedicineDepartment,
  GynecologyMedicineDepartment,
} from "@/components/medical-profile";
import { mediacalSelect } from "@/constants/data";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppContext } from "@/providers/app-proviceders";

import { ScrollArea } from "@/components/ui/scroll-area";

export default function Page() {
  const [department, setDeparment] = useState<string | null>("");
  const { setLoadingOverlay } = useAppContext();
  const handleChangeMedical = (value: string) => {
    setLoadingOverlay(true);
    setTimeout(() => {
      // Giả lập setTimeout để test
      setDeparment(value);
      setLoadingOverlay(false);
    }, 1000);
  };

  return (
    <>
      <ScrollArea className="h-[calc(100vh-40px)] p-2">
        <div className="flex-1 md:p-4 w-full h-full">
          <p>
            Thông báo: Từ 13h ngày 23/01/2018, các bác sĩ vui lòng nhập ĐẦY ĐỦ
            các trường bắt buộc(*) trong HSBA.
          </p>

          <br />
          <div className="inline-flex w-full">
            {/* Left select box */}
            <div className="inline-flex content-center">
              <div className="sm:flex md:inline-flex pb-2">
                <div className="content-center pr-3">
                  <span>Tạo bệnh án mới</span>
                </div>
                <div className="min-[426px]:pr-5 grow">
                  <Select
                    onValueChange={(value: string) =>
                      handleChangeMedical(value)
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Chọn bệnh án" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {mediacalSelect.length &&
                          mediacalSelect.map((item: any, index: number) => {
                              return (
                                <SelectItem key={index} value={item.value}>
                                  {item.title}
                                </SelectItem>
                              );
                          })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            {/* Right select box */}
            <div className="inline-flex content-center ml-auto">
              <div className="sm:flex md:inline-flex pb-2">
                <div className="content-center pr-3">
                  <span>Bệnh án của bệnh nhân</span>
                </div>
                <div className="min-[426px]:pr-5 grow">
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Chọn bệnh án" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="1">Bệnh án nội khoa</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          {/* check and include components */}
          {department === "internal" && <InternalMedicineDepartment />}
          {department === "foreign" && <ForeignMedicineDepartment />}
          {department === "gynecology" && <GynecologyMedicineDepartment />}

          {/* { department === 'internal' && (<InternalMedicineDepartment />)}
          { department === 'foreign' && (<ForeignMedicineDepartment />)} */}
        </div>
      </ScrollArea>
    </>
  );
}
