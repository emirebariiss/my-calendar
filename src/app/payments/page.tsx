"use client";

import { useMemo, useState } from "react";
import { useApp } from "@/providers/AppProvider";
import { usePayments } from "@/hooks/usePayments";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { EmptyState } from "@/components/ui/EmptyState";
import { PaymentForm } from "@/components/payments/PaymentForm";
import { PaymentList } from "@/components/payments/PaymentList";
import { PaymentHistoryList } from "@/components/payments/PaymentHistoryList";
import { PaymentDashboardSummary } from "@/components/payments/PaymentDashboardSummary";
import { PaymentPeriodControls } from "@/components/payments/PaymentPeriodControls";
import { PaymentViewTabs } from "@/components/payments/PaymentViewTabs";
import { UpcomingPayments } from "@/components/payments/UpcomingPayments";
import { PaymentDetailModal } from "@/components/payments/PaymentDetailModal";
import {
  formValuesToPaymentPayload,
  type PaymentFormValues,
} from "@/components/payments/paymentFormUtils";
import { PREDEFINED_PAYMENT_CATEGORIES } from "@/lib/constants/paymentCategories";
import type { Payment, PaymentStatus } from "@/lib/types/payment";
import { PAYMENT_STATUS_LABELS } from "@/lib/types/payment";
import {
  filterPaymentHistoryByPeriod,
  filterPaymentsByCategory,
  filterPaymentsByPeriod,
  filterPaymentsByStatus,
  getPaymentPeriodRange,
  sortPaymentHistoryByDueDate,
  sortPaymentsByDueDate,
  type PaymentPeriod,
} from "@/lib/utils/paymentFilters";
import {
  computePeriodStats,
  shiftPeriodReference,
} from "@/lib/utils/paymentStats";

