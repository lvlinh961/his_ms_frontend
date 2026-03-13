import { PermissionGuard } from "@/components/auth/PermissionGuard";
import DrugStoreManagement from "@/components/drug-store/stores/DrugStoreManagement";
import { AppPermission } from "@/constants/enum";

export default function Page() {
  return (
    <PermissionGuard permission={AppPermission.DRUG_STORE_MANAGEMENT}>
      <DrugStoreManagement />
    </PermissionGuard>
  );
}
