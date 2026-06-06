"use client";

import { useMemo, useState } from "react";
import { ReminderForm, type ReminderFormValues } from "@/components/reminders/ReminderForm";
import { ReminderItem } from "@/components/reminders/ReminderItem";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useReminders } from "@/hooks/useReminders";
import type { Reminder } from "@/lib/types";

export default function RemindersPage() {
  const { reminders, addReminder, updateReminder } = useReminders();
  const [showActiveOnly, setShowActiveOnly] = useState(true);
  const [formOpen, setFormOpen] = useState(false);

  const filtered = useMemo(() => {
    if (!showActiveOnly) return reminders;
    return reminders.filter((reminder) => reminder.isActive);
  }, [reminders, showActiveOnly]);

  const handleToggleActive = (reminder: Reminder) => {
    updateReminder(reminder.id, { isActive: !reminder.isActive });
  };

  const handleSubmit = (values: ReminderFormValues) => {
    addReminder({
      title: values.title,
      targetType: values.targetType,
      targetId: values.targetId,
      triggerAt: values.triggerAt,
      recurrence: values.recurrence,
      isActive: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={showActiveOnly}
            onChange={(e) => setShowActiveOnly(e.target.checked)}
            className="rounded border-border"
          />
          Sadece aktif hatırlatmaları göster
        </label>
        <Button type="button" onClick={() => setFormOpen(true)}>
          + Yeni Hatırlatma
        </Button>
      </div>

      <Card title={`Hatırlatmalar (${filtered.length})`}>
        {filtered.length === 0 ? (
          <EmptyState title="Hatırlatma bulunamadı" />
        ) : (
          <ul className="space-y-3">
            {filtered.map((reminder) => (
              <ReminderItem
                key={reminder.id}
                reminder={reminder}
                onToggleActive={handleToggleActive}
              />
            ))}
          </ul>
        )}
      </Card>

      <ReminderForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
