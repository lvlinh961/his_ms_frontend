"use client";
import { NavItem } from "@/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { useSidebar } from "@/hooks/useSidebar";
import { usePermission } from "@/hooks/usePermission";
import { Collapsible } from "@radix-ui/react-collapsible";

export function ProtectedRoute({
  route,
  setOpen,
  isMobileNav,
}: {
  route: NavItem;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}) {
  const path = usePathname();
  const { isMinimized } = useSidebar();
  const { hasPermission } = usePermission();
  const Icon = Icons[route.icon || "arrowRight"];

  const renderMenu = (route: NavItem) => {
    if (!route.href) {
      return <></>;
    }

    return (
      <Link
        href={route.disabled ? "/" : route.href}
        className={cn(
          "flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          path === route.href ? "bg-accent" : "transparent",
          route.disabled && "cursor-not-allowed opacity-80"
        )}
        onClick={() => {
          if (setOpen) setOpen(false);
        }}
      >
        <Icon className={`ml-3 size-5`} />

        {isMobileNav || (!isMinimized && !isMobileNav) ? (
          <span className="mr-2 truncate">{route.title}</span>
        ) : (
          ""
        )}
      </Link>
    );
  };

  const renderGroupMenu = (route: NavItem) => {
    if (!route.href) {
      return <></>;
    }

    return (
      <Link
        href={route.disabled ? "/" : route.href}
        className={cn(
          "flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
          path === route.href ? "bg-accent" : "transparent",
          route.disabled && "cursor-not-allowed opacity-80"
        )}
        onClick={() => {
          if (setOpen) setOpen(false);
        }}
      >
        <Icon className={`ml-3 size-5`} />

        {isMobileNav || (!isMinimized && !isMobileNav) ? (
          <span className="mr-2 truncate">{route.title}</span>
        ) : (
          ""
        )}
      </Link>
    );
  };

  const menu = !route.childrens ? renderMenu(route) : renderGroupMenu(route);

  return hasPermission(route.permission) && menu;
}
