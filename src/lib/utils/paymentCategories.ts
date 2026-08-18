import {
  DEFAULT_CUSTOM_PAYMENT_CATEGORY_COLOR,
  PREDEFINED_PAYMENT_CATEGORIES,
} from "@/lib/constants/paymentCategories";
import type { PaymentCategory } from "@/lib/types/paymentCategory";

export function findPaymentCategoryBySlug(
  slug: string,
  customCategories: PaymentCategory[] = []
): PaymentCategory | undefined {
  return (
    PREDEFINED_PAYMENT_CATEGORIES.find((category) => category.slug === slug) ??
    customCategories.find((category) => category.slug === slug)
  );
}

export function resolvePaymentCategory(
  slug: string,
  customCategories: PaymentCategory[] = []
): PaymentCategory {
  const found = findPaymentCategoryBySlug(slug, customCategories);
  if (found) return found;

  return {
    slug,
    label: slug,
    color: DEFAULT_CUSTOM_PAYMENT_CATEGORY_COLOR,
  };
}
