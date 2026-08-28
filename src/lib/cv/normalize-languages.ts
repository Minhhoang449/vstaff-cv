import "server-only";

const LANGUAGE_RULES: { label: string; patterns: RegExp[] }[] = [
  {
    label: "Tiếng Anh",
    patterns: [
      /\btiếng\s*anh\b/iu,
      /\banh\s*văn\b/iu,
      /\benglish\b/iu,
      /\btoeic\b/iu,
      /\bielts\b/iu,
      /\btoefl\b/iu,
      /\bgiao\s*tiếp\s*(tiếng\s*)?anh\b/iu,
      /\bcommunicate\s+in\s+english\b/iu,
    ],
  },
  {
    label: "Tiếng Nhật",
    patterns: [
      /\btiếng\s*nhật\b/iu,
      /\bjapanese\b/iu,
      /\bjlpt\b/iu,
      /\bjlpt\s*n[1-5]\b/iu,
    ],
  },
  {
    label: "Tiếng Hàn",
    patterns: [/\btiếng\s*hàn\b/iu, /\bkorean\b/iu, /\btopik\b/iu],
  },
  {
    label: "Tiếng Trung",
    patterns: [/\btiếng\s*trung\b/iu, /\bchinese\b/iu, /\bhsk\b/iu, /\bmandarin\b/iu],
  },
  {
    label: "Tiếng Pháp",
    patterns: [/\btiếng\s*pháp\b/iu, /\bfrench\b/iu, /\bdelf\b/iu, /\bdalf\b/iu],
  },
  {
    label: "Tiếng Đức",
    patterns: [/\btiếng\s*đức\b/iu, /\bgerman\b/iu],
  },
];

function languageKey(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/** Nhãn native script (filter UI) → canonical tiếng Việt. */
const SCRIPT_ALIASES: Record<string, string> = {
  日本語: "Tiếng Nhật",
  中文: "Tiếng Trung",
  한국어: "Tiếng Hàn",
};

const ALIASES: Record<string, string> = {
  english: "Tiếng Anh",
  tienganh: "Tiếng Anh",
  anhvan: "Tiếng Anh",
  japanese: "Tiếng Nhật",
  tiengnhat: "Tiếng Nhật",
  korean: "Tiếng Hàn",
  tienghan: "Tiếng Hàn",
  chinese: "Tiếng Trung",
  tiengtrung: "Tiếng Trung",
  french: "Tiếng Pháp",
  tiengphap: "Tiếng Pháp",
  german: "Tiếng Đức",
  tiengduc: "Tiếng Đức",
  vietnamese: "Tiếng Việt",
  tiengviet: "Tiếng Việt",
};

/**
 * Gộp languages từ model + suy luận từ skills / itSkills / nội dung CV
 * (vd. "nói tiếng Anh giao tiếp" nằm trong skills → thêm Tiếng Anh).
 */
export function enrichLanguages(
  rawLanguages: string[] | undefined,
  ...textParts: Array<string | string[] | undefined | null>
): string[] {
  const ordered: string[] = [];
  const seen = new Set<string>();

  const push = (label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    const fromScript = SCRIPT_ALIASES[trimmed];
    const key = languageKey(trimmed);
    const canonical = fromScript || ALIASES[key] || trimmed;
    const ck = languageKey(canonical) || fromScript || trimmed;
    if (seen.has(ck)) return;
    seen.add(ck);
    ordered.push(canonical);
  };

  push("Tiếng Việt");
  for (const lang of rawLanguages || []) push(String(lang));

  const blob = textParts
    .flatMap((p) => (Array.isArray(p) ? p : p ? [p] : []))
    .join("\n");

  for (const rule of LANGUAGE_RULES) {
    if (rule.patterns.some((re) => re.test(blob))) push(rule.label);
  }

  return ordered;
}
