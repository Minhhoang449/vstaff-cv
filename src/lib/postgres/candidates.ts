import "server-only";

import { randomBytes } from "node:crypto";
import { evaluateCvCompleteness } from "@/lib/cv/cv-completeness";
import { getPrisma, isDatabaseReady } from "@/lib/db";
import {
  MAX_LIST_PAGE,
  PAGE_SIZE,
  type CandidateGender,
  type CandidateListParams,
  type CandidateListResult,
  type CandidateProfile,
  type JobSeekingStatus,
} from "@/lib/candidates-shared";
import type { CandidateProfile as DbCandidate, Prisma } from "@/generated/prisma";

function newId(prefix: string) {
  return `${prefix}_${randomBytes(8).toString("hex")}`;
}

function toProfile(row: DbCandidate, isViewed: boolean): CandidateProfile {
  const completeness = evaluateCvCompleteness({
    fullName: row.fullName,
    title: row.title,
    desiredPosition: row.desiredPosition,
    location: row.location,
    provinceCode: row.provinceCode,
    wardCode: row.wardCode,
    wardName: row.wardName,
    industryId: row.industryId,
    gender: row.gender,
    languages: row.languages,
    education: row.education,
    experienceYears: row.experienceYears,
    skills: row.skills,
    summary: row.summary,
    age: row.age,
    workType: row.workType,
    phone: row.phone,
    email: row.email,
  });

  return {
    id: row.id,
    slug: row.slug,
    fullName: row.fullName,
    title: row.title,
    desiredPosition: row.desiredPosition,
    location: row.location,
    provinceCode: row.provinceCode,
    wardCode: row.wardCode,
    wardName: row.wardName,
    industryId: row.industryId,
    gender: row.gender,
    languages: row.languages,
    education: row.education,
    experienceYears: row.experienceYears,
    skills: row.skills,
    summary: row.summary,
    age: row.age,
    salaryExpect: row.salaryExpect,
    workType: row.workType,
    jobSeekingStatus: row.jobSeekingStatus,
    interestCount: row.interestCount,
    phone: row.phone,
    email: row.email,
    isViewed,
    isPublic: row.isPublic,
    updatedAt: row.updatedAt.toISOString(),
    cvScore: completeness.cvScore,
    cvGrade: completeness.cvGrade,
    cvScoreLabel: completeness.cvScoreLabel,
  };
}

function buildWhere(params: CandidateListParams): Prisma.CandidateProfileWhereInput {
  const where: Prisma.CandidateProfileWhereInput = { isPublic: true };
  const province = params.province?.trim();
  const industry = params.industry?.trim();
  const status = params.status?.trim();
  const ward = params.ward?.trim();
  const gender = params.gender?.trim();
  const language = params.language?.trim();
  const education = params.education?.trim();
  const workType = params.workType?.trim();
  const position = params.position?.trim();
  const q = params.q?.trim();

  if (province) where.provinceCode = province;
  if (industry) where.industryId = industry;
  if (status === "active" || status === "open" || status === "passive") {
    where.jobSeekingStatus = status;
  }
  if (ward) where.wardCode = ward;
  if (gender === "male" || gender === "female" || gender === "other") {
    where.gender = gender;
  }
  if (language) where.languages = { has: language };
  if (education) where.education = education;
  if (workType) where.workType = workType;
  if (position) where.desiredPosition = { equals: position, mode: "insensitive" };

  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { title: { contains: q, mode: "insensitive" } },
      { desiredPosition: { contains: q, mode: "insensitive" } },
      { summary: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
      { email: { contains: q, mode: "insensitive" } },
      { skills: { has: q } },
    ];
  }

  const employerId = params.employerId?.trim();
  if (employerId && params.unviewedOnly) {
    where.views = { none: { employerId } };
  }
  if (employerId && params.viewedOnly) {
    where.views = { some: { employerId } };
  }

  return where;
}

