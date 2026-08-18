import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  differenceInCalendarDays,
  parseISO,
  startOfDay,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";
import type { Payment, PaymentCurrency, PaymentStatus } from "@/lib/types/payment";
import { RECURRENCE_FREQUENCY_LABELS } from "@/lib/types/payment";
import { getPaymentDisplayAmount, resolvePaymentStatus } from "./payment";

export interface CurrencyPaymentStats {
  currency: PaymentCurrency;
  planned: number;
  paid: number;
  pending: number;
  overdue: number;
}

export function computePeriodStats(payments: Payment[]): CurrencyPaymentStats[] {
  const map = new Map<PaymentCurrency, CurrencyPaymentStats>();

  for (const payment of payments) {
    const status = resolvePaymentStatus(payment);
    if (status === "skipped") continue;

    const existing = map.get(payment.currency) ?? {
      currency: payment.currency,
      planned: 0,
      paid: 0,
      pending: 0,
      overdue: 0,
    };

    const amount = getPaymentDisplayAmount({ ...payment, status });
    existing.planned += amount;

    if (status === "paid") existing.paid += amount;
    else if (status === "overdue") existing.overdue += amount;
    else existing.pending += amount;

    map.set(payment.currency, existing);
  }

  return Array.from(map.values()).sort((a, b) =>
    a.currency.localeCompare(b.currency)
  );
}

import type { PaymentPeriod } from "./paymentFilters";

export function canNavigatePeriod(period: PaymentPeriod): boolean {
  return period !== "all";
}

export function shiftPeriodReference(
  period: PaymentPeriod,
  referenceDate: Date,
  direction: -1 | 1
): Date {
  if (period === "all") return referenceDate;

  if (direction === 1) {
    switch (period) {
      case "day":
        return addDays(referenceDate, 1);
      case "week":
        return addWeeks(referenceDate, 1);
      case "month":
        return addMonths(referenceDate, 1);
      case "year":
        return addYears(referenceDate, 1);
    }
  }

  switch (period) {
    case "day":
      return subDays(referenceDate, 1);
    case "week":
      return subWeeks(referenceDate, 1);
    case "month":
      return subMonths(referenceDate, 1);
    case "year":
      return subYears(referenceDate, 1);
  }
}

export function getDaysUntilDue(dueDate: string): number {
  const today = startOfDay(new Date());
  const due = startOfDay(parseISO(dueDate));
  return differenceInCalendarDays(due, today);
}

export function formatDueInLabel(
  dueDate: string,
  status: PaymentStatus
): string {
  const days = getDaysUntilDue(dueDate);

  if (status === "overdue") {
    if (days === 0) return "Bugün gecikmiş";
    return `${Math.abs(days)} gün gecikmiş`;
  }

  if (days === 0) return "Bugün";
  if (days === 1) return "Yarın";
  if (days < 0) return `${Math.abs(days)} gün gecikmiş`;
  return `${days} gün`;
}

export function getUpcomingPayments(
  payments: Payment[],
  limit = 5
): Payment[] {
  return payments
    .filter((payment) => {
      const status = resolvePaymentStatus(payment);
      return status !== "paid" && status !== "skipped";
    })
    .sort((a, b) => {
      const statusA = resolvePaymentStatus(a);
      const statusB = resolvePaymentStatus(b);
      if (statusA === "overdue" && statusB !== "overdue") return -1;
      if (statusB === "overdue" && statusA !== "overdue") return 1;
      return a.dueDate.localeCompare(b.dueDate);
    })
    .slice(0, limit);
}

export function getPaymentRecurrenceLabel(payment: Payment): string | null {
  if (payment.paymentType !== "recurring") return null;
  const frequency = payment.recurrence?.frequency;
  if (!frequency) return "Tekrarlayan";
  return RECURRENCE_FREQUENCY_LABELS[frequency];
}

export function getPaymentMetaParts(
  payment: Payment,
  options: { variableAmount?: boolean } = {}
): string[] {
  const parts: string[] = [];

  const recurrence = getPaymentRecurrenceLabel(payment);
  if (recurrence) parts.push(recurrence);
  if (payment.isTemplate) parts.push("Düzenli ödeme");
  parts.push(payment.autoPay ? "Otomatik" : "Manuel");
  if (options.variableAmount) parts.push("≈ Değişken");

  return parts;
}
