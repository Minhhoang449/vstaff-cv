import { INDUSTRIES } from "@/data/industries";

/** Layout shell — mỗi ngành gắn 1 layout + màu riêng. */
export type CvLayoutId =
  | "classic"
  | "sidebar"
  | "banner"
  | "rail"
  | "topbar"
  | "split"
  | "executive"
  | "magazine";

export type CvTemplateTheme = {
  /** Trùng industryId — 1 mẫu / 1 ngành */
  id: string;
  label: string;
  layout: CvLayoutId;
  accent: string;
  accentMuted: string;
  chipBg: string;
  sidebarBg?: string;
  sidebarMuted?: string;
};

/**
 * 20 mẫu — phủ hết INDUSTRIES.
 * Mỗi ngành: layout + palette khác nhau để PDF/preview phân biệt rõ.
 */
export const CV_TEMPLATE_THEMES: Record<string, CvTemplateTheme> = {
  "it-software": {
    id: "it-software",
    label: "Tech Sidebar",
    layout: "sidebar",
    accent: "#1d4ed8",
    accentMuted: "#93c5fd",
    chipBg: "#eff6ff",
    sidebarBg: "#0f172a",
    sidebarMuted: "#cbd5e1",
  },
  "it-data": {
    id: "it-data",
    label: "Data Insight",
    layout: "sidebar",
    accent: "#6d28d9",
    accentMuted: "#c4b5fd",
    chipBg: "#f5f3ff",
    sidebarBg: "#1e1b4b",
    sidebarMuted: "#ddd6fe",
  },
  "it-network": {
    id: "it-network",
    label: "Secure Net",
    layout: "sidebar",
    accent: "#0e7490",
    accentMuted: "#67e8f9",
    chipBg: "#ecfeff",
    sidebarBg: "#083344",
    sidebarMuted: "#a5f3fc",
  },
  marketing: {
    id: "marketing",
    label: "Brand Banner",
    layout: "banner",
    accent: "#0f766e",
    accentMuted: "#99f6e4",
    chipBg: "#ecfdf5",
  },
  sales: {
    id: "sales",
    label: "Growth Banner",
    layout: "banner",
    accent: "#047857",
    accentMuted: "#a7f3d0",
    chipBg: "#ecfdf5",
  },
  finance: {
    id: "finance",
    label: "Finance Executive",
    layout: "executive",
    accent: "#1e3a5f",
    accentMuted: "#94a3b8",
    chipBg: "#f1f5f9",
  },
  accounting: {
    id: "accounting",
    label: "Ledger Classic",
    layout: "classic",
    accent: "#0f766e",
    accentMuted: "#5eead4",
    chipBg: "#f0fdfa",
  },
  hr: {
    id: "hr",
    label: "People Split",
    layout: "split",
    accent: "#7c3aed",
    accentMuted: "#ddd6fe",
    chipBg: "#f5f3ff",
  },
  admin: {
    id: "admin",
    label: "Office Classic",
    layout: "classic",
    accent: "#334155",
    accentMuted: "#94a3b8",
    chipBg: "#f4f4f5",
  },
  logistics: {
    id: "logistics",
    label: "Supply Topbar",
    layout: "topbar",
    accent: "#c2410c",
    accentMuted: "#fdba74",
    chipBg: "#fff7ed",
  },
  manufacturing: {
    id: "manufacturing",
    label: "Industrial Rail",
    layout: "rail",
    accent: "#475569",
    accentMuted: "#94a3b8",
    chipBg: "#f1f5f9",
  },
  construction: {
    id: "construction",
    label: "Build Banner",
    layout: "banner",
    accent: "#b45309",
    accentMuted: "#fcd34d",
    chipBg: "#fffbeb",
  },
  design: {
    id: "design",
    label: "Creative Rail",
    layout: "rail",
    accent: "#c2410c",
    accentMuted: "#fdba74",
    chipBg: "#fff7ed",
  },
  content: {
    id: "content",
    label: "Editorial Magazine",
    layout: "magazine",
    accent: "#be123c",
    accentMuted: "#fda4af",
    chipBg: "#fff1f2",
  },
  education: {
    id: "education",
    label: "Campus Classic",
    layout: "classic",
    accent: "#15803d",
    accentMuted: "#86efac",
    chipBg: "#f0fdf4",
  },
  healthcare: {
    id: "healthcare",
    label: "Care Banner",
    layout: "banner",
    accent: "#0e7490",
    accentMuted: "#a5f3fc",
    chipBg: "#ecfeff",
  },
  hospitality: {
    id: "hospitality",
    label: "Service Rail",
    layout: "rail",
    accent: "#b45309",
    accentMuted: "#fcd34d",
    chipBg: "#fffbeb",
  },
  "customer-service": {
    id: "customer-service",
    label: "Support Topbar",
    layout: "topbar",
    accent: "#0369a1",
    accentMuted: "#7dd3fc",
    chipBg: "#f0f9ff",
  },
  legal: {
    id: "legal",
    label: "Counsel Executive",
    layout: "executive",
    accent: "#1c1917",
    accentMuted: "#a8a29e",
    chipBg: "#f5f5f4",
  },
  other: {
    id: "other",
    label: "General Classic",
    layout: "classic",
    accent: "#0f766e",
    accentMuted: "#5eead4",
    chipBg: "#f4f4f5",
  },
};

const FALLBACK = CV_TEMPLATE_THEMES.other;

export function getCvTemplateTheme(industryOrTemplateId: string): CvTemplateTheme {
  return CV_TEMPLATE_THEMES[industryOrTemplateId] ?? FALLBACK;
}

/** templateId = industryId (1 mẫu / ngành). */
export function resolveCvTemplateId(industryId: string): string {
  if (CV_TEMPLATE_THEMES[industryId]) return industryId;
  if (INDUSTRIES.some((i) => i.id === industryId)) return industryId;
  return "other";
}

export function cvTemplateLabel(id: string) {
  const theme = getCvTemplateTheme(id);
  const industry = INDUSTRIES.find((i) => i.id === theme.id)?.name;
  return industry ? `${theme.label} · ${industry}` : theme.label;
}
