import type { TaskPriority } from "@/lib/types";
import { TASK_PRIORITY_LABELS } from "@/lib/types";

const PRIORITY_CLASSES: Record<TaskPriority, string> = {
  high: "border-red-400 bg-red-50/60 text-red-700 dark:border-red-600 dark:bg-red-950/40 dark:text-red-300",
  medium:
    "border-amber-400 bg-amber-50/60 text-amber-800 dark:border-amber-600 dark:bg-amber-950/40 dark:text-amber-300",
  low: "border-slate-400 bg-slate-50/60 text-slate-600 dark:border-slate-500 dark:bg-slate-900/40 dark:text-slate-300",
};

const PRIORITY_MARKERS: Record<TaskPriority, string> = {
  high: "↑",
  medium: "↔",
  low: "↓",
};

interface PriorityBadgeProps {
  priority: TaskPriority;
}

/** Etiket pill'lerinden ayrı: köşeli, çerçeveli öncelik rozeti */
export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${PRIORITY_CLASSES[priority]}`}
    >
      <span aria-hidden>{PRIORITY_MARKERS[priority]}</span>
      {TASK_PRIORITY_LABELS[priority]}
    </span>
  );
}
