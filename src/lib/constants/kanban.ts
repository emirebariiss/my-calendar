import type { TaskStatus } from "@/lib/types";

export interface KanbanColumnDef {
  status: TaskStatus;
  title: string;
}

export const KANBAN_COLUMNS: KanbanColumnDef[] = [
  { status: "not_started", title: "Yapılacak" },
  { status: "in_progress", title: "Devam ediyor" },
  { status: "done", title: "Tamamlandı" },
];
