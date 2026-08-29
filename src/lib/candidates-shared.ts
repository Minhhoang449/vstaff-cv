/** Client-safe candidate types/constants — do NOT import db/prisma here. */

import { evaluateCvCompleteness } from "@/lib/cv/cv-completeness";
import type { CandidateCvDetails } from "@/lib/cv/cv-details";

export type UserRole = "EMPLOYER" | "CANDIDATE" | "ADMIN";

export type CandidateGender = "male" | "female" | "other";
export type JobSeekingStatus = "active" | "open" | "passive";

export type CandidateProfile = {
  id: string;
  slug: string;
  fullName: string;
  title: string;
  desiredPosition: string;
  location: string;
  provinceCode: string;
  wardCode: string;
  wardName: string;
  industryId: string;
  gender: CandidateGender;
  languages: string[];
  education: string;
  experienceYears: number;
  skills: string[];
  summary: string;
  age: number;
  salaryExpect: number;
  workType: string;
  jobSeekingStatus: JobSeekingStatus;
  interestCount: number;
  phone: string;
  email: string;
  /** NTD đã xem hồ sơ này chưa */
  isViewed: boolean;
  isPublic: boolean;
  updatedAt: string;
  /** Điểm độ đầy đủ CV (0–100) */
  cvScore: number;
  cvGrade: "A" | "B" | "C" | "D";
  cvScoreLabel: string;
  /** Chi tiết CV trích xuất (kinh nghiệm, học vấn, sở thích…) */
  cvDetails?: CandidateCvDetails;
};

export const PAGE_SIZE = 12;
/** Cap deep offset pagination for ~100k scale. */
export const MAX_LIST_PAGE = 200;

export const GENDERS: { id: CandidateGender | ""; label: string }[] = [
  { id: "", label: "Tất cả" },
  { id: "male", label: "Nam" },
  { id: "female", label: "Nữ" },
  { id: "other", label: "Khác" },
];

export const LANGUAGES = [
  "Tiếng Việt",
  "English",
  "日本語",
  "中文",
  "한국어",
  "Français",
  "Deutsch",
] as const;

export const EDUCATION_LEVELS = [
  "Trung cấp",
  "Cao đẳng",
  "Đại học",
  "Thạc sĩ",
  "Tiến sĩ",
] as const;

export const DESIRED_POSITIONS = [
  "Frontend Developer",
  "Backend Developer",
  "Full-stack Developer",
  "UI/UX Designer",
  "DevOps Engineer",
  "Data Analyst",
  "Nhân viên kinh doanh",
  "Kế toán",
  "Nhân sự",
  "Marketing Executive",
] as const;

export const WORK_TYPES = ["Toàn thời gian", "Bán thời gian", "Remote", "Fresher"] as const;

export const JOB_SEEKING_STATUSES: { id: JobSeekingStatus | ""; label: string }[] = [
  { id: "", label: "Tất cả" },
  { id: "active", label: "Tích cực tìm việc" },
  { id: "open", label: "Đang mở cơ hội" },
  { id: "passive", label: "Chưa chủ động" },
];

export const EXPERIENCE_FILTERS = [
  { id: "", label: "Tất cả" },
  { id: "0-1", label: "Dưới 1 năm" },
  { id: "1-3", label: "1–3 năm" },
  { id: "3-5", label: "3–5 năm" },
  { id: "5+", label: "Trên 5 năm" },
] as const;

const INDUSTRY_IDS = [
  "it-software",
  "it-data",
  "marketing",
  "sales",
  "finance",
  "accounting",
  "hr",
  "design",
  "education",
  "healthcare",
] as const;

const PROVINCE_SEED = [
  { code: "01", name: "Thành phố Hà Nội" },
  { code: "79", name: "Thành phố Hồ Chí Minh" },
  { code: "48", name: "Thành phố Đà Nẵng" },
  { code: "31", name: "Thành phố Hải Phòng" },
] as const;

const WARD_SEED: Record<string, { code: string; name: string }[]> = {
  "01": [
    { code: "00004", name: "Ba Đình" },
    { code: "00008", name: "Ngọc Hà" },
    { code: "00103", name: "Cầu Giấy" },
  ],
  "79": [
    { code: "26734", name: "Bến Nghé" },
    { code: "26740", name: "Đa Kao" },
    { code: "26767", name: "Tân Định" },
  ],
  "48": [
    { code: "20257", name: "Hải Châu" },
    { code: "20263", name: "Thanh Khê" },
  ],
  "31": [
    { code: "11311", name: "Hồng Bàng" },
    { code: "11317", name: "Ngô Quyền" },
  ],
};

function shortProvince(name: string) {
  return name.replace(/^Thành phố\s+/u, "");
}

const POSITION_INDUSTRY: Record<string, string> = {
  "Frontend Developer": "it-software",
  "Backend Developer": "it-software",
  "Full-stack Developer": "it-software",
  "UI/UX Designer": "design",
  "DevOps Engineer": "it-network",
  "Data Analyst": "it-data",
  "Nhân viên kinh doanh": "sales",
  "Kế toán": "accounting",
  "Nhân sự": "hr",
  "Marketing Executive": "marketing",
};

