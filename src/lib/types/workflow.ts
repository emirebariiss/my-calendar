export type StepStatus = "pending" | "in_progress" | "completed" | "skipped";
export type WorkflowStatus = "active" | "completed" | "archived";

export interface WorkflowStep {
  id: string;
  order: number;
  title: string;
  description?: string;
  status: StepStatus;
  dueDate?: string;
  notes?: string;
  completedAt?: string;
  reminderIds?: string[];
  eventId?: string;
}

export interface Workflow {
  id: string;
  title: string;
  description?: string;
  steps: WorkflowStep[];
  status: WorkflowStatus;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export const STEP_STATUS_LABELS: Record<StepStatus, string> = {
  pending: "Bekliyor",
  in_progress: "Devam ediyor",
  completed: "Tamamlandı",
  skipped: "Atlandı",
};

export const WORKFLOW_STATUS_LABELS: Record<WorkflowStatus, string> = {
  active: "Aktif",
  completed: "Tamamlandı",
  archived: "Arşivlendi",
};
