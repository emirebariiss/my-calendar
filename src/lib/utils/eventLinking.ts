import type { CalendarEvent, Task, WorkflowStep } from "@/lib/types";
import { EVENT_COLORS } from "@/lib/types";
import { fromAllDayRange } from "@/lib/utils/calendar";

/** Takvim linki için YYYY-MM-DD (deadline / due date) */
export function getCalendarLinkDate(isoOrDate: string): string {
  return isoOrDate.slice(0, 10);
}

/** Bu göreve bağlı mevcut event var mı? (çift eklemeyi önler) */
export function findEventsForTask(
  events: CalendarEvent[],
  taskId: string
): CalendarEvent[] {
  return events.filter((event) => event.taskId === taskId);
}

/** Görev deadline'ı var ve henüz takvime eklenmemiş mi? */
export function canAddTaskToCalendar(task: Task): boolean {
  return Boolean(task.deadline) && !task.eventId;
}
/** Adım due date'i var ve henüz takvime eklenmemiş mi? */
export function canAddStepToCalendar(step: WorkflowStep): boolean {
  return Boolean(step.dueDate) && !step.eventId;
}

/**
 * Görev → all-day CalendarEvent payload.
 * Event ayrı entity kalır; taskId ile göreve bağlanır.
 */
export function buildEventFromTask(
  task: Task
): Omit<CalendarEvent, "id" | "createdAt" | "updatedAt"> {
  if (!task.deadline) {
    throw new Error("Deadline olmayan görev takvime eklenemez.");
  }

  const { startAt, endAt } = fromAllDayRange(task.deadline, task.deadline);

  return {
    title: task.title,
    description: task.description,
    type: "custom",
    status: "scheduled",
    startAt,
    endAt,
    allDay: true,
    color: EVENT_COLORS.custom,
    taskId: task.id,
  };
}

/**
 * Workflow adımı → all-day CalendarEvent payload.
 * Step.eventId ile geri bağlantı kurulur (event.taskId kullanılmaz).
 */
export function buildEventFromStep(
  step: WorkflowStep,
  workflowTitle: string
): Omit<CalendarEvent, "id" | "createdAt" | "updatedAt"> {
  if (!step.dueDate) {
    throw new Error("Due date olmayan adım takvime eklenemez.");
  }

  const { startAt, endAt } = fromAllDayRange(step.dueDate, step.dueDate);

  return {
    title: `${step.order}. ${step.title}`,
    description: `Süreç: ${workflowTitle}`,
    type: "study",
    status: "scheduled",
    startAt,
    endAt,
    allDay: true,
    color: EVENT_COLORS.study,
  };
}
