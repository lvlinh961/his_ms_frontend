"use client";

import { PermissionGuard } from "@/components/auth/PermissionGuard";
import CashierForm from "@/components/payment/CashierForm";
import PrescriptionPaymentForm from "@/components/payment/PrescriptionPaymentForm";
import { AppPermission } from "@/constants/enum";
import { dateFormater } from "@/lib/utils";
import { useDashboardContext } from "@/providers/dashboard-providers";

export default function Page() {
  const { customerSelected } = useDashboardContext();

  return (
    <PermissionGuard permission={AppPermission.PRESCRIPTION_PAYMENT}>
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

      <PrescriptionPaymentForm />
    </PermissionGuard>
  );
}
