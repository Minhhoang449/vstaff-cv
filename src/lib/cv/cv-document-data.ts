import { INDUSTRIES } from "@/data/industries";
import type { CandidateProfile } from "@/lib/candidates-shared";
import { formatExperienceYears } from "@/lib/candidates-shared";
import {
  cvTemplateLabel,
  resolveCvTemplateId,
  type CvTemplateTheme,
} from "@/lib/cv/cv-template-themes";

export type { CvTemplateTheme };
export { cvTemplateLabel, resolveCvTemplateId, getCvTemplateTheme } from "@/lib/cv/cv-template-themes";

export type CvExperienceBlock = {
  company: string;
  position: string;
  period: string;
  bullets: string[];
};

export type CvEducationBlock = {
  school: string;
  degree: string;
  period: string;
  detail?: string;
};

/** Dữ liệu chuẩn cho mọi mẫu CV Vstaff (preview + PDF). */
export type VstaffCvDocumentData = {
  fullName: string;
  title: string;
  desiredPosition: string;
  locationLine: string;
  phone: string;
  email: string;
  age: number;
  summary: string;
  careerObjective: string;
  education: string;
  educationDetails: CvEducationBlock[];
  experienceLabel: string;
  experiences: CvExperienceBlock[];
  workType: string;
  skills: string[];
  languages: string[];
  interests: string[];
  activities: string;
  industryId: string;
  industryName: string;
  cvScore?: number;
  cvScoreLabel?: string;
  /** Trùng industryId — 1 mẫu / ngành */
  templateId: string;
};

function industryNameOf(id: string) {
  return INDUSTRIES.find((i) => i.id === id)?.name ?? "Khác";
}