/** In-memory seed (chỉ dùng khi Postgres không sẵn sàng / script seed). */
export function buildMemoryCandidates(count = 48): CandidateProfile[] {
  return Array.from({ length: count }, (_, i) => {
    const n = i + 1;
    const skillsPool = [
      "React",
      "TypeScript",
      "Node.js",
      "PostgreSQL",
      "Next.js",
      "Python",
      "Java",
      "AWS",
      "Docker",
      "Figma",
    ];
    const province = PROVINCE_SEED[i % PROVINCE_SEED.length];
    const wards = WARD_SEED[province.code];
    const ward = wards[i % wards.length];
    const gender: CandidateGender = i % 3 === 0 ? "female" : i % 7 === 0 ? "other" : "male";
    const langA = LANGUAGES[i % LANGUAGES.length];
    const langB = LANGUAGES[(i + 1) % LANGUAGES.length];
    const desiredPosition = DESIRED_POSITIONS[i % DESIRED_POSITIONS.length];
    const experienceYears = (i % 10) + 1;
    const statuses: JobSeekingStatus[] = ["active", "open", "passive"];
    const industryId =
      POSITION_INDUSTRY[desiredPosition] || INDUSTRY_IDS[i % INDUSTRY_IDS.length];

    const base = {
      id: `cand-${n}`,
      slug: `ung-vien-${n}`,
      fullName: `Ứng viên mẫu ${n}`,
      title: desiredPosition,
      desiredPosition,
      location: shortProvince(province.name),
      provinceCode: province.code,
      wardCode: ward.code,
      wardName: ward.name,
      industryId,
      gender,
      languages: langA === langB ? [langA] : [langA, langB],
      education: EDUCATION_LEVELS[i % EDUCATION_LEVELS.length],
      experienceYears,
      skills: skillsPool.slice(0, 3 + (i % 4)),
      summary: `Đang tìm cơ hội ${desiredPosition}. ${experienceYears}+ năm kinh nghiệm, sẵn sàng kết nối NTD.`,
      age: 22 + (i % 18),
      salaryExpect: 8 + (i % 25),
      workType: WORK_TYPES[i % WORK_TYPES.length],
      jobSeekingStatus: statuses[i % statuses.length],
      interestCount: 12 + ((i * 17) % 500),
      phone: i % 5 === 0 ? "" : `09${String(10000000 + n).slice(-8)}`,
      email: i % 7 === 0 ? "" : `ungvien${n}@demo.local`,
      isViewed: false,
      isPublic: true,
      updatedAt: new Date(Date.now() - (i % 48) * 60 * 60 * 1000).toISOString(),
    };

    const completeness = evaluateCvCompleteness(base);
    return {
      ...base,
      cvScore: completeness.cvScore,
      cvGrade: completeness.cvGrade,
      cvScoreLabel: completeness.cvScoreLabel,
    };
  });
}

/** Không seed mẫu trên runtime — dữ liệu thật từ Postgres / import admin. */
export const CANDIDATES: CandidateProfile[] = [];

export type CandidateListParams = {
  page?: number;
  q?: string;
  location?: string;
  skill?: string;
  province?: string;
  ward?: string;
  industry?: string;
  gender?: string;
  language?: string;
  position?: string;
  education?: string;
  experience?: string;
  workType?: string;
  status?: string;
  sort?: string;
  employerId?: string;
  unviewedOnly?: boolean;
  viewedOnly?: boolean;
  /** Khi set: trả tối đa N hồ sơ (bỏ PAGE_SIZE), dùng cho khớp lệnh lọc. */
  limit?: number;
};

export type CandidateListResult = {
  data: CandidateProfile[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
  source: "db" | "memory";
};

export function genderLabel(gender: CandidateGender) {
  return GENDERS.find((g) => g.id === gender)?.label ?? gender;
}

export function jobSeekingLabel(status: JobSeekingStatus) {
  return JOB_SEEKING_STATUSES.find((s) => s.id === status)?.label ?? status;
}

export function formatSalary(millions: number) {
  return `${millions} Triệu`;
}

export function formatExperienceYears(years: number) {
  if (years <= 1) return "Dưới 1 năm";
  if (years > 5) return "Hơn 5 năm";
  return `${years} năm`;
}

export function formatUpdatedAgo(iso: string) {
  const mins = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  return `${days} ngày trước`;
}

export function cvScoreTone(score: number) {
  if (score >= 85) return "emerald" as const;
  if (score >= 70) return "sky" as const;
  if (score >= 50) return "amber" as const;
  return "zinc" as const;
}

/** Shared factories for seed / bench scripts. */
export const CANDIDATE_SEED_HELPERS = {
  INDUSTRY_IDS,
  PROVINCE_SEED,
  WARD_SEED,
  shortProvince,
};
