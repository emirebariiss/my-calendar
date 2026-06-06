import { useApp } from "@/providers/AppProvider";

export function useReminders() {
  const { reminders, addReminder, updateReminder } = useApp();
  return { reminders, addReminder, updateReminder };
}
