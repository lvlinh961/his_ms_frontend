import type { Metadata } from "next";
import localFont from "next/font/local";
import AppProviders from "@/providers/app-proviceders";
import Script from "next/script";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/toaster";
import { auth } from "@/auth";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Hệ thống phòng khám",
  description: "Luôn đồng hành cùng bạn",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <Script src="/runtime-config.js" strategy="beforeInteractive" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <NextTopLoader showSpinner={false} />
        <AppProviders session={session}>
          <Toaster />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
