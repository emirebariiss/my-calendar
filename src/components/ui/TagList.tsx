"use client";

import type { Tag } from "@/lib/types";
import { resolveTag } from "@/lib/utils/tags";

interface TagListProps {
  tags?: string[];
  customTags: Tag[];
  className?: string;
  maxVisible?: number;
}

/**
 * Stil 1/3: Kategori etiketleri (İş, Kodlama…) — dolu renkli pill
 * Durum: StatusBadge | Öncelik: PriorityBadge
 */
export function TagList({
  tags,
  customTags,
  className = "",
  maxVisible,
}: TagListProps) {
  if (!tags?.length) return null;

  const visible = maxVisible ? tags.slice(0, maxVisible) : tags;
  const hiddenCount = maxVisible ? Math.max(0, tags.length - maxVisible) : 0;

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {visible.map((slug) => {
        const tag = resolveTag(slug, customTags);
        return (
          <span
            key={slug}
            className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium text-white"
            style={{ backgroundColor: tag.color }}
          >
            {tag.name}
          </span>
        );
      })}
      {hiddenCount > 0 && (
        <span className="text-xs font-medium text-muted">+{hiddenCount}</span>
      )}
    </div>
  );
}
