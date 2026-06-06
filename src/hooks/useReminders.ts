import { useApp } from "@/providers/AppProvider";

export function useReminders() {
  const { reminders } = useApp();
  return { reminders };
}
