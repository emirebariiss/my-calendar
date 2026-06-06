"use client";

import { usePathname } from "next/navigation";
import { PAGE_TITLES } from "@/lib/constants/navigation";

export function Header() {
  const pathname = usePathname();
  const title =
    PAGE_TITLES[pathname] ??
    (pathname.startsWith("/workflows/") ? "Süreç Detayı" : "My Calendar");

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-sidebar px-6">
      <div>
        <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        <p className="text-sm text-muted">Mock veri ile çalışıyor</p>
      </div>
      <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
        MVP — Sprint 0-1
      </div>
    </header>
  );
}
