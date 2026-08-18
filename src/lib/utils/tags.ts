import {
  DEFAULT_CUSTOM_TAG_COLOR,
  PREDEFINED_TAGS,
} from "@/lib/constants/tags";
import type { Tag } from "@/lib/types/tag";

export function slugifyTagName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function findTagBySlug(slug: string, customTags: Tag[]): Tag | undefined {
  return (
    PREDEFINED_TAGS.find((tag) => tag.slug === slug) ??
    customTags.find((tag) => tag.slug === slug)
  );
}

export function resolveTag(slug: string, customTags: Tag[]): Tag {
  const found = findTagBySlug(slug, customTags);
  if (found) return found;

  return {
    id: `tag-unknown-${slug}`,
    slug,
    name: slug,
    color: DEFAULT_CUSTOM_TAG_COLOR,
  };
}

export function getAllKnownTags(customTags: Tag[]): Tag[] {
  const slugs = new Set<string>();
  const result: Tag[] = [];

  for (const tag of [...PREDEFINED_TAGS, ...customTags]) {
    if (slugs.has(tag.slug)) continue;
    slugs.add(tag.slug);
    result.push(tag);
  }

  return result;
}

export function collectTagSlugsFromItems(
  items: Array<{ tags?: string[] }>
): string[] {
  const slugs = new Set<string>();
  for (const item of items) {
    item.tags?.forEach((slug) => slugs.add(slug));
  }
  return [...slugs].sort();
}

export function buildTagFilterOptions(
  customTags: Tag[],
  items: Array<{ tags?: string[] }>
): Tag[] {
  const known = getAllKnownTags(customTags);
  const knownSlugs = new Set(known.map((tag) => tag.slug));
  const extras = collectTagSlugsFromItems(items).filter(
    (slug) => !knownSlugs.has(slug)
  );

  return [
    ...known,
    ...extras.map((slug) => resolveTag(slug, customTags)),
  ];
}

export function createCustomTag(name: string, existingTags: Tag[]): Tag {
  const slug = slugifyTagName(name);
  const predefined = PREDEFINED_TAGS.find((tag) => tag.slug === slug);
  if (predefined) return predefined;

  const existing = existingTags.find((tag) => tag.slug === slug);
  if (existing) return existing;

  const numbers = existingTags
    .map((tag) => Number(tag.id.split("-").pop()))
    .filter((n) => !Number.isNaN(n));
  const next = numbers.length > 0 ? Math.max(...numbers) + 1 : 1;

  return {
    id: `tag-${String(next).padStart(3, "0")}`,
    slug,
    name: name.trim(),
    color: DEFAULT_CUSTOM_TAG_COLOR,
  };
}
