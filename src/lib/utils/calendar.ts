import { format, parseISO } from "date-fns";
import type { CalendarEvent, EventType } from "@/lib/types";
import { EVENT_COLORS } from "@/lib/types";

export function getEventColor(event: CalendarEvent): string {
  return event.color ?? EVENT_COLORS[event.type];
}

export function toDateTimeLocalValue(iso: string): string {
  return format(parseISO(iso), "yyyy-MM-dd'T'HH:mm");
}

export function toDateValue(iso: string): string {
  return format(parseISO(iso), "yyyy-MM-dd");
}

export function fromDateTimeLocalValue(value: string): string {
  return new Date(value).toISOString();
}

export function fromAllDayRange(startDate: string, endDate: string): {
  startAt: string;
  endAt: string;
} {
  const startAt = `${startDate}T00:00:00`;
  const endAt = `${endDate}T23:59:59`;
  return { startAt, endAt };
}

export function toFullCalendarEvent(event: CalendarEvent) {
  return {
    id: event.id,
    title: event.title,
    start: event.startAt,
    end: event.endAt,
    allDay: Boolean(event.allDay),
    backgroundColor: getEventColor(event),
    borderColor: getEventColor(event),
    extendedProps: {
      description: event.description,
      type: event.type,
      status: event.status,
    },
  };
}

export function defaultEventTimes(allDay: boolean): { startAt: string; endAt: string } {
  const now = new Date();
  if (allDay) {
    const date = format(now, "yyyy-MM-dd");
    return fromAllDayRange(date, date);
  }

  const start = new Date(now);
  start.setMinutes(0, 0, 0);
  const end = new Date(start);
  end.setHours(end.getHours() + 1);

  return {
    startAt: start.toISOString(),
    endAt: end.toISOString(),
  };
}

export function buildEventPayload(
  values: {
    title: string;
    description: string;
    type: EventType;
    status: CalendarEvent["status"];
    allDay: boolean;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
  }
): Omit<CalendarEvent, "id" | "createdAt" | "updatedAt"> {
  const startAt = values.allDay
    ? `${values.startDate}T00:00:00`
    : fromDateTimeLocalValue(`${values.startDate}T${values.startTime}`);
  const endAt = values.allDay
    ? `${values.endDate}T23:59:59`
    : fromDateTimeLocalValue(`${values.endDate}T${values.endTime}`);

  return {
    title: values.title,
    description: values.description || undefined,
    type: values.type,
    status: values.status,
    startAt,
    endAt,
    allDay: values.allDay,
    color: EVENT_COLORS[values.type],
  };
}
