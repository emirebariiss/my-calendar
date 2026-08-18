export type StatusBadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "danger"
  | "info";

const VARIANT_CLASSES: Record<StatusBadgeVariant, string> = {
  default: "bg-hover/80 text-foreground",
  success:
    "bg-emerald-50/90 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300",
  warning:
    "bg-amber-50/90 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300",
  danger: "bg-red-50/90 text-red-800 dark:bg-red-950/50 dark:text-red-300",
  info: "bg-blue-50/90 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300",
};

const DOT_CLASSES: Record<StatusBadgeVariant, string> = {
  default: "bg-muted",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
};

interface StatusBadgeProps {
  children: React.ReactNode;
  variant?: StatusBadgeVariant;
  /** Durum rozetlerinde nokta göstergesi (etiket pill'lerinden ayırır) */
  dot?: boolean;
}

/**
 * Stil 3/3: Durum ve meta bilgi (Devam ediyor, Gecikmiş, Aktif…)
 * — Etiketler: TagList (dolu pill) | Öncelik: PriorityBadge (çerçeveli)
 */
export function StatusBadge({
  children,
  variant = "default",
  dot = true,
}: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${VARIANT_CLASSES[variant]}`}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 shrink-0 rounded-full ${DOT_CLASSES[variant]}`}
          aria-hidden
        />
      )}
      {children}
    </span>
  );
}
