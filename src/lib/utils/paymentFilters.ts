import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import { tr } from "date-fns/locale";
import type { Payment, PaymentStatus, PaymentHistoryRecord, PaymentCurrency } from "@/lib/types/payment";
import { getPaymentDisplayAmount } from "./payment";
import { resolvePaymentStatus } from "./payment";

export type PaymentPeriod = "day" | "week" | "month" | "year" | "all";

export const PAYMENT_PERIOD_LABELS: Record<PaymentPeriod, string> = {
  day: "Bugün",
  week: "Bu hafta",
  month: "Bu ay",
  year: "Bu yıl",
  all: "Tümü",
};

export interface PaymentPeriodRange {
  start: string;
  end: string;
  label: string;
}

export function getPaymentPeriodRange(
  period: PaymentPeriod,
  referenceDate = new Date()
): PaymentPeriodRange {
  if (period === "all") {
    return { start: "", end: "", label: "Tüm dönem" };
  }

  let startDate: Date;
  let endDate: Date;
  let label: string;

  switch (period) {
    case "day":
      startDate = startOfDay(referenceDate);
      endDate = endOfDay(referenceDate);
      label = format(referenceDate, "d MMMM yyyy", { locale: tr });
      break;
    case "week":
      startDate = startOfWeek(referenceDate, { locale: tr });
      endDate = endOfWeek(referenceDate, { locale: tr });
      label = `${format(startDate, "d MMM", { locale: tr })} – ${format(endDate, "d MMM yyyy", { locale: tr })}`;
      break;
    case "month":
      startDate = startOfMonth(referenceDate);
      endDate = endOfMonth(referenceDate);
      label = format(referenceDate, "MMMM yyyy", { locale: tr });
      break;
    case "year":
      startDate = startOfYear(referenceDate);
      endDate = endOfYear(referenceDate);
      label = format(referenceDate, "yyyy", { locale: tr });
      break;
  }

  return {
    start: format(startDate, "yyyy-MM-dd"),
    end: format(endDate, "yyyy-MM-dd"),
    label,
  };
}

export function filterPaymentsByPeriod(
  payments: Payment[],
  period: PaymentPeriod,
  referenceDate = new Date()
): Payment[] {
  if (period === "all") return payments;

  const { start, end } = getPaymentPeriodRange(period, referenceDate);
  return payments.filter(
    (payment) => payment.dueDate >= start && payment.dueDate <= end
  );
}

export function filterPaymentHistoryByPeriod(
  records: PaymentHistoryRecord[],
  period: PaymentPeriod,
  referenceDate = new Date()
): PaymentHistoryRecord[] {
  if (period === "all") return records;

  const { start, end } = getPaymentPeriodRange(period, referenceDate);
  return records.filter(
    (record) => record.dueDate >= start && record.dueDate <= end
  );
}

export type PeriodTotals = Partial<Record<PaymentCurrency, number>>;

/** Dönem içindeki planlanan/gerçekleşen tutarları para birimine göre toplar. */
export function sumPaymentsByCurrency(payments: Payment[]): PeriodTotals {
  const totals: PeriodTotals = {};

  for (const payment of payments) {
    const status = resolvePaymentStatus(payment);
    if (status === "skipped") continue;

    const amount = getPaymentDisplayAmount({ ...payment, status });
    totals[payment.currency] = (totals[payment.currency] ?? 0) + amount;
  }

  return totals;
}

/** Tekrarlayan serinin kök id'si (şablon veya tek seferlik ödeme). */
export function getPaymentSeriesId(payment: Payment): string {
  if (payment.isTemplate) return payment.id;
  if (payment.recurringTemplateId) return payment.recurringTemplateId;
  return payment.id;
}

export function getRelatedPayments(
  payment: Payment,
  payments: Payment[]
): Payment[] {
  const seriesId = getPaymentSeriesId(payment);
  return payments.filter(
    (item) =>
      item.id === seriesId ||
      item.recurringTemplateId === seriesId ||
      item.id === payment.id
  );
}

export function getRelatedPaymentHistory(
  payment: Payment,
  history: PaymentHistoryRecord[]
): PaymentHistoryRecord[] {
  const seriesId = getPaymentSeriesId(payment);

  return history.filter(
    (record) =>
      record.templateId === seriesId ||
      record.paymentId === seriesId ||
      record.paymentId === payment.id ||
      (record.title === payment.title &&
        !record.templateId &&
        !payment.recurringTemplateId &&
        !payment.isTemplate &&
        record.paymentId === payment.id)
  );
}

export function hasVariableAmount(
  payment: Payment,
  payments: Payment[]
): boolean {
  if (payment.recurrence?.isVariableAmount) return true;

  if (payment.recurringTemplateId) {
    const template = payments.find(
      (item) => item.id === payment.recurringTemplateId
    );
    return template?.recurrence?.isVariableAmount ?? false;
  }

  return false;
}

export function withResolvedPaymentStatus(payment: Payment): Payment {
  const status = resolvePaymentStatus(payment);
  if (status === payment.status) return payment;
  return { ...payment, status };
}

export function filterPaymentsByStatus(
  payments: Payment[],
  status: PaymentStatus | "all"
): Payment[] {
  if (status === "all") return payments;
  return payments.filter(
    (payment) => resolvePaymentStatus(payment) === status
  );
}

export function filterPaymentsByCategory(
  payments: Payment[],
  category: string
): Payment[] {
  if (category === "all") return payments;
  return payments.filter((payment) => payment.category === category);
}

export function sortPaymentsByDueDate(
  payments: Payment[],
  ascending = true
): Payment[] {
  return [...payments].sort((a, b) => {
    const diff = a.dueDate.localeCompare(b.dueDate);
    return ascending ? diff : -diff;
  });
}

export function sortPaymentHistoryByDueDate<T extends { dueDate: string }>(
  records: T[],
  ascending = false
): T[] {
  return [...records].sort((a, b) => {
    const diff = a.dueDate.localeCompare(b.dueDate);
    return ascending ? diff : -diff;
  });
}
