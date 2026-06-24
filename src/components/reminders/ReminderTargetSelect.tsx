"use client";

import type { ReminderTargetType } from "@/lib/types";
import { REMINDER_TARGET_LABELS } from "@/lib/types";
import type { ReminderTargetOption } from "@/lib/utils/reminder";

interface ReminderTargetSelectProps {
  targetType: ReminderTargetType;
  targetId: string;
  options: ReminderTargetOption[];
  onTargetTypeChange: (targetType: ReminderTargetType) => void;
  onTargetIdChange: (targetId: string) => void;
}

export function ReminderTargetSelect({
  targetType,
  targetId,
  options,
  onTargetTypeChange,
  onTargetIdChange,
}: ReminderTargetSelectProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <label
          htmlFor="reminder-target-type"
          className="mb-1 block text-sm font-medium"
        >
          Hedef tipi *
        </label>
        <select
          id="reminder-target-type"
          value={targetType}
          onChange={(e) =>
            onTargetTypeChange(e.target.value as ReminderTargetType)
          }
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        >
          {(Object.keys(REMINDER_TARGET_LABELS) as ReminderTargetType[]).map(
            (type) => (
              <option key={type} value={type}>
                {REMINDER_TARGET_LABELS[type]}
              </option>
            )
          )}
        </select>
      </div>

      <div>
        <label
          htmlFor="reminder-target-id"
          className="mb-1 block text-sm font-medium"
        >
          Hedef seçimi *
        </label>
        <select
          id="reminder-target-id"
          value={targetId}
          onChange={(e) => onTargetIdChange(e.target.value)}
          disabled={options.length === 0}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-60"
        >
          {options.length === 0 ? (
            <option value="">Kayıt bulunamadı</option>
          ) : (
            options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))
          )}
        </select>
      </div>
    </div>
  );
}
