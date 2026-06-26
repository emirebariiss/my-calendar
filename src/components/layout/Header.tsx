"use client";

import { usePathname } from "next/navigation";
import { PAGE_TITLES } from "@/lib/constants/navigation";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const title =
    PAGE_TITLES[pathname] ??
    (pathname.startsWith("/workflows/") ? "Süreç Detayı" : "My Calendar");

  return (
    <header className="relative z-[60] flex h-16 items-center justify-between gap-4 border-b border-border bg-sidebar px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            className="rounded-lg p-2 hover:bg-slate-100 md:hidden"
            onClick={onMenuClick}
            aria-label="Menüyü aç"
          >
            ☰
          </button>
          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold text-foreground md:text-xl">
              {title}
            </h2>
            <p className="hidden text-sm text-muted sm:block">
              Mock veri ile çalışıyor
            </p>
          </div>
        </div>
        <div className="shrink-0 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 md:px-3">
          <span className="md:hidden">MVP</span>
          <span className="hidden md:inline">MVP — Sprint 6</span>
        </div>
    </header>
  );
}
