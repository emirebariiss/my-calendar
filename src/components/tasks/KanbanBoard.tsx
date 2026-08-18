"use client";

import { useMemo } from "react";
import type { Task, TaskStatus } from "@/lib/types";
import { KANBAN_COLUMNS } from "@/lib/constants/kanban";
import { sortByPriority } from "@/lib/utils/filters";
import { KanbanColumn } from "./KanbanColumn";

interface KanbanBoardProps {
  tasks: Task[];
  onMoveTask: (taskId: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function KanbanBoard({
  tasks,
  onMoveTask,
  onEdit,
  onDelete,
}: KanbanBoardProps) {
  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, Task[]> = {
      not_started: [],
      in_progress: [],
      done: [],
    };

    for (const task of tasks) {
      grouped[task.status].push(task);
    }

    for (const status of Object.keys(grouped) as TaskStatus[]) {
      grouped[status] = sortByPriority(grouped[status]);
    }

    return grouped;
  }, [tasks]);

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {KANBAN_COLUMNS.map((column) => (
        <KanbanColumn
          key={column.status}
          title={column.title}
          status={column.status}
          tasks={tasksByStatus[column.status]}
          onDropTask={onMoveTask}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
