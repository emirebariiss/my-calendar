"use client";

import { useTheme } from "@/providers/ThemeProvider";

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-lg border border-border bg-card px-3 py-1.5 text-sm text-foreground hover:bg-hover"
      aria-label={resolvedTheme === "dark" ? "Açık moda geç" : "Koyu moda geç"}
      title={resolvedTheme === "dark" ? "Açık mod" : "Koyu mod"}
    >
      {resolvedTheme === "dark" ? "☀️" : "🌙"}
    </button>
  );
}
