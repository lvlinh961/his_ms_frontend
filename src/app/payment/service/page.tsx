import { PermissionGuard } from "@/components/auth/PermissionGuard";
import CashierForm from "@/components/payment/CashierForm";
import { AppPermission } from "@/constants/enum";

export default function Page() {
  return (
    <PermissionGuard permission={AppPermission.PAYMENT}>
      <CashierForm />
    </PermissionGuard>
  );
}
