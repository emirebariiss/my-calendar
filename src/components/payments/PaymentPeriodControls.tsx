"use client";

import type { PaymentPeriod } from "@/lib/utils/paymentFilters";
import { PAYMENT_PERIOD_LABELS } from "@/lib/utils/paymentFilters";
import { canNavigatePeriod } from "@/lib/utils/paymentStats";

interface PaymentPeriodControlsProps {
  period: PaymentPeriod;
  periodLabel: string;
  onPeriodChange: (period: PaymentPeriod) => void;
  onNavigate: (direction: -1 | 1) => void;
}

const PERIOD_ORDER: PaymentPeriod[] = ["day", "week", "month", "year", "all"];

function periodTabClass(isActive: boolean): string {
  return [
    "flex-1 min-w-[3.75rem] rounded-lg px-2 py-1.5 text-xs font-medium transition-colors sm:min-w-[4.5rem] sm:text-sm",
    isActive
      ? "bg-card text-foreground shadow-sm"
      : "text-muted hover:text-foreground",
  ].join(" ");
}

export function PaymentPeriodControls({
  period,
  periodLabel,
  onPeriodChange,
  onNavigate,
}: PaymentPeriodControlsProps) {
  const showNav = canNavigatePeriod(period);

  return (
    <div className="space-y-2">
      <div
        className="flex flex-wrap gap-0.5 rounded-xl border border-border bg-hover/30 p-1"
        role="tablist"
        aria-label="Dönem filtresi"
      >
        {PERIOD_ORDER.map((key) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={period === key}
            className={periodTabClass(period === key)}
            onClick={() => onPeriodChange(key)}
          >
            {PAYMENT_PERIOD_LABELS[key]}
          </button>
        ))}
      </div>

      {showNav && (
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-lg leading-none text-muted transition-colors hover:bg-hover hover:text-foreground"
            onClick={() => onNavigate(-1)}
            aria-label="Önceki dönem"
          >
            ‹
          </button>
          <span className="min-w-[9rem] px-2 text-center text-sm font-medium capitalize text-foreground">
            {periodLabel}
          </span>
          <button
            type="button"
            className="rounded-lg px-2 py-1 text-lg leading-none text-muted transition-colors hover:bg-hover hover:text-foreground"
            onClick={() => onNavigate(1)}
            aria-label="Sonraki dönem"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
