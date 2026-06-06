import { useApp } from "@/providers/AppProvider";

export function useWorkflows() {
  const { workflows } = useApp();
  return { workflows };
}
