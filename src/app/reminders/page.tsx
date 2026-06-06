"use client";

import { useMemo, useState } from "react";
import { useReminders } from "@/hooks/useReminders";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  REMINDER_RECURRENCE_LABELS,
  REMINDER_TARGET_LABELS,
} from "@/lib/types";
import { formatDateTime } from "@/lib/utils/date";

export default function RemindersPage() {
  const { reminders } = useReminders();
  const [showActiveOnly, setShowActiveOnly] = useState(true);

  const filtered = useMemo(() => {
    if (!showActiveOnly) return reminders;
    return reminders.filter((reminder) => reminder.isActive);
  }, [reminders, showActiveOnly]);

  return (
    <div className="space-y-6">
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={showActiveOnly}
          onChange={(e) => setShowActiveOnly(e.target.checked)}
          className="rounded border-border"
        />
        Sadece aktif hatırlatmaları göster
      </label>

      <Card title={`Hatırlatmalar (${filtered.length})`}>
        {filtered.length === 0 ? (
          <EmptyState title="Hatırlatma bulunamadı" />
        ) : (
          <ul className="space-y-3">
            {filtered.map((reminder) => (
              <li
                key={reminder.id}
                className="rounded-lg border border-border bg-white px-4 py-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">{reminder.title}</p>
                    {reminder.message && (
                      <p className="mt-1 text-sm text-muted">
                        {reminder.message}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-muted">
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
                    <Badge variant={reminder.isActive ? "success" : "default"}>
                      {reminder.isActive ? "Aktif" : "Pasif"}
                    </Badge>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
