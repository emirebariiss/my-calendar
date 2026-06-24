import type { ReminderRecurrence, ReminderTargetType } from "@/lib/types";

export interface ReminderFormValues {
  title: string;
  targetType: ReminderTargetType;
  targetId: string;
  triggerAt: string;
  recurrence: ReminderRecurrence;
}
