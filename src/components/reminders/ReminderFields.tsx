"use client";

import type { ReminderInput, ReminderRecurrence } from "@/lib/types";
import { REMINDER_RECURRENCE_LABELS } from "@/lib/types";

interface ReminderFieldsProps {
  idPrefix: string;
  value: ReminderInput;
  suggestedTriggerAt: string;
  onChange: (value: ReminderInput) => void;
  compact?: boolean;
}

export function ReminderFields({
  idPrefix,
  value,
  suggestedTriggerAt,
  onChange,
  compact = false,
}: ReminderFieldsProps) {
  const handleToggle = (enabled: boolean) => {
    onChange({
      ...value,
      enabled,
      triggerAt: enabled ? value.triggerAt || suggestedTriggerAt : value.triggerAt,
    });
  };

  return (
    <div className={compact ? "space-y-2" : "space-y-3 rounded-lg border border-dashed border-border p-3"}>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={value.enabled}
          onChange={(e) => handleToggle(e.target.checked)}
          className="rounded border-border"
        />
        Hatırlatma ekle
      </label>

      {value.enabled && (
        <div
          className={`grid min-w-0 gap-3 ${compact ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2"} [&>*]:min-w-0`}
        >
          <div className="min-w-0">
            <label
              htmlFor={`${idPrefix}-trigger-at`}
              className="mb-1 block text-sm font-medium"
            >
              Tetikleme zamanı
            </label>
            <input
              id={`${idPrefix}-trigger-at`}
              type="datetime-local"
              value={value.triggerAt}
              onChange={(e) =>
                onChange({ ...value, triggerAt: e.target.value })
              }
              className="w-full min-w-0 max-w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </div>

          <div className="min-w-0">
            <label
              htmlFor={`${idPrefix}-recurrence`}
              className="mb-1 block text-sm font-medium"
            >
              Tekrar
            </label>
            <select
              id={`${idPrefix}-recurrence`}
              value={value.recurrence}
              onChange={(e) =>
                onChange({
                  ...value,
                  recurrence: e.target.value as ReminderRecurrence,
                })
              }
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              {(
                Object.keys(REMINDER_RECURRENCE_LABELS) as ReminderRecurrence[]
              ).map((recurrence) => (
                <option key={recurrence} value={recurrence}>
                  {REMINDER_RECURRENCE_LABELS[recurrence]}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
