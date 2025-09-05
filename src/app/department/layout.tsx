import { DashboardProvider } from "@/providers/dashboard-providers";
import Header from "@/components/layout/header";
import type { Metadata } from "next";

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
        <Header hideMenu />
        <div className="flex h-screen">
          <main className="flex-1 pt-16">{children}</main>
        </div>
      </DashboardProvider>
    </>
  );
}
