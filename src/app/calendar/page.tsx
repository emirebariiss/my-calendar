"use client";

import { useMemo, useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Card } from "@/components/ui/Card";
import { CalendarView } from "@/components/calendar/CalendarView";
import { EventCard } from "@/components/calendar/EventCard";
import { EventForm, type EventFormValues } from "@/components/calendar/EventForm";
import type { CalendarEvent } from "@/lib/types";
import { buildEventPayload, defaultEventTimes } from "@/lib/utils/calendar";

export default function CalendarPage() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | undefined>();
  const [deletingEvent, setDeletingEvent] = useState<CalendarEvent | undefined>();
  const [defaultRange, setDefaultRange] = useState<{
    startAt: string;
    endAt: string;
    allDay?: boolean;
  }>();

  const scheduledEvents = useMemo(
    () =>
      [...events]
        .filter((event) => event.status === "scheduled")
        .sort(
          (a, b) =>
            new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
        ),
    [events]
  );

  const openCreateForm = () => {
    const times = defaultEventTimes(false);
    setFormMode("create");
    setEditingEvent(undefined);
    setDefaultRange(times);
    setFormOpen(true);
  };

  const openEditForm = (event: CalendarEvent) => {
    setFormMode("edit");
    setEditingEvent(event);
    setDefaultRange(undefined);
    setFormOpen(true);
  };

  const handleDateSelect = (range: {
    startAt: string;
    endAt: string;
    allDay: boolean;
  }) => {
    setFormMode("create");
    setEditingEvent(undefined);
    setDefaultRange(range);
    setFormOpen(true);
  };

  const handleSubmit = (values: EventFormValues) => {
    const payload = buildEventPayload(values);

    if (formMode === "create") {
      addEvent(payload);
      return;
    }

    if (editingEvent) {
      updateEvent(editingEvent.id, payload);
    }
  };

  const handleEventDrop = (
    eventId: string,
    startAt: string,
    endAt: string,
    allDay: boolean
  ) => {
    updateEvent(eventId, { startAt, endAt, allDay });
  };

  const handleDeleteConfirm = () => {
    if (deletingEvent) {
      deleteEvent(deletingEvent.id);
      setDeletingEvent(undefined);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="text-sm text-muted">
          Gün, hafta ve ay görünümünde etkinliklerini yönet. Sürükle-bırak ile
          taşıyabilirsin.
        </p>
        <Button type="button" onClick={openCreateForm}>
          + Yeni Etkinlik
        </Button>
      </div>

      <CalendarView
        events={events}
        onEventClick={openEditForm}
        onDateSelect={handleDateSelect}
        onEventDrop={handleEventDrop}
      />

      <Card title="Yaklaşan Etkinlikler">
        {scheduledEvents.length === 0 ? (
          <p className="text-sm text-muted">Planlanmış etkinlik yok.</p>
        ) : (
          <ul className="space-y-3">
            {scheduledEvents.slice(0, 5).map((event) => (
              <li key={event.id}>
                <EventCard event={event} onClick={() => openEditForm(event)} />
              </li>
            ))}
          </ul>
        )}
      </Card>

      {formMode === "edit" && editingEvent && (
        <div className="flex justify-end">
          <Button
            variant="danger"
            type="button"
            onClick={() => {
              setFormOpen(false);
              setDeletingEvent(editingEvent);
            }}
          >
            Etkinliği Sil
          </Button>
        </div>
      )}

      <EventForm
        open={formOpen}
        mode={formMode}
        initialEvent={editingEvent}
        defaultRange={defaultRange}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deletingEvent)}
        title="Etkinliği sil"
        message={`"${deletingEvent?.title}" etkinliğini silmek istediğine emin misin?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingEvent(undefined)}
      />
    </div>
  );
}
