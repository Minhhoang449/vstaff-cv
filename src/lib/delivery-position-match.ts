/** Khớp mềm vị trí tuyển dụng cho lệnh lọc / gửi CV (không bắt buộc đúng chữ). */

import { INDUSTRIES } from "@/data/industries";
import type { CandidateProfile } from "@/lib/candidates-shared";

/** Từ khóa chuyên môn theo industryId (chuẩn hóa không dấu khi so khớp). */
const DOMAIN_KEYWORDS: Record<string, string[]> = {
  "it-software": [
    "lap trinh",
    "developer",
    "software",
    "frontend",
    "backend",
    "fullstack",
    "phan mem",
    "cntt",
    "cong nghe thong tin",
  ],
  "it-data": [
    "data analyst",
    "data scientist",
    "phan tich du lieu",
    "business intelligence",
    "machine learning",
    "ai ",
  ],
  "it-network": ["bao mat", "network", "devops", "sysadmin", "ha tang", "cloud"],
  marketing: [
    "marketing",
    "truyen thong",
    "digital marketing",
    "seo",
    "brand",
    "quang cao",
    "social media",
  ],
  sales: [
    "kinh doanh",
    "ban hang",
    "sales",
    "tu van",
    "telesales",
    "business development",
    "account executive",
    "sale ",
    "bd ",
    "cham soc khach hang ban hang",
  ],
  finance: [
    "tai chinh",
    "ngan hang",
    "tin dung",
    "chung khoan",
    "qhkh",
    "quan he khach hang",
  ],
  accounting: ["ke toan", "kiem toan", "thue", "accountant"],
  hr: ["nhan su", "tuyen dung", "hr ", "payroll", "dao tao noi bo"],
  admin: ["hanh chinh", "van phong", "thu ky", "tro ly", "le tan"],
  logistics: ["logistics", "chuoi cung ung", "xuat nhap khau", "kho van", "mua hang"],
  manufacturing: ["san xuat", "co khi", "qa qc", "nha may"],
  construction: ["xay dung", "bat dong san", "kien truc", "dia oc"],
  design: ["thiet ke", "ui ux", "ui/ux", "graphic", "figma"],
  content: ["bien tap", "content", "copywriter", "noi dung", "bien dich"],
  education: ["giao duc", "giao vien", "giang vien", "gia su", "dao tao"],
  healthcare: ["y te", "duoc", "bac si", "dieu duong", "y ta"],
  hospitality: ["nha hang", "khach san", "fnb", "f&b", "du lich", "le tan"],
  "customer-service": [
    "cham soc khach hang",
    "cskh",
    "customer service",
    "tong dai",
    "call center",
    "hotline",
  ],
  legal: ["phap ly", "luat", "compliance", "luat su", "phap che"],
};

/**
 * Ngành liên quan — VD kinh doanh/bán hàng mở sang tư vấn CSKH, marketing.
 * Không bắt buộc đúng industryId khách chọn.
 */
const RELATED_INDUSTRIES: Record<string, string[]> = {
  sales: ["sales", "marketing", "customer-service", "finance"],
  marketing: ["marketing", "sales", "content", "customer-service"],
  finance: ["finance", "accounting", "sales", "customer-service"],
  accounting: ["accounting", "finance"],
  "customer-service": ["customer-service", "sales", "marketing", "hospitality"],
  "it-software": ["it-software", "it-data", "it-network"],
  "it-data": ["it-data", "it-software"],
  "it-network": ["it-network", "it-software"],
  hr: ["hr", "admin", "education"],
  admin: ["admin", "hr", "customer-service"],
  logistics: ["logistics", "manufacturing", "sales"],
  manufacturing: ["manufacturing", "logistics", "construction"],
  construction: ["construction", "manufacturing"],
  design: ["design", "content", "it-software", "marketing"],
  content: ["content", "marketing", "design"],
  education: ["education", "hr"],
  healthcare: ["healthcare"],
  hospitality: ["hospitality", "customer-service", "sales"],
  legal: ["legal", "admin"],
};

export type DeliveryMatchContext = {
  primaryIndustryId: string;
  relatedIndustryIds: string[];
  keywords: string[];
};

export type DeliveryMatchTier = 1 | 2 | 3;

export type ScoredDeliveryCandidate = {
  candidate: CandidateProfile;
  tier: DeliveryMatchTier;
  score: number;
};

