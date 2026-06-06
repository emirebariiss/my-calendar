"use client";

import type { Task } from "@/lib/types";
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
} from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, isOverdue } from "@/lib/utils/date";

interface TaskItemProps {
  task: Task;
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskItem({ task, onToggle, onEdit, onDelete }: TaskItemProps) {
  const overdue =
    task.deadline && task.status !== "done" && isOverdue(task.deadline);
  const isDone = task.status === "done";

  return (
    <li
      className={`rounded-lg border px-4 py-3 ${
        overdue ? "border-red-200 bg-red-50/40" : "border-border bg-white"
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
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p
                className={`font-medium ${isDone ? "text-muted line-through" : ""}`}
              >
                {task.title}
              </p>
              {task.description && (
                <p className="mt-1 text-sm text-muted">{task.description}</p>
              )}
              <p className="mt-2 text-xs text-muted">
                {task.deadline
                  ? `Deadline: ${formatDate(task.deadline)}`
                  : "Süresiz"}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="info">{TASK_STATUS_LABELS[task.status]}</Badge>
              <Badge>{TASK_PRIORITY_LABELS[task.priority]}</Badge>
              {overdue && <Badge variant="danger">Gecikmiş</Badge>}
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <Button variant="secondary" type="button" onClick={() => onEdit(task)}>
              Düzenle
            </Button>
            <Button variant="ghost" type="button" onClick={() => onDelete(task)}>
              Sil
            </Button>
          </div>
        </div>
      </div>
    </li>
  );
}
