"use client";

import PrescriptionForm from "@/components/concultation/PrescriptionForm";
import ServiceAppointmentForm from "@/components/concultation/ServiceAppointmentForm";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { useDashboardContext } from "@/providers/dashboard-providers";
import { dateFormater } from "@/lib/utils";
import EmrForm from "@/components/concultation/EmrForm";

export default function Page() {
  const { customerSelected } = useDashboardContext();

  return (
    <>
      <div className="p-4">
        <fieldset className="w-full border border-border rounded-lg p-4 bg-slate-50/50">
          <legend className="font-bold px-2 text-blue-700 uppercase text-sm">
            Thông tin bệnh nhân
          </legend>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <p className="text-sm">
              Họ tên: <strong>{customerSelected?.patientName}</strong>
            </p>
            <p className="text-sm">
              Ngày sinh:{" "}
              <strong>
                {customerSelected &&
                  dateFormater.format(new Date(customerSelected.dateOfBirth))}
              </strong>
            </p>
            <p className="text-sm">
              Giới tính:{" "}
              <strong>
                {customerSelected?.gender == "MALE" ? "Nam" : "Nữ"}
              </strong>
            </p>
            <p className="text-sm">
              Mã BN: <strong>{customerSelected?.patientCode}</strong>
            </p>
            <p className="text-sm md:col-span-4">
              Địa chỉ: <strong>{customerSelected?.address}</strong>
            </p>
          </div>
        </fieldset>
      </div>
      <Tabs defaultValue="service" className="flex flex-col w-full p-4 gap-6">
        <TabsList className="flex w-full flex-row items-start bg-gray-100 p-0">
          <TabsTrigger
            value="service"
            className="w-full justify-start data-[state=active]:bg-muted data-[state=active]:font-semibold rounded-md px-3 py-3"
          >
            Chỉ định
          </TabsTrigger>
          <TabsTrigger
            value="prescription"
            className="w-full justify-start data-[state=active]:bg-muted data-[state=active]:font-semibold rounded-md px-3 py-3"
          >
            Toa thuốc
          </TabsTrigger>
          <TabsTrigger
            value="medical_record"
            className="w-full justify-start data-[state=active]:bg-muted data-[state=active]:font-semibold rounded-md px-3 py-3"
          >
            Bệnh án
          </TabsTrigger>
        </TabsList>
        <div className="flex-1">
          <TabsContent value="prescription">
            <PrescriptionForm />
          </TabsContent>
          <TabsContent value="service">
            <ServiceAppointmentForm />
          </TabsContent>
          <TabsContent value="medical_record">
            <EmrForm />
          </TabsContent>
        </div>
      </Tabs>
    </>
  );
}
