"use client";

import type { Task } from "@/lib/types";
import { TASK_STATUS_LABELS } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/tasks/PriorityBadge";
import { Button } from "@/components/ui/Button";
import { CalendarLinkActions } from "@/components/ui/CalendarLinkActions";
import { TagList } from "@/components/ui/TagList";
import { DeadlineLine } from "@/components/tasks/DeadlineLine";
import { useTags } from "@/hooks/useTags";
import { isOverdue } from "@/lib/utils/date";
import { canAddTaskToCalendar, getCalendarLinkDate } from "@/lib/utils/eventLinking";

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAddToCalendar: (task: Task) => void;
}

export function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
  onAddToCalendar,
}: TaskItemProps) {
  const { customTags } = useTags();
  const overdue =
    task.deadline && task.status !== "done" && isOverdue(task.deadline);
  const isDone = task.status === "done";

  return (
    <li
      className={`rounded-lg border px-4 py-3 ${
        overdue
          ? "border-red-200 bg-red-50/40 dark:border-red-900 dark:bg-red-950/40"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isDone}
          onChange={() => onToggle(task)}
          className="mt-1 h-4 w-4 rounded border-border"
          aria-label={`${task.title} tamamlandı olarak işaretle`}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
            <p
              className={`min-w-0 flex-1 font-medium ${isDone ? "text-muted line-through" : ""}`}
            >
              {task.title}
            </p>
            <div className="flex shrink-0 flex-wrap gap-2">
              <StatusBadge variant="info">{TASK_STATUS_LABELS[task.status]}</StatusBadge>
              <PriorityBadge priority={task.priority} />
            </div>
          </div>

          {task.description && (
            <p className="mt-1 text-sm text-muted">{task.description}</p>
          )}

          <DeadlineLine deadline={task.deadline} overdue={Boolean(overdue)} />

          <TagList
            tags={task.tags}
            customTags={customTags}
            maxVisible={2}
            className="mt-2"
          />

          <div className="mt-3 flex flex-wrap gap-2">
            <Button variant="secondary" type="button" onClick={() => onEdit(task)}>
              Düzenle
            </Button>
            <Button variant="ghost" type="button" onClick={() => onDelete(task)}>
              Sil
            </Button>
            <CalendarLinkActions
              eventId={task.eventId}
              canAdd={canAddTaskToCalendar(task)}
              calendarDate={task.deadline ? getCalendarLinkDate(task.deadline) : undefined}
              disabledTitle="Deadline gerekli"
              onAdd={() => onAddToCalendar(task)}
            />
          </div>
        </div>
      </div>
    </li>
  );
}
