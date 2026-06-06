import type { CalendarEvent } from "@/lib/types";
import { EVENT_TYPE_LABELS } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatDateTime, formatTime } from "@/lib/utils/date";
import { getEventColor } from "@/lib/utils/calendar";

interface EventCardProps {
  event: CalendarEvent;
  onClick?: () => void;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const color = getEventColor(event);

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-lg border border-border bg-white p-4 text-left transition-shadow hover:shadow-sm"
    >
      <div className="flex items-start gap-3">
        <span
          className="mt-1 h-10 w-1 shrink-0 rounded-full"
          style={{ backgroundColor: color }}
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-medium">{event.title}</p>
            <Badge>{EVENT_TYPE_LABELS[event.type]}</Badge>
          </div>
          {event.description && (
            <p className="mt-1 text-sm text-muted">{event.description}</p>
          )}
          <p className="mt-2 text-xs text-muted">
            {event.allDay
              ? `Tüm gün · ${formatDate(event.startAt)}`
              : `${formatDateTime(event.startAt)} – ${formatTime(event.endAt)}`}
          </p>
        </div>
      </div>
    </button>
  );
}
