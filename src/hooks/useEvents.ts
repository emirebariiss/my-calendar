import { useApp } from "@/providers/AppProvider";

export function useEvents() {
  const { events } = useApp();
  return { events };
}
