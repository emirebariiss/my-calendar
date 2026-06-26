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
    <html lang="tr" className="h-full">
      <body className={`${geistSans.variable} h-full overflow-hidden antialiased`}>
        <AppProvider>
          <div className="h-full min-h-0">
            <AppShell>{children}</AppShell>
          </div>
        </AppProvider>
      </body>
    </html>
  );
}
