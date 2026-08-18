import { resolvePaymentCategory } from "@/lib/utils/paymentCategories";

interface PaymentCategoryBadgeProps {
  categorySlug: string;
  /** badge: dolu kutu (modal, geçmiş) | text: renkli metin (liste kartları) */
  variant?: "badge" | "text";
  className?: string;
}

export function PaymentCategoryBadge({
  categorySlug,
  variant = "badge",
  className = "",
}: PaymentCategoryBadgeProps) {
  const category = resolvePaymentCategory(categorySlug);

  if (variant === "text") {
    return (
      <span
        className={`font-medium ${className}`}
        style={{ color: category.color }}
      >
        {category.label}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center rounded-md border border-border bg-hover/50 px-2 py-0.5 text-xs text-muted ${className}`}
    >
      <span
        className="mr-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ backgroundColor: category.color }}
        aria-hidden
      />
      {category.label}
    </span>
  );
}
