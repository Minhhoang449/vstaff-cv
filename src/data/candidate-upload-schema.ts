/** Schema JSON dùng để admin tải ứng viên hàng loạt. */

import { evaluateCvCompleteness } from "@/lib/cv/cv-completeness";

export type CvEducationDetail = {
  school?: string;
  faculty?: string;
  major?: string;
  degree?: string;
  classification?: string;
  period?: string;
};

export type CvExperienceDetail = {
  company?: string;
  position?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
};

export type CandidateUploadItem = {
  fullName: string;
  title: string;
  desiredPosition: string;
  location: string;
  provinceCode: string;
  wardCode?: string;
  wardName?: string;
  industryId: string;
  gender?: "male" | "female" | "other";
  languages?: string[];
  education?: string;
  experienceYears?: number;
  skills?: string[];
  summary?: string;
  age?: number;
  salaryExpect?: number;
  workType?: string;
  jobSeekingStatus?: "active" | "open" | "passive";
  phone?: string;
  email?: string;
  isPublic?: boolean;
  slug?: string;
  /** Chi tiết bổ sung từ CV */
  dateOfBirth?: string;
  address?: string;
  careerObjective?: string;
  itSkills?: string[];
  interests?: string[];
  activities?: string;
  educationDetails?: CvEducationDetail[];
  experiences?: CvExperienceDetail[];
  /** Toàn bộ nội dung/ghi chú còn lại từ CV */
  extraNotes?: string;
  /** Điểm độ đầy đủ hồ sơ (0–100) do hệ thống đánh giá */
  cvScore?: number;
  cvGrade?: "A" | "B" | "C" | "D";
  cvScoreLabel?: string;
};

export type CandidateUploadPayload = {
  candidates: CandidateUploadItem[];
};

export const CANDIDATE_UPLOAD_EXAMPLE: CandidateUploadPayload = {
  candidates: [
    {
      fullName: "Nguyễn Văn An",
      title: "Frontend Developer",
      desiredPosition: "Frontend Developer",
      location: "TP. Hồ Chí Minh",
      provinceCode: "79",
      wardCode: "79001",
      wardName: "Phường Bến Nghé",
      industryId: "it-software",
      gender: "male",
      languages: ["Tiếng Việt", "English"],
      education: "Đại học",
      experienceYears: 3,
      skills: ["React", "TypeScript", "Next.js"],
      summary: "Lập trình viên frontend 3 năm kinh nghiệm với React/Next.js.",
      age: 27,
      salaryExpect: 25,
      workType: "Toàn thời gian",
      jobSeekingStatus: "open",
      phone: "0901234567",
      email: "nguyenvanan@example.com",
      isPublic: true,
      experiences: [
        {
          company: "ABC Tech",
          position: "Frontend Developer",
          startDate: "01/2022",
          endDate: "Hiện tại",
          description: "Phát triển ứng dụng React/Next.js",
        },
      ],
    },
  ],
};

const REQUIRED_FIELDS: (keyof CandidateUploadItem)[] = [
  "fullName",
  "title",
  "desiredPosition",
  "location",
  "provinceCode",
  "industryId",
];

export type CandidateUploadValidation = {
  ok: boolean;
  count: number;
  errors: string[];
  items: CandidateUploadItem[];
};

function asStringArray(val: unknown): string[] | undefined {
  if (val == null) return undefined;
  if (!Array.isArray(val)) return undefined;
  return val.map(String).filter(Boolean);
}

function asEducationDetails(val: unknown): CvEducationDetail[] | undefined {
  if (!Array.isArray(val)) return undefined;
  return val
    .filter((x) => x && typeof x === "object")
    .map((x) => {
      const o = x as Record<string, unknown>;
      return {
        school: o.school != null ? String(o.school) : undefined,
        faculty: o.faculty != null ? String(o.faculty) : undefined,
        major: o.major != null ? String(o.major) : undefined,
        degree: o.degree != null ? String(o.degree) : undefined,
        classification: o.classification != null ? String(o.classification) : undefined,
        period: o.period != null ? String(o.period) : undefined,
      };
    });
}

function asExperiences(val: unknown): CvExperienceDetail[] | undefined {
  if (!Array.isArray(val)) return undefined;
  return val
    .filter((x) => x && typeof x === "object")
    .map((x) => {
      const o = x as Record<string, unknown>;
      return {
        company: o.company != null ? String(o.company) : undefined,
        position: o.position != null ? String(o.position) : undefined,
        startDate: o.startDate != null ? String(o.startDate) : undefined,
        endDate: o.endDate != null ? String(o.endDate) : undefined,
        description: o.description != null ? String(o.description) : undefined,
      };
    });
}

function sanitizeExtraNotes(raw?: string | null): string | undefined {
  if (!raw?.trim()) return undefined;
  const lines = raw
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean)
    .filter((line) => {
      const n = line
        .normalize("NFD")
        .replace(/\p{M}/gu, "")
        .toLowerCase()
        .replace(/[^a-z0-9.]/g, "");
      if (!n) return false;
      if (/timviec365(\.vn)?/.test(n)) return false;
      if (/vietnamworks(\.com)?/.test(n)) return false;
      if (/topcv(\.vn)?/.test(n)) return false;
      if (/vieclam24h/.test(n)) return false;
      if (/careerbuilder/.test(n)) return false;
      return true;
    });
  const text = lines.join("\n").trim();
  return text || undefined;
}

