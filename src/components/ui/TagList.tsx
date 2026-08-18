"use client";

import type { Tag } from "@/lib/types";
import { resolveTag } from "@/lib/utils/tags";

interface TagListProps {
  tags?: string[];
  customTags: Tag[];
  className?: string;
}

export function TagList({ tags, customTags, className = "" }: TagListProps) {
  if (!tags?.length) return null;

  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {tags.map((slug) => {
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
    </div>
  );
}
