"use client";

import { useState } from "react";
import { notFound, useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useWorkflows } from "@/hooks/useWorkflows";
import { useReminders } from "@/hooks/useReminders";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { StepList } from "@/components/workflows/StepList";
import {
  WorkflowForm,
  type WorkflowFormValues,
} from "@/components/workflows/WorkflowForm";
import {
  DEFAULT_REMINDER_INPUT,
  WORKFLOW_STATUS_LABELS,
  type WorkflowStep,
} from "@/lib/types";
import { getWorkflowProgress } from "@/lib/utils/filters";
import {
  appendReminderId,
  createReminderFromInput,
} from "@/lib/utils/reminder";
import { buildWorkflowSteps, deriveWorkflowStatus } from "@/lib/utils/workflow";

export default function WorkflowDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { workflows, updateWorkflow, deleteWorkflow, updateStep } = useWorkflows();
  const { addReminder } = useReminders();
  const [formOpen, setFormOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const workflow = workflows.find((item) => item.id === params.id);

  if (!workflow) {
    notFound();
  }

  const progress = getWorkflowProgress(workflow);

  const attachStepReminders = (
    workflowId: string,
    steps: WorkflowStep[],
    stepInputs: WorkflowFormValues["steps"]
  ) => {
    steps.forEach((step, index) => {
      const reminderPayload = createReminderFromInput(
        stepInputs[index]?.reminder ?? DEFAULT_REMINDER_INPUT,
        {
          targetType: "workflow_step",
          targetId: step.id,
          title: `${step.title} hatırlatması`,
        }
      );

      if (reminderPayload) {
        const reminderId = addReminder(reminderPayload);
        updateStep(workflowId, step.id, {
          reminderIds: appendReminderId(step.reminderIds, reminderId),
        });
      }
    });
  };

  const handleSubmit = (values: WorkflowFormValues) => {
    const steps = buildWorkflowSteps(
      values.steps.map((step) => ({
        title: step.title,
        dueDate: step.dueDate || undefined,
      })),
      workflows,
      workflow.steps
    );

    updateWorkflow(workflow.id, {
      title: values.title,
      description: values.description || undefined,
      steps,
      status: deriveWorkflowStatus(steps),
    });
    attachStepReminders(workflow.id, steps, values.steps);
  };

  const handleDeleteConfirm = () => {
    deleteWorkflow(workflow.id);
    setDeleteConfirmOpen(false);
    router.push("/workflows");
  };

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
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link href="/workflows" className="text-sm font-medium text-primary">
          ← Süreçlere dön
        </Link>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={() => setFormOpen(true)}>
            Düzenle
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={() => setDeleteConfirmOpen(true)}
          >
            Sil
          </Button>
        </div>
      </div>

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

      <WorkflowForm
        open={formOpen}
        mode="edit"
        initialWorkflow={workflow}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={deleteConfirmOpen}
        title="Süreci sil"
        message={`"${workflow.title}" sürecini silmek istediğine emin misin?`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmOpen(false)}
      />
    </div>
  );
}
