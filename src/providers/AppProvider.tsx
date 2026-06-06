"use client";

import { createContext, useContext, useMemo, useState } from "react";
import {
  loadEvents,
  loadReminders,
  loadTasks,
  loadWorkflows,
} from "@/lib/mock/loader";
import type { CalendarEvent, Reminder, Task, Workflow } from "@/lib/types";

interface AppContextValue {
  events: CalendarEvent[];
  tasks: Task[];
  workflows: Workflow[];
  reminders: Reminder[];
  addEvent: (event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function createId(prefix: string, items: { id: string }[]): string {
  const numbers = items
    .map((item) => Number(item.id.split("-").pop()))
    .filter((n) => !Number.isNaN(n));
  const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;
  return `${prefix}-${String(next).padStart(3, "0")}`;
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<CalendarEvent[]>(() => loadEvents());
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [workflows] = useState<Workflow[]>(() => loadWorkflows());
  const [reminders] = useState<Reminder[]>(() => loadReminders());

  const addEvent = (
    event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">
  ) => {
    const now = new Date().toISOString();
    setEvents((prev) => [
      ...prev,
      {
        ...event,
        id: createId("evt", prev),
        createdAt: now,
        updatedAt: now,
      },
    ]);
  };

  const updateEvent = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents((prev) =>
      prev.map((event) =>
        event.id === id
          ? { ...event, ...updates, updatedAt: new Date().toISOString() }
          : event
      )
    );
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((event) => event.id !== id));
  };

  const addTask = (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    setTasks((prev) => [
      ...prev,
      {
        ...task,
        id: createId("task", prev),
        createdAt: now,
        updatedAt: now,
      },
    ]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;

        const next: Task = {
          ...task,
          ...updates,
          updatedAt: new Date().toISOString(),
        };

        if (updates.status === "done" && !next.completedAt) {
          next.completedAt = new Date().toISOString();
        }

        if (updates.status && updates.status !== "done") {
          next.completedAt = undefined;
        }

        return next;
      })
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const value = useMemo(
    () => ({
      events,
      tasks,
      workflows,
      reminders,
      addEvent,
      updateEvent,
      deleteEvent,
      addTask,
      updateTask,
      deleteTask,
    }),
    [events, tasks, workflows, reminders]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
