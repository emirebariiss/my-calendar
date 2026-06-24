import type { Reminder, Task, TaskPriority, Workflow, WorkflowStep } from "@/lib/types";
import { isOverdue, isUpcoming } from "./date";

const PRIORITY_ORDER: Record<TaskPriority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function filterByStatus<T extends { status: string }>(
  items: T[],
  status: string | "all"
): T[] {
  if (status === "all") return items;
  return items.filter((item) => item.status === status);
}

export function sortByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
  );
}

export function getOverdueTasks(tasks: Task[]): Task[] {
  return tasks.filter(
    (task) =>
      task.deadline &&
      task.status !== "done" &&
      isOverdue(task.deadline)
  );
}

export function getActiveWorkflows(workflows: Workflow[]): Workflow[] {
  return workflows.filter((wf) => wf.status === "active");
}

export function getWorkflowProgress(workflow: Workflow): {
  completed: number;
  total: number;
  percentage: number;
} {
  const total = workflow.steps.length;
  const completed = workflow.steps.filter((s) => s.status === "completed").length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { completed, total, percentage };
}

export function getOverdueSteps(workflows: Workflow[]): Array<{
  workflow: Workflow;
  step: WorkflowStep;
}> {
  const result: Array<{ workflow: Workflow; step: WorkflowStep }> = [];

  for (const workflow of workflows) {
    for (const step of workflow.steps) {
      if (
        step.dueDate &&
        step.status !== "completed" &&
        step.status !== "skipped" &&
        isOverdue(step.dueDate)
      ) {
        result.push({ workflow, step });
      }
    }
  }

  return result;
}
export function getUpcomingReminders(
  reminders: Reminder[],
  days = 7
): Reminder[] {
  return reminders
  .filter( (reminder) => reminder.isActive && isUpcoming(reminder.triggerAt, days))
  .sort((a, b) => new Date(a.triggerAt).getTime() - new Date(b.triggerAt).getTime());
}
