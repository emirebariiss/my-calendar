import type { Payment, PaymentCurrency, PaymentStatus } from "@/lib/types/payment";
import { isOverdue } from "./date";

const CURRENCY_SYMBOLS: Record<PaymentCurrency, string> = {
  TRY: "₺",
  USD: "$",
  EUR: "€",
};

/** Görüntüleme için tutar formatı — örn. ₺1.240 veya $9.99 */
export function formatPaymentAmount(
  amount: number,
  currency: PaymentCurrency
): string {
  const formatted = new Intl.NumberFormat("tr-TR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);

  return `${CURRENCY_SYMBOLS[currency]}${formatted}`;
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
