import { PermissionGuard } from "@/components/auth/PermissionGuard";
import PharImportOrder from "@/components/drug-store/PharImportOrder";
import { AppPermission } from "@/constants/enum";

export default function Page() {
  return <PermissionGuard permission={AppPermission.VIEW_IMPORT_ORDER}>
    <PharImportOrder />
  </PermissionGuard>;
}
