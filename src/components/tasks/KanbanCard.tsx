"use client";

import type { Task } from "@/lib/types";
import { TASK_PRIORITY_LABELS } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CalendarLinkActions } from "@/components/ui/CalendarLinkActions";
import { formatDate, isOverdue } from "@/lib/utils/date";
import { canAddTaskToCalendar, getCalendarLinkDate } from "@/lib/utils/eventLinking";

interface KanbanCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAddToCalendar: (task: Task) => void;
}

export function KanbanCard({ task, onEdit, onDelete, onAddToCalendar }: KanbanCardProps) {
  const overdue =
    task.deadline && task.status !== "done" && isOverdue(task.deadline);

  return (
    <article
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/task-id", task.id);
        event.dataTransfer.effectAllowed = "move";
      }}
      className={`cursor-grab rounded-lg border bg-white p-3 shadow-sm active:cursor-grabbing ${
        overdue ? "border-red-200" : "border-border"
      }`}
    >
      <p className="font-medium leading-snug">{task.title}</p>

      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-muted">{task.description}</p>
      )}

      <div className="mt-2 flex flex-wrap gap-1.5">
        <Badge>{TASK_PRIORITY_LABELS[task.priority]}</Badge>
        {overdue && <Badge variant="danger">Gecikmiş</Badge>}
      </div>

      {task.deadline && (
        <p className="mt-2 text-xs text-muted">{formatDate(task.deadline)}</p>
      )}

      <div className="mt-2 flex flex-wrap gap-1">
        <Button
          variant="ghost"
          type="button"
          className="px-2 py-1 text-xs"
          onClick={() => onEdit(task)}
        >
          Düzenle
        </Button>
        <Button
          variant="ghost"
          type="button"
          className="px-2 py-1 text-xs"
          onClick={() => onDelete(task)}
        >
          Sil
        </Button>
        <CalendarLinkActions
          eventId={task.eventId}
          canAdd={canAddTaskToCalendar(task)}
          calendarDate={task.deadline ? getCalendarLinkDate(task.deadline) : undefined}
          disabledTitle="Deadline gerekli"
          onAdd={() => onAddToCalendar(task)}
          compact
        />
      </div>
    </article>
  );
}
