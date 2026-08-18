import type { CurrencyPaymentStats } from "@/lib/utils/paymentStats";
import { formatPaymentAmountCompact } from "@/lib/utils/payment";

interface PaymentDashboardSummaryProps {
  stats: CurrencyPaymentStats[];
}

export function PaymentDashboardSummary({ stats }: PaymentDashboardSummaryProps) {
  return (
    <div className="rounded-xl border border-border bg-card px-3 py-2.5">
      <div className="mb-2 flex items-center justify-between gap-2">
        <p className="text-xs text-muted">Dönem özeti</p>
        <span className="rounded-full bg-hover px-2 py-0.5 text-[11px] text-muted">
          Bütçe · Yakında
        </span>
      </div>

      {stats.length === 0 ? (
        <p className="text-sm text-muted">Bu dönemde ödeme yok.</p>
      ) : (
        <div className="space-y-2">
          {stats.map((row) => (
            <div key={row.currency} className="text-sm">
              <span className="mr-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                {row.currency}
              </span>
              <span className="text-muted">
                Planlanan{" "}
                <span className="font-semibold tabular-nums text-foreground">
                  {formatPaymentAmountCompact(row.planned, row.currency)}
                </span>
                {" · "}
                <span className="text-emerald-700 dark:text-emerald-300">
                  Ödenen {formatPaymentAmountCompact(row.paid, row.currency)}
                </span>
                {" · "}
                <span className="text-amber-700 dark:text-amber-300">
                  Bekleyen {formatPaymentAmountCompact(row.pending, row.currency)}
                </span>
                {row.overdue > 0 && (
                  <>
                    {" · "}
                    <span className="text-red-700 dark:text-red-300">
                      Gecikmiş {formatPaymentAmountCompact(row.overdue, row.currency)}
                    </span>
                  </>
                )}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
