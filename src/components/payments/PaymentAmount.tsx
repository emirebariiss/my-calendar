import type { PaymentCurrency } from "@/lib/types/payment";
import { formatPaymentAmount } from "@/lib/utils/payment";

interface PaymentAmountProps {
  amount: number;
  currency: PaymentCurrency;
  className?: string;
}

export function PaymentAmount({ amount, currency, className = "" }: PaymentAmountProps) {
  return (
    <span className={`font-semibold tabular-nums ${className}`}>
      {formatPaymentAmount(amount, currency)}
    </span>
  );
}
