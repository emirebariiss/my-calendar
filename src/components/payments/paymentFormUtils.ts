import type {
  Payment,
  PaymentCurrency,
  PaymentMethod,
  PaymentRecurrence,
  PaymentStatus,
  PaymentType,
  RecurrenceFrequency,
} from "@/lib/types/payment";

export interface PaymentFormValues {
  title: string;
  plannedAmount: string;
  currency: PaymentCurrency;
  dueDate: string;
  category: string;
  paymentType: PaymentType;
  autoPay: boolean;
  paymentMethod: PaymentMethod | "";
  note: string;
  status: PaymentStatus;
  recurrenceFrequency: RecurrenceFrequency;
  recurrenceInterval: string;
  recurrenceStartDate: string;
  recurrenceEndDate: string;
  recurrenceDayOfMonth: string;
  recurrenceWeekday: string;
  isVariableAmount: boolean;
}

export const DEFAULT_PAYMENT_FORM_VALUES: PaymentFormValues = {
  title: "",
  plannedAmount: "",
  currency: "TRY",
  dueDate: "",
  category: "bills",
  paymentType: "one_time",
  autoPay: false,
  paymentMethod: "",
  note: "",
  status: "pending",
  recurrenceFrequency: "monthly",
  recurrenceInterval: "1",
  recurrenceStartDate: "",
  recurrenceEndDate: "",
  recurrenceDayOfMonth: "1",
  recurrenceWeekday: "1",
  isVariableAmount: false,
};

export function paymentToFormValues(payment: Payment): PaymentFormValues {
  return {
    title: payment.title,
    plannedAmount: String(payment.plannedAmount),
    currency: payment.currency,
    dueDate: payment.dueDate,
    category: payment.category,
    paymentType: payment.paymentType,
    autoPay: payment.autoPay,
    paymentMethod: payment.paymentMethod ?? "",
    note: payment.note ?? "",
    status: payment.status,
    recurrenceFrequency: payment.recurrence?.frequency ?? "monthly",
    recurrenceInterval: String(payment.recurrence?.interval ?? 1),
    recurrenceStartDate: payment.recurrence?.startDate ?? payment.dueDate,
    recurrenceEndDate: payment.recurrence?.endDate ?? "",
    recurrenceDayOfMonth: String(payment.recurrence?.dayOfMonth ?? 1),
    recurrenceWeekday: String(payment.recurrence?.weekday ?? 1),
    isVariableAmount: payment.recurrence?.isVariableAmount ?? false,
  };
}

function buildRecurrence(values: PaymentFormValues): PaymentRecurrence | undefined {
  if (values.paymentType !== "recurring") return undefined;

  const interval = Math.max(1, Number(values.recurrenceInterval) || 1);
  const recurrence: PaymentRecurrence = {
    frequency: values.recurrenceFrequency,
    interval,
    startDate: values.recurrenceStartDate || values.dueDate,
    isVariableAmount: values.isVariableAmount,
  };

  if (values.recurrenceEndDate) {
    recurrence.endDate = values.recurrenceEndDate;
  }

  if (values.recurrenceFrequency === "monthly" || values.recurrenceFrequency === "yearly") {
    recurrence.dayOfMonth = Math.min(
      31,
      Math.max(1, Number(values.recurrenceDayOfMonth) || 1)
    );
  }

  if (values.recurrenceFrequency === "weekly") {
    recurrence.weekday = Math.min(
      6,
      Math.max(0, Number(values.recurrenceWeekday) || 1)
    );
  }

  return recurrence;
}

export function formValuesToPaymentPayload(
  values: PaymentFormValues,
  existing?: Payment
): Omit<Payment, "id" | "createdAt" | "updatedAt"> {
  const plannedAmount = Number(values.plannedAmount);
  const recurrence = buildRecurrence(values);

  const payload: Omit<Payment, "id" | "createdAt" | "updatedAt"> = {
    title: values.title.trim(),
    plannedAmount,
    currency: values.currency,
    dueDate: values.dueDate,
    category: values.category,
    paymentType: values.paymentType,
    autoPay: values.autoPay,
    status: values.status,
    note: values.note.trim() || undefined,
    paymentMethod: values.paymentMethod || undefined,
  };

  if (values.paymentType === "recurring") {
    payload.recurrence = recurrence;
    if (existing?.recurringTemplateId) {
      payload.recurringTemplateId = existing.recurringTemplateId;
    } else {
      payload.isTemplate = true;
      payload.nextDueDate = existing?.nextDueDate ?? values.dueDate;
    }
  }

  if (existing?.status === "paid") {
    payload.actualAmount = existing.actualAmount;
    payload.paidAt = existing.paidAt;
  }

  return payload;
}
