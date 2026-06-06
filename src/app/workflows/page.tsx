"use client";

import Link from "next/link";
import { useWorkflows } from "@/hooks/useWorkflows";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { WORKFLOW_STATUS_LABELS } from "@/lib/types";
import { getWorkflowProgress } from "@/lib/utils/filters";

export default function WorkflowsPage() {
  const { workflows } = useWorkflows();

  return (
    <div className="space-y-6">
      <Card title={`Süreçler (${workflows.length})`}>
        {workflows.length === 0 ? (
          <EmptyState title="Süreç bulunamadı" />
        ) : (
          <ul className="space-y-4">
            {workflows.map((workflow) => {
              const progress = getWorkflowProgress(workflow);
              const activeStep = workflow.steps.find(
                (step) => step.status === "in_progress"
              );

              return (
                <li
                  key={workflow.id}
                  className="rounded-lg border border-border bg-white p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/workflows/${workflow.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {workflow.title}
                      </Link>
                      {workflow.description && (
                        <p className="mt-1 text-sm text-muted">
                          {workflow.description}
                        </p>
                      )}
                      {activeStep && (
                        <p className="mt-2 text-xs text-muted">
                          Aktif adım: {activeStep.title}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={
                        workflow.status === "completed" ? "success" : "info"
                      }
                    >
                      {WORKFLOW_STATUS_LABELS[workflow.status]}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <ProgressBar
                      value={progress.percentage}
                      label={`${progress.completed}/${progress.total} adım`}
                    />
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
