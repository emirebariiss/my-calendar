"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useWorkflows } from "@/hooks/useWorkflows";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { STEP_STATUS_LABELS } from "@/lib/types";
import { getWorkflowProgress } from "@/lib/utils/filters";
import { formatDate, isOverdue } from "@/lib/utils/date";

export default function WorkflowDetailPage() {
  const params = useParams();
  const { workflows } = useWorkflows();
  const workflow = workflows.find((item) => item.id === params.id);

  if (!workflow) {
    return (
      <EmptyState
        title="Süreç bulunamadı"
        description="Geçersiz veya silinmiş bir süreç ID'si."
      />
    );
  }

  const progress = getWorkflowProgress(workflow);
  const sortedSteps = [...workflow.steps].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      <Link href="/workflows" className="text-sm font-medium text-primary">
        ← Süreçlere dön
      </Link>

      <Card title={workflow.title}>
        {workflow.description && (
          <p className="mb-4 text-sm text-muted">{workflow.description}</p>
        )}
        <ProgressBar
          value={progress.percentage}
          label={`${progress.completed}/${progress.total} adım tamamlandı`}
        />
      </Card>

      <Card title="Adımlar">
        <ul className="space-y-3">
          {sortedSteps.map((step) => {
            const overdue =
              step.dueDate &&
              step.status !== "completed" &&
              step.status !== "skipped" &&
              isOverdue(step.dueDate);

            return (
              <li
                key={step.id}
                className={`rounded-lg border px-4 py-3 ${
                  overdue
                    ? "border-red-200 bg-red-50/40"
                    : "border-border bg-white"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      {step.order}. {step.title}
                    </p>
                    {step.dueDate && (
                      <p className="mt-1 text-xs text-muted">
                        Tarih: {formatDate(step.dueDate)}
                      </p>
                    )}
                    {step.notes && (
                      <p className="mt-2 text-sm text-muted">{step.notes}</p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Badge
                      variant={
                        step.status === "completed" ? "success" : "default"
                      }
                    >
                      {STEP_STATUS_LABELS[step.status]}
                    </Badge>
                    {overdue && <Badge variant="danger">Gecikmiş</Badge>}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </div>
  );
}
