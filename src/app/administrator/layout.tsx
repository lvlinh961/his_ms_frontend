import { DashboardProvider } from "@/providers/dashboard-providers";
import Header from "@/components/layout/header";
import CustomerLeftSideBar from "@/components/layout/customer-left-sidebar";
import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Quản trị hệ thống",
  description: "Quản trị, cấu hình hệ thống",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardProvider>
        <Header />
        <div className="flex h-screen overflow-auto">
          <main className="flex-1 overflow-auto pt-16">{children}</main>
        </div>
      </DashboardProvider>
    </>
  );
}
