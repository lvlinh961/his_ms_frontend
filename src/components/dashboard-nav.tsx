"use client";
import { usePathname } from "next/navigation";
import { Icons } from "./icons";
import { NavItem } from "@/types";
import { Dispatch, SetStateAction, useCallback } from "react";
import { useSidebar } from "@/hooks/useSidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { ProtectedRoute } from "./protected-route";
import { usePermission } from "@/hooks/usePermission";

interface DashboardNavProps {
  items: NavItem[];
  setOpen?: Dispatch<SetStateAction<boolean>>;
  isMobileNav?: boolean;
}

export function DashboardNav({
  items,
  setOpen,
  isMobileNav = false,
}: DashboardNavProps) {
  const path = usePathname();
  const { isMinimized } = useSidebar();
  const { hasPermission } = usePermission();

  const renderCollapsLabel = useCallback((item: NavItem) => {
    if (!item) return <></>;
    const Icon: any = Icons[item.icon || "arrowRight"];

    return (
      <>
        <div
          className={cn(
            "flex items-center gap-2 overflow-hidden rounded-md py-2 text-sm font-medium",
            isMinimized ? "hidden" : ""
          )}
        >
          <Icon className={`ml-3 size-5`} />
          <div>{item.title}</div>
          <ChevronDown
            className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-hover:rotate-180"
            aria-hidden="true"
          />
        </div>
      </>
    );
  }, []);

  const renderLinkNotChild = useCallback((item: NavItem, index: number) => {
    if (!items.length) return <></>;

    return (
      <>
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <ProtectedRoute
              route={item}
              setOpen={setOpen}
              isMobileNav={isMobileNav}
            />
          </TooltipTrigger>
          <TooltipContent
            align="center"
            side="right"
            sideOffset={8}
            className={!isMinimized ? "hidden" : "inline-block"}
          >
            {item.title}
          </TooltipContent>
        </Tooltip>
      </>
    );
  }, []);

  const renderLinkHasChild = useCallback((item: NavItem, index: number) => {
    if (!item.childrens?.length) return <></>;

    return (
      <>
        {hasPermission(item?.permission) && item?.childrens && (
          <Collapsible>
            <CollapsibleTrigger className="duration-500">
              {renderCollapsLabel(item)}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <>
                {item?.childrens
                  ?.flatMap((item: NavItem) => [item, item.childrens])
                  .filter(
                    (item: NavItem | NavItem[] | undefined) =>
                      item !== undefined
                  )
                  .flat()
                  .map((child: NavItem, childIndex: number) => {
                    return (
                      <>
                        <Tooltip key={childIndex}>
                          <TooltipTrigger asChild>
                            <ProtectedRoute
                              route={child}
                              setOpen={setOpen}
                              isMobileNav={isMobileNav}
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            align="center"
                            side="right"
                            sideOffset={8}
                            className={!isMinimized ? "hidden" : "inline-block"}
                          >
                            {item.title}
                          </TooltipContent>
                        </Tooltip>
                      </>
                    );
                  })}
              </>
            </CollapsibleContent>
          </Collapsible>
        )}
      </>
    );
  }, []);

  if (!items?.length) {
    return null;
  }

  return (
    <ScrollArea className="h-[calc(100vh-80px)]">
      <nav className="grid items-start gap-2">
        <TooltipProvider>
          {items.map((item, index) => {
            return (
              <>
                {item?.childrens && renderLinkHasChild(item, index)}
                {!item?.childrens?.length && renderLinkNotChild(item, index)}
              </>
            );
          })}
        </TooltipProvider>
      </nav>
    </ScrollArea>
  );
}
