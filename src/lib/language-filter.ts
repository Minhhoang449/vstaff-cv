/** Lọc ngôn ngữ — canonical (DB) + alias (UI cũ / import). */

export const LANGUAGE_FILTER_OPTIONS = [
  { value: "Tiếng Việt", label: "Tiếng Việt" },
  { value: "Tiếng Anh", label: "Tiếng Anh (English)" },
  { value: "Tiếng Nhật", label: "Tiếng Nhật (日本語)" },
  { value: "Tiếng Trung", label: "Tiếng Trung (中文)" },
  { value: "Tiếng Hàn", label: "Tiếng Hàn (한국어)" },
  { value: "Tiếng Pháp", label: "Tiếng Pháp (Français)" },
  { value: "Tiếng Đức", label: "Tiếng Đức (Deutsch)" },
] as const;

/** Giá trị canonical lưu trong DB sau enrichLanguages. */
export const LANGUAGES = LANGUAGE_FILTER_OPTIONS.map((o) => o.value);

/** URL/UI cũ → canonical. */
const LEGACY_FILTER: Record<string, string> = {
  English: "Tiếng Anh",
  Français: "Tiếng Pháp",
  Deutsch: "Tiếng Đức",
  "日本語": "Tiếng Nhật",
  "中文": "Tiếng Trung",
  "한국어": "Tiếng Hàn",
};

/** Canonical → mọi biến thể có thể có trong DB. */
const LANGUAGE_VARIANTS: Record<string, string[]> = {
  "Tiếng Việt": ["Tiếng Việt", "Vietnamese", "Tieng Viet"],
  "Tiếng Anh": ["Tiếng Anh", "English", "Tieng Anh", "Anh văn"],
  "Tiếng Nhật": ["Tiếng Nhật", "日本語", "Japanese", "Tieng Nhat"],
  "Tiếng Trung": ["Tiếng Trung", "中文", "Chinese", "Tieng Trung", "Mandarin"],
  "Tiếng Hàn": ["Tiếng Hàn", "한국어", "Korean", "Tieng Han"],
  "Tiếng Pháp": ["Tiếng Pháp", "Français", "French", "Tieng Phap"],
  "Tiếng Đức": ["Tiếng Đức", "Deutsch", "German", "Tieng Duc"],
};

export function canonicalLanguageFilter(value: string | undefined | null): string | null {
  const v = value?.trim();
  if (!v) return null;
  if (LANGUAGE_VARIANTS[v]) return v;
  return LEGACY_FILTER[v] ?? null;
}

/** Các chuỗi khớp Prisma `languages hasSome`. */
export function languageFilterVariants(value: string | undefined | null): string[] {
  const canonical = canonicalLanguageFilter(value);
  if (!canonical) return [];
  return LANGUAGE_VARIANTS[canonical] ?? [canonical];
}