/** Sinh nội dung CV đủ dài (~2 trang) khi hồ sơ chỉ có field cơ bản (demo/memory). */
function enrichBlocks(candidate: CandidateProfile): {
  summary: string;
  careerObjective: string;
  educationDetails: CvEducationBlock[];
  experiences: CvExperienceBlock[];
  interests: string[];
  activities: string;
  skills: string[];
} {
  const role = candidate.desiredPosition || candidate.title;
  const years = Math.max(1, candidate.experienceYears || 1);
  const industry = industryNameOf(candidate.industryId);

  const skillExtra: Record<string, string[]> = {
    "it-software": ["Git", "CI/CD", "REST API", "Agile/Scrum", "Code review"],
    "it-data": ["SQL", "Python", "Power BI", "A/B testing", "ETL"],
    marketing: ["SEO", "Google Ads", "Content plan", "Brand", "Analytics"],
    sales: ["CRM", "Negotiation", "Pipeline", "Presentation", "Cold call"],
    finance: ["Excel", "Risk", "Credit", "Reporting", "KYC"],
    design: ["Figma", "UI kit", "Prototyping", "Design system", "User research"],
    hr: ["Recruitment", "Onboarding", "C&B", "Interview", "Training"],
  };

  const skills = [
    ...candidate.skills,
    ...(skillExtra[candidate.industryId] || ["Làm việc nhóm", "Giao tiếp", "Quản lý thời gian"]),
  ].filter((v, i, a) => a.indexOf(v) === i);

  const summary = [
    candidate.summary?.trim(),
    `${years}+ năm gắn với lĩnh vực ${industry}, tập trung vào vị trí ${role}.`,
    "Thành thạo phối hợp cross-team, theo dõi KPI và cải tiến quy trình làm việc thực tế.",
    "Ưu tiên môi trường minh bạch, đề cao chất lượng bàn giao và tinh thần chủ động.",
  ]
    .filter(Boolean)
    .join(" ");

  const careerObjective = [
    `Hướng tới vị trí ${role} tại doanh nghiệp đang mở rộng quy mô.`,
    "Muốn đóng góp vào tăng trưởng doanh số / sản phẩm, đồng thời phát triển chuyên môn sâu.",
    "Sẵn sàng nhận thử thách mới, làm việc hybrid hoặc toàn thời gian tùy nhu cầu đội ngũ.",
  ].join(" ");

  const educationDetails: CvEducationBlock[] = [
    {
      school: "Đại học Kinh tế TP. Hồ Chí Minh",
      degree: `${candidate.education || "Đại học"} — chuyên ngành liên quan ${industry}`,
      period: "2012 — 2016",
      detail: "Tốt nghiệp khá; tham gia CLB học thuật và hoạt động tình nguyện sinh viên.",
    },
    {
      school: "Chứng chỉ nghề nghiệp ngắn hạn",
      degree: `Khóa nâng cao kỹ năng ${role}`,
      period: "2018 — 2019",
      detail: "Hoàn thành bài tập thực chiến, thuyết trình và case study theo nhóm.",
    },
  ];

  const companyPool = [
    "Công ty CP Giải pháp Số Việt",
    "Tập đoàn Dịch vụ Khách hàng Á Châu",
    "Công ty TNHH Thương mại & Công nghệ Nam Việt",
    "Startup Growth Lab",
  ];

  const experiences: CvExperienceBlock[] = Array.from(
    { length: Math.min(4, Math.max(2, Math.ceil(years / 2))) },
    (_, idx) => {
      const start = 2024 - (idx + 1) * 2;
      const end = idx === 0 ? "Hiện tại" : String(start + 2);
      return {
        company: companyPool[idx % companyPool.length],
        position: idx === 0 ? role : `${role} (Junior / Mid)`,
        period: `${start} — ${end}`,
        bullets: [
          `Phụ trách các hạng mục chính liên quan ${role}, phối hợp 5–12 thành viên liên phòng ban.`,
          `Theo dõi KPI tuần/tháng, phân tích nguyên nhân lệch mục tiêu và đề xuất hành động cải thiện.`,
          `Xây dựng tài liệu quy trình, checklist bàn giao và hướng dẫn onboarding cho thành viên mới.`,
          `Tham gia họp với stakeholders, trình bày tiến độ và rủi ro; hỗ trợ ra quyết định dựa trên dữ liệu.`,
          `Đóng góp sáng kiến giúp rút ngắn thời gian xử lý công việc lặp lại khoảng 15–25%.`,
        ],
      };
    }
  );

  return {
    summary,
    careerObjective,
    educationDetails,
    experiences,
    interests: ["Đọc sách chuyên môn", "Chạy bộ", "Công nghệ mới", "Networking ngành"],
    activities:
      "Tình nguyện hỗ trợ ngày hội việc làm sinh viên; tham gia webinar chia sẻ kinh nghiệm nghề nghiệp định kỳ.",
    skills,
  };
}

export function toVstaffCvDocumentData(
  candidate: CandidateProfile
): VstaffCvDocumentData {
  const enriched = enrichBlocks(candidate);
  const locationParts = [candidate.wardName, candidate.location].filter(Boolean);
  const templateId = resolveCvTemplateId(candidate.industryId);

  return {
    fullName: candidate.fullName,
    title: candidate.title || candidate.desiredPosition,
    desiredPosition: candidate.desiredPosition || candidate.title,
    locationLine: locationParts.join(", ") || candidate.location || "Việt Nam",
    phone: candidate.phone || "",
    email: candidate.email || "",
    age: candidate.age,
    summary: enriched.summary,
    careerObjective: enriched.careerObjective,
    education: candidate.education || "Đại học",
    educationDetails: enriched.educationDetails,
    experienceLabel: formatExperienceYears(candidate.experienceYears),
    experiences: enriched.experiences,
    workType: candidate.workType || "Toàn thời gian",
    skills: enriched.skills,
    languages: candidate.languages?.length ? candidate.languages : ["Tiếng Việt"],
    interests: enriched.interests,
    activities: enriched.activities,
    industryId: candidate.industryId,
    industryName: industryNameOf(candidate.industryId),
    cvScore: candidate.cvScore,
    cvScoreLabel: candidate.cvScoreLabel,
    templateId,
  };
}

export function cvPdfFilename(fullName: string) {
  const base = fullName
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/gi, "d")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40);
  return `CV-${base || "ung-vien"}-Vstaff.pdf`;
}
