export type EventType = "meeting" | "study" | "personal" | "custom";
export type EventStatus = "scheduled" | "completed" | "cancelled";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  type: EventType;
  status: EventStatus;
  startAt: string;
  endAt: string;
  allDay?: boolean;
  color?: string;
  reminderIds?: string[];
  taskId?: string;
  createdAt: string;
  updatedAt: string;
}

export const EVENT_COLORS: Record<EventType, string> = {
  meeting: "#3B82F6",
  study: "#8B5CF6",
  personal: "#10B981",
  custom: "#6B7280",
};

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  meeting: "Toplantı",
  study: "Çalışma",
  personal: "Kişisel",
  custom: "Özel",
};
