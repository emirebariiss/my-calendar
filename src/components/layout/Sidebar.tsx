"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants/navigation";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      <div className="border-b border-border px-6 py-5">
        <h1 className="text-lg font-bold text-foreground">My Calendar</h1>
        <p className="mt-1 text-xs text-muted">Planla · Yönet · İlerle</p>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-accent text-primary"
                  : "text-foreground hover:bg-slate-50"
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border px-4 py-4">
        <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
            MD
          </div>
          <div>
            <p className="text-sm font-medium">Mock Kullanıcı</p>
            <p className="text-xs text-muted">demo@my-calendar.app</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
