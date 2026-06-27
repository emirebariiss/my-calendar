"use client";

import type { EventStatus, EventType } from "@/lib/types";
import { EVENT_TYPE_LABELS } from "@/lib/types";
import type { EventFormValues } from "./eventFormUtils";

interface EventBasicFieldsProps {
  values: Pick<EventFormValues, "title" | "description" | "type" | "status">;
  error?: string;
  onChange: (patch: Partial<EventFormValues>) => void;
}

export function EventBasicFields({ values, error, onChange }: EventBasicFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="event-title" className="mb-1 block text-sm font-medium">
          Başlık *
        </label>
        <input
          id="event-title"
          value={values.title}
          onChange={(e) => onChange({ title: e.target.value })}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          placeholder="Örn: Haftalık ekip toplantısı"
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      </div>

      <div>
        <label htmlFor="event-description" className="mb-1 block text-sm font-medium">
          Açıklama
        </label>
        <textarea
          id="event-description"
          value={values.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 [&>*]:min-w-0">
        <div className="min-w-0 overflow-hidden">
          <label htmlFor="event-type" className="mb-1 block text-sm font-medium">
            Tip
          </label>
          <select
            id="event-type"
            value={values.type}
            onChange={(e) => onChange({ type: e.target.value as EventType })}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          >
            {Object.entries(EVENT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="min-w-0">
          <label htmlFor="event-status" className="mb-1 block text-sm font-medium">
            Durum
          </label>
          <select
            id="event-status"
            value={values.status}
            onChange={(e) => onChange({ status: e.target.value as EventStatus })}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          >
            <option value="scheduled">Planlandı</option>
            <option value="completed">Tamamlandı</option>
            <option value="cancelled">İptal</option>
          </select>
        </div>
      </div>
    </>
  );
}
