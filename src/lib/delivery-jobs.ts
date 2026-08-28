import "server-only";

import { randomBytes } from "node:crypto";
import type { CandidateProfile } from "@/lib/candidates-shared";
import type {
  CandidateDeliveryJob,
  DeliveryJobStatus,
  DeliverySlot,
} from "@/lib/delivery-job-types";
import {
  DELIVERY_DAILY_CV_LIMIT,
  DELIVERY_NEW_CV_DAYS,
} from "@/lib/delivery-job-types";
import { getCandidateById, listCandidates } from "@/lib/candidates";
import { getPrisma, isDatabaseReady } from "@/lib/db";
import { getEmployerSubscriptionState } from "@/lib/employer-unlocks";
import {
  buildDeliveryMatchContext,
  rankDeliveryCandidates,
} from "@/lib/delivery-position-match";
import { startOfTodayVietnamIso } from "@/lib/vietnam-time";

export type {
  CandidateDeliveryJob,
  DeliveryJobStatus,
  DeliverySlot,
} from "@/lib/delivery-job-types";
export {
  DELIVERY_DAILY_CV_LIMIT,
  DELIVERY_NEW_CV_DAYS,
  deliverySlotLabel,
} from "@/lib/delivery-job-types";
export { startOfTodayVietnamIso } from "@/lib/vietnam-time";

export type CreateDeliveryJobInput = {
  employerId: string;
  position: string;
  industryId?: string;
  provinceCode: string;
  wardCode?: string;
  gender?: string;
  language?: string;
  ageRange?: string;
  delivery: DeliverySlot;
  notes?: string;
};

function isNewCv(updatedAt: string, nowMs: number) {
  const t = new Date(updatedAt).getTime();
  if (!Number.isFinite(t)) return false;
  return nowMs - t <= DELIVERY_NEW_CV_DAYS * 24 * 60 * 60 * 1000;
}

function matchAgeRange(age: number, ageRange: string) {
  const r = ageRange.trim();
  if (!r) return true;
  if (r === "50+") return age > 50;
  const m = r.match(/^(\d+)\s*-\s*(\d+)$/);
  if (!m) return true;
  const lo = Number(m[1]);
  const hi = Number(m[2]);
  return age >= lo && age <= hi;
}

/** Ưu tiên khớp vị trí/kinh nghiệm → ngành liên quan; trong cùng tier ưu tiên CV mới. */
export function pickDeliveryCandidates(
  pool: CandidateProfile[],
  limit: number,
  excludeIds: Set<string>,
  opts?: {
    position?: string;
    industryId?: string;
    nowMs?: number;
  }
): string[] {
  if (limit <= 0) return [];
  const nowMs = opts?.nowMs ?? Date.now();
  const ctx = buildDeliveryMatchContext(opts?.position || "", opts?.industryId);
  const ranked = rankDeliveryCandidates(
    pool.filter((c) => !excludeIds.has(c.id)),
    ctx
  );

  ranked.sort((a, b) => {
    if (a.tier !== b.tier) return a.tier - b.tier;
    const aNew = isNewCv(a.candidate.updatedAt, nowMs) ? 1 : 0;
    const bNew = isNewCv(b.candidate.updatedAt, nowMs) ? 1 : 0;
    if (bNew !== aNew) return bNew - aNew;
    if (b.score !== a.score) return b.score - a.score;
    return b.candidate.updatedAt.localeCompare(a.candidate.updatedAt);
  });

  return ranked.slice(0, limit).map((r) => r.candidate.id);
}

export async function getEmployerDailyDeliveryUsage(employerId: string): Promise<{
  used: number;
  remaining: number;
  limit: number;
  deliveredIds: Set<string>;
}> {
  const jobs = await listDeliveryJobsForEmployer(employerId);
  const dayStart = startOfTodayVietnamIso();
  const deliveredIds = new Set<string>();
  let used = 0;
  for (const job of jobs) {
    const runAt = job.lastRunAt || job.createdAt;
    if (!runAt || runAt < dayStart) continue;
    for (const id of job.matchedCandidateIds) {
      deliveredIds.add(id);
    }
    used += job.matchedCandidateIds.length;
  }
  const remaining = Math.max(0, DELIVERY_DAILY_CV_LIMIT - used);
  return { used, remaining, limit: DELIVERY_DAILY_CV_LIMIT, deliveredIds };
}

async function runMatchForJob(
  input: CreateDeliveryJobInput,
  limit: number,
  excludeIds: Set<string>
): Promise<string[]> {
  if (limit <= 0) return [];

  // Không lọc cứng theo đúng chữ vị trí / đúng 1 ngành — lấy pool theo địa điểm & tiêu chí cứng,
  // rồi chấm điểm mềm (vị trí → kinh nghiệm → ngành liên quan).
  const result = await listCandidates({
    page: 1,
    province: input.provinceCode || undefined,
    ward: input.wardCode || undefined,
    gender: input.gender || undefined,
    language: input.language || undefined,
    sort: "updated",
    employerId: input.employerId,
    limit: 500,
  });

  let pool = result.data;
  if (input.ageRange?.trim()) {
    pool = pool.filter((c) => matchAgeRange(c.age, input.ageRange!));
  }

  return pickDeliveryCandidates(pool, limit, excludeIds, {
    position: input.position,
    industryId: input.industryId,
  });
}

export async function createDeliveryJob(
  input: CreateDeliveryJobInput
): Promise<CandidateDeliveryJob> {
  const position = input.position.trim();
  if (!position || !input.provinceCode || !input.delivery) {
    throw new Error("INVALID");
  }

  const [sub, daily] = await Promise.all([
    getEmployerSubscriptionState(input.employerId),
    getEmployerDailyDeliveryUsage(input.employerId),
  ]);

  if (daily.remaining <= 0) {
    throw new Error("DAILY_LIMIT");
  }

  if (!sub) {
    throw new Error("QUOTA");
  }

  // Trần cứng 50/ngày; vẫn tôn trọng hạn mức gói còn lại (nếu có).
  let cap = daily.remaining;
  if (sub.cvLimit != null) {
    const planLeft = Math.max(0, sub.cvLimit - sub.cvUsed);
    cap = Math.min(cap, planLeft);
  }
  if (cap <= 0) {
    throw new Error("QUOTA");
  }

  const matchedCandidateIds = await runMatchForJob(input, cap, daily.deliveredIds);
  const now = new Date().toISOString();
  const id = `job_${randomBytes(8).toString("hex")}`;

  const job: CandidateDeliveryJob = {
    id,
    employerId: input.employerId,
    position,
    industryId: input.industryId?.trim() || "",
    provinceCode: input.provinceCode,
    wardCode: input.wardCode?.trim() || "",
    gender: input.gender?.trim() || "",
    language: input.language?.trim() || "",
    ageRange: input.ageRange?.trim() || "",
    delivery: input.delivery,
    notes: input.notes?.trim() || "",
    status: "active",
    matchedCandidateIds,
    matchedCount: matchedCandidateIds.length,
    createdAt: now,
    updatedAt: now,
    lastRunAt: now,
  };

  if (!(await isDatabaseReady())) throw new Error("DATABASE_UNAVAILABLE");
  const prisma = getPrisma();
  if (!prisma) throw new Error("DATABASE_UNAVAILABLE");

  await prisma.deliveryJob.create({
    data: {
      id: job.id,
      employerId: job.employerId,
      position: job.position,
      industryId: job.industryId,
      provinceCode: job.provinceCode,
      wardCode: job.wardCode,
      gender: job.gender,
      language: job.language,
      ageRange: job.ageRange,
      delivery: job.delivery,
      notes: job.notes,
      status: job.status,
      matchedCandidateIds: job.matchedCandidateIds,
      matchedCount: job.matchedCount,
      createdAt: new Date(job.createdAt),
      updatedAt: new Date(job.updatedAt),
      lastRunAt: job.lastRunAt ? new Date(job.lastRunAt) : null,
    },
  });
  return job;
}

function rowToJob(row: {
  id: string;
  employerId: string;
  position: string;
  industryId: string;
  provinceCode: string;
  wardCode: string;
  gender: string;
  language: string;
  ageRange: string;
  delivery: string;
  notes: string;
  status: string;
  matchedCandidateIds: string[];
  matchedCount: number;
  createdAt: Date;
  updatedAt: Date;
  lastRunAt: Date | null;
}): CandidateDeliveryJob {
  return {
    id: row.id,
    employerId: row.employerId,
    position: row.position,
    industryId: row.industryId,
    provinceCode: row.provinceCode,
    wardCode: row.wardCode,
    gender: row.gender,
    language: row.language,
    ageRange: row.ageRange,
    delivery: row.delivery as DeliverySlot,
    notes: row.notes,
    status: row.status as DeliveryJobStatus,
    matchedCandidateIds: row.matchedCandidateIds,
    matchedCount: row.matchedCount,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    lastRunAt: row.lastRunAt?.toISOString() ?? null,
  };
}

export async function listDeliveryJobsForEmployer(
  employerId: string
): Promise<CandidateDeliveryJob[]> {
  if (!employerId) return [];
  try {
    if (!(await isDatabaseReady())) return [];
    const prisma = getPrisma();
    if (!prisma) return [];
    const rows = await prisma.deliveryJob.findMany({
      where: { employerId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return rows.map(rowToJob);
  } catch (err) {
    console.warn("[delivery-jobs] list failed", err);
    return [];
  }
}

export async function getDeliveryJob(
  employerId: string,
  jobId: string
): Promise<CandidateDeliveryJob | null> {
  try {
    if (!(await isDatabaseReady())) return null;
    const prisma = getPrisma();
    if (!prisma) return null;
    const row = await prisma.deliveryJob.findUnique({ where: { id: jobId } });
    if (!row || row.employerId !== employerId) return null;
    return rowToJob(row);
  } catch (err) {
    console.warn("[delivery-jobs] get failed", err);
    return null;
  }
}

export async function deleteDeliveryJob(employerId: string, jobId: string): Promise<void> {
  const job = await getDeliveryJob(employerId, jobId);
  if (!job) throw new Error("NOT_FOUND");
  const prisma = getPrisma();
  if (!prisma) throw new Error("DATABASE_UNAVAILABLE");
  await prisma.deliveryJob.delete({ where: { id: jobId } });
}

export async function setDeliveryJobStatus(
  employerId: string,
  jobId: string,
  status: DeliveryJobStatus
): Promise<CandidateDeliveryJob> {
  const job = await getDeliveryJob(employerId, jobId);
  if (!job) throw new Error("NOT_FOUND");
  const prisma = getPrisma();
  if (!prisma) throw new Error("DATABASE_UNAVAILABLE");
  const next = { ...job, status, updatedAt: new Date().toISOString() };
  await prisma.deliveryJob.update({
    where: { id: jobId },
    data: { status, updatedAt: new Date(next.updatedAt) },
  });
  return next;
}

export async function getMatchedCandidatesForJob(
  job: CandidateDeliveryJob
): Promise<CandidateProfile[]> {
  const out: CandidateProfile[] = [];
  for (const id of job.matchedCandidateIds.slice(0, DELIVERY_DAILY_CV_LIMIT)) {
    const c = await getCandidateById(id);
    if (c) out.push(c);
  }
  return out;
}
