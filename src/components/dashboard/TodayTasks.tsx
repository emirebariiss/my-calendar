"use client";

import Link from "next/link";
import { useTasks } from "@/hooks/useTasks";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { TASK_PRIORITY_LABELS } from "@/lib/types";
import { formatDate, isToday } from "@/lib/utils/date";

export function TodayTasks() {
  const { tasks } = useTasks();

  const todayTasks = tasks.filter(
    (task) =>
      task.status !== "done" &&
      (task.status === "in_progress" ||
        (task.deadline && isToday(task.deadline)))
  );

  return (
    <Card
      title="Bugünün Görevleri"
      action={
        <Link href="/tasks" className="text-sm font-medium text-primary">
          Tümünü gör →
        </Link>
      }
    >
      {todayTasks.length === 0 ? (
        <EmptyState
          title="Bugün için görev yok"
          description="Yeni görev ekleyebilir veya deadline'sız görevlere bakabilirsin."
        />
      ) : (
        <ul className="space-y-3">
          {todayTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-border px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium">{task.title}</p>
                <p className="text-xs text-muted">
                  {task.deadline
                    ? formatDate(task.deadline)
                    : "Süresiz · devam ediyor"}
                </p>
              </div>
              <Badge variant="info">
                {TASK_PRIORITY_LABELS[task.priority]}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
