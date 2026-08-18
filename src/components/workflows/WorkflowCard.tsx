"use client";

import Link from "next/link";
import type { Workflow } from "@/lib/types";
import { WORKFLOW_STATUS_LABELS } from "@/lib/types";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { TagList } from "@/components/ui/TagList";
import { useTags } from "@/hooks/useTags";
import { getWorkflowProgress } from "@/lib/utils/filters";

interface WorkflowCardProps {
  workflow: Workflow;
}

export function WorkflowCard({ workflow }: WorkflowCardProps) {
  const { customTags } = useTags();
  const progress = getWorkflowProgress(workflow);
  const activeStep = workflow.steps.find((step) => step.status === "in_progress");

  return (
    <article className="min-w-0 rounded-lg border border-border bg-card p-4">
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
          <TagList tags={workflow.tags} customTags={customTags} className="mt-2" />
        </div>
        <StatusBadge variant={workflow.status === "completed" ? "success" : "info"}>
          {WORKFLOW_STATUS_LABELS[workflow.status]}
        </StatusBadge>
      </div>

      <div className="mt-4">
        <ProgressBar
          value={progress.percentage}
          label={`${progress.completed}/${progress.total} adım`}
        />
      </div>
    </article>
  );
}
