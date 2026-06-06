import { format, isAfter, isBefore, isToday as fnsIsToday, parseISO, startOfDay, addDays } from "date-fns";
import { tr } from "date-fns/locale";

export function parseDate(value: string): Date {
  return parseISO(value);
}

export function formatDate(value: string, dateFormat = "d MMMM yyyy"): string {
  return format(parseDate(value), dateFormat, { locale: tr });
}

export function formatTime(value: string): string {
  return format(parseDate(value), "HH:mm", { locale: tr });
}

export function formatDateTime(value: string): string {
  return format(parseDate(value), "d MMM yyyy HH:mm", { locale: tr });
}

export function isToday(value: string): boolean {
  return fnsIsToday(parseDate(value));
}

export function isOverdue(deadline: string): boolean {
  const today = startOfDay(new Date());
  const due = startOfDay(parseDate(deadline));
  return isBefore(due, today);
}

export function isUpcoming(value: string, days = 7): boolean {
  const date = parseDate(value);
  const now = new Date();
  const limit = addDays(now, days);
  return !isBefore(date, now) && !isAfter(date, limit);
}
