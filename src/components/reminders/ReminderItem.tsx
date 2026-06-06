"use client";

import type { Reminder } from "@/lib/types";
import {
  REMINDER_RECURRENCE_LABELS,
  REMINDER_TARGET_LABELS,
} from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { formatDateTime } from "@/lib/utils/date";

interface ReminderItemProps {
  reminder: Reminder;
  onToggleActive: (reminder: Reminder) => void;
}

export function ReminderItem({ reminder, onToggleActive }: ReminderItemProps) {
  return (
    <li
      className={`rounded-lg border px-4 py-3 ${
        reminder.isActive
          ? "border-border bg-white"
          : "border-border bg-slate-50 opacity-80"
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={reminder.isActive}
          onChange={() => onToggleActive(reminder)}
          className="mt-1 h-4 w-4 rounded border-border"
          aria-label={`${reminder.title} hatırlatmasını ${reminder.isActive ? "pasif" : "aktif"} yap`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p
                className={`font-medium ${!reminder.isActive ? "text-muted" : ""}`}
              >
                {reminder.title}
              </p>
              {reminder.message && (
                <p className="mt-1 text-sm text-muted">{reminder.message}</p>
              )}
              <p className="mt-2 text-xs text-muted">
                Tetikleme: {formatDateTime(reminder.triggerAt)}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="info">
                {REMINDER_TARGET_LABELS[reminder.targetType]}
              </Badge>
              <Badge>{REMINDER_RECURRENCE_LABELS[reminder.recurrence]}</Badge>
              <Badge variant={reminder.isActive ? "success" : "default"}>
                {reminder.isActive ? "Aktif" : "Pasif"}
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}