function buildOrderBy(
  sort: string
): Prisma.CandidateProfileOrderByWithRelationInput[] {
  if (sort === "relevant") return [{ interestCount: "desc" }, { updatedAt: "desc" }];
  if (sort === "active") {
    return [{ jobSeekingStatus: "asc" }, { updatedAt: "desc" }];
  }
  if (sort === "cvScore") return [{ updatedAt: "desc" }];
  return [{ updatedAt: "desc" }];
}

export async function listCandidatesPg(
  params: CandidateListParams = {}
): Promise<CandidateListResult> {
  const prisma = getPrisma();
  if (!prisma) throw new Error("DATABASE_UNAVAILABLE");

  const requestedPage = Math.max(1, params.page ?? 1);
  const page = Math.min(MAX_LIST_PAGE, requestedPage);
  const sort = params.sort?.trim() || "updated";
  const employerId = params.employerId?.trim() || "";
  const where = buildWhere(params);

  // Experience band filtered in SQL via raw bounds when possible
  const experience = params.experience?.trim();
  if (experience === "0-1") {
    where.experienceYears = { lt: 1 };
  } else if (experience === "1-3") {
    where.experienceYears = { gte: 1, lt: 3 };
  } else if (experience === "3-5") {
    where.experienceYears = { gte: 3, lte: 5 };
  } else if (experience === "5+") {
    where.experienceYears = { gt: 5 };
  }

  const take =
    params.limit != null && params.limit > 0
      ? Math.min(500, Math.max(1, Math.floor(params.limit)))
      : PAGE_SIZE;
  const skip = params.limit != null && params.limit > 0 ? 0 : (page - 1) * PAGE_SIZE;

  const [total, rows] = await Promise.all([
    prisma.candidateProfile.count({ where }),
    prisma.candidateProfile.findMany({
      where,
      orderBy: buildOrderBy(sort),
      skip,
      take,
    }),
  ]);

  let viewed = new Set<string>();
  if (employerId && rows.length) {
    const views = await prisma.employerCandidateView.findMany({
      where: {
        employerId,
        candidateId: { in: rows.map((r) => r.id) },
      },
      select: { candidateId: true },
    });
    viewed = new Set(views.map((v) => v.candidateId));
  }

  let data = rows.map((r) => toProfile(r, viewed.has(r.id)));
  if (sort === "cvScore") {
    data = [...data].sort((a, b) => b.cvScore - a.cvScore || b.updatedAt.localeCompare(a.updatedAt));
  }

  const totalPages = Math.max(1, Math.ceil(total / (params.limit ? take : PAGE_SIZE)));
  return {
    data,
    total,
    page: params.limit ? 1 : Math.min(page, totalPages),
    totalPages: params.limit ? 1 : totalPages,
    pageSize: params.limit ? take : PAGE_SIZE,
    source: "db",
  };
}

export async function getCandidateBySlugPg(
  slug: string,
  options?: { employerId?: string }
): Promise<CandidateProfile | null> {
  const prisma = getPrisma();
  if (!prisma) throw new Error("DATABASE_UNAVAILABLE");
  const key = slug.trim();
  if (!key) return null;

  const row =
    (await prisma.candidateProfile.findUnique({ where: { slug: key } })) ||
    (await prisma.candidateProfile.findUnique({ where: { id: key } }));
  if (!row || !row.isPublic) return null;

  let isViewed = false;
  const employerId = options?.employerId?.trim();
  if (employerId) {
    const view = await prisma.employerCandidateView.findUnique({
      where: {
        employerId_candidateId: { employerId, candidateId: row.id },
      },
    });
    isViewed = Boolean(view);
  }
  return toProfile(row, isViewed);
}

export async function getCandidateByIdPg(id: string): Promise<CandidateProfile | null> {
  const prisma = getPrisma();
  if (!prisma) throw new Error("DATABASE_UNAVAILABLE");
  const row = await prisma.candidateProfile.findUnique({ where: { id } });
  if (!row) return null;
  return toProfile(row, false);
}

