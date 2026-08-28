import "server-only";

import { INDUSTRIES } from "@/data/industries";

/** Từ khóa gắn với từng ngành trong list hệ thống — ưu tiên khớp dài/cụ thể hơn. */
const INDUSTRY_KEYWORDS: Record<string, string[]> = {
  "it-software": [
    "công nghệ thông tin",
    "lập trình",
    "developer",
    "software",
    "frontend",
    "backend",
    "fullstack",
    "full-stack",
    "mobile",
    "android",
    "ios",
    "react",
    "node.js",
    "nodejs",
    "java",
    "python",
    ".net",
    "php",
    "devops",
    "phần mềm",
    "lập trình viên",
    "kỹ sư phần mềm",
    "cntt",
    "it ",
    " it",
  ],
  "it-data": [
    "phân tích dữ liệu",
    "data analyst",
    "data scientist",
    "data engineer",
    "machine learning",
    "trí tuệ nhân tạo",
    "big data",
    "business intelligence",
    "power bi",
    "ai engineer",
    "ml engineer",
  ],
  "it-network": [
    "bảo mật",
    "cyber security",
    "network",
    "mạng máy tính",
    "system admin",
    "sysadmin",
    "infrastructure",
    "cloud engineer",
    "helpdesk it",
    "hạ tầng it",
  ],
  marketing: [
    "marketing",
    "truyền thông",
    "digital marketing",
    "seo",
    "sem",
    "brand",
    "pr ",
    "quảng cáo",
    "content marketing",
    "social media",
    "truyền thông marketing",
  ],
  sales: [
    "kinh doanh",
    "bán hàng",
    "sales",
    "account executive",
    "business development",
    "bd ",
    "sale ",
    "telesales",
    "sales executive",
    "nhân viên kinh doanh",
    "tư vấn",
    "tư vấn bán hàng",
    "tư vấn khách hàng",
  ],
  finance: [
    "ngân hàng",
    "tài chính",
    "bank",
    "tín dụng",
    "giao dịch viên",
    "quan hệ khách hàng",
    "qhkh",
    "tín dụng viên",
    "investment",
    "chứng khoán",
    "bảo hiểm nhân thọ",
  ],
  accounting: [
    "kế toán",
    "kiểm toán",
    "accountant",
    "auditor",
    "thuế",
    "kế toán viên",
    "chief accountant",
  ],
  hr: [
    "nhân sự",
    "tuyển dụng",
    "hr ",
    "human resources",
    "đào tạo nội bộ",
    "c&b",
    "payroll",
    "talent acquisition",
  ],
  admin: [
    "hành chính",
    "văn phòng",
    "thư ký",
    "assistant",
    "admin ",
    "lễ tân văn phòng",
    "trợ lý",
    "office admin",
  ],
  logistics: [
    "logistics",
    "chuỗi cung ứng",
    "supply chain",
    "xuất nhập khẩu",
    "kho vận",
    "vận tải",
    "freight",
    "procurement",
    "mua hàng",
  ],
  manufacturing: [
    "sản xuất",
    "cơ khí",
    "nhà máy",
    "kỹ sư cơ khí",
    "qa/qc",
    "qa qc",
    "sản xuất công nghiệp",
    "kỹ thuật sản xuất",
    "operator",
  ],
  construction: [
    "xây dựng",
    "bất động sản",
    "kiến trúc",
    "kỹ sư xây dựng",
    "real estate",
    "giám sát công trình",
    "địa ốc",
  ],
  design: [
    "thiết kế",
    "ui/ux",
    "ui ux",
    "graphic design",
    "designer",
    "figma",
    "photoshop",
    "illustrator",
    "thiết kế đồ họa",
  ],
  content: [
    "biên tập",
    "content writer",
    "copywriter",
    "nội dung",
    "biên dịch",
    "editor",
    "content creator",
  ],
  education: [
    "giáo dục",
    "giáo viên",
    "giảng viên",
    "teacher",
    "gia sư",
    "đào tạo",
    "tutor",
    "lecturer",
  ],
  healthcare: [
    "y tế",
    "dược",
    "bác sĩ",
    "điều dưỡng",
    "nurse",
    "pharmacy",
    "dược sĩ",
    "y tá",
    "phòng khám",
  ],
  hospitality: [
    "nhà hàng",
    "khách sạn",
    "hotel",
    "restaurant",
    "fnb",
    "f&b",
    "barista",
    "lễ tân khách sạn",
    "du lịch",
    "tourism",
  ],
  "customer-service": [
    "chăm sóc khách hàng",
    "cskh",
    "customer service",
    "call center",
    "tổng đài",
    "support khách hàng",
    "hotline",
  ],
  legal: [
    "pháp lý",
    "luật",
    "compliance",
    "lawyer",
    "legal",
    "luật sư",
    "pháp chế",
  ],
  other: [],
};

const VALID_IDS = new Set(INDUSTRIES.map((i) => i.id));

function stripDiacritics(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function norm(s: string) {
  return stripDiacritics(s.toLowerCase())
    .replace(/[^a-z0-9\s./&+-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreIndustry(blobNorm: string, industryId: string): number {
  const keywords = INDUSTRY_KEYWORDS[industryId] || [];
  let score = 0;
  for (const kw of keywords) {
    const k = norm(kw);
    if (!k || k.length < 2) continue;
    if (blobNorm.includes(k)) {
      // Từ khóa dài / cụ thể hơn được ưu tiên
      score += 10 + Math.min(40, k.length * 2);
    }
  }

  const industry = INDUSTRIES.find((i) => i.id === industryId);
  if (industry) {
    const nameN = norm(industry.name);
    if (nameN && blobNorm.includes(nameN)) score += 80;
    for (const part of industry.name.split(/[\/,]/).map((p) => norm(p))) {
      if (part.length >= 4 && blobNorm.includes(part)) score += 25;
    }
    const groupN = norm(industry.group);
    if (groupN.length >= 4 && blobNorm.includes(groupN)) score += 8;
  }

  return score;
}

/**
 * Map nội dung CV / gợi ý ngành → đúng industryId trong list hệ thống.
 * Không khớp được → "other".
 */
export function resolveIndustryId(
  ...parts: Array<string | string[] | undefined | null>
): string {
  const blob = parts
    .flatMap((p) => (Array.isArray(p) ? p : p ? [p] : []))
    .join("\n");
  const blobNorm = norm(blob);
  if (!blobNorm) return "other";

  // Nếu model đã trả đúng id trong list
  const asId = blobNorm.replace(/\s+/g, "-");
  for (const id of VALID_IDS) {
    if (blobNorm === id || asId === id || blobNorm.includes(id)) {
      // chỉ nhận khi blob ngắn kiểu "it-software" / tên ngành, không phải cả CV
      if (blobNorm.length < 80 && VALID_IDS.has(id)) return id;
    }
  }

  let bestId = "other";
  let bestScore = 0;
  for (const industry of INDUSTRIES) {
    if (industry.id === "other") continue;
    const score = scoreIndustry(blobNorm, industry.id);
    if (score > bestScore) {
      bestScore = score;
      bestId = industry.id;
    }
  }

  return bestScore > 0 ? bestId : "other";
}

export function isValidIndustryId(id: string | null | undefined): boolean {
  return Boolean(id && VALID_IDS.has(id));
}
