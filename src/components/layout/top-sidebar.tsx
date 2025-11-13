"use client";
import * as React from "react";
import { navItems } from "@/constants/navItems";
import { NavItem } from "@/types";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { usePermission } from "@/hooks/usePermission";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import { DialogDescription } from "@radix-ui/react-dialog";

const classWidthContent = 56; // w-56	width: 14rem; /* 224px */

export function TopSidebar() {
  if (!navItems?.length) return <></>;

  return <Menu list={navItems} className="flex" />;
}

export function ListItem({
  item,
  className,
  setNavPopupContent,
  setNavPopupTitle,
  setOpenNavComponent,
}: {
  item: NavItem;
  className?: string;
  setNavPopupContent: React.Dispatch<
    React.SetStateAction<React.ComponentType | null>
  >;
  setNavPopupTitle: (title: string) => void;
  setOpenNavComponent: (open: boolean) => void;
}) {
  const { title, href, childrens, level } = item;
  const router = useRouter();
  const pathName = usePathname();

  const handleRedirect = (href: string) => {
    if (!href) return;

    router.push(href);
    router.refresh();
  };

  const handleClick = () => {
    if (item.component) {
      setNavPopupContent(() => item.component!);
      setNavPopupTitle(item.label || item.title);
      setOpenNavComponent(true);
    } else {
      handleRedirect(href || "");
    }
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
        onClick={handleClick}
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
  const [navPopupContent, setNavPopupContent] =
    useState<React.ComponentType | null>(null);
  const [navPopupTitle, setNavPopupTitle] = useState<string>("");
  const [openNavCompoment, setOpenNavComponent] = useState<boolean>(false);
  const { hasPermission } = usePermission();

  return (
    <>
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
                setNavPopupContent={setNavPopupContent}
                setNavPopupTitle={setNavPopupTitle}
                setOpenNavComponent={setOpenNavComponent}
              />
            );
          }
          return null;
        })}
      </ul>
      <Dialog open={openNavCompoment} onOpenChange={setOpenNavComponent}>
        <DialogContent className="w-[90vw] max-w-4xl max-h-[90vh] overflow-y-hidden">
          <DialogHeader>
            <DialogTitle>{navPopupTitle}</DialogTitle>
            <DialogDescription />
          </DialogHeader>
          {navPopupContent && React.createElement(navPopupContent)}
        </DialogContent>
      </Dialog>
    </>
  );
}
