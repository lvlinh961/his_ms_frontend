import { PermissionGuard } from "@/components/auth/PermissionGuard";
import StockTransactionReport from "@/components/report/drug-store/StockTransactionReport";
import { AppPermission } from "@/constants/enum";

export default function Page() {
  return (
    <PermissionGuard permission={AppPermission.STOCK_TRANSACTION_REPORT}>
      <StockTransactionReport />
    </PermissionGuard>
  );
}
