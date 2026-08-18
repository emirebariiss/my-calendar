"use client";

import { Button } from "@/components/ui/Button";

export type PaymentsViewTab = "payments" | "history";

interface PaymentViewTabsProps {
  activeTab: PaymentsViewTab;
  paymentsCount: number;
  historyCount: number;
  onChange: (tab: PaymentsViewTab) => void;
}

export function PaymentViewTabs({
  activeTab,
  paymentsCount,
  historyCount,
  onChange,
}: PaymentViewTabsProps) {
  return (
    <div className="flex gap-1 rounded-lg border border-border bg-hover/30 p-1">
      <Button
        type="button"
        variant={activeTab === "payments" ? "primary" : "ghost"}
        className="flex-1 px-3 py-1.5 text-sm"
        onClick={() => onChange("payments")}
      >
        Ödemeler ({paymentsCount})
      </Button>
      <Button
        type="button"
        variant={activeTab === "history" ? "primary" : "ghost"}
        className="flex-1 px-3 py-1.5 text-sm"
        onClick={() => onChange("history")}
      >
        Geçmiş ({historyCount})
      </Button>
    </div>
  );
}
