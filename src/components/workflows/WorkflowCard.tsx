"use client";

import Link from "next/link";
import type { Workflow } from "@/lib/types";
import { WORKFLOW_STATUS_LABELS } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { getWorkflowProgress } from "@/lib/utils/filters";

interface WorkflowCardProps {
  workflow: Workflow;
  onEdit?: () => void;
  onDelete?: () => void;
}

export function WorkflowCard({ workflow, onEdit, onDelete }: WorkflowCardProps) {
  const progress = getWorkflowProgress(workflow);
  const activeStep = workflow.steps.find((step) => step.status === "in_progress");

  return (
    <article className="min-w-0 rounded-lg border border-border bg-white p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <Link
            href={`/workflows/${workflow.id}`}
            className="font-medium text-primary hover:underline"
          >
            {workflow.title}
          </Link>
          {workflow.description && (
            <p className="mt-1 text-sm text-muted">{workflow.description}</p>
          )}
          {activeStep && (
            <p className="mt-2 text-xs text-muted">
              Aktif adım: {activeStep.title}
            </p>
          )}
        </div>
        <Badge variant={workflow.status === "completed" ? "success" : "info"}>
          {WORKFLOW_STATUS_LABELS[workflow.status]}
        </Badge>
      </div>

      <div className="mt-4">
        <ProgressBar
          value={progress.percentage}
          label={`${progress.completed}/${progress.total} adım`}
        />
      </div>

      {(onEdit || onDelete) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {onEdit && (
            <Button variant="secondary" type="button" onClick={onEdit}>
              Düzenle
            </Button>
          )}
          {onDelete && (
            <Button variant="ghost" type="button" onClick={onDelete}>
              Sil
            </Button>
          )}
        </div>
      )}
    </article>
  );
}
