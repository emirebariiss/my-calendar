export type ReminderTargetType = "event" | "task" | "workflow_step";
export type ReminderRecurrence = "once" | "daily" | "weekly";

export interface Reminder {
  id: string;
  title: string;
  targetType: ReminderTargetType;
  targetId: string;
  triggerAt: string;
  recurrence: ReminderRecurrence;
  isActive: boolean;
  message?: string;
  createdAt: string;
}

export const REMINDER_TARGET_LABELS: Record<ReminderTargetType, string> = {
  event: "Etkinlik",
  task: "Görev",
  workflow_step: "Süreç adımı",
};

export const REMINDER_RECURRENCE_LABELS: Record<ReminderRecurrence, string> = {
  once: "Tek seferlik",
  daily: "Günlük",
  weekly: "Haftalık",
};
