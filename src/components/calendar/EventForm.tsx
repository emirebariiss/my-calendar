"use client";

import { useEffect, useState } from "react";
import type { CalendarEvent } from "@/lib/types";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { ReminderFields } from "@/components/reminders/ReminderFields";
import { getEventReminderDefault } from "@/lib/utils/reminder";
import { EventBasicFields } from "./EventBasicFields";
import { EventScheduleFields } from "./EventScheduleFields";
import {
  eventToFormValues,
  getDefaultValues,
  type EventFormDefaultRange,
  type EventFormValues,
} from "./eventFormUtils";

export type { EventFormValues };

interface EventFormProps {
  open: boolean;
  mode: "create" | "edit";
  initialEvent?: CalendarEvent;
  defaultRange?: EventFormDefaultRange;
  onClose: () => void;
  onSubmit: (values: EventFormValues) => void;
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

  const updateValues = (patch: Partial<EventFormValues>) => {
    setValues((prev) => ({ ...prev, ...patch }));
  };

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
      <form
        id="event-form"
        onSubmit={handleSubmit}
        className="min-w-0 space-y-4 overflow-x-hidden"
      >
        <EventBasicFields values={values} error={error} onChange={updateValues} />

        <EventScheduleFields values={values} onChange={updateValues} />

        <ReminderFields
          idPrefix="event-reminder"
          value={values.reminder}
          suggestedTriggerAt={getEventReminderDefault(
            values.startDate,
            values.startTime,
            values.allDay
          )}
          onChange={(reminder) => updateValues({ reminder })}
        />
      </form>
    </Modal>
  );
}
