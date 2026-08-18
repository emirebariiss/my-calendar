"use client";

import type { Tag } from "@/lib/types";
import { resolveTag } from "@/lib/utils/tags";

interface TagFilterSelectProps {
  value: string;
  options: Tag[];
  onChange: (slug: string) => void;
  className?: string;
}

export function TagFilterSelect({
  value,
  options,
  onChange,
  className = "",
}: TagFilterSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`rounded-lg border border-border bg-white px-3 py-2 text-sm ${className}`}
    >
      <option value="all">Tüm etiketler</option>
      {options.map((tag) => (
        <option key={tag.slug} value={tag.slug}>
          {tag.name}
        </option>
      ))}
    </select>
  );
}

export function getTagFilterLabel(slug: string, customTags: Tag[]): string {
  if (slug === "all") return "Tüm etiketler";
  return resolveTag(slug, customTags).name;
}
