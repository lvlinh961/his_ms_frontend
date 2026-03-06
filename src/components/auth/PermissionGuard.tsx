// components/auth/PermissionGuard.tsx
"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePermission } from "@/hooks/usePermission";
import { Loader2 } from "lucide-react";
import { AppPermission } from "@/constants/enum";

interface Props {
  children: ReactNode;
  permission: AppPermission; // Ép kiểu Enum ở đây
}

export const PermissionGuard = ({ children, permission }: Props) => {
  const { hasPermission, isLoading } = usePermission();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !hasPermission(permission)) {
      router.replace("/forbidden");
    }
  }, [isLoading, hasPermission, permission, router]);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <p className="text-sm text-slate-500 font-medium italic">
          Đang xác thực quyền truy cập...
        </p>
      </div>
    );
  }

  if (!hasPermission(permission)) return null;

  return <>{children}</>;
};