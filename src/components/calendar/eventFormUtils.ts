import type { CalendarEvent, EventStatus, EventType, ReminderInput } from "@/lib/types";
import { DEFAULT_REMINDER_INPUT } from "@/lib/types";
import { toDateTimeLocalValue, toDateValue } from "@/lib/utils/calendar";

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

export type EventFormDefaultRange = {
  startAt: string;
  endAt: string;
  allDay?: boolean;
};

export function getDefaultValues(
  defaultRange?: EventFormDefaultRange
): EventFormValues {
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

export function eventToFormValues(event: CalendarEvent): EventFormValues {
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
