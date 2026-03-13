import { PermissionGuard } from "@/components/auth/PermissionGuard";
import ReceptionForm from "@/components/reception/ReceptionForm";
import { AppPermission } from "@/constants/enum";

export default function Page() {
  return (
    <PermissionGuard permission={AppPermission.RECEPTION}>
      <ReceptionForm />
    </PermissionGuard>
  );
}
