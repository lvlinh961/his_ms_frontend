import { RoleManagement } from "@/components/administrator/permisssion/RoleManagement";
import { PermissionGuard } from "@/components/auth/PermissionGuard";
import { AppPermission } from "@/constants/enum";

export default function Page() {
  return (
    <PermissionGuard permission={AppPermission.USER_ROLE_MANAGEMENT}>
      <RoleManagement />
    </PermissionGuard>
  );
}
