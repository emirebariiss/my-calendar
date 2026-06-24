import { subMinutes } from "date-fns";
import type {
  CalendarEvent,
  Reminder,
  ReminderInput,
  ReminderTargetType,
  Task,
  Workflow,
} from "@/lib/types";
import { fromDateTimeLocalValue, toDateTimeLocalValue } from "@/lib/utils/calendar";

export interface ReminderTargetOption {
  id: string;
  label: string;
}

export function getDefaultReminderTriggerAt(): string {
  const next = new Date();
  next.setMinutes(0, 0, 0);
  next.setHours(next.getHours() + 1);
  return toDateTimeLocalValue(next.toISOString());
}

export function getReminderTargetOptions(
  targetType: ReminderTargetType,
  events: CalendarEvent[],
  tasks: Task[],
  workflows: Workflow[]
): ReminderTargetOption[] {
  if (targetType === "event") {
    return events.map((event) => ({
      id: event.id,
      label: event.title,
    }));
  }

  if (targetType === "task") {
    return tasks.map((task) => ({
      id: task.id,
      label: task.title,
    }));
  }

  return workflows.flatMap((workflow) =>
    workflow.steps.map((step) => ({
      id: step.id,
      label: `${step.order}. ${step.title} — ${workflow.title}`,
    }))
  );
}

export function getEventReminderDefault(
  startDate: string,
  startTime: string,
  allDay: boolean
): string {
  if (allDay) {
    return `${startDate}T08:45`;
  }

  const start = new Date(`${startDate}T${startTime}`);
  return toDateTimeLocalValue(subMinutes(start, 15).toISOString());
}

export function getTaskReminderDefault(deadline?: string): string {
  const date = deadline ? new Date(`${deadline}T09:00:00`) : new Date();

  if (deadline) {
    date.setDate(date.getDate() - 1);
  } else {
    date.setDate(date.getDate() + 1);
  }

  date.setHours(9, 0, 0, 0);
  return toDateTimeLocalValue(date.toISOString());
}

export function getStepReminderDefault(dueDate?: string): string {
  return getTaskReminderDefault(dueDate);
}

export function createReminderFromInput(
  input: ReminderInput,
  options: {
    targetType: ReminderTargetType;
    targetId: string;
    title: string;
    message?: string;
  }
): Omit<Reminder, "id" | "createdAt"> | null {
  if (!input.enabled || !input.triggerAt) {
    return null;
  }

  return {
    title: options.title,
    targetType: options.targetType,
    targetId: options.targetId,
    triggerAt: fromDateTimeLocalValue(input.triggerAt),
    recurrence: input.recurrence,
    isActive: true,
    message: options.message,
  };
}

export function appendReminderId(
  existing: string[] | undefined,
  reminderId: string
): string[] {
  return [...(existing ?? []), reminderId];
}