export async function getAllPublicSlugsPg(limit = 5000): Promise<string[]> {
  const prisma = getPrisma();
  if (!prisma) throw new Error("DATABASE_UNAVAILABLE");
  const rows = await prisma.candidateProfile.findMany({
    where: { isPublic: true },
    orderBy: { updatedAt: "desc" },
    take: Math.min(limit, 5000),
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

export async function listMatchedCandidatesPg(
  skills: string[],
  limit = 5
): Promise<CandidateProfile[]> {
  const prisma = getPrisma();
  if (!prisma) throw new Error("DATABASE_UNAVAILABLE");
  if (!skills.length) return [];
  const rows = await prisma.candidateProfile.findMany({
    where: {
      isPublic: true,
      skills: { hasSome: skills },
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
  return rows.map((r) => toProfile(r, false));
}

export async function markCandidateViewedPg(
  employerId: string,
  candidateId: string
): Promise<void> {
  const prisma = getPrisma();
  if (!prisma || !employerId || !candidateId) return;
  await prisma.employerCandidateView.upsert({
    where: {
      employerId_candidateId: { employerId, candidateId },
    },
    create: {
      id: newId("view"),
      employerId,
      candidateId,
      viewedAt: new Date(),
    },
    update: { viewedAt: new Date() },
  });
}

export async function createCandidatesPg(
  profiles: CandidateProfile[],
  options?: { originalFileUrls?: Record<string, string> }
): Promise<number> {
  const prisma = getPrisma();
  if (!prisma) throw new Error("DATABASE_UNAVAILABLE");
  let created = 0;
  for (const p of profiles) {
    await prisma.candidateProfile.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        slug: p.slug,
        fullName: p.fullName,
        title: p.title,
        desiredPosition: p.desiredPosition,
        location: p.location,
        provinceCode: p.provinceCode,
        wardCode: p.wardCode,
        wardName: p.wardName,
        industryId: p.industryId,
        gender: p.gender as CandidateGender,
        languages: p.languages,
        education: p.education,
        experienceYears: p.experienceYears,
        skills: p.skills,
        summary: p.summary,
        age: p.age,
        salaryExpect: p.salaryExpect,
        workType: p.workType,
        jobSeekingStatus: p.jobSeekingStatus as JobSeekingStatus,
        interestCount: p.interestCount,
        phone: p.phone,
        email: p.email,
        isPublic: p.isPublic !== false,
        originalFileUrl: options?.originalFileUrls?.[p.id] ?? null,
        updatedAt: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      },
      update: {
        slug: p.slug,
        fullName: p.fullName,
        title: p.title,
        desiredPosition: p.desiredPosition,
        location: p.location,
        provinceCode: p.provinceCode,
        wardCode: p.wardCode,
        wardName: p.wardName,
        industryId: p.industryId,
        gender: p.gender as CandidateGender,
        languages: p.languages,
        education: p.education,
        experienceYears: p.experienceYears,
        skills: p.skills,
        summary: p.summary,
        age: p.age,
        salaryExpect: p.salaryExpect,
        workType: p.workType,
        jobSeekingStatus: p.jobSeekingStatus as JobSeekingStatus,
        interestCount: p.interestCount,
        phone: p.phone,
        email: p.email,
        isPublic: p.isPublic !== false,
        originalFileUrl: options?.originalFileUrls?.[p.id] ?? undefined,
        updatedAt: new Date(),
      },
    });
    created += 1;
  }
  return created;
}

export async function deleteCandidatePg(candidateId: string): Promise<boolean> {
  const prisma = getPrisma();
  if (!prisma || !candidateId) return false;
  try {
    await prisma.candidateProfile.delete({ where: { id: candidateId } });
    return true;
  } catch {
    return false;
  }
}

export async function isPostgresCandidatesReady(): Promise<boolean> {
  return isDatabaseReady();
}
