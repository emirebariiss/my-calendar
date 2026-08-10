import {
  loadEvents,
  loadReminders,
  loadTasks,
  loadWorkflows,
} from "@/lib/mock/loader";
import type {
  CalendarEvent,
  Reminder,
  Task,
  Workflow,
} from "@/lib/types";

const STORAGE_KEY = "my-calendar-app-data";
const STORAGE_VERSION = 1;

export interface PersistedAppData {
  version: number;
  events: CalendarEvent[];
  tasks: Task[];
  workflows: Workflow[];
  reminders: Reminder[];
}

function loadMockData(): PersistedAppData {
  return {
    version: STORAGE_VERSION,
    events: loadEvents(),
    tasks: loadTasks(),
    workflows: loadWorkflows(),
    reminders: loadReminders(),
  };
}

function isPersistedAppData(value: unknown): value is PersistedAppData {
  if (!value || typeof value !== "object") return false;

  const data = value as PersistedAppData;
  return (
    data.version === STORAGE_VERSION &&
    Array.isArray(data.events) &&
    Array.isArray(data.tasks) &&
    Array.isArray(data.workflows) &&
    Array.isArray(data.reminders)
  );
}

export function loadInitialAppData(): PersistedAppData {
  if (typeof window === "undefined") {
    return loadMockData();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return loadMockData();

    const parsed: unknown = JSON.parse(raw);
    if (isPersistedAppData(parsed)) return parsed;
  } catch {
    // Bozuk veri — mock'a dön
  }

  return loadMockData();
}

export function saveAppData(data: Omit<PersistedAppData, "version">): void {
  if (typeof window === "undefined") return;

  const payload: PersistedAppData = {
    version: STORAGE_VERSION,
    ...data,
  };

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Quota veya gizli mod — sessizce atla
  }
}