function stripDiacritics(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export function normalizeMatchText(s: string) {
  return stripDiacritics(s.toLowerCase())
    .replace(/[^a-z0-9\s./&+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function unique(items: string[]) {
  return Array.from(new Set(items.filter(Boolean)));
}

/** Suy ngành từ chuỗi vị trí khi NTD không chọn ngành. */
export function inferIndustryFromPosition(position: string): string {
  const blob = normalizeMatchText(position);
  if (!blob) return "other";

  let bestId = "other";
  let bestScore = 0;
  for (const [id, kws] of Object.entries(DOMAIN_KEYWORDS)) {
    let score = 0;
    for (const kw of kws) {
      const k = normalizeMatchText(kw);
      if (k.length >= 2 && blob.includes(k)) score += 10 + Math.min(30, k.length);
    }
    const industry = INDUSTRIES.find((i) => i.id === id);
    if (industry) {
      const nameN = normalizeMatchText(industry.name);
      if (nameN && blob.includes(nameN)) score += 50;
      for (const part of industry.name.split(/[\/,]/).map((p) => normalizeMatchText(p))) {
        if (part.length >= 4 && blob.includes(part)) score += 20;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  }
  return bestScore > 0 ? bestId : "other";
}

function tokenizePosition(position: string): string[] {
  const n = normalizeMatchText(position);
  if (!n) return [];
  const parts = n.split(/\s+/).filter((p) => p.length >= 3);
  // Giữ cả cụm đầy đủ để khớp "kinh doanh", "ban hang"
  return unique([n, ...parts]);
}

export function buildDeliveryMatchContext(
  position: string,
  industryId?: string
): DeliveryMatchContext {
  const selected = industryId?.trim() || "";
  const primary =
    selected && selected !== "other" ? selected : inferIndustryFromPosition(position);

  const related =
    primary !== "other"
      ? RELATED_INDUSTRIES[primary] || [primary]
      : RELATED_INDUSTRIES[inferIndustryFromPosition(position)] || [];

  const relatedIndustryIds = unique(
    related.length ? related : primary !== "other" ? [primary] : []
  );

  const domainKws = relatedIndustryIds.flatMap((id) => DOMAIN_KEYWORDS[id] || []);
  const keywords = unique([
    ...tokenizePosition(position),
    ...domainKws.map((k) => normalizeMatchText(k)),
  ]).filter((k) => k.length >= 2);

  return {
    primaryIndustryId: primary,
    relatedIndustryIds,
    keywords,
  };
}

function textHitsKeyword(blob: string, keywords: string[]): number {
  let best = 0;
  for (const kw of keywords) {
    if (kw.length >= 2 && blob.includes(kw)) {
      best = Math.max(best, 10 + Math.min(40, kw.length * 2));
    }
  }
  return best;
}

/**
 * Chấm điểm hồ sơ cho vị trí cần tuyển.
 * Tier 1: vị trí ứng tuyển / chức danh liên quan
 * Tier 2: kinh nghiệm chuyên môn (tóm tắt, kỹ năng)
 * Tier 3: ngành nghề liên quan (vd. kinh doanh → bán hàng, tư vấn/CSKH)
 * Không khớp → null (loại).
 */
export function scoreDeliveryCandidate(
  candidate: CandidateProfile,
  ctx: DeliveryMatchContext
): ScoredDeliveryCandidate | null {
  const posBlob = normalizeMatchText(
    `${candidate.desiredPosition} ${candidate.title}`
  );
  const expBlob = normalizeMatchText(
    `${candidate.summary} ${candidate.skills.join(" ")}`
  );

  const posHit = textHitsKeyword(posBlob, ctx.keywords);
  if (posHit > 0) {
    return {
      candidate,
      tier: 1,
      score: 1000 + posHit + (candidate.experienceYears > 0 ? 5 : 0),
    };
  }

  const expHit = textHitsKeyword(expBlob, ctx.keywords);
  if (expHit > 0) {
    return {
      candidate,
      tier: 2,
      score:
        500 +
        expHit +
        Math.min(40, candidate.experienceYears * 4) +
        (candidate.industryId && ctx.relatedIndustryIds.includes(candidate.industryId)
          ? 15
          : 0),
    };
  }

  if (
    candidate.industryId &&
    ctx.relatedIndustryIds.includes(candidate.industryId)
  ) {
    return {
      candidate,
      tier: 3,
      score:
        100 +
        (candidate.industryId === ctx.primaryIndustryId ? 30 : 0) +
        Math.min(20, candidate.experienceYears * 2),
    };
  }

  return null;
}

export function rankDeliveryCandidates(
  pool: CandidateProfile[],
  ctx: DeliveryMatchContext
): ScoredDeliveryCandidate[] {
  const out: ScoredDeliveryCandidate[] = [];
  for (const c of pool) {
    const scored = scoreDeliveryCandidate(c, ctx);
    if (scored) out.push(scored);
  }
  return out.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    if (b.score !== a.score) return b.score - a.score;
    return b.candidate.updatedAt.localeCompare(a.candidate.updatedAt);
  });
}
