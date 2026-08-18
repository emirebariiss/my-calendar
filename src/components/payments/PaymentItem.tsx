"use client";

import type { Payment, PaymentStatus } from "@/lib/types/payment";
import { PAYMENT_STATUS_LABELS } from "@/lib/types/payment";
import { Button } from "@/components/ui/Button";
import { PaymentAmount } from "@/components/payments/PaymentAmount";
import { PaymentCategoryBadge } from "@/components/payments/PaymentCategoryBadge";
import { PaymentItemMenu } from "@/components/payments/PaymentItemMenu";
import { formatDate } from "@/lib/utils/date";
import {
  getPaymentDisplayAmount,
  isPaymentOverdue,
  resolvePaymentStatus,
} from "@/lib/utils/payment";
import { getPaymentMetaParts } from "@/lib/utils/paymentStats";

interface PaymentItemProps {
  payment: Payment;
  variableAmount?: boolean;
  onOpenDetail: (payment: Payment) => void;
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
  onMarkPaid: (payment: Payment) => void;
  onMarkPending: (payment: Payment) => void;
  onMarkSkipped: (payment: Payment) => void;
}

function statusDotClass(status: PaymentStatus): string {
  switch (status) {
    case "overdue":
      return "bg-red-500";
    case "paid":
      return "bg-emerald-500";
    case "pending":
      return "bg-amber-500";
    default:
      return "bg-muted";
  }
}

function statusTextClass(status: PaymentStatus): string {
  switch (status) {
    case "overdue":
      return "text-red-600 dark:text-red-400";
    case "paid":
      return "text-emerald-700 dark:text-emerald-300";
    case "pending":
      return "text-amber-700 dark:text-amber-300";
    default:
      return "text-muted";
  }
}

export function PaymentItem({
  payment,
  variableAmount = false,
  onOpenDetail,
  onEdit,
  onDelete,
  onMarkPaid,
  onMarkPending,
  onMarkSkipped,
}: PaymentItemProps) {
  const status = resolvePaymentStatus(payment);
  const overdue = isPaymentOverdue(payment.dueDate, status);
  const isPaid = status === "paid";
  const isSkipped = status === "skipped";
  const displayAmount = getPaymentDisplayAmount({ ...payment, status });
  const metaParts = getPaymentMetaParts(payment, { variableAmount });

  return (
    <li
      className={`group rounded-lg border transition-colors ${
        overdue
          ? "border-red-200 bg-red-50/40 dark:border-red-900 dark:bg-red-950/40"
          : "border-border bg-card hover:border-primary/25 hover:bg-hover/20"
      }`}
    >
      <button
        type="button"
        onClick={() => onOpenDetail(payment)}
        aria-label={`${payment.title} — detayları görüntüle`}
        className="w-full rounded-lg px-3 py-2.5 text-left transition-colors group-hover:bg-hover/30"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-1">
            <span className="min-w-0 font-medium group-hover:text-primary">
              {payment.title}
            </span>
            <span
              className="mt-0.5 shrink-0 text-sm text-muted/50 transition-colors group-hover:text-primary/70"
              aria-hidden
            >
              ›
            </span>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-0.5">
            <PaymentAmount
              amount={displayAmount}
              currency={payment.currency}
              className="text-base"
            />
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-medium ${statusTextClass(status)}`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${statusDotClass(status)}`}
                aria-hidden
              />
              {PAYMENT_STATUS_LABELS[status]}
            </span>
          </div>
        </div>

        <p className="mt-1 text-xs text-muted">{formatDate(payment.dueDate)}</p>

        <p className="mt-0.5 text-xs">
          <PaymentCategoryBadge categorySlug={payment.category} variant="text" />
          {metaParts.length > 0 && (
            <span className="text-muted"> · {metaParts.join(" · ")}</span>
          )}
        </p>
      </button>

      {!isPaid && !isSkipped && (
        <div className="flex items-center justify-end gap-2 px-3 pb-2.5">
          <Button
            type="button"
            className="px-3 py-1.5 text-sm"
            onClick={() => onMarkPaid(payment)}
          >
            Ödemeyi tamamla
          </Button>
          <PaymentItemMenu
            payment={payment}
            isPaid={isPaid}
            isSkipped={isSkipped}
            isOverdue={overdue}
            isRecurring={payment.paymentType === "recurring"}
            onEdit={onEdit}
            onDelete={onDelete}
            onMarkPending={onMarkPending}
            onMarkSkipped={onMarkSkipped}
          />
        </div>
      )}

      {(isPaid || isSkipped) && (
        <div className="flex justify-end px-3 pb-2.5">
          <PaymentItemMenu
            payment={payment}
            isPaid={isPaid}
            isSkipped={isSkipped}
            isOverdue={overdue}
            isRecurring={payment.paymentType === "recurring"}
            onEdit={onEdit}
            onDelete={onDelete}
            onMarkPending={onMarkPending}
            onMarkSkipped={onMarkSkipped}
          />
        </div>
      )}
    </li>
  );
}
