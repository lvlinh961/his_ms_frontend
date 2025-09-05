import { DashboardProvider } from "@/providers/dashboard-providers";
import Header from "@/components/layout/header";
import EmrLeftSideBar from "@/components/emr/emr-left-sidebar";
import type { Metadata } from "next";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Next Shadcn Dashboard Starter",
  description: "Basic dashboard with Next.js and Shadcn",
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
          {/* <EmrLeftSideBar /> */}
          <main className="flex-1 overflow-hidden pt-16">{children}</main>
        </div>
      </DashboardProvider>
    </>
  );
}
