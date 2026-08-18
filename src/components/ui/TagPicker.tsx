"use client";

import { useState } from "react";
import type { Tag } from "@/lib/types";
import { PREDEFINED_TAGS } from "@/lib/constants/tags";
import { Button } from "@/components/ui/Button";

interface TagPickerProps {
  selected: string[];
  customTags: Tag[];
  onChange: (slugs: string[]) => void;
  onAddCustomTag: (name: string) => string;
  onDeleteCustomTag?: (slug: string) => void;
}

export function TagPicker({
  selected,
  customTags,
  onChange,
  onAddCustomTag,
  onDeleteCustomTag,
}: TagPickerProps) {
  const [customInput, setCustomInput] = useState("");

  const toggleTag = (slug: string) => {
    if (selected.includes(slug)) {
      onChange(selected.filter((item) => item !== slug));
      return;
    }
    onChange([...selected, slug]);
  };

  const handleAddCustom = () => {
    const slug = onAddCustomTag(customInput);
    if (!slug) return;

    if (!selected.includes(slug)) {
      onChange([...selected, slug]);
    }
    setCustomInput("");
  };

  const handleDeleteCustom = (tag: Tag) => {
    const confirmed = window.confirm(
      `"${tag.name}" etiketini silmek istediğine emin misin? Tüm görev ve süreçlerden kaldırılır.`
    );
    if (!confirmed) return;

    onDeleteCustomTag?.(tag.slug);
    onChange(selected.filter((item) => item !== tag.slug));
  };

  const customOnly = customTags.filter(
    (tag) => !PREDEFINED_TAGS.some((item) => item.slug === tag.slug)
  );

  return (
    <div className="space-y-3">
      <div>
        <p className="mb-2 text-sm font-medium">Etiketler</p>
        <p className="mb-2 text-xs text-muted">
          Seçmek veya kaldırmak için tıkla. Özel etiketlerin yanındaki × ile sistemden silebilirsin.
        </p>
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_TAGS.map((tag) => {
            const isSelected = selected.includes(tag.slug);
            return (
              <button
                key={tag.id}
                type="button"
                onClick={() => toggleTag(tag.slug)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  isSelected
                    ? "text-white ring-2 ring-slate-900 ring-offset-1"
                    : "text-white opacity-60 hover:opacity-90"
                }`}
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </button>
            );
          })}
          {customOnly.map((tag) => {
            const isSelected = selected.includes(tag.slug);
            return (
              <span key={tag.id} className="inline-flex items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => toggleTag(tag.slug)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                    isSelected
                      ? "text-white ring-2 ring-slate-900 ring-offset-1"
                      : "text-white opacity-60 hover:opacity-90"
                  }`}
                  style={{ backgroundColor: tag.color }}
                >
                  {tag.name}
                </button>
                {onDeleteCustomTag && (
                  <button
                    type="button"
                    onClick={() => handleDeleteCustom(tag)}
                    className="rounded-full px-1.5 py-0.5 text-xs text-muted hover:bg-red-50 hover:text-red-600"
                    aria-label={`${tag.name} etiketini sistemden sil`}
                    title="Etiketi sistemden sil"
                  >
                    ×
                  </button>
                )}
              </span>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <input
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddCustom();
            }
          }}
          placeholder="Özel etiket ekle..."
          className="min-w-0 flex-1 rounded-lg border border-border px-3 py-2 text-sm"
        />
        <Button type="button" variant="secondary" onClick={handleAddCustom}>
          Ekle
        </Button>
      </div>
    </div>
  );
}
