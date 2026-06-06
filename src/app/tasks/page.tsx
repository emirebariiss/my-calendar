"use client";

import { useMemo, useState } from "react";
import { useTasks } from "@/hooks/useTasks";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  type TaskPriority,
  type TaskStatus,
} from "@/lib/types";
import { filterByStatus, sortByPriority } from "@/lib/utils/filters";
import { formatDate, isOverdue } from "@/lib/utils/date";

export default function TasksPage() {
  const { tasks } = useTasks();
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | "all">(
    "all"
  );

  const filteredTasks = useMemo(() => {
    let result = filterByStatus(tasks, statusFilter);
    if (priorityFilter !== "all") {
      result = result.filter((task) => task.priority === priorityFilter);
    }
    return sortByPriority(result);
  }, [tasks, statusFilter, priorityFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as TaskStatus | "all")
          }
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
        >
          <option value="all">Tüm durumlar</option>
          <option value="not_started">Başlanmadı</option>
          <option value="in_progress">Devam ediyor</option>
          <option value="done">Tamamlandı</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) =>
            setPriorityFilter(e.target.value as TaskPriority | "all")
          }
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
        >
          <option value="all">Tüm öncelikler</option>
          <option value="high">Yüksek</option>
          <option value="medium">Orta</option>
          <option value="low">Düşük</option>
        </select>
      </div>

      <Card title={`Görevler (${filteredTasks.length})`}>
        {filteredTasks.length === 0 ? (
          <EmptyState title="Görev bulunamadı" />
        ) : (
          <ul className="space-y-3">
            {filteredTasks.map((task) => {
              const overdue =
                task.deadline &&
                task.status !== "done" &&
                isOverdue(task.deadline);

              return (
                <li
                  key={task.id}
                  className={`rounded-lg border px-4 py-3 ${
                    overdue
                      ? "border-red-200 bg-red-50/40"
                      : "border-border bg-white"
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      {task.description && (
                        <p className="mt-1 text-sm text-muted">
                          {task.description}
                        </p>
                      )}
                      <p className="mt-2 text-xs text-muted">
                        {task.deadline
                          ? `Deadline: ${formatDate(task.deadline)}`
                          : "Süresiz"}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="info">
                        {TASK_STATUS_LABELS[task.status]}
                      </Badge>
                      <Badge>
                        {TASK_PRIORITY_LABELS[task.priority]}
                      </Badge>
                      {overdue && <Badge variant="danger">Gecikmiş</Badge>}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
