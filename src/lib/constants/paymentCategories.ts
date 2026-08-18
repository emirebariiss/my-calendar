import type { PaymentCategory } from "@/lib/types/paymentCategory";

/** Mock veri slug'ları ile uyumlu önceden tanımlı ödeme kategorileri */
export const PREDEFINED_PAYMENT_CATEGORIES: PaymentCategory[] = [
  { slug: "housing", label: "Konut", color: "#6366F1" },
  { slug: "bills", label: "Faturalar", color: "#F59E0B" },
  { slug: "subscriptions", label: "Abonelikler", color: "#EC4899" },
  { slug: "credit_card", label: "Kredi kartı", color: "#EF4444" },
  { slug: "loan", label: "Kredi / Borç", color: "#DC2626" },
  { slug: "education", label: "Eğitim", color: "#8B5CF6" },
  { slug: "transportation", label: "Ulaşım", color: "#0EA5E9" },
  { slug: "shopping", label: "Alışveriş", color: "#14B8A6" },
  { slug: "health", label: "Sağlık", color: "#10B981" },
  { slug: "entertainment", label: "Eğlence", color: "#F97316" },
  { slug: "other", label: "Diğer", color: "#64748B" },
];

export const DEFAULT_CUSTOM_PAYMENT_CATEGORY_COLOR = "#64748B";
