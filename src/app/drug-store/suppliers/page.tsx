import { PermissionGuard } from "@/components/auth/PermissionGuard";
import DrugSupplierManagement from "@/components/drug-store/suppliers/DrugSupplierManagement";
import { AppPermission } from "@/constants/enum";

export default function Page() {
  return (
    <PermissionGuard permission={AppPermission.DRUG_SUPPLIER_MANAGEMENT}>
      <DrugSupplierManagement />
    </PermissionGuard>
  );
}
