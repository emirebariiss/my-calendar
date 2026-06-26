"use client";

import { useEffect, useState } from "react";
import type { CalendarEvent, EventStatus, EventType, ReminderInput } from "@/lib/types";
import { DEFAULT_REMINDER_INPUT, EVENT_TYPE_LABELS } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ReminderFields } from "@/components/reminders/ReminderFields";
import { NativePickerInput } from "@/components/ui/NativePickerInput";
import {
  toDateTimeLocalValue,
  toDateValue,
} from "@/lib/utils/calendar";
import { getEventReminderDefault } from "@/lib/utils/reminder";

export interface EventFormValues {
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  allDay: boolean;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  reminder: ReminderInput;
}

interface EventFormProps {
  open: boolean;
  mode: "create" | "edit";
  initialEvent?: CalendarEvent;
  defaultRange?: { startAt: string; endAt: string; allDay?: boolean };
  onClose: () => void;
  onSubmit: (values: EventFormValues) => void;
}

function getDefaultValues(defaultRange?: EventFormProps["defaultRange"]): EventFormValues {
  const startAt = defaultRange?.startAt ?? new Date().toISOString();
  const endAt =
    defaultRange?.endAt ??
    new Date(new Date(startAt).getTime() + 60 * 60 * 1000).toISOString();
  const allDay = defaultRange?.allDay ?? false;

  return {
    title: "",
    description: "",
    type: "meeting",
    status: "scheduled",
    allDay,
    startDate: toDateValue(startAt),
    startTime: toDateTimeLocalValue(startAt).split("T")[1] ?? "09:00",
    endDate: toDateValue(endAt),
    endTime: toDateTimeLocalValue(endAt).split("T")[1] ?? "10:00",
    reminder: { ...DEFAULT_REMINDER_INPUT },
  };
}

function eventToFormValues(event: CalendarEvent): EventFormValues {
  return {
    title: event.title,
    description: event.description ?? "",
    type: event.type,
    status: event.status,
    allDay: Boolean(event.allDay),
    startDate: toDateValue(event.startAt),
    startTime: toDateTimeLocalValue(event.startAt).split("T")[1] ?? "09:00",
    endDate: toDateValue(event.endAt),
    endTime: toDateTimeLocalValue(event.endAt).split("T")[1] ?? "10:00",
    reminder: { ...DEFAULT_REMINDER_INPUT },
  };
}

export function EventForm({
  open,
  mode,
  initialEvent,
  defaultRange,
  onClose,
  onSubmit,
}: EventFormProps) {
  const [values, setValues] = useState<EventFormValues>(getDefaultValues());
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialEvent) {
      setValues(eventToFormValues(initialEvent));
    } else {
      setValues(getDefaultValues(defaultRange));
    }
    setError("");
  }, [open, mode, initialEvent, defaultRange]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!values.title.trim()) {
      setError("Başlık zorunludur.");
      return;
    }

    if (!values.allDay) {
      const start = new Date(`${values.startDate}T${values.startTime}`);
      const end = new Date(`${values.endDate}T${values.endTime}`);
      if (end <= start) {
        setError("Bitiş zamanı başlangıçtan sonra olmalıdır.");
        return;
      }
    }

    if (values.reminder.enabled && !values.reminder.triggerAt) {
      setError("Hatırlatma için tetikleme zamanı gerekli.");
      return;
    }

    onSubmit({
      ...values,
      title: values.title.trim(),
      description: values.description.trim(),
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      title={mode === "create" ? "Yeni Etkinlik" : "Etkinliği Düzenle"}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Vazgeç
          </Button>
          <Button type="submit" form="event-form">
            {mode === "create" ? "Oluştur" : "Kaydet"}
          </Button>
        </>
      }
    >
      <form id="event-form" onSubmit={handleSubmit} className="min-w-0 space-y-4 overflow-x-hidden">
        <div>
          <label htmlFor="event-title" className="mb-1 block text-sm font-medium">
            Başlık *
          </label>
          <input
            id="event-title"
            value={values.title}
            onChange={(e) => setValues((prev) => ({ ...prev, title: e.target.value }))}
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
            onChange={(e) =>
              setValues((prev) => ({ ...prev, description: e.target.value }))
            }
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
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  type: e.target.value as EventType,
                }))
              }
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
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  status: e.target.value as EventStatus,
                }))
              }
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              <option value="scheduled">Planlandı</option>
              <option value="completed">Tamamlandı</option>
              <option value="cancelled">İptal</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={values.allDay}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, allDay: e.target.checked }))
            }
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
              onChange={(startDate) =>
                setValues((prev) => ({ ...prev, startDate }))
              }
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
                onChange={(startTime) =>
                  setValues((prev) => ({ ...prev, startTime }))
                }
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
              onChange={(endDate) =>
                setValues((prev) => ({ ...prev, endDate }))
              }
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
                onChange={(endTime) =>
                  setValues((prev) => ({ ...prev, endTime }))
                }
              />
            </div>
          )}
        </div>

        <ReminderFields
          idPrefix="event-reminder"
          value={values.reminder}
          suggestedTriggerAt={getEventReminderDefault(
            values.startDate,
            values.startTime,
            values.allDay
          )}
          onChange={(reminder) =>
            setValues((prev) => ({ ...prev, reminder }))
          }
        />
      </form>
    </Modal>
  );
}
