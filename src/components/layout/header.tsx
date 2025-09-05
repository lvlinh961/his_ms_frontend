import ThemeToggle from "@/components/layout/ThemeToggle/theme-toggle";
import { cn } from "@/lib/utils";
import { TopSidebar } from "./top-sidebar";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";
import TopSelectDeparment from "./top-select-deparment";
import Link from "next/link";
import "@/app/globals.css";

type HeadrProps = {
  hideMenu?: Boolean | false;
};
export default function Header({ hideMenu }: HeadrProps) {
  return (
    <div className="bg-[hsl(var(--color-custom-1))] fixed left-0 right-0 top-0 z-20 border-b">
      <nav className="flex h-14 items-center justify-between px-4">
        {!hideMenu && (
          <>
            <div className="hidden lg:flex">
              <div className="flex justify-center items-center">
                <Link
                  href={
                    "https://github.com/Kiranism/next-shadcn-dashboard-starter"
                  }
                  target="_blank"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="mr-2 h-6 w-6"
                  >
                    <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
                  </svg>
                </Link>
              </div>
              <div>
                <TopSidebar />
              </div>
            </div>
            <div className={cn("block lg:!hidden")}>
              <MobileSidebar />
            </div>
          </>
        )}
        <div
          className={cn("flex items-center gap-2", hideMenu ? "ml-auto" : "")}
        >
          {/* <div>{!hideMenu && <TopSelectDeparment />}</div> */}
          <UserNav />
          <ThemeToggle />
        </div>
      </nav>
    </div>
  );
}
