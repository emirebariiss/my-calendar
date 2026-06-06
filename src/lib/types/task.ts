export type TaskStatus = "not_started" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  deadline?: string;
  tags?: string[];
  reminderIds?: string[];
  eventId?: string;
  workflowId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export const TASK_STATUS_LABELS: Record<TaskStatus, string> = {
  not_started: "Başlanmadı",
  in_progress: "Devam ediyor",
  done: "Tamamlandı",
};

export const TASK_PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: "Düşük",
  medium: "Orta",
  high: "Yüksek",
};
