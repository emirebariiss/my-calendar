"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { loadInitialAppData, saveAppData } from "@/lib/storage/appStorage";
import type {
  CalendarEvent,
  Reminder,
  Task,
  Workflow,
  WorkflowStep,
} from "@/lib/types";
import { applyStepUpdate } from "@/lib/utils/workflow";
import { MOCK_LOAD_DELAY_MS } from "@/lib/constants/mock";

interface AppContextValue {
  isLoading: boolean;
  events: CalendarEvent[];
  tasks: Task[];
  workflows: Workflow[];
  reminders: Reminder[];
  addReminder: (reminder: Omit<Reminder, "id" | "createdAt">) => string;
  updateReminder: (id: string, updates: Partial<Reminder>) => void;
  deleteReminder: (id: string) => void;
  addEvent: (
    event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">
  ) => string;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "updatedAt">) => string;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  addWorkflow: (
    workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt">
  ) => string;
  updateWorkflow: (id: string, updates: Partial<Workflow>) => void;
  deleteWorkflow: (id: string) => void;
  updateStep: (
    workflowId: string,
    stepId: string,
    updates: Partial<WorkflowStep>
  ) => void;
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
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  useEffect(() => {
    const timer = setTimeout(() => {
      const data = loadInitialAppData();
      setEvents(data.events);
      setTasks(data.tasks);
      setWorkflows(data.workflows);
      setReminders(data.reminders);
      setIsLoading(false);
    }, MOCK_LOAD_DELAY_MS);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isLoading) return;

    saveAppData({ events, tasks, workflows, reminders });
  }, [isLoading, events, tasks, workflows, reminders]);
  const addReminder = (reminder: Omit<Reminder, "id" | "createdAt">): string => {
    const now = new Date().toISOString();
    let newId = "";

    setReminders((prev) => {
      newId = createId("rem", prev);
      return [
        ...prev,
        {
          ...reminder,
          id: newId,
          createdAt: now,
        },
      ];
    });

    return newId;
  };

  const updateReminder = (id: string, updates: Partial<Reminder>) => {
    setReminders((prev) =>
      prev.map((reminder) =>
        reminder.id === id ? { ...reminder, ...updates } : reminder
      )
    );
  };

  const deleteReminder = (id: string) => {
    setReminders((prev) => prev.filter((reminder) => reminder.id !== id));

    setEvents((prev) =>
      prev.map((event) => {
        if (!event.reminderIds?.includes(id)) return event;
        const reminderIds = event.reminderIds.filter((rid) => rid !== id);
        return {
          ...event,
          reminderIds: reminderIds.length > 0 ? reminderIds : undefined,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    setTasks((prev) =>
      prev.map((task) => {
        if (!task.reminderIds?.includes(id)) return task;
        const reminderIds = task.reminderIds.filter((rid) => rid !== id);
        return {
          ...task,
          reminderIds: reminderIds.length > 0 ? reminderIds : undefined,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    setWorkflows((prev) =>
      prev.map((workflow) => {
        const hasReference = workflow.steps.some((step) =>
          step.reminderIds?.includes(id)
        );
        if (!hasReference) return workflow;

        return {
          ...workflow,
          steps: workflow.steps.map((step) => {
            if (!step.reminderIds?.includes(id)) return step;
            const reminderIds = step.reminderIds.filter((rid) => rid !== id);
            return {
              ...step,
              reminderIds: reminderIds.length > 0 ? reminderIds : undefined,
            };
          }),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const addEvent = (
    event: Omit<CalendarEvent, "id" | "createdAt" | "updatedAt">
  ): string => {
    const now = new Date().toISOString();
    let newId = "";

    setEvents((prev) => {
      newId = createId("evt", prev);
      return [
        ...prev,
        {
          ...event,
          id: newId,
          createdAt: now,
          updatedAt: now,
        },
      ];
    });

    return newId;
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

  const addTask = (
    task: Omit<Task, "id" | "createdAt" | "updatedAt">
  ): string => {
    const now = new Date().toISOString();
    let newId = "";

    setTasks((prev) => {
      newId = createId("task", prev);
      return [
        ...prev,
        {
          ...task,
          id: newId,
          createdAt: now,
          updatedAt: now,
        },
      ];
    });

    return newId;
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

  const addWorkflow = (
    workflow: Omit<Workflow, "id" | "createdAt" | "updatedAt">
  ): string => {
    const now = new Date().toISOString();
    let newId = "";

    setWorkflows((prev) => {
      newId = createId("wf", prev);
      return [
        ...prev,
        {
          ...workflow,
          id: newId,
          createdAt: now,
          updatedAt: now,
        },
      ];
    });

    return newId;
  };

  const updateWorkflow = (id: string, updates: Partial<Workflow>) => {
    setWorkflows((prev) =>
      prev.map((workflow) =>
        workflow.id === id
          ? { ...workflow, ...updates, updatedAt: new Date().toISOString() }
          : workflow
      )
    );
  };

  const deleteWorkflow = (id: string) => {
    setWorkflows((prev) => prev.filter((workflow) => workflow.id !== id));
  };

  const updateStep = (
    workflowId: string,
    stepId: string,
    updates: Partial<WorkflowStep>
  ) => {
    setWorkflows((prev) =>
      prev.map((workflow) =>
        workflow.id === workflowId
          ? applyStepUpdate(workflow, stepId, updates)
          : workflow
      )
    );
  };

  const value = useMemo(
    () => ({
      isLoading,
      events,
      tasks,
      workflows,
      reminders,
      addReminder,
      updateReminder,
      deleteReminder,
      addEvent,
      updateEvent,
      deleteEvent,
      addWorkflow,
      updateWorkflow,
      deleteWorkflow,
      updateStep,
      addTask,
      updateTask,
      deleteTask,
    }),
    [isLoading, events, tasks, workflows, reminders]
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
