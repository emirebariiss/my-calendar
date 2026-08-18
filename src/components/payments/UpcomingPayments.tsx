"use client";

import type { Payment } from "@/lib/types/payment";
import { PaymentAmount } from "@/components/payments/PaymentAmount";
import { formatDueInLabel, getUpcomingPayments } from "@/lib/utils/paymentStats";
import { resolvePaymentStatus } from "@/lib/utils/payment";

interface UpcomingPaymentsProps {
  payments: Payment[];
  onOpenDetail: (payment: Payment) => void;
  limit?: number;
}

function urgencyDot(status: ReturnType<typeof resolvePaymentStatus>) {
  if (status === "overdue") return "bg-red-500";
  if (status === "pending") return "bg-amber-500";
  return "bg-muted";
}

export function UpcomingPayments({
  payments,
  onOpenDetail,
  limit = 4,
}: UpcomingPaymentsProps) {
  const upcoming = getUpcomingPayments(payments, limit);

  if (upcoming.length === 0) return null;

  return (
    <section className="rounded-xl border border-border bg-card px-3 py-2.5">
      <h3 className="text-sm font-semibold">Yaklaşan ödemeler</h3>
      <ul className="mt-3 space-y-2">
        {upcoming.map((payment) => {
          const status = resolvePaymentStatus(payment);
          const dueLabel = formatDueInLabel(payment.dueDate, status);

          return (
            <li key={payment.id}>
              <button
                type="button"
                onClick={() => onOpenDetail(payment)}
                aria-label={`${payment.title} — detayları görüntüle`}
                className="group flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2 text-left transition-colors hover:bg-hover"
              >
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${urgencyDot(status)}`}
                    aria-hidden
                  />
                  <span className="truncate text-sm font-medium group-hover:text-primary">
                    {payment.title}
                  </span>
                  <span
                    className="shrink-0 text-sm text-muted/50 transition-colors group-hover:text-primary/70"
                    aria-hidden
                  >
                    ›
                  </span>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-sm">
                  <PaymentAmount
                    amount={payment.plannedAmount}
                    currency={payment.currency}
                    className="text-sm"
                  />
                  <span
                    className={
                      status === "overdue"
                        ? "text-red-600 dark:text-red-400"
                        : "text-muted"
                    }
                  >
                    {dueLabel}
                  </span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
