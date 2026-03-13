import { PermissionGuard } from "@/components/auth/PermissionGuard";
import ConsultationReport from "@/components/report/consultation/ConsultaionReport";
import { AppPermission } from "@/constants/enum";

export default function Page() {
  return (
    <PermissionGuard permission={AppPermission.CONSULTATION_REPORT}>
      <ConsultationReport />
    </PermissionGuard>
  );
}
