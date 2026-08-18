"use client";

import type { Payment, PaymentHistoryRecord } from "@/lib/types/payment";
import {
  PAYMENT_STATUS_LABELS,
  PAYMENT_TYPE_LABELS,
} from "@/lib/types/payment";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PaymentAmount } from "@/components/payments/PaymentAmount";
import { PaymentCategoryBadge } from "@/components/payments/PaymentCategoryBadge";
import { PaymentHistoryList } from "@/components/payments/PaymentHistoryList";
import { formatDate } from "@/lib/utils/date";
import {
  getPaymentChannelSummary,
  getPaymentDisplayAmount,
  getPaymentStatusVariant,
  resolvePaymentStatus,
} from "@/lib/utils/payment";
import {
  getRelatedPaymentHistory,
  getRelatedPayments,
  hasVariableAmount,
  sortPaymentHistoryByDueDate,
  sortPaymentsByDueDate,
} from "@/lib/utils/paymentFilters";

interface PaymentDetailModalProps {
  open: boolean;
  payment?: Payment;
  payments: Payment[];
  paymentHistory: PaymentHistoryRecord[];
  onClose: () => void;
  onEdit: (payment: Payment) => void;
}

export function PaymentDetailModal({
  open,
  payment,
  payments,
  paymentHistory,
  onClose,
  onEdit,
}: PaymentDetailModalProps) {
  if (!payment) return null;

  const status = resolvePaymentStatus(payment);
  const relatedPayments = sortPaymentsByDueDate(
    getRelatedPayments(payment, payments),
    false
  );
  const seriesHistory = sortPaymentHistoryByDueDate(
    getRelatedPaymentHistory(payment, paymentHistory),
    false
  );
  const variableAmount = hasVariableAmount(payment, payments);

  return (
    <Modal
      open={open}
      title={payment.title}
      onClose={onClose}
      footer={
        <>
          <Button variant="secondary" type="button" onClick={onClose}>
            Kapat
          </Button>
          <Button type="button" onClick={() => onEdit(payment)}>
            Düzenle
          </Button>
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <PaymentAmount
            amount={getPaymentDisplayAmount({ ...payment, status })}
            currency={payment.currency}
          />
          <StatusBadge variant={getPaymentStatusVariant(status)}>
            {PAYMENT_STATUS_LABELS[status]}
          </StatusBadge>
          <PaymentCategoryBadge categorySlug={payment.category} />
        </div>

        <dl className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-muted">Vade</dt>
            <dd className="font-medium">{formatDate(payment.dueDate)}</dd>
          </div>
          <div>
            <dt className="text-muted">Tip</dt>
            <dd className="font-medium">
              {PAYMENT_TYPE_LABELS[payment.paymentType]}
              {payment.isTemplate ? " (düzenli ödeme)" : ""}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Ödeme modu</dt>
            <dd className="font-medium">
              {getPaymentChannelSummary(payment.autoPay, payment.paymentMethod)}
            </dd>
          </div>
          {variableAmount && (
            <div>
              <dt className="text-muted">Tutar</dt>
              <dd className="font-medium">Dönemden döneme değişebilir</dd>
            </div>
          )}
        </dl>

        {payment.note && (
          <p className="text-sm text-muted">{payment.note}</p>
        )}

        {relatedPayments.length > 1 && (
          <section>
            <h3 className="mb-2 text-sm font-semibold">Bu serideki kayıtlar</h3>
            <ul className="space-y-2">
              {relatedPayments.map((item) => {
                const itemStatus = resolvePaymentStatus(item);
                return (
                  <li
                    key={item.id}
                    className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border px-3 py-2 text-sm"
                  >
                    <span>
                      {formatDate(item.dueDate)}
                      {item.isTemplate ? " · Düzenli ödeme" : ""}
                    </span>
                    <div className="flex items-center gap-2">
                      <PaymentAmount
                        amount={getPaymentDisplayAmount({ ...item, status: itemStatus })}
                        currency={item.currency}
                        className="text-sm"
                      />
                      <StatusBadge variant={getPaymentStatusVariant(itemStatus)}>
                        {PAYMENT_STATUS_LABELS[itemStatus]}
                      </StatusBadge>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        <section>
          <h3 className="mb-2 text-sm font-semibold">
            Ödeme geçmişi ({seriesHistory.length})
          </h3>
          {seriesHistory.length === 0 ? (
            <p className="text-sm text-muted">Henüz geçmiş kayıt yok.</p>
          ) : (
            <PaymentHistoryList records={seriesHistory} />
          )}
        </section>
      </div>
    </Modal>
  );
}
