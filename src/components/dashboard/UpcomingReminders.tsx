"use client";

import Link from "next/link";
import { useReminders } from "@/hooks/useReminders";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { REMINDER_RECURRENCE_LABELS, REMINDER_TARGET_LABELS } from "@/lib/types";
import { formatDateTime } from "@/lib/utils/date";
import { getUpcomingReminders } from "@/lib/utils/filters";

export function UpcomingReminders() {
  const { reminders } = useReminders();
  const upcoming = getUpcomingReminders(reminders);
  return (
    <Card
      title="Yaklaşan Hatırlatmalar"
      action={
        <Link href="/reminders" className="text-sm font-medium text-primary">
          Tümünü gör →
        </Link>
      }
    >
      {upcoming.length === 0 ? (
        <EmptyState title="Önümüzdeki 7 günde aktif hatırlatma yok" />
      ) : (
        <ul className="space-y-3">
          {upcoming.map((reminder) => (
            <li
              key={reminder.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium">{reminder.title}</p>
                <p className="text-xs text-muted">
                  {formatDateTime(reminder.triggerAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="info">
                  {REMINDER_TARGET_LABELS[reminder.targetType]}
                </Badge>
                <Badge>
                  {REMINDER_RECURRENCE_LABELS[reminder.recurrence]}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}