import "server-only";

import { randomBytes } from "node:crypto";
import type { CandidateProfile } from "@/lib/candidates-shared";
import { getCandidateById } from "@/lib/candidates";
import { getPrisma, isDatabaseReady } from "@/lib/db";

export type SavedCandidateDoc = {
  id: string;
  employerId: string;
  candidateId: string;
  candidateSlug: string;
  savedAt: string;
};

export type SavedCandidateRow = CandidateProfile & { savedAt: string };

function newId() {
  return `save_${randomBytes(8).toString("hex")}`;
}

async function requirePrisma() {
  if (!(await isDatabaseReady())) return null;
  return getPrisma();
}

export async function isCandidateSaved(
  employerId: string,
  candidateId: string
): Promise<boolean> {
  if (!employerId || !candidateId) return false;
  const prisma = await requirePrisma();
  if (!prisma) return false;
  const row = await prisma.savedCandidate.findUnique({
    where: { employerId_candidateId: { employerId, candidateId } },
  });
  return Boolean(row);
}

export async function listSavedCandidateIds(employerId: string): Promise<Set<string>> {
  if (!employerId) return new Set();
  const prisma = await requirePrisma();
  if (!prisma) return new Set();
  const rows = await prisma.savedCandidate.findMany({
    where: { employerId },
    select: { candidateId: true },
    take: 1000,
  });
  return new Set(rows.map((r) => r.candidateId));
}

export async function saveCandidateForEmployer(
  employerId: string,
  candidate: Pick<CandidateProfile, "id" | "slug">
): Promise<SavedCandidateDoc> {
  const savedAt = new Date().toISOString();
  const prisma = await requirePrisma();
  if (!prisma) throw new Error("DATABASE_UNAVAILABLE");

  await prisma.savedCandidate.upsert({
    where: { employerId_candidateId: { employerId, candidateId: candidate.id } },
    create: {
      id: newId(),
      employerId,
      candidateId: candidate.id,
      savedAt: new Date(savedAt),
    },
    update: { savedAt: new Date(savedAt) },
  });

  return {
    id: `${employerId}_${candidate.id}`,
    employerId,
    candidateId: candidate.id,
    candidateSlug: candidate.slug,
    savedAt,
  };
}

export async function unsaveCandidateForEmployer(
  employerId: string,
  candidateId: string
): Promise<void> {
  const prisma = await requirePrisma();
  if (!prisma) return;
  await prisma.savedCandidate
    .delete({
      where: { employerId_candidateId: { employerId, candidateId } },
    })
    .catch(() => undefined);
}

export async function listSavedCandidatesForEmployer(
  employerId: string,
  options?: {
    page?: number;
    pageSize?: number;
    q?: string;
    industry?: string;
    status?: string;
    province?: string;
    viewed?: "viewed" | "unviewed" | "";
  }
): Promise<{
  data: SavedCandidateRow[];
  total: number;
  page: number;
  totalPages: number;
  pageSize: number;
}> {
  const pageSize = Math.min(50, Math.max(1, options?.pageSize ?? 12));
  const page = Math.max(1, options?.page ?? 1);
  const empty = { data: [] as SavedCandidateRow[], total: 0, page: 1, totalPages: 1, pageSize };

  if (!employerId) return empty;
  const prisma = await requirePrisma();
  if (!prisma) return empty;

  const [saveRows, viewRows] = await Promise.all([
    prisma.savedCandidate.findMany({
      where: { employerId },
      orderBy: { savedAt: "desc" },
      take: 1000,
    }),
    prisma.employerCandidateView.findMany({
      where: { employerId },
      select: { candidateId: true },
    }),
  ]);

  const viewed = new Set(viewRows.map((v) => v.candidateId));
  const rows: SavedCandidateRow[] = [];
  for (const s of saveRows) {
    const c = await getCandidateById(s.candidateId);
    if (!c) continue;
    rows.push({ ...c, isViewed: viewed.has(s.candidateId), savedAt: s.savedAt.toISOString() });
  }

  let filtered = rows;
  const q = options?.q?.trim().toLowerCase();
  if (q) {
    filtered = filtered.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.desiredPosition.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q)
    );
  }
  if (options?.industry) filtered = filtered.filter((c) => c.industryId === options.industry);
  if (options?.status) filtered = filtered.filter((c) => c.jobSeekingStatus === options.status);
  if (options?.province) filtered = filtered.filter((c) => c.provinceCode === options.province);
  if (options?.viewed === "viewed") filtered = filtered.filter((c) => c.isViewed);
  else if (options?.viewed === "unviewed") filtered = filtered.filter((c) => !c.isViewed);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    data: filtered.slice(start, start + pageSize),
    total,
    page: safePage,
    totalPages,
    pageSize,
  };
}
