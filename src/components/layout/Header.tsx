"use client";

import { usePathname } from "next/navigation";
import { PAGE_TITLES } from "@/lib/constants/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const pathname = usePathname();
  const title =
    PAGE_TITLES[pathname] ??
    (pathname.startsWith("/workflows/") ? "Süreç Detayı" : "My Calendar");

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-sidebar px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          className="rounded-lg p-2 hover:bg-hover md:hidden"
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
      <div className="flex shrink-0 items-center gap-2">
        <ThemeToggle />
      </div>
    </header>
  );
}
