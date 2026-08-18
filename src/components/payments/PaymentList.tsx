import type { Payment } from "@/lib/types/payment";
import { PaymentItem } from "@/components/payments/PaymentItem";
import { hasVariableAmount } from "@/lib/utils/paymentFilters";

interface PaymentListProps {
  payments: Payment[];
  allPayments: Payment[];
  onOpenDetail: (payment: Payment) => void;
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
  onMarkPaid: (payment: Payment) => void;
  onMarkPending: (payment: Payment) => void;
  onMarkSkipped: (payment: Payment) => void;
}

export function PaymentList({
  payments,
  allPayments,
  onOpenDetail,
  onEdit,
  onDelete,
  onMarkPaid,
  onMarkPending,
  onMarkSkipped,
}: PaymentListProps) {
  return (
    <ul className="space-y-3">
      {payments.map((payment) => (
        <PaymentItem
          key={payment.id}
          payment={payment}
          variableAmount={hasVariableAmount(payment, allPayments)}
          onOpenDetail={onOpenDetail}
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkPaid={onMarkPaid}
          onMarkPending={onMarkPending}
          onMarkSkipped={onMarkSkipped}
        />
      ))}
    </ul>
  );
}
