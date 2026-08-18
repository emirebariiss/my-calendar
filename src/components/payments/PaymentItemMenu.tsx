"use client";

import { useEffect, useRef, useState } from "react";
import type { Payment } from "@/lib/types/payment";
import { Button } from "@/components/ui/Button";

interface PaymentItemMenuProps {
  payment: Payment;
  isPaid: boolean;
  isSkipped: boolean;
  isOverdue: boolean;
  isRecurring: boolean;
  onEdit: (payment: Payment) => void;
  onDelete: (payment: Payment) => void;
  onMarkPending: (payment: Payment) => void;
  onMarkSkipped: (payment: Payment) => void;
}

export function PaymentItemMenu({
  payment,
  isPaid,
  isSkipped,
  isOverdue,
  isRecurring,
  onEdit,
  onDelete,
  onMarkPending,
  onMarkSkipped,
}: PaymentItemMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        type="button"
        className="px-2 py-1"
        aria-label="Diğer işlemler"
        onClick={() => setOpen((value) => !value)}
      >
        •••
      </Button>

      {open && (
        <div className="absolute right-0 top-full z-10 mt-1 min-w-[11rem] rounded-lg border border-border bg-card py-1 shadow-lg">
          {isPaid && (
            <MenuButton
              label="Ödenmedi işaretle"
              onClick={() => {
                onMarkPending(payment);
                setOpen(false);
              }}
            />
          )}
          {isSkipped && (
            <MenuButton
              label="Yeniden planla"
              onClick={() => {
                onMarkPending(payment);
                setOpen(false);
              }}
            />
          )}
          {isRecurring && !isPaid && !isSkipped && !isOverdue && (
            <MenuButton
              label="Bu dönemi atla"
              onClick={() => {
                onMarkSkipped(payment);
                setOpen(false);
              }}
            />
          )}
          <MenuButton
            label="Düzenle"
            onClick={() => {
              onEdit(payment);
              setOpen(false);
            }}
          />
          <MenuButton
            label="Sil"
            tone="danger"
            onClick={() => {
              onDelete(payment);
              setOpen(false);
            }}
          />
        </div>
      )}
    </div>
  );
}

function MenuButton({
  label,
  onClick,
  tone = "default",
}: {
  label: string;
  onClick: () => void;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`block w-full px-3 py-2 text-left text-sm hover:bg-hover ${
        tone === "danger" ? "text-red-600 dark:text-red-400" : ""
      }`}
    >
      {label}
    </button>
  );
}
