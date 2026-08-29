import type { CvEducationDetail, CvExperienceDetail } from "@/data/candidate-upload-schema";
import { INDUSTRIES } from "@/data/industries";
import type { CandidateProfile } from "@/lib/candidates-shared";
import { formatExperienceYears } from "@/lib/candidates-shared";
import {
  cvTemplateLabel,
  resolveCvTemplateId,
  type CvTemplateTheme,
} from "@/lib/cv/cv-template-themes";
import { formatCvBirthDate, formatCvLocationLine } from "@/lib/cv/format-cv-location";

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
  /** Ngày sinh hiển thị trên CV Vstaff, vd. "08/11/1994" */
  dateOfBirth: string;
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

function isPlaceholder(value?: string | null): boolean {
  if (!value?.trim()) return true;
  const v = value.trim().toLowerCase();
  return v === "n/a" || v === "na" || v === "—" || v === "-";
}

function formatPeriod(start?: string, end?: string): string {
  const parts = [start, end].filter((p) => p && !isPlaceholder(p));
  return parts.join(" — ");
}

function descriptionToBullets(description?: string): string[] {
  if (!description?.trim()) return [];
  return description
    .split(/\r?\n|(?:\.\s+)/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function mapEducationDetails(
  details: CvEducationDetail[] | undefined,
  fallbackEducation: string
): CvEducationBlock[] {
  if (!details?.length) {
    if (fallbackEducation?.trim() && !isPlaceholder(fallbackEducation)) {
      return [{ school: "", degree: fallbackEducation.trim(), period: "" }];
    }
    return [];
  }

  return details
    .map((d) => {
      const school = d.school?.trim() || "";
      const degreeParts = [d.degree, d.major, d.faculty].filter(
        (p) => p && !isPlaceholder(p)
      );
      const degree = degreeParts.join(" — ") || fallbackEducation.trim();
      const period = d.period && !isPlaceholder(d.period) ? d.period.trim() : "";
      const detail =
        d.classification && !isPlaceholder(d.classification)
          ? d.classification.trim()
          : undefined;
      return { school, degree, period, detail };
    })
    .filter((e) => e.school || e.degree);
}

function mapExperiences(exps: CvExperienceDetail[] | undefined): CvExperienceBlock[] {
  if (!exps?.length) return [];
  return exps
    .map((e) => ({
      company: e.company?.trim() || "",
      position: e.position?.trim() || "",
      period: formatPeriod(e.startDate, e.endDate),
      bullets: descriptionToBullets(e.description),
    }))
    .filter((e) => e.company || e.position || e.bullets.length > 0);
}

function buildDocumentBlocks(candidate: CandidateProfile) {
  const cv = candidate.cvDetails;
  const skills = [...candidate.skills, ...(cv?.itSkills ?? [])].filter(
    (v, i, a) => a.indexOf(v) === i
  );

  const activities = [cv?.activities?.trim(), cv?.extraNotes?.trim()]
    .filter(Boolean)
    .join("\n");

  return {
    summary: candidate.summary?.trim() || "",
    careerObjective: cv?.careerObjective?.trim() || "",
    educationDetails: mapEducationDetails(cv?.educationDetails, candidate.education),
    experiences: mapExperiences(cv?.experiences),
    interests: cv?.interests ?? [],
    activities,
    skills,
  };
}

export function toVstaffCvDocumentData(
  candidate: CandidateProfile
): VstaffCvDocumentData {
  const blocks = buildDocumentBlocks(candidate);
  const locationLine = formatCvLocationLine({
    address: candidate.cvDetails?.address,
    wardName: candidate.wardName,
    location: candidate.location,
  });
  const templateId = resolveCvTemplateId(candidate.industryId);

  return {
    fullName: candidate.fullName,
    title: candidate.title || candidate.desiredPosition,
    desiredPosition: candidate.desiredPosition || candidate.title,
    locationLine,
    phone: candidate.phone || "",
    email: candidate.email || "",
    dateOfBirth: formatCvBirthDate(candidate.cvDetails?.dateOfBirth),
    summary: blocks.summary,
    careerObjective: blocks.careerObjective,
    education: candidate.education || "Đại học",
    educationDetails: blocks.educationDetails,
    experienceLabel: formatExperienceYears(candidate.experienceYears),
    experiences: blocks.experiences,
    workType: candidate.workType || "Toàn thời gian",
    skills: blocks.skills,
    languages: candidate.languages?.length ? candidate.languages : ["Tiếng Việt"],
    interests: blocks.interests,
    activities: blocks.activities,
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
