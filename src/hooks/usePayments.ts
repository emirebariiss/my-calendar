import { useApp } from "@/providers/AppProvider";

export function usePayments() {
  const {
    payments,
    paymentHistory,
    addPayment,
    updatePayment,
    deletePayment,
    markPaymentPaid,
    markPaymentPending,
    markPaymentSkipped,
  } = useApp();

  return {
    payments,
    paymentHistory,
    addPayment,
    updatePayment,
    deletePayment,
    markPaymentPaid,
    markPaymentPending,
    markPaymentSkipped,
  };
}
