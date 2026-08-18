import type { ReminderInput, Workflow } from "@/lib/types";
import { DEFAULT_REMINDER_INPUT } from "@/lib/types";

export interface WorkflowStepInput {
  title: string;
  dueDate: string;
  reminder: ReminderInput;
}

export interface WorkflowFormValues {
  title: string;
  description: string;
  tags: string[];
  steps: WorkflowStepInput[];
}

export const EMPTY_STEP: WorkflowStepInput = {
  title: "",
  dueDate: "",
  reminder: { ...DEFAULT_REMINDER_INPUT },
};

export function getDefaultWorkflowFormValues(): WorkflowFormValues {
  return {
    title: "",
    description: "",
    tags: [],
    steps: [{ ...EMPTY_STEP }, { ...EMPTY_STEP }],
  };
}

export function workflowToFormValues(workflow: Workflow): WorkflowFormValues {
  const sorted = [...workflow.steps].sort((a, b) => a.order - b.order);
  return {
    title: workflow.title,
    description: workflow.description ?? "",
    tags: workflow.tags ?? [],
    steps: sorted.map((step) => ({
      title: step.title,
      dueDate: step.dueDate ?? "",
      reminder: { ...DEFAULT_REMINDER_INPUT },
    })),
  };
}
