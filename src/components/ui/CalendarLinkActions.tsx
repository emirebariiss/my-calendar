"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface CalendarLinkActionsProps {
  eventId?: string;
  canAdd: boolean;
  disabledTitle?: string;
  calendarDate?: string;
  onAdd: () => void;
  compact?: boolean;
}

/**
 * Bağlı event varsa takvime link; yoksa "Takvime ekle" butonu.
 * calendarDate verilirse link /calendar?date=YYYY-MM-DD olur.
 */
export function CalendarLinkActions({
  eventId,
  canAdd,
  disabledTitle,
  calendarDate,
  onAdd,
  compact = false,
}: CalendarLinkActionsProps) {
  const [isAdding, setIsAdding] = useState(false);
  const sizeClass = compact ? "px-2 py-1 text-xs" : undefined;

  const calendarHref = calendarDate
    ? `/calendar?date=${calendarDate}`
    : "/calendar";

  const handleAdd = () => {
    if (isAdding) return;
    setIsAdding(true);
    onAdd();
    setIsAdding(false);
  };

  if (eventId) {
    return (
      <Link
        href={calendarHref}
        className={`inline-flex items-center rounded-lg font-medium text-primary hover:underline ${
          compact ? "px-2 py-1 text-xs" : "px-3 py-2 text-sm"
        }`}
      >
        Takvimde gör
      </Link>
    );
  }

  if (canAdd) {
    return (
      <Button
        variant="ghost"
        type="button"
        className={sizeClass}
        disabled={isAdding}
        onClick={handleAdd}
      >
        {isAdding ? "Ekleniyor..." : "Takvime ekle"}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      type="button"
      className={sizeClass}
      disabled
      title={disabledTitle}
    >
      Takvime ekle
    </Button>
  );
}
