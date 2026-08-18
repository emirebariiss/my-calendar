import type { PaymentHistoryRecord } from "@/lib/types/payment";
import {
  PAYMENT_STATUS_LABELS,
} from "@/lib/types/payment";
import { PaymentAmount } from "@/components/payments/PaymentAmount";
import { PaymentCategoryBadge } from "@/components/payments/PaymentCategoryBadge";
import { formatDate } from "@/lib/utils/date";

interface PaymentHistoryListProps {
  records: PaymentHistoryRecord[];
}

export function PaymentHistoryList({ records }: PaymentHistoryListProps) {
  return (
    <ul className="space-y-2">
      {records.map((record) => {
        const amount = record.actualAmount ?? record.plannedAmount;
        const isPaid = record.status === "paid";

        return (
          <li
            key={record.id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card px-3 py-2"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium">
                <span aria-hidden className="mr-1">
                  {isPaid ? "✓" : record.status === "skipped" ? "–" : "✕"}
                </span>
                {record.title}
              </p>
              <p className="text-xs text-muted">
                {formatDate(record.dueDate)} · {PAYMENT_STATUS_LABELS[record.status]}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <PaymentAmount
                amount={amount}
                currency={record.currency}
                className="text-sm"
              />
              <PaymentCategoryBadge categorySlug={record.category} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
