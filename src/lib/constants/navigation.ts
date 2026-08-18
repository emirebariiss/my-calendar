export interface NavItem {
  href: string;
  label: string;
  icon: string;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: "📊" },
  { href: "/calendar", label: "Takvim", icon: "📅" },
  { href: "/tasks", label: "Görevler", icon: "✅" },
  { href: "/workflows", label: "Süreçler", icon: "🔁" },
  { href: "/payments", label: "Ödemeler", icon: "💳" },
  { href: "/reminders", label: "Hatırlatmalar", icon: "🔔" },
];

export const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/calendar": "Takvim",
  "/tasks": "Görevler",
  "/workflows": "Süreçler",
  "/payments": "Ödemeler",
  "/reminders": "Hatırlatmalar",
};
