"use client";

import { NativePickerInput } from "@/components/ui/NativePickerInput";
import type { EventFormValues } from "./eventFormUtils";

interface EventScheduleFieldsProps {
  values: Pick<
    EventFormValues,
    "allDay" | "startDate" | "startTime" | "endDate" | "endTime"
  >;
  onChange: (patch: Partial<EventFormValues>) => void;
}

export function EventScheduleFields({ values, onChange }: EventScheduleFieldsProps) {
  return (
    <>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={values.allDay}
          onChange={(e) => onChange({ allDay: e.target.checked })}
          className="rounded border-border"
        />
        Tüm gün etkinliği
      </label>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 [&>*]:min-w-0">
        <div className="min-w-0 overflow-hidden">
          <label htmlFor="event-start-date" className="mb-1 block text-sm font-medium">
            Başlangıç tarihi
          </label>
          <NativePickerInput
            id="event-start-date"
            type="date"
            value={values.startDate}
            aria-label="Başlangıç tarihi"
            onChange={(startDate) => onChange({ startDate })}
          />
        </div>

        {!values.allDay && (
          <div className="min-w-0 overflow-hidden">
            <label htmlFor="event-start-time" className="mb-1 block text-sm font-medium">
              Başlangıç saati
            </label>
            <NativePickerInput
              id="event-start-time"
              type="time"
              value={values.startTime}
              aria-label="Başlangıç saati"
              onChange={(startTime) => onChange({ startTime })}
            />
          </div>
        )}

        <div className="min-w-0 overflow-hidden">
          <label htmlFor="event-end-date" className="mb-1 block text-sm font-medium">
            Bitiş tarihi
          </label>
          <NativePickerInput
            id="event-end-date"
            type="date"
            value={values.endDate}
            aria-label="Bitiş tarihi"
            onChange={(endDate) => onChange({ endDate })}
          />
        </div>

        {!values.allDay && (
          <div className="min-w-0 overflow-hidden">
            <label htmlFor="event-end-time" className="mb-1 block text-sm font-medium">
              Bitiş saati
            </label>
            <NativePickerInput
              id="event-end-time"
              type="time"
              value={values.endTime}
              aria-label="Bitiş saati"
              onChange={(endTime) => onChange({ endTime })}
            />
          </div>
        )}
      </div>
    </>
  );
}
