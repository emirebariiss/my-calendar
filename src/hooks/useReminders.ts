import { useApp } from "@/providers/AppProvider";

export function useReminders() {
  const { reminders, addReminder, updateReminder, deleteReminder } = useApp();
  return { reminders, addReminder, updateReminder, deleteReminder };
}
