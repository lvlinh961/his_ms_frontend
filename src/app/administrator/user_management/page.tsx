import UserManagement from "@/components/administrator/use_management/UserManagement";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { AppPermission } from "@/constants/enum";

export default function Page() {
  return (
    <PermissionGuard permission={AppPermission.USER_MANAGEMENT}>
      <UserManagement />
    </PermissionGuard>
  );
}
