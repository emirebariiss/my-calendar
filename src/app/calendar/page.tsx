"use client";

import { useMemo, useState } from "react";
import { useEvents } from "@/hooks/useEvents";
import { useReminders } from "@/hooks/useReminders";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Card } from "@/components/ui/Card";
import { CalendarView } from "@/components/calendar/CalendarView";
import { EventCard } from "@/components/calendar/EventCard";
import { EventForm, type EventFormValues } from "@/components/calendar/EventForm";
import type { CalendarEvent } from "@/lib/types";
import { buildEventPayload, defaultEventTimes } from "@/lib/utils/calendar";
import { appendReminderId, createReminderFromInput } from "@/lib/utils/reminder";
import { EmptyState } from "@/components/ui/EmptyState";

export default function CalendarPage() {
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const { addReminder } = useReminders();
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
    const reminderPayload = createReminderFromInput(values.reminder, {
      targetType: "event",
      targetId: "",
      title: `${values.title} hatırlatması`,
    });

    if (formMode === "create") {
      const eventId = addEvent(payload);

      if (reminderPayload) {
        const reminderId = addReminder({ ...reminderPayload, targetId: eventId });
        updateEvent(eventId, {
          reminderIds: appendReminderId(undefined, reminderId),
        });
      }
      return;
    }

    if (editingEvent) {
      updateEvent(editingEvent.id, payload);

      if (reminderPayload) {
        const reminderId = addReminder({
          ...reminderPayload,
          targetId: editingEvent.id,
        });
        updateEvent(editingEvent.id, {
          reminderIds: appendReminderId(editingEvent.reminderIds, reminderId),
        });
      }
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
          <EmptyState 
          title="Planlanmış etkinlik yok" 
          description="Yeni bir etkinlik oluşturarak başla." />
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

      <EventForm
        open={formOpen}
        mode={formMode}
        initialEvent={editingEvent}
        defaultRange={defaultRange}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        onDelete={
          formMode === "edit" && editingEvent
            ? () => {
                setFormOpen(false);
                setDeletingEvent(editingEvent);
              }
            : undefined
        }
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
