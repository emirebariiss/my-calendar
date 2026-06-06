"use client";

import Link from "next/link";
import { useTasks } from "@/hooks/useTasks";
import { useWorkflows } from "@/hooks/useWorkflows";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { getOverdueSteps, getOverdueTasks } from "@/lib/utils/filters";
import { formatDate } from "@/lib/utils/date";

export function OverdueSection() {
  const { tasks } = useTasks();
  const { workflows } = useWorkflows();

  const overdueTasks = getOverdueTasks(tasks);
  const overdueSteps = getOverdueSteps(workflows);
  const hasItems = overdueTasks.length > 0 || overdueSteps.length > 0;

  return (
    <Card
      title="Gecikmiş İşler"
      action={
        <Link href="/tasks" className="text-sm font-medium text-primary">
          Tümünü gör →
        </Link>
      }
    >
      {!hasItems ? (
        <EmptyState title="Gecikmiş iş yok" description="Harika gidiyorsun!" />
      ) : (
        <ul className="space-y-3">
          {overdueTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-red-100 bg-red-50/50 px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium">{task.title}</p>
                <p className="text-xs text-red-600">
                  Görev · {task.deadline && formatDate(task.deadline)}
                </p>
              </div>
              <Badge variant="danger">Gecikmiş</Badge>
            </li>
          ))}
          {overdueSteps.map(({ workflow, step }) => (
            <li
              key={step.id}
              className="flex items-center justify-between gap-3 rounded-lg border border-red-100 bg-red-50/50 px-3 py-2"
            >
              <div>
                <p className="text-sm font-medium">{step.title}</p>
                <p className="text-xs text-red-600">
                  {workflow.title} · {step.dueDate && formatDate(step.dueDate)}
                </p>
              </div>
              <Badge variant="danger">Gecikmiş</Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
