"use client";

import { useMemo, useState } from "react";
import { useWorkflows } from "@/hooks/useWorkflows";
import { useReminders } from "@/hooks/useReminders";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { WorkflowCard } from "@/components/workflows/WorkflowCard";
import {
  WorkflowForm,
  type WorkflowFormValues,
} from "@/components/workflows/WorkflowForm";
import type { WorkflowStatus, WorkflowStep } from "@/lib/types";
import { DEFAULT_REMINDER_INPUT } from "@/lib/types";
import {
  appendReminderId,
  createReminderFromInput,
} from "@/lib/utils/reminder";
import { buildWorkflowSteps, deriveWorkflowStatus } from "@/lib/utils/workflow";

export default function WorkflowsPage() {
  const { workflows, addWorkflow, updateStep } = useWorkflows();
  const { addReminder } = useReminders();
  const [statusFilter, setStatusFilter] = useState<WorkflowStatus | "all">(
    "all"
  );
  const [formOpen, setFormOpen] = useState(false);

  const filtered = useMemo(() => {
    if (statusFilter === "all") return workflows;
    return workflows.filter((workflow) => workflow.status === statusFilter);
  }, [workflows, statusFilter]);

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
      []
    );

    const payload = {
      title: values.title,
      description: values.description || undefined,
      steps,
      status: deriveWorkflowStatus(steps),
    };

    const workflowId = addWorkflow(payload);
    attachStepReminders(workflowId, steps, values.steps);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as WorkflowStatus | "all")
          }
          className="rounded-lg border border-border bg-white px-3 py-2 text-sm"
        >
          <option value="all">Tüm süreçler</option>
          <option value="active">Aktif</option>
          <option value="completed">Tamamlanmış</option>
        </select>
        <Button type="button" onClick={() => setFormOpen(true)}>
          + Yeni Süreç
        </Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="Süreç bulunamadı"
          description="Yeni bir süreç oluşturarak başla."
        />
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 [&>*]:min-w-0">
          {filtered.map((workflow) => (
            <WorkflowCard key={workflow.id} workflow={workflow} />
          ))}
        </div>
      )}

      <WorkflowForm
        open={formOpen}
        mode="create"
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
