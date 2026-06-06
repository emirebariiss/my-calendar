"use client";

import Link from "next/link";
import { useWorkflows } from "@/hooks/useWorkflows";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getActiveWorkflows, getWorkflowProgress } from "@/lib/utils/filters";

export function ActiveWorkflows() {
  const { workflows } = useWorkflows();
  const active = getActiveWorkflows(workflows);

  return (
    <Card
      title="Aktif Süreçler"
      action={
        <Link href="/workflows" className="text-sm font-medium text-primary">
          Tümünü gör →
        </Link>
      }
    >
      {active.length === 0 ? (
        <EmptyState title="Aktif süreç yok" />
      ) : (
        <ul className="space-y-4">
          {active.map((workflow) => {
            const progress = getWorkflowProgress(workflow);
            return (
              <li key={workflow.id} className="space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-medium">{workflow.title}</p>
                  <span className="text-xs text-muted">
                    {progress.completed}/{progress.total}
                  </span>
                </div>
                <ProgressBar
                  value={progress.percentage}
                  label={`${progress.completed} adım tamamlandı`}
                />
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
