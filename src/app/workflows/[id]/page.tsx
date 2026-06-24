"use client";

import { notFound, useParams } from "next/navigation";
import Link from "next/link";
import { useWorkflows } from "@/hooks/useWorkflows";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StepList } from "@/components/workflows/StepList";
import { WORKFLOW_STATUS_LABELS, type WorkflowStep } from "@/lib/types";
import { getWorkflowProgress } from "@/lib/utils/filters";

export default function WorkflowDetailPage() {
  const params = useParams();
  const { workflows, updateStep } = useWorkflows();
  const workflow = workflows.find((item) => item.id === params.id);

  if (!workflow) {
    notFound();
  }

  const progress = getWorkflowProgress(workflow);

  const handleToggleComplete = (step: WorkflowStep) => {
    const nextStatus = step.status === "completed" ? "in_progress" : "completed";
    updateStep(workflow.id, step.id, { status: nextStatus });
  };

  const handleSetInProgress = (step: WorkflowStep) => {
    updateStep(workflow.id, step.id, { status: "in_progress" });
  };

  const handleUpdateNotes = (step: WorkflowStep, notes: string) => {
    updateStep(workflow.id, step.id, { notes: notes || undefined });
  };

  return (
    <div className="space-y-6">
      <Link href="/workflows" className="text-sm font-medium text-primary">
        ← Süreçlere dön
      </Link>

      <Card title={workflow.title}>
        <div className="mb-4 flex items-center gap-2">
          <Badge
            variant={workflow.status === "completed" ? "success" : "info"}
          >
            {WORKFLOW_STATUS_LABELS[workflow.status]}
          </Badge>
        </div>
        {workflow.description && (
          <p className="mb-4 text-sm text-muted">{workflow.description}</p>
        )}
        <ProgressBar
          value={progress.percentage}
          label={`${progress.completed}/${progress.total} adım tamamlandı`}
        />
      </Card>

      <Card title="Adımlar">
        <StepList
          workflow={workflow}
          onToggleComplete={handleToggleComplete}
          onUpdateNotes={handleUpdateNotes}
          onSetInProgress={handleSetInProgress}
        />
      </Card>
    </div>
  );
}
