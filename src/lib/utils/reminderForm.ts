import type { Reminder, ReminderRecurrence, ReminderTargetType } from "@/lib/types";
import { toDateTimeLocalValue } from "@/lib/utils/calendar";
import { getDefaultReminderTriggerAt } from "@/lib/utils/reminder";

export interface ReminderFormValues {
  title: string;
  targetType: ReminderTargetType;
  targetId: string;
  triggerAt: string;
  recurrence: ReminderRecurrence;
}

export function getDefaultReminderFormValues(): ReminderFormValues {
  return {
    title: "",
    targetType: "task",
    targetId: "",
    triggerAt: getDefaultReminderTriggerAt(),
    recurrence: "once",
  };
}

export function reminderToFormValues(reminder: Reminder): ReminderFormValues {
  return {
    title: reminder.title,
    targetType: reminder.targetType,
    targetId: reminder.targetId,
    triggerAt: toDateTimeLocalValue(reminder.triggerAt),
    recurrence: reminder.recurrence,
  };
}
