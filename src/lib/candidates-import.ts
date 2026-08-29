import "server-only";

import { randomBytes } from "node:crypto";
import type { CandidateUploadItem } from "@/data/candidate-upload-schema";
import { evaluateCvCompleteness } from "@/lib/cv/cv-completeness";
import { cvDetailsFromUpload } from "@/lib/cv/cv-details";
import {
  type CandidateGender,
  type CandidateProfile,
  type JobSeekingStatus,
} from "@/lib/candidates-shared";
import { createCandidates } from "@/lib/candidates";

function slugifyName(name: string) {
  const base = name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  const suffix = randomBytes(3).toString("hex");
  return `${base || "ung-vien"}-${suffix}`;
}

function toGender(g?: string): CandidateGender {
  if (g === "male" || g === "female" || g === "other") return g;
  return "other";
}

function toStatus(s?: string): JobSeekingStatus {
  if (s === "active" || s === "open" || s === "passive") return s;
  return "open";
}

function uploadToProfile(item: CandidateUploadItem): CandidateProfile {
  const cvDetails = cvDetailsFromUpload(item);
  const completeness = evaluateCvCompleteness(item);
  const now = new Date().toISOString();
  return {
    id: `imp-${randomBytes(6).toString("hex")}`,
    slug: item.slug?.trim() || slugifyName(item.fullName),
    fullName: item.fullName.trim(),
    title: item.title.trim(),
    desiredPosition: item.desiredPosition.trim(),
    location: item.location.trim(),
    provinceCode: item.provinceCode.trim() || "79",
    wardCode: item.wardCode?.trim() || "",
    wardName: item.wardName?.trim() || item.location.trim(),
    industryId: item.industryId.trim() || "other",
    gender: toGender(item.gender),
    languages: item.languages?.length ? item.languages.map(String) : ["Tiếng Việt"],
    education: item.education?.trim() || "Đại học",
    experienceYears: Math.max(0, Math.round(Number(item.experienceYears ?? 0) || 0)),
    skills: Array.isArray(item.skills) ? item.skills.map(String) : [],
    summary: item.summary?.trim() || item.careerObjective?.trim() || "",
    age: Number(item.age ?? 25) || 25,
    salaryExpect: Number(item.salaryExpect ?? 10) || 10,
    workType: item.workType?.trim() || "Toàn thời gian",
    jobSeekingStatus: toStatus(item.jobSeekingStatus),
    interestCount: 0,
    phone: item.phone?.trim() || "",
    email: item.email?.trim() || "",
    isViewed: false,
    isPublic: item.isPublic !== false,
    updatedAt: now,
    cvScore: item.cvScore ?? completeness.cvScore,
    cvGrade: item.cvGrade ?? completeness.cvGrade,
    cvScoreLabel: item.cvScoreLabel ?? completeness.cvScoreLabel,
    cvDetails,
  };
}

export type ImportCandidatesResult = {
  imported: number;
  source: "db";
  profiles: CandidateProfile[];
};

/** Ghi hồ sơ đã extract vào Postgres. */
export async function importCandidateUploads(
  items: CandidateUploadItem[],
  options?: { originalFileUrls?: Record<string, string> }
): Promise<ImportCandidatesResult> {
  const profiles = items.map(uploadToProfile);
  if (!profiles.length) {
    return { imported: 0, source: "db", profiles: [] };
  }

  const created = await createCandidates(profiles, {
    originalFileUrls: options?.originalFileUrls,
  });

  return {
    imported: created,
    source: "db",
    profiles,
  };
}
