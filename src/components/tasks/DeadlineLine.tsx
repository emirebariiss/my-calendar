import { formatDate } from "@/lib/utils/date";

interface DeadlineLineProps {
  deadline?: string;
  overdue?: boolean;
  label?: string;
  className?: string;
}

/** Deadline metni; gecikmişse rozetsiz "· Gecikmiş" ekler (kart zaten uyarıyor). */
export function DeadlineLine({
  deadline,
  overdue = false,
  label = "Deadline",
  className = "mt-2 text-xs text-muted",
}: DeadlineLineProps) {
  if (!deadline) {
    return <p className={className}>Süresiz</p>;
  }

  return (
    <p className={className}>
      {label}: {formatDate(deadline)}
      {overdue && (
        <span className="font-medium text-red-600 dark:text-red-400"> · Gecikmiş</span>
      )}
    </p>
  );
}
