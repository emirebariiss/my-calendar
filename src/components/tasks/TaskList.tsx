"use client";

import type { Task } from "@/lib/types";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  onToggle: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAddToCalendar: (task: Task) => void;
}

export function TaskList({
  tasks,
  onToggle,
  onEdit,
  onDelete,
  onAddToCalendar,
}: TaskListProps) {
  return (
    <Card title={`Görevler (${tasks.length})`}>
      {tasks.length === 0 ? (
        <EmptyState title="Görev bulunamadı" />
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddToCalendar={onAddToCalendar}
            />
          ))}
        </ul>
      )}
    </Card>
  );
}
