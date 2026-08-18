import type { Tag } from "@/lib/types/tag";

/** Mock veri slug'ları ile uyumlu önceden tanımlı tag'ler */
export const PREDEFINED_TAGS: Tag[] = [
  { id: "tag-work", slug: "work", name: "İş", color: "#3B82F6" },
  { id: "tag-study", slug: "study", name: "Okul", color: "#8B5CF6" },
  { id: "tag-personal", slug: "personal", name: "Kişisel", color: "#10B981" },
  { id: "tag-health", slug: "health", name: "Sağlık", color: "#F59E0B" },
  { id: "tag-coding", slug: "coding", name: "Kodlama", color: "#EF4444" },
];

export const DEFAULT_CUSTOM_TAG_COLOR = "#64748B";
