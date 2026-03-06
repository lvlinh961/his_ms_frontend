import { DashboardProvider } from "@/providers/dashboard-providers";
import Header from "@/components/layout/header";
import CustomerLeftSideBar from "@/components/layout/customer-left-sidebar";
import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Quản lý kho dược",
  description: "Quản lý nhập xuất tồn kho dược",
};

export default function ForbidentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardProvider>
        <Header />
        <div className="flex h-screen overflow-hidden">
          <main className="flex-1 overflow-hidden pt-16">{children}</main>
        </div>
      </DashboardProvider>
    </>
  );
}
