import { useApp } from "@/providers/AppProvider";

export function useTags() {
  const { customTags, ensureCustomTag, deleteCustomTag } = useApp();
  return { customTags, ensureCustomTag, deleteCustomTag };
}
