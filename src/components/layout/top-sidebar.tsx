"use client";
import * as React from "react";
import { navItems } from "@/constants/data";
import { NavItem } from "@/types";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { usePermission } from "@/hooks/usePermission";

const classWidthContent = 56; // w-56	width: 14rem; /* 224px */

export function TopSidebar() {
  if (!navItems?.length) return <></>;

  return <Menu list={navItems} className="flex" />;
}

export function ListItem({
  item,
  className,
}: {
  item: NavItem;
  className?: string;
}) {
  const { title, href, childrens, level } = item;
  const router = useRouter();
  const pathName = usePathname();

  const handleRedirect = (href: string) => {
    if (!href) return;

    router.push(href);
    router.refresh();
  };

  const renderChevronIcon = () => {
    if (!Array.isArray(childrens)) return <></>;

    if (level === 1) {
      return (
        <>
          <ChevronDown
            className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-hover:rotate-180"
            aria-hidden="true"
          />
        </>
      );
    }

    return <ChevronRightIcon className="h-4 w-4 mr-2" aria-hidden="true" />;
  };

  const bgActive = (navItem: NavItem) => {
    const currentPrefix =
      [...navItems]
        .flatMap((item: NavItem) => [item, item.childrens])
        .filter((item) => item !== undefined)
        .flat()
        .flatMap((item: NavItem) => [item, item.childrens])
        .flat()
        .find((item: NavItem | undefined) => (item && item?.href) === pathName)
        ?.prefix ?? "";

    return navItem.prefix === currentPrefix
      ? "bg-[hsl(var(--color-custom-2))] shadow"
      : "";
  };

  return (
    <li
      className={cn(
        className,
        level && level === 1
          ? `group ${bgActive(item)} font-semibold rounded`
          : "",
        level && level >= 2
          ? `group/child border-b border-b-solid last:border-b-0`
          : "",
        "relative"
      )}
    >
      <div
        className="inline-flex items-center w-full p-3 hover:rounded hover:shadow hover:bg-[hsl(var(--color-custom-2))] text-[hsl(var(--text-color))]"
        onClick={() => handleRedirect(href || "")}
      >
        <div className="w-full">{title}</div>
        {renderChevronIcon()}
      </div>
      {Array.isArray(childrens) && (
        <Menu
          key={item.href}
          list={childrens}
          className={cn(
            `w-${classWidthContent} absolute bg-[hsl(var(--color-custom-1))] border`,
            level && level === 1 ? "hidden group-hover:block" : "",
            level && level >= 2
              ? `hidden group-hover/child:block z-[10] top-0 left-56`
              : ""
          )}
        />
      )}
    </li>
  );
}

export function Menu({
  list,
  className,
  itemKey,
}: {
  list: NavItem[];
  className?: string;
  itemKey?: any;
}) {
  const { hasPermission } = usePermission();

  return (
    <ul className={cn(className)}>
      {list.map((item: NavItem) => {
        if (hasPermission(item?.permission)) {
          return (
            <ListItem
              key={item.title || item.label}
              item={item}
              className={cn(
                "text-sm hover:bg-[hsl(var(--color-custom-2))] hover:cursor-pointer"
              )}
            />
          );
        }
        return null;
      })}
    </ul>
  );
}
