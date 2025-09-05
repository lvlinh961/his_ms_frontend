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
      <fieldset className="w-full border border-border rounded-lg p-4 text-base gap-10">
        <legend className="font-bold">Thông tin bệnh nhân</legend>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p>
              Tên bệnh nhân: <strong>{customerSelected?.patientName}</strong>
            </p>
          </div>
          <div>
            <p>
              Ngày sinh:{" "}
              <strong>
                {customerSelected &&
                  dateFormater.format(new Date(customerSelected.dateOfBirth))}
              </strong>
            </p>
          </div>
          <div>
            <p>
              Giới tính:{" "}
              <strong>
                {customerSelected?.gender == "MALE" ? "Nam" : "Nữ"}
              </strong>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div>
            <p>
              Địa chỉ: <strong>{customerSelected?.address}</strong>
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <div>
            <p>
              Lý do khám: <strong>{customerSelected?.reason}</strong>
            </p>
          </div>
        </div>
      </fieldset>
      <Tabs defaultValue="service" className="flex flex-col w-full gap-6">
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
