"use client";

import type { Task } from "@/lib/types";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { Button } from "@/components/ui/Button";
import { CalendarLinkActions } from "@/components/ui/CalendarLinkActions";
import { TagList } from "@/components/ui/TagList";
import { DeadlineLine } from "@/components/tasks/DeadlineLine";
import { useTags } from "@/hooks/useTags";
import { isOverdue } from "@/lib/utils/date";
import { canAddTaskToCalendar, getCalendarLinkDate } from "@/lib/utils/eventLinking";

interface KanbanCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAddToCalendar: (task: Task) => void;
}

export function KanbanCard({ task, onEdit, onDelete, onAddToCalendar }: KanbanCardProps) {
  const { customTags } = useTags();
  const overdue =
    task.deadline && task.status !== "done" && isOverdue(task.deadline);

  return (
    <article
      draggable
      onDragStart={(event) => {
        event.dataTransfer.setData("text/task-id", task.id);
        event.dataTransfer.effectAllowed = "move";
      }}
      className={`cursor-grab rounded-lg border bg-card p-3 shadow-sm active:cursor-grabbing ${
        overdue
          ? "border-red-200 bg-red-50/40 dark:border-red-900 dark:bg-red-950/40"
          : "border-border"
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="min-w-0 flex-1 font-medium leading-snug">{task.title}</p>
        <PriorityBadge priority={task.priority} />
      </div>

      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-muted">{task.description}</p>
      )}

      {task.deadline ? (
        <DeadlineLine
          deadline={task.deadline}
          overdue={Boolean(overdue)}
          className="mt-2 text-xs text-muted"
        />
      ) : null}

      <TagList
        tags={task.tags}
        customTags={customTags}
        maxVisible={2}
        className="mt-2"
      />

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
