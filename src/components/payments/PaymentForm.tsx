"use client";

import { useEffect, useState } from "react";
import type { Payment } from "@/lib/types/payment";
import {
  PAYMENT_CURRENCY_LABELS,
  PAYMENT_METHOD_LABELS,
  PAYMENT_STATUS_LABELS,
  PAYMENT_TYPE_LABELS,
  RECURRENCE_FREQUENCY_LABELS,
} from "@/lib/types/payment";
import { getAvailablePaymentMethods, sanitizePaymentMethod } from "@/lib/utils/payment";
import { PREDEFINED_PAYMENT_CATEGORIES } from "@/lib/constants/paymentCategories";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { NativePickerInput } from "@/components/ui/NativePickerInput";
import {
  DEFAULT_PAYMENT_FORM_VALUES,
  paymentToFormValues,
  type PaymentFormValues,
} from "@/components/payments/paymentFormUtils";

interface PaymentFormProps {
  open: boolean;
  mode: "create" | "edit";
  initialPayment?: Payment;
  onClose: () => void;
  onSubmit: (values: PaymentFormValues) => void;
}

type PaymentFormField = "title" | "plannedAmount" | "dueDate" | "recurrence";

type PaymentFormErrors = Partial<Record<PaymentFormField, string>>;

const ERROR_FIELD_ORDER: PaymentFormField[] = [
  "title",
  "plannedAmount",
  "dueDate",
  "recurrence",
];

const ERROR_FIELD_IDS: Record<PaymentFormField, string> = {
  title: "payment-title",
  plannedAmount: "payment-amount",
  dueDate: "payment-due-date",
  recurrence: "payment-recurrence-section",
};

const WEEKDAY_OPTIONS = [
  { value: "0", label: "Pazar" },
  { value: "1", label: "Pazartesi" },
  { value: "2", label: "Salı" },
  { value: "3", label: "Çarşamba" },
  { value: "4", label: "Perşembe" },
  { value: "5", label: "Cuma" },
  { value: "6", label: "Cumartesi" },
];

function validatePaymentForm(
  values: PaymentFormValues,
  showRecurrence: boolean
): PaymentFormErrors {
  const errors: PaymentFormErrors = {};

  if (!values.title.trim()) {
    errors.title = "Başlık zorunludur.";
  }

  const amount = Number(values.plannedAmount);
  if (!values.plannedAmount || Number.isNaN(amount) || amount <= 0) {
    errors.plannedAmount = "Geçerli bir tutar girin.";
  }

  if (!values.dueDate) {
    errors.dueDate = "Vade tarihi zorunludur.";
  }

  if (showRecurrence && !values.recurrenceStartDate && !values.dueDate) {
    errors.recurrence = "Tekrar başlangıç tarihi gerekli.";
  }

  return errors;
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return <p className="mt-1 text-xs text-red-600">{message}</p>;
}

function inputErrorClass(hasError: boolean): string {
  return hasError ? "border-red-400 focus:border-red-500" : "border-border";
}

