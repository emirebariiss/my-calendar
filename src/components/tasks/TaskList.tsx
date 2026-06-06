"use client";

import { useMemo, useState } from "react";
import type { Task, TaskPriority, TaskStatus } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { TaskItem } from "./TaskItem";
import { filterByStatus, sortByPriority } from "@/lib/utils/filters";

interface TaskListProps {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskList({ tasks, onToggle, onEdit, onDelete }: TaskListProps) {
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
    <div className="space-y-4">
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
            {filteredTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={onToggle}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
