import { DashboardProvider } from "@/providers/dashboard-providers";
import Header from "@/components/layout/header";
import CustomerLeftSideBar from "@/components/layout/customer-left-sidebar";
import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Khám bệnh",
  description: "Khám/Chữa bệnh - Ra y lệnh cho bệnh nhân",
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
        <div className="flex h-screen overflow-hidden">
          <CustomerLeftSideBar />
          <main className="flex-1 overflow-auto pt-16">{children}</main>
        </div>
      </DashboardProvider>
    </>
  );
}
