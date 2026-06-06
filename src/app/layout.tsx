import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { AppProvider } from "@/providers/AppProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Calendar",
  description: "Takvim, görev ve süreç yönetimi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${geistSans.variable} antialiased`}>
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
