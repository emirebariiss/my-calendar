export type PaymentStatus = "pending" | "paid" | "overdue" | "skipped";

export type PaymentType = "one_time" | "recurring";

export type PaymentMethod =
  | "bank_transfer"
  | "credit_card"
  | "cash"
  | "bank_account"
  | "other";

export type PaymentCurrency = "TRY" | "USD" | "EUR";

export type RecurrenceFrequency = "weekly" | "monthly" | "yearly" | "custom";

/** Tekrarlayan ödeme kuralı — "sadece bu" / "gelecek hepsi" UI'si P3'te gelir. */
export interface PaymentRecurrence {
  frequency: RecurrenceFrequency;
  /** Her N hafta/ay/yıl (custom için zorunlu). */
  interval: number;
  startDate: string;
  /** Yoksa sınırsız tekrar. */
  endDate?: string;
  /** Aylık tekrar için ayın günü (1–31). */
  dayOfMonth?: number;
  /** Haftalık tekrar için gün (0=Pazar … 6=Cumartesi). */
  weekday?: number;
  /** true ise tutar dönemden döneme değişebilir (kira artışı vb.). */
  isVariableAmount: boolean;
}

/**
 * Bağımsız Payment entity — Calendar Event değildir.
 * recurring template: isTemplate=true, paymentType=recurring
 * occurrence: recurringTemplateId set, isTemplate=false
 */
export interface Payment {
  id: string;
  title: string;
  /** Planlanan tutar (planned spending). */
  plannedAmount: number;
  /** Gerçekleşen tutar — ödendiğinde doldurulur (actual spending). */
  actualAmount?: number;
  currency: PaymentCurrency;
  dueDate: string;
  category: string;
  note?: string;
  paymentMethod?: PaymentMethod;
  status: PaymentStatus;
  paymentType: PaymentType;
  autoPay: boolean;
  recurrence?: PaymentRecurrence;
  /** Recurring template için bir sonraki vade (P3'te otomatik güncellenir). */
  nextDueDate?: string;
  /** Tekrarlayan şablondan üretilen occurrence ise şablon id'si. */
  recurringTemplateId?: string;
  /** true ise recurring tanım kaydıdır; false/undefined ise tek seferlik veya occurrence. */
  isTemplate?: boolean;
  reminderIds?: string[];
  /** P9 — Task ↔ Payment ilişkisi için. */
  taskId?: string;
  /** P9 — Workflow step ↔ Payment ilişkisi için. */
  workflowStepId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

/** Geçmiş ödeme kaydı — silinmez, değiştirilmez (append-only). */
export interface PaymentHistoryRecord {
  id: string;
  paymentId: string;
  templateId?: string;
  title: string;
  plannedAmount: number;
  actualAmount?: number;
  currency: PaymentCurrency;
  dueDate: string;
  paidAt?: string;
  status: PaymentStatus;
  category: string;
  autoPay: boolean;
  note?: string;
  createdAt: string;
}

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: "Ödenmedi",
  paid: "Ödendi",
  overdue: "Gecikmiş",
  skipped: "Atlandı",
};

export const PAYMENT_TYPE_LABELS: Record<PaymentType, string> = {
  one_time: "Tek seferlik",
  recurring: "Tekrarlayan",
};

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  bank_transfer: "Havale / EFT",
  credit_card: "Kredi kartı",
  cash: "Nakit",
  bank_account: "Banka hesabı",
  other: "Diğer",
};

/** Manuel ödemede kullanılabilir kanallar */
export const MANUAL_PAYMENT_METHODS: PaymentMethod[] = [
  "bank_transfer",
  "credit_card",
  "cash",
  "other",
];

/** Otomatik tahsilatta kullanılabilir kanallar */
export const AUTO_PAYMENT_METHODS: PaymentMethod[] = [
  "credit_card",
  "bank_account",
  "other",
];

export const PAYMENT_CURRENCY_LABELS: Record<PaymentCurrency, string> = {
  TRY: "₺ TRY",
  USD: "$ USD",
  EUR: "€ EUR",
};

export const RECURRENCE_FREQUENCY_LABELS: Record<RecurrenceFrequency, string> = {
  weekly: "Haftalık",
  monthly: "Aylık",
  yearly: "Yıllık",
  custom: "Özel",
};