export function parseCandidateUploadJson(raw: string): CandidateUploadValidation {
  const errors: string[] = [];
  let parsed: unknown;

  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, count: 0, errors: ["JSON không hợp lệ — kiểm tra cú pháp."], items: [] };
  }

  let list: unknown[] = [];
  if (Array.isArray(parsed)) {
    list = parsed;
  } else if (
    parsed &&
    typeof parsed === "object" &&
    Array.isArray((parsed as CandidateUploadPayload).candidates)
  ) {
    list = (parsed as CandidateUploadPayload).candidates;
  } else {
    return {
      ok: false,
      count: 0,
      errors: ['Root phải là mảng [...] hoặc object { "candidates": [...] }.'],
      items: [],
    };
  }

  if (list.length === 0) {
    return { ok: false, count: 0, errors: ["Danh sách ứng viên trống."], items: [] };
  }

  const items: CandidateUploadItem[] = [];
  list.forEach((row, index) => {
    const n = index + 1;
    if (!row || typeof row !== "object") {
      errors.push(`Dòng ${n}: không phải object.`);
      return;
    }
    const item = row as Record<string, unknown>;
    let rowOk = true;
    for (const field of REQUIRED_FIELDS) {
      const val = item[field];
      if (typeof val !== "string" || !val.trim()) {
        errors.push(`Dòng ${n}: thiếu hoặc sai trường bắt buộc "${field}".`);
        rowOk = false;
      }
    }
    if (item.gender != null && !["male", "female", "other"].includes(String(item.gender))) {
      errors.push(`Dòng ${n}: gender phải là male | female | other.`);
      rowOk = false;
    }
    if (
      item.jobSeekingStatus != null &&
      !["active", "open", "passive"].includes(String(item.jobSeekingStatus))
    ) {
      errors.push(`Dòng ${n}: jobSeekingStatus phải là active | open | passive.`);
      rowOk = false;
    }
    if (item.skills != null && !Array.isArray(item.skills)) {
      errors.push(`Dòng ${n}: skills phải là mảng string[].`);
      rowOk = false;
    }
    if (item.languages != null && !Array.isArray(item.languages)) {
      errors.push(`Dòng ${n}: languages phải là mảng string[].`);
      rowOk = false;
    }

    if (!rowOk) return;

    const base: CandidateUploadItem = {
      fullName: String(item.fullName ?? "").trim(),
      title: String(item.title ?? "").trim(),
      desiredPosition: String(item.desiredPosition ?? "").trim(),
      location: String(item.location ?? "").trim(),
      provinceCode: String(item.provinceCode ?? "").trim(),
      wardCode: item.wardCode != null ? String(item.wardCode) : undefined,
      wardName: item.wardName != null ? String(item.wardName) : undefined,
      industryId: String(item.industryId ?? "").trim(),
      gender: (item.gender as CandidateUploadItem["gender"]) ?? "other",
      languages: Array.isArray(item.languages) ? item.languages.map(String) : ["Tiếng Việt"],
      education: item.education != null ? String(item.education) : "Đại học",
      experienceYears: Number(item.experienceYears ?? 0) || 0,
      skills: Array.isArray(item.skills) ? item.skills.map(String) : [],
      summary: item.summary != null ? String(item.summary) : "",
      age: Number(item.age ?? 25) || 25,
      salaryExpect: Number(item.salaryExpect ?? 10) || 10,
      workType: item.workType != null ? String(item.workType) : "Toàn thời gian",
      jobSeekingStatus:
        (item.jobSeekingStatus as CandidateUploadItem["jobSeekingStatus"]) ?? "open",
      phone: item.phone != null ? String(item.phone) : "",
      email: item.email != null ? String(item.email) : "",
      isPublic: item.isPublic !== false,
      slug: item.slug != null ? String(item.slug) : undefined,
      dateOfBirth: item.dateOfBirth != null ? String(item.dateOfBirth) : undefined,
      address: item.address != null ? String(item.address) : undefined,
      careerObjective: item.careerObjective != null ? String(item.careerObjective) : undefined,
      itSkills: asStringArray(item.itSkills),
      interests: asStringArray(item.interests),
      activities: item.activities != null ? String(item.activities) : undefined,
      educationDetails: asEducationDetails(item.educationDetails),
      experiences: asExperiences(item.experiences),
      extraNotes: sanitizeExtraNotes(
        item.extraNotes != null ? String(item.extraNotes) : undefined
      ),
    };

    const completeness = evaluateCvCompleteness(base);
    items.push({
      ...base,
      cvScore: completeness.cvScore,
      cvGrade: completeness.cvGrade,
      cvScoreLabel: completeness.cvScoreLabel,
    });
  });

  return {
    ok: errors.length === 0 && items.length > 0,
    count: items.length,
    errors,
    items,
  };
}
