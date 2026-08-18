"use client";

import type { Task, TaskStatus } from "@/lib/types";
import { KanbanCard } from "./KanbanCard";

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onDropTask: (taskId: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onAddToCalendar: (task: Task) => void;
}

export function KanbanColumn({
  title,
  status,
  tasks,
  onDropTask,
  onEdit,
  onDelete,
  onAddToCalendar,
}: KanbanColumnProps) {
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/task-id");
    if (taskId) onDropTask(taskId, status);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="flex min-h-[280px] min-w-0 flex-1 flex-col rounded-xl border border-border bg-slate-50/80 p-3"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold">{title}</h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs text-muted shadow-sm">
          {tasks.length}
        </span>
      </div>

      <ul className="flex flex-1 flex-col gap-2">
        {tasks.length === 0 ? (
          <li className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted">
            Kartı buraya sürükle
          </li>
        ) : (
          tasks.map((task) => (
            <li key={task.id}>
              <KanbanCard
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onAddToCalendar={onAddToCalendar}
              />
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
