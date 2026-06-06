"use client";

import Link from "next/link";
import { useEvents } from "@/hooks/useEvents";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { EVENT_TYPE_LABELS } from "@/lib/types";
import { formatDateTime, isUpcoming } from "@/lib/utils/date";

export function UpcomingEvents() {
  const { events } = useEvents();

  const upcoming = events
    .filter(
      (event) =>
        event.status === "scheduled" && isUpcoming(event.startAt, 7)
    )
    .sort(
      (a, b) =>
        new Date(a.startAt).getTime() - new Date(b.startAt).getTime()
    );

  return (
    <Card
      title="Yaklaşan Etkinlikler"
      action={
        <Link href="/calendar" className="text-sm font-medium text-primary">
          Tümünü gör →
        </Link>
      }
    >
      {upcoming.length === 0 ? (
        <EmptyState title="Önümüzdeki 7 günde etkinlik yok" />
      ) : (
        <ul className="space-y-3">
          {upcoming.map((event) => (
            <li
              key={event.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium">{event.title}</p>
                <p className="text-xs text-muted">
                  {formatDateTime(event.startAt)}
                </p>
              </div>
              <Badge>{EVENT_TYPE_LABELS[event.type]}</Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
