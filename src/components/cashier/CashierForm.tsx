"use client";

import { useEffect, useState } from "react";
import { groupBy, dateFormater } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { Key, X } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

type PatientInfo = {
  name: string;
  date_of_birth: Date;
  gender: string;
  address: string;
  reason: string;
};

const patientInfo: PatientInfo = {
  name: "Nguyễn Văn A",
  date_of_birth: new Date("1990-09-02"),
  address: "411/20/1 Lê Đức Thọ, Phường 17, Quận Gò Vấp, Thành Phố Hồ Chí Minh",
  reason: "Cảm thấy không khoẻ",
  gender: "Nam",
} satisfies PatientInfo;

type ServiceAppointment = {
  code: string;
  name: string;
  type: string;
  price: number;
  unit: string;
  quantity: number;
  status: string;
};

const serviceAppointments: ServiceAppointment[] = [
  {
    code: "KHA001",
    name: "Khám bệnh",
    type: "Khám bệnh",
    price: 150000,
    unit: "Lần",
    quantity: 1,
    status: "Chưa thanh toán",
  },
  {
    code: "XN001",
    name: "Xét nghiệm máu",
    type: "Xét nghiệm",
    price: 180000,
    unit: "Lần",
    quantity: 1,
    status: "Chưa thanh toán",
  },
];

// const groupByType = groupBy(data, (data) => data.documentType);

export default function CashierForm() {
  const [services, setServices] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const toggleGroup = (key: string) => {
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const totalPrice = serviceAppointments.reduce((total, item) => {
      total += item.quantity * item.price;
      return total;
    }, 0);

    setTotalPrice(totalPrice);

    const groupedService = groupBy(
      serviceAppointments,
      (serviceAppointments) => serviceAppointments.type
    );
    setServices(groupedService);
  }, []);

  return (
    <div className="flex flex-col items-start justify-end p-4">
      <fieldset className="w-full border border-border rounded-lg p-4 text-base gap-10">
        <legend className="font-bold">Thông tin bệnh nhân</legend>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p>
              Tên bệnh nhân: <strong>{patientInfo?.name}</strong>
            </p>
          </div>
          <div>
            <p>
              Ngày sinh:{" "}
              <strong>
                {patientInfo && dateFormater.format(patientInfo.date_of_birth)}
              </strong>
            </p>
          </div>
          <div>
            <p>
              Giới tính: <strong>{patientInfo?.gender}</strong>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div>
            <p>
              Địa chỉ: <strong>{patientInfo?.address}</strong>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div>
            <p>
              Lý do khám: <strong>{patientInfo?.reason}</strong>
            </p>
          </div>
        </div>
      </fieldset>

      <Table className="mt-4">
        <TableHeader className="bg-[hsl(var(--color-custom-1))] rounded-md">
          <TableRow>
            <TableHead className="text-[hsl(var(--text-color))] font-bold">
              #
            </TableHead>
            <TableHead className="text-[hsl(var(--text-color))] font-bold">
              Mã
            </TableHead>
            <TableHead className="text-[hsl(var(--text-color))] font-bold">
              Tên dịch vụ
            </TableHead>
            <TableHead className="text-[hsl(var(--text-color))] font-bold">
              Số lượng
            </TableHead>
            <TableHead className="text-[hsl(var(--text-color))] font-bold">
              Đơn vị
            </TableHead>
            <TableHead className="text-[hsl(var(--text-color))] font-bold">
              Đơn giá
            </TableHead>
            <TableHead className="text-[hsl(var(--text-color))] font-bold">
              Thành tiền
            </TableHead>
            <TableHead className="text-[hsl(var(--text-color))] font-bold">
              Thao tác
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services &&
            Object.entries(services).map(([key, items]) => (
              <Collapsible key={key} asChild>
                <>
                  <CollapsibleTrigger asChild>
                    <TableRow
                      onClick={() => toggleGroup(key)}
                      className="cursor-pointer bg-gray-200"
                    >
                      <TableCell colSpan={8}>
                        <div className="flex w-full">
                          <span className="mt-1">{key}</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  </CollapsibleTrigger>
                  {expanded[key] && (
                    <CollapsibleContent asChild>
                      <>
                        {(items as ServiceAppointment[]).map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{item.code}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>
                              {Intl.NumberFormat("vi-VN").format(item.quantity)}
                            </TableCell>
                            <TableCell>{item.unit}</TableCell>
                            <TableCell>
                              {Intl.NumberFormat("vi-VN").format(item.price)}
                            </TableCell>
                            <TableCell>
                              {Intl.NumberFormat("vi-VN").format(
                                item.price * item.quantity
                              )}
                            </TableCell>
                            <TableCell>
                              <X className="text-red-500" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </>
                    </CollapsibleContent>
                  )}
                </>
              </Collapsible>
            ))}
          {/* {serviceAppointments &&
            serviceAppointments.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>
                  {Intl.NumberFormat("vi-VN").format(item.quantity)}
                </TableCell>
                <TableCell>{item.unit}</TableCell>
                <TableCell>
                  {Intl.NumberFormat("vi-VN").format(item.price)}
                </TableCell>
                <TableCell>
                  {Intl.NumberFormat("vi-VN").format(
                    item.price * item.quantity
                  )}
                </TableCell>
              </TableRow>
            ))} */}
        </TableBody>
      </Table>

      <div className="flex flex-col w-full items-end justify-end">
        <div>
          <p>
            Thành tiền (VNĐ):{" "}
            <strong className="text-lg">
              {Intl.NumberFormat("vi-VN").format(totalPrice)}
            </strong>
          </p>
        </div>
        <div>
          <p>
            Giảm giá (VNĐ):{" "}
            <strong className="text-lg">
              {Intl.NumberFormat("vi-VN").format(totalPrice)}
            </strong>
          </p>
        </div>
        <div>
          <Button className="bg-[hsl(var(--color-custom-1))] mt-4">
            Thanh toán
          </Button>
        </div>
      </div>
    </div>
  );
}