export default function PaymentsPage() {
  const { isLoading } = useApp();
  const {
    payments,
    paymentHistory,
    addPayment,
    updatePayment,
    deletePayment,
    markPaymentPaid,
    markPaymentPending,
    markPaymentSkipped,
  } = usePayments();

  const [period, setPeriod] = useState<PaymentPeriod>("month");
  const [referenceDate, setReferenceDate] = useState(() => new Date());
  const [activeTab, setActiveTab] = useState<"payments" | "history">("payments");
  const [statusFilter, setStatusFilter] = useState<PaymentStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editingPayment, setEditingPayment] = useState<Payment | undefined>();
  const [deletingPayment, setDeletingPayment] = useState<Payment | undefined>();
  const [detailPayment, setDetailPayment] = useState<Payment | undefined>();

  const periodRange = useMemo(
    () => getPaymentPeriodRange(period, referenceDate),
    [period, referenceDate]
  );

  const periodPayments = useMemo(
    () => filterPaymentsByPeriod(payments, period, referenceDate),
    [payments, period, referenceDate]
  );

  const filteredPayments = useMemo(() => {
    let result = periodPayments;
    result = filterPaymentsByCategory(result, categoryFilter);
    result = filterPaymentsByStatus(result, statusFilter);
    return sortPaymentsByDueDate(result, true);
  }, [periodPayments, categoryFilter, statusFilter]);

  const periodStats = useMemo(
    () => computePeriodStats(periodPayments),
    [periodPayments]
  );

  const sortedHistory = useMemo(() => {
    const inPeriod = filterPaymentHistoryByPeriod(
      paymentHistory,
      period,
      referenceDate
    );
    return sortPaymentHistoryByDueDate(inPeriod, false);
  }, [paymentHistory, period, referenceDate]);

  const handlePeriodChange = (next: PaymentPeriod) => {
    setPeriod(next);
    setReferenceDate(new Date());
  };

  const handleNavigate = (direction: -1 | 1) => {
    setReferenceDate((current) => shiftPeriodReference(period, current, direction));
  };

  const openCreateForm = () => {
    setFormMode("create");
    setEditingPayment(undefined);
    setFormOpen(true);
  };

  const openEditForm = (payment: Payment) => {
    setDetailPayment(undefined);
    setFormMode("edit");
    setEditingPayment(payment);
    setFormOpen(true);
  };

  const openDetail = (payment: Payment) => {
    setDetailPayment(payment);
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setFormMode("create");
    setEditingPayment(undefined);
  };

  const handleSubmit = (values: PaymentFormValues) => {
    if (formMode === "create") {
      addPayment(formValuesToPaymentPayload(values));
      return;
    }

    if (editingPayment) {
      updatePayment(
        editingPayment.id,
        formValuesToPaymentPayload(values, editingPayment)
      );
    }
  };

  const handleDeleteConfirm = () => {
    if (deletingPayment) {
      deletePayment(deletingPayment.id);
      setDeletingPayment(undefined);
    }
  };

  if (isLoading) {
    return (
      <EmptyState
        title="Ödemeler yükleniyor"
        description="Veriler hazırlanıyor…"
      />
    );
  }

  return (
    <div className="space-y-4">
      <PaymentPeriodControls
        period={period}
        periodLabel={periodRange.label}
        onPeriodChange={handlePeriodChange}
        onNavigate={handleNavigate}
      />

      <PaymentDashboardSummary stats={periodStats} />

      {activeTab === "payments" && (
        <UpcomingPayments payments={periodPayments} onOpenDetail={openDetail} />
      )}

      <PaymentViewTabs
        activeTab={activeTab}
        paymentsCount={filteredPayments.length}
        historyCount={sortedHistory.length}
        onChange={setActiveTab}
      />

      {activeTab === "payments" ? (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as PaymentStatus | "all")
                }
                className="rounded-lg border border-border px-3 py-2 text-sm"
                aria-label="Durum filtresi"
              >
                <option value="all">Tüm durumlar</option>
                {(Object.keys(PAYMENT_STATUS_LABELS) as PaymentStatus[]).map(
                  (status) => (
                    <option key={status} value={status}>
                      {PAYMENT_STATUS_LABELS[status]}
                    </option>
                  )
                )}
              </select>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="rounded-lg border border-border px-3 py-2 text-sm"
                aria-label="Kategori filtresi"
              >
                <option value="all">Tüm kategoriler</option>
                {PREDEFINED_PAYMENT_CATEGORIES.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <Button type="button" onClick={openCreateForm}>
              + Yeni ödeme
            </Button>
          </div>

          <Card title={`Tüm ödemeler (${filteredPayments.length})`}>
            {filteredPayments.length === 0 ? (
              <EmptyState
                title="Bu dönemde ödeme yok"
                description="Dönem seçimini değiştir veya yeni ödeme ekle."
              />
            ) : (
              <PaymentList
                payments={filteredPayments}
                allPayments={payments}
                onOpenDetail={openDetail}
                onEdit={openEditForm}
                onDelete={setDeletingPayment}
                onMarkPaid={(payment) => markPaymentPaid(payment.id)}
                onMarkPending={(payment) => markPaymentPending(payment.id)}
                onMarkSkipped={(payment) => markPaymentSkipped(payment.id)}
              />
            )}
          </Card>
        </>
      ) : (
        <Card title={`Ödeme geçmişi (${sortedHistory.length})`}>
          <p className="mb-3 text-xs text-muted">
            {periodRange.label} dönemindeki tamamlanmış ve kayıtlı ödemeler.
          </p>
          {sortedHistory.length === 0 ? (
            <EmptyState title="Bu dönemde geçmiş kayıt yok" />
          ) : (
            <PaymentHistoryList records={sortedHistory} />
          )}
        </Card>
      )}

      <PaymentDetailModal
        open={Boolean(detailPayment)}
        payment={detailPayment}
        payments={payments}
        paymentHistory={paymentHistory}
        onClose={() => setDetailPayment(undefined)}
        onEdit={openEditForm}
      />

      <PaymentForm
        open={formOpen}
        mode={formMode}
        initialPayment={editingPayment}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={Boolean(deletingPayment)}
        title="Ödemeyi sil"
        message={`"${deletingPayment?.title}" ödemesini silmek istediğine emin misin? Geçmiş kayıtlar korunur.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingPayment(undefined)}
      />
    </div>
  );
}