export function PaymentForm({
  open,
  mode,
  initialPayment,
  onClose,
  onSubmit,
}: PaymentFormProps) {
  const [values, setValues] = useState<PaymentFormValues>(DEFAULT_PAYMENT_FORM_VALUES);
  const [errors, setErrors] = useState<PaymentFormErrors>({});

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && initialPayment) {
      setValues(paymentToFormValues(initialPayment));
    } else {
      setValues(DEFAULT_PAYMENT_FORM_VALUES);
    }
    setErrors({});
  }, [open, mode, initialPayment]);

  const isOccurrence = Boolean(initialPayment?.recurringTemplateId);
  const showRecurrence = values.paymentType === "recurring";
  const channelOptions = getAvailablePaymentMethods(values.autoPay);

  const clearError = (field: PaymentFormField) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const setPaymentMode = (autoPay: boolean) => {
    setValues((prev) => ({
      ...prev,
      autoPay,
      paymentMethod: sanitizePaymentMethod(prev.paymentMethod, autoPay),
    }));
  };

  const scrollToFirstError = (nextErrors: PaymentFormErrors) => {
    const firstField = ERROR_FIELD_ORDER.find((field) => nextErrors[field]);
    if (!firstField) return;

    requestAnimationFrame(() => {
      document
        .getElementById(ERROR_FIELD_IDS[firstField])
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const nextErrors = validatePaymentForm(values, showRecurrence);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      scrollToFirstError(nextErrors);
      return;
    }

    setErrors({});
    onSubmit(values);
    onClose();
  };

  const paymentModeHint = values.autoPay
    ? "Karttan veya hesaptan otomatik kesilir."
    : "Her dönem sen ödersin (havale, fatura vb.).";

  return (
    <Modal
      open={open}
      title={mode === "create" ? "Yeni Ödeme" : "Ödemeyi Düzenle"}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Vazgeç
          </Button>
          <Button type="submit" form="payment-form">
            {mode === "create" ? "Oluştur" : "Kaydet"}
          </Button>
        </>
      }
    >
      <form
        id="payment-form"
        onSubmit={handleSubmit}
        className="min-w-0 space-y-3 overflow-x-hidden sm:space-y-4"
      >
        <div>
          <label htmlFor="payment-title" className="mb-1 block text-sm font-medium">
            Başlık *
          </label>
          <input
            id="payment-title"
            name="payment-title"
            autoComplete="off"
            value={values.title}
            onChange={(e) => {
              clearError("title");
              setValues((prev) => ({ ...prev, title: e.target.value }));
            }}
            className={`w-full rounded-lg border px-3 py-2 text-sm ${inputErrorClass(Boolean(errors.title))}`}
            placeholder="Örn: Kira, Elektrik faturası, Netflix"
          />
          <FieldError message={errors.title} />
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 [&>*]:min-w-0">
          <div>
            <label htmlFor="payment-amount" className="mb-1 block text-sm font-medium">
              Tutar *
            </label>
            <input
              id="payment-amount"
              type="number"
              min="0"
              step="0.01"
              inputMode="decimal"
              value={values.plannedAmount}
              onChange={(e) => {
                clearError("plannedAmount");
                setValues((prev) => ({ ...prev, plannedAmount: e.target.value }));
              }}
              className={`w-full rounded-lg border px-3 py-2 text-sm ${inputErrorClass(Boolean(errors.plannedAmount))}`}
              placeholder="1240"
            />
            <FieldError message={errors.plannedAmount} />
          </div>

          <div>
            <label htmlFor="payment-currency" className="mb-1 block text-sm font-medium">
              Para birimi
            </label>
            <select
              id="payment-currency"
              value={values.currency}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  currency: e.target.value as PaymentFormValues["currency"],
                }))
              }
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              {Object.entries(PAYMENT_CURRENCY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 [&>*]:min-w-0">
          <div className="min-w-0 overflow-hidden">
            <label htmlFor="payment-due-date" className="mb-1 block text-sm font-medium">
              Vade tarihi *
            </label>
            <NativePickerInput
              id="payment-due-date"
              type="date"
              value={values.dueDate}
              aria-label="Vade tarihi"
              invalid={Boolean(errors.dueDate)}
              onChange={(dueDate) => {
                clearError("dueDate");
                clearError("recurrence");
                setValues((prev) => ({
                  ...prev,
                  dueDate,
                  recurrenceStartDate: prev.recurrenceStartDate || dueDate,
                }));
              }}
              className={inputErrorClass(Boolean(errors.dueDate))}
            />
            <FieldError message={errors.dueDate} />
          </div>

          <div>
            <label htmlFor="payment-category" className="mb-1 block text-sm font-medium">
              Kategori
            </label>
            <select
              id="payment-category"
              value={values.category}
              onChange={(e) =>
                setValues((prev) => ({ ...prev, category: e.target.value }))
              }
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              {PREDEFINED_PAYMENT_CATEGORIES.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <fieldset className="space-y-1.5">
          <legend className="mb-1 text-sm font-medium">Ödeme modu</legend>
          <div
            className="flex gap-0.5 rounded-lg border border-border bg-hover/30 p-0.5"
            role="radiogroup"
            aria-label="Ödeme modu"
          >
            <button
              type="button"
              role="radio"
              aria-checked={!values.autoPay}
              className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                !values.autoPay
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
              onClick={() => setPaymentMode(false)}
            >
              Manuel
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={values.autoPay}
              className={`flex-1 rounded-md px-2 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
                values.autoPay
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted hover:text-foreground"
              }`}
              onClick={() => setPaymentMode(true)}
            >
              Otomatik tahsilat
            </button>
          </div>
          <p className="text-xs text-muted">{paymentModeHint}</p>
        </fieldset>

        <div>
          <label htmlFor="payment-method" className="mb-1 block text-sm font-medium">
            Ödeme kanalı
          </label>
          <select
            id="payment-method"
            value={values.paymentMethod}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                paymentMethod: e.target.value as PaymentFormValues["paymentMethod"],
              }))
            }
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          >
            <option value="">Seçilmedi</option>
            {channelOptions.map((method) => (
              <option key={method} value={method}>
                {PAYMENT_METHOD_LABELS[method]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="payment-type" className="mb-1 block text-sm font-medium">
            Ödeme tipi
          </label>
          <select
            id="payment-type"
            value={values.paymentType}
            disabled={isOccurrence}
            onChange={(e) =>
              setValues((prev) => ({
                ...prev,
                paymentType: e.target.value as PaymentFormValues["paymentType"],
              }))
            }
            className="w-full rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-60"
          >
            {Object.entries(PAYMENT_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {isOccurrence && (
            <p className="mt-1 text-xs text-muted">
              Tekrarlayan ödeme kaydı — tip şablondan gelir.
            </p>
          )}
        </div>

        {mode === "edit" && (
          <div>
            <label htmlFor="payment-status" className="mb-1 block text-sm font-medium">
              Durum
            </label>
            <select
              id="payment-status"
              value={values.status}
              onChange={(e) =>
                setValues((prev) => ({
                  ...prev,
                  status: e.target.value as PaymentFormValues["status"],
                }))
              }
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            >
              {Object.entries(PAYMENT_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}

        {showRecurrence && (
          <div
            id="payment-recurrence-section"
            className="space-y-3 rounded-lg border border-border bg-hover/30 p-3 sm:space-y-4 sm:p-4"
          >
            <p className="text-sm font-medium">Tekrar ayarları</p>
            <FieldError message={errors.recurrence} />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 [&>*]:min-w-0">
              <div>
                <label
                  htmlFor="payment-recurrence-frequency"
                  className="mb-1 block text-sm font-medium"
                >
                  Sıklık
                </label>
                <select
                  id="payment-recurrence-frequency"
                  value={values.recurrenceFrequency}
                  disabled={isOccurrence}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      recurrenceFrequency: e.target
                        .value as PaymentFormValues["recurrenceFrequency"],
                    }))
                  }
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-60"
                >
                  {Object.entries(RECURRENCE_FREQUENCY_LABELS).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="payment-recurrence-interval"
                  className="mb-1 block text-sm font-medium"
                >
                  Aralık (her N dönem)
                </label>
                <input
                  id="payment-recurrence-interval"
                  type="number"
                  min="1"
                  value={values.recurrenceInterval}
                  disabled={isOccurrence}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      recurrenceInterval: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm disabled:opacity-60"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 [&>*]:min-w-0">
              <div className="min-w-0 overflow-hidden">
                <label
                  htmlFor="payment-recurrence-start"
                  className="mb-1 block text-sm font-medium"
                >
                  Başlangıç tarihi
                </label>
                <NativePickerInput
                  id="payment-recurrence-start"
                  type="date"
                  value={values.recurrenceStartDate || values.dueDate}
                  aria-label="Tekrar başlangıç tarihi"
                  invalid={Boolean(errors.recurrence)}
                  onChange={(recurrenceStartDate) => {
                    clearError("recurrence");
                    setValues((prev) => ({ ...prev, recurrenceStartDate }));
                  }}
                  className={inputErrorClass(Boolean(errors.recurrence))}
                />
              </div>

              <div className="min-w-0 overflow-hidden">
                <label
                  htmlFor="payment-recurrence-end"
                  className="mb-1 block text-sm font-medium"
                >
                  Bitiş tarihi (opsiyonel)
                </label>
                <NativePickerInput
                  id="payment-recurrence-end"
                  type="date"
                  value={values.recurrenceEndDate}
                  aria-label="Tekrar bitiş tarihi"
                  onChange={(recurrenceEndDate) =>
                    setValues((prev) => ({ ...prev, recurrenceEndDate }))
                  }
                />
              </div>
            </div>

            {values.recurrenceFrequency === "monthly" ||
            values.recurrenceFrequency === "yearly" ? (
              <div>
                <label
                  htmlFor="payment-recurrence-day"
                  className="mb-1 block text-sm font-medium"
                >
                  Ayın günü
                </label>
                <input
                  id="payment-recurrence-day"
                  type="number"
                  min="1"
                  max="31"
                  value={values.recurrenceDayOfMonth}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      recurrenceDayOfMonth: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                />
              </div>
            ) : null}

            {values.recurrenceFrequency === "weekly" ? (
              <div>
                <label
                  htmlFor="payment-recurrence-weekday"
                  className="mb-1 block text-sm font-medium"
                >
                  Haftanın günü
                </label>
                <select
                  id="payment-recurrence-weekday"
                  value={values.recurrenceWeekday}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      recurrenceWeekday: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                >
                  {WEEKDAY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={values.isVariableAmount}
                disabled={isOccurrence}
                onChange={(e) =>
                  setValues((prev) => ({
                    ...prev,
                    isVariableAmount: e.target.checked,
                  }))
                }
                className="rounded border-border disabled:opacity-60"
              />
              Tutar dönemden döneme değişebilir
            </label>

            {isOccurrence ? (
              <p className="text-xs text-muted">
                Bu kayıt tek bir döneme ait. Değişken tutar ayarını şablondan
                düzenleyin.
              </p>
            ) : values.isVariableAmount ? (
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Değişken tutar etkin — liste ve detayda görünecek.
              </p>
            ) : null}
          </div>
        )}

        <div>
          <label htmlFor="payment-note" className="mb-1 block text-sm font-medium">
            Not <span className="font-normal text-muted">(opsiyonel)</span>
          </label>
          <textarea
            id="payment-note"
            value={values.note}
            onChange={(e) =>
              setValues((prev) => ({ ...prev, note: e.target.value }))
            }
            rows={2}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            placeholder="Kısa not"
          />
        </div>
      </form>
    </Modal>
  );
}
