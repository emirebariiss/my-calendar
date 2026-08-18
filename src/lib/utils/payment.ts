import type {
  Payment,
  PaymentCurrency,
  PaymentHistoryRecord,
  PaymentMethod,
  PaymentStatus,
} from "@/lib/types/payment";
import {
  AUTO_PAYMENT_METHODS,
  MANUAL_PAYMENT_METHODS,
  PAYMENT_METHOD_LABELS,
} from "@/lib/types/payment";
import { isOverdue } from "./date";

const CURRENCY_SYMBOLS: Record<PaymentCurrency, string> = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
};

/** Görüntüleme için tutar formatı — tr-TR: ₺70.018,00 */
export function formatPaymentAmount(
  amount: number,
  currency: PaymentCurrency
): string {
  const formatted = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${CURRENCY_SYMBOLS[currency]}${formatted}`;
}

export function formatPaymentAmountCompact(
  amount: number,
  currency: PaymentCurrency
): string {
  const hasDecimals = amount % 1 !== 0;
  const formatted = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: hasDecimals ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${CURRENCY_SYMBOLS[currency]}${formatted}`;
}

export function getPaymentModeLabel(autoPay: boolean): string {
  return autoPay ? "Otomatik tahsilat" : "Manuel";
}

export function getAvailablePaymentMethods(autoPay: boolean): PaymentMethod[] {
  return autoPay ? AUTO_PAYMENT_METHODS : MANUAL_PAYMENT_METHODS;
}

export function sanitizePaymentMethod(
  method: PaymentMethod | "",
  autoPay: boolean
): PaymentMethod | "" {
  if (!method) return "";
  return getAvailablePaymentMethods(autoPay).includes(method) ? method : "";
}

export function getPaymentChannelSummary(
  autoPay: boolean,
  paymentMethod?: PaymentMethod
): string {
  const mode = getPaymentModeLabel(autoPay);
  if (!paymentMethod) return mode;
  return `${mode} · ${PAYMENT_METHOD_LABELS[paymentMethod]}`;
}

export function isPaymentOverdue(
  dueDate: string,
  status: PaymentStatus
): boolean {
  if (status === "paid" || status === "skipped") return false;
  return isOverdue(dueDate);
}

/** Mock/UI'daki status'u vade tarihine göre düzeltir (pending → overdue). */
export function resolvePaymentStatus(
  payment: Pick<Payment, "dueDate" | "status">
): PaymentStatus {
  if (payment.status === "paid" || payment.status === "skipped") {
    return payment.status;
  }

  if (isOverdue(payment.dueDate)) return "overdue";
  return payment.status === "overdue" ? "pending" : payment.status;
}

/** Ödenmiş kayıtlar için actual, diğerleri için planned tutar. */
export function getPaymentDisplayAmount(payment: Payment): number {
  if (payment.status === "paid" && payment.actualAmount != null) {
    return payment.actualAmount;
  }
  return payment.plannedAmount;
}

export function getPaymentStatusVariant(
  status: PaymentStatus
): "success" | "warning" | "danger" | "info" | "default" {
  switch (status) {
    case "paid":
      return "success";
    case "overdue":
      return "danger";
    case "pending":
      return "warning";
    case "skipped":
      return "default";
    default:
      return "default";
  }
}

export function buildPaymentHistoryRecord(
  payment: Payment,
  overrides?: Partial<{
    actualAmount: number;
    paidAt: string;
    status: PaymentStatus;
    note: string;
  }>
): Omit<PaymentHistoryRecord, "id"> {
  const now = new Date().toISOString();
  return {
    paymentId: payment.id,
    templateId: payment.recurringTemplateId ?? (payment.isTemplate ? payment.id : undefined),
    title: payment.title,
    plannedAmount: payment.plannedAmount,
    actualAmount: overrides?.actualAmount ?? payment.actualAmount,
    currency: payment.currency,
    dueDate: payment.dueDate,
    paidAt: overrides?.paidAt ?? payment.paidAt,
    status: overrides?.status ?? payment.status,
    category: payment.category,
    autoPay: payment.autoPay,
    note: overrides?.note ?? payment.note,
    createdAt: overrides?.paidAt ?? payment.paidAt ?? now,
  };
}
