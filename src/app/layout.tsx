import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AppShell } from "@/components/layout/AppShell";
import { AppProvider } from "@/providers/AppProvider";
import { ThemeProvider } from "@/providers/ThemeProvider";
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
    <html lang="tr" className="h-full" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k="my-calendar-theme";var s=localStorage.getItem(k);var m=s==="light"||s==="dark"||s==="system"?s:"system";var d=m==="dark"||(m==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",d);}catch(e){}})();`,
          }}
        />
      </head>
      <body className={`${geistSans.variable} h-full overflow-hidden antialiased`}>
        <ThemeProvider>
          <AppProvider>
            <div className="h-full min-h-0">
              <AppShell>{children}</AppShell>
            </div>
          </AppProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
