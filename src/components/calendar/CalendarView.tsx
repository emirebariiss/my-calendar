"use client";

import { useMemo, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type {
  DateSelectArg,
  EventClickArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core";
import trLocale from "@fullcalendar/core/locales/tr";
import type { CalendarEvent } from "@/lib/types";
import { toFullCalendarEvent } from "@/lib/utils/calendar";

interface CalendarViewProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateSelect: (range: { startAt: string; endAt: string; allDay: boolean }) => void;
  onEventDrop: (eventId: string, startAt: string, endAt: string, allDay: boolean) => void;
}

export function CalendarView({
  events,
  onEventClick,
  onDateSelect,
  onEventDrop,
}: CalendarViewProps) {
  const eventsMap = useMemo(
    () => new Map(events.map((event) => [event.id, event])),
    [events]
  );

  const calendarEvents = useMemo<EventInput[]>(
    () => events.map(toFullCalendarEvent),
    [events]
  );

  const eventsMapRef = useRef(eventsMap);
  eventsMapRef.current = eventsMap;

  const handleEventClick = (info: EventClickArg) => {
    const event = eventsMapRef.current.get(info.event.id);
    if (event) onEventClick(event);
  };

  const handleDateSelect = (info: DateSelectArg) => {
    onDateSelect({
      startAt: info.start.toISOString(),
      endAt: info.end.toISOString(),
      allDay: info.allDay,
    });
  };

  const handleEventDrop = (info: EventDropArg) => {
    onEventDrop(
      info.event.id,
      info.event.start?.toISOString() ?? "",
      info.event.end?.toISOString() ?? info.event.start?.toISOString() ?? "",
      info.event.allDay
    );
  };

  return (
    <div className="calendar-wrapper rounded-xl border border-border bg-white p-2 sm:p-4">
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        locale={trLocale}
        initialView="timeGridWeek"
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        buttonText={{
          today: "Bugün",
          month: "Ay",
          week: "Hafta",
          day: "Gün",
        }}
        height="auto"
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        allDaySlot
        editable
        selectable
        selectMirror
        dayMaxEvents
        weekends
        events={calendarEvents}
        eventClick={handleEventClick}
        select={handleDateSelect}
        eventDrop={handleEventDrop}
      />
    </div>
  );
}
