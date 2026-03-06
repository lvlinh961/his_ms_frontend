"use client";

import { AppPermission } from "@/constants/enum";
import { usePermission } from "@/hooks/usePermission";
import { ReactNode } from "react";

interface HasPermissionProps {
  children: ReactNode;
  permission: AppPermission | AppPermission[]; // Chấp nhận 1 hoặc nhiều quyền
  requirement?: "all" | "any"; // "all": phải có đủ, "any": chỉ cần 1 trong số đó
  fallback?: ReactNode; // Hiển thị gì nếu không có quyền (mặc định là null)
}

export const HasPermission = ({
  children,
  permission,
  requirement = "any",
  fallback = null,
}: HasPermissionProps) => {
  const { hasPermission, isLoading } = usePermission();

  if (isLoading) return null;
  const permissions = Array.isArray(permission) ? permission : [permission];
  
  const isAllowed = requirement === "any" 
    ? permissions.some((p) => hasPermission(p))
    : permissions.every((p) => hasPermission(p));

  if (!isAllowed) return <>{fallback}</>;

  return <>{children}</>;
};