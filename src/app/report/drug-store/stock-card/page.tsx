import { PermissionGuard } from "@/components/auth/PermissionGuard";
import StockCardReport from "@/components/report/drug-store/StockCardReport";
import { AppPermission } from "@/constants/enum";

export default function Page() {
  return (
    <PermissionGuard permission={AppPermission.STOCK_CARD_REPORT}>
      <StockCardReport />
    </PermissionGuard>
  );
}
