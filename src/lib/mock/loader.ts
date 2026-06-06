import eventsData from "@/data/events.json";
import tasksData from "@/data/tasks.json";
import workflowsData from "@/data/workflows.json";
import remindersData from "@/data/reminders.json";
import type { CalendarEvent, Task, Workflow, Reminder } from "@/lib/types";

export function loadEvents(): CalendarEvent[] {
  return eventsData as CalendarEvent[];
}

export function loadTasks(): Task[] {
  return tasksData as Task[];
}

export function loadWorkflows(): Workflow[] {
  return workflowsData as Workflow[];
}

export function loadReminders(): Reminder[] {
  return remindersData as Reminder[];
}
