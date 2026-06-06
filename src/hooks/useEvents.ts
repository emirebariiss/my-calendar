import { useApp } from "@/providers/AppProvider";

export function useEvents() {
  const { events, addEvent, updateEvent, deleteEvent } = useApp();
  return { events, addEvent, updateEvent, deleteEvent };
}
