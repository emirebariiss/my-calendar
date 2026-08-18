import eventsData from "@/data/events.json";
import tasksData from "@/data/tasks.json";
import workflowsData from "@/data/workflows.json";
import remindersData from "@/data/reminders.json";
import paymentsData from "@/data/payments.json";
import paymentHistoryData from "@/data/paymentHistory.json";
import type {
  CalendarEvent,
  Payment,
  PaymentHistoryRecord,
  Reminder,
  Task,
  Workflow,
} from "@/lib/types";

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

export function loadPayments(): Payment[] {
  return paymentsData as Payment[];
}

export function loadPaymentHistory(): PaymentHistoryRecord[] {
  return paymentHistoryData as PaymentHistoryRecord[];
}
