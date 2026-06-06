import { useApp } from "@/providers/AppProvider";

export function useTasks() {
  const { tasks, addTask, updateTask, deleteTask } = useApp();
  return { tasks, addTask, updateTask, deleteTask };
}
