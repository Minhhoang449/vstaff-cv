import "server-only";

import { randomBytes } from "node:crypto";
import {
  dailyCvCap,
  normalizeDailyCvUsage,
  type EmployerSubscription,
} from "@/data/employer-subscription";
import { EMPLOYER_PLANS } from "@/data/employer-plans";
import {
  MAX_LIST_PAGE,
  PAGE_SIZE,
  type CandidateListParams,
  type CandidateListResult,
  type CandidateProfile,
} from "@/lib/candidates-shared";
import { getCandidateById } from "@/lib/candidates";
import { getPrisma, isDatabaseReady } from "@/lib/db";
import { vietnamCalendarDate, startOfTodayVietnamIso } from "@/lib/vietnam-time";

function newId(prefix: string) {
  return `${prefix}_${randomBytes(8).toString("hex")}`;
}

async function pgReady() {
  return (await isDatabaseReady()) && Boolean(getPrisma());
}

function rowToSub(row: {
  planId: string;
  planName: string;
  cvUsed: number;
  cvLimit: number | null;
  cvUsedToday: number;
  cvUsageDay: string | null;
  activatedAt: Date;
  expiresAt: Date;
  activationVerified: boolean;
}): EmployerSubscription {
  return normalizeDailyCvUsage({
    planId: row.planId,
    planName: row.planName,
    cvUsed: row.cvUsed,
    cvLimit: row.cvLimit,
    cvUsedToday: row.cvUsedToday,
    cvUsageDay: row.cvUsageDay ?? undefined,
    activatedAt: row.activatedAt.toISOString(),
    expiresAt: row.expiresAt.toISOString(),
    activationVerified: row.activationVerified,
  });
}

async function countUnlocksToday(employerId: string): Promise<number> {
  if (!employerId || !(await pgReady())) return 0;
  const prisma = getPrisma()!;
  const dayStart = new Date(startOfTodayVietnamIso());
  return prisma.contactUnlock.count({
    where: { employerId, unlockedAt: { gte: dayStart } },
  });
}

export async function isCandidateContactUnlocked(
  employerId: string,
  candidateId: string
): Promise<boolean> {
  if (!employerId || !candidateId || !(await pgReady())) return false;
  const prisma = getPrisma()!;
  const row = await prisma.contactUnlock.findUnique({
    where: { employerId_candidateId: { employerId, candidateId } },
  });
  return Boolean(row);
}

/** ID ứng viên đã mở liên hệ (−1 CV), mới nhất trước. */
export async function listUnlockedCandidateIds(employerId: string): Promise<string[]> {
  if (!employerId || !(await pgReady())) return [];
  const prisma = getPrisma()!;
  const rows = await prisma.contactUnlock.findMany({
    where: { employerId },
    orderBy: { unlockedAt: "desc" },
    take: 500,
    select: { candidateId: true },
  });
  return rows.map((r) => r.candidateId);
}

function matchesUnlockListFilters(c: CandidateProfile, params: CandidateListParams) {
  const q = params.q?.trim().toLowerCase() ?? "";
  const province = params.province?.trim() ?? "";
  const industry = params.industry?.trim() ?? "";
  const status = params.status?.trim() ?? "";

  if (province && c.provinceCode !== province) return false;
  if (industry && c.industryId !== industry) return false;
  if (
    (status === "active" || status === "open" || status === "passive") &&
    c.jobSeekingStatus !== status
  ) {
    return false;
  }
  if (q) {
    const hit =
      c.fullName.toLowerCase().includes(q) ||
      c.title.toLowerCase().includes(q) ||
      c.desiredPosition.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.slug.toLowerCase().includes(q);
    if (!hit) return false;
  }
  return true;
}

/** Danh sách NTD đã mở SĐT/email (trang Đã mở). */
export async function listUnlockedCandidatesForEmployer(
  employerId: string,
  params: CandidateListParams = {}
): Promise<CandidateListResult> {
  const empty: CandidateListResult = {
    data: [],
    total: 0,
    page: 1,
    totalPages: 1,
    pageSize: PAGE_SIZE,
    source: "db",
  };
  if (!employerId) return empty;

  try {
    const ids = await listUnlockedCandidateIds(employerId);
    const profiles: CandidateProfile[] = [];
    for (const id of ids) {
      const c = await getCandidateById(id);
      if (!c || !c.isPublic) continue;
      if (!matchesUnlockListFilters(c, params)) continue;
      profiles.push({ ...c, isViewed: true });
    }

    const total = profiles.length;
    const requestedPage = Math.max(1, params.page ?? 1);
    const page = Math.min(MAX_LIST_PAGE, requestedPage);
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * PAGE_SIZE;

    return {
      data: profiles.slice(start, start + PAGE_SIZE),
      total,
      page: safePage,
      totalPages,
      pageSize: PAGE_SIZE,
      source: "db",
    };
  } catch (err) {
    console.error("[unlocks] listUnlockedCandidatesForEmployer failed", err);
    return empty;
  }
}

/**
 * Gói đang dùng của NTD (Postgres). `null` = chưa kích hoạt gói.
 */
export async function getEmployerSubscriptionState(
  employerId?: string
): Promise<EmployerSubscription | null> {
  if (!employerId || !(await pgReady())) return null;
  const prisma = getPrisma()!;
  const row = await prisma.employerSubscription.findUnique({
    where: { employerId },
  });
  if (!row) return null;
  return rowToSub(row);
}

export type UnlockContactResult =
  | { ok: true; alreadyUnlocked: boolean; subscription: EmployerSubscription }
  | { ok: false; error: string; code: "NO_QUOTA" | "EXPIRED" | "NOT_FOUND" };

export async function unlockCandidateContact(
  employerId: string,
  candidateId: string
): Promise<UnlockContactResult> {
  if (!employerId || !candidateId) {
    return { ok: false, error: "Thiếu thông tin NTD / ứng viên.", code: "NOT_FOUND" };
  }
  if (!(await pgReady())) {
    return {
      ok: false,
      error: "Cơ sở dữ liệu chưa sẵn sàng. Thử lại sau.",
      code: "NOT_FOUND",
    };
  }

  const prisma = getPrisma()!;
  const today = vietnamCalendarDate();
  const unlocksTodaySeed = await countUnlocksToday(employerId);

  const existing = await prisma.contactUnlock.findUnique({
    where: { employerId_candidateId: { employerId, candidateId } },
  });

  const subRow = await prisma.employerSubscription.findUnique({ where: { employerId } });
  if (!subRow) {
    return {
      ok: false,
      error: "Chưa đăng ký gói. Vào Bảng giá để kích hoạt Free hoặc chọn gói trả phí.",
      code: "NO_QUOTA",
    };
  }

  const sub = rowToSub(subRow);

  if (new Date(sub.expiresAt).getTime() < Date.now() && sub.planId !== "free") {
    return { ok: false, error: "Gói đã hết hạn. Vui lòng gia hạn.", code: "EXPIRED" };
  }

  if (existing) {
    return { ok: true, alreadyUnlocked: true, subscription: sub };
  }

  const perDay = dailyCvCap(sub.planId);
  const usedToday = Math.max(sub.cvUsedToday ?? 0, unlocksTodaySeed);

  if (perDay != null) {
    if (usedToday >= perDay) {
      return {
        ok: false,
        error: `Đã hết hạn mức ${perDay} CV trong ngày. Quay lại vào ngày mai hoặc nâng gói.`,
        code: "NO_QUOTA",
      };
    }
  } else if (sub.cvLimit != null && sub.cvUsed >= sub.cvLimit) {
    return {
      ok: false,
      error: "Đã hết hạn mức CV trong gói. Nâng gói để mở thêm hồ sơ.",
      code: "NO_QUOTA",
    };
  }

  // Candidate phải tồn tại trên Postgres (FK)
  const cand = await prisma.candidateProfile.findUnique({
    where: { id: candidateId },
    select: { id: true },
  });
  if (!cand) {
    return { ok: false, error: "Không tìm thấy ứng viên trong kho dữ liệu.", code: "NOT_FOUND" };
  }

  const next: EmployerSubscription = {
    ...sub,
    cvUsed: sub.cvUsed + 1,
    cvUsedToday: usedToday + 1,
    cvUsageDay: today,
  };

  await prisma.$transaction([
    prisma.contactUnlock.create({
      data: {
        id: newId("ul"),
        employerId,
        candidateId,
        unlockedAt: new Date(),
      },
    }),
    prisma.employerSubscription.update({
      where: { employerId },
      data: {
        cvUsed: next.cvUsed,
        cvUsedToday: next.cvUsedToday,
        cvUsageDay: today,
      },
    }),
  ]);

  return { ok: true, alreadyUnlocked: false, subscription: next };
}

/** Áp dụng gói sau thanh toán / kích hoạt Free. */
export async function applyPaidPlanToSubscription(
  employerId: string,
  input: {
    planId: string;
    planName: string;
    cvLimit: number | null;
    durationDays: number;
  }
): Promise<EmployerSubscription> {
  if (!(await pgReady())) {
    throw new Error("DATABASE_UNAVAILABLE");
  }
  const prisma = getPrisma()!;
  const plan = EMPLOYER_PLANS.find((p) => p.id === input.planId);
  const now = Date.now();
  const durationDays = input.durationDays || plan?.durationDays || 30;
  const next = normalizeDailyCvUsage({
    planId: input.planId,
    planName: input.planName || plan?.name || input.planId,
    cvUsed: 0,
    cvLimit: input.cvLimit ?? plan?.cvLimit ?? null,
    cvUsedToday: 0,
    cvUsageDay: vietnamCalendarDate(),
    activatedAt: new Date(now).toISOString(),
    expiresAt: new Date(now + durationDays * 24 * 60 * 60 * 1000).toISOString(),
    activationVerified: true,
  });

  await prisma.employerSubscription.upsert({
    where: { employerId },
    create: {
      employerId,
      planId: next.planId,
      planName: next.planName,
      cvUsed: next.cvUsed,
      cvLimit: next.cvLimit,
      cvUsedToday: next.cvUsedToday ?? 0,
      cvUsageDay: next.cvUsageDay ?? null,
      activatedAt: new Date(next.activatedAt),
      expiresAt: new Date(next.expiresAt),
      activationVerified: true,
      lastFreeActivatedAt: input.planId === "free" ? new Date(now) : null,
    },
    update: {
      planId: next.planId,
      planName: next.planName,
      cvUsed: next.cvUsed,
      cvLimit: next.cvLimit,
      cvUsedToday: next.cvUsedToday ?? 0,
      cvUsageDay: next.cvUsageDay ?? null,
      activatedAt: new Date(next.activatedAt),
      expiresAt: new Date(next.expiresAt),
      activationVerified: true,
      ...(input.planId === "free" ? { lastFreeActivatedAt: new Date(now) } : {}),
    },
  });

  return next;
}

/** Đã kích hoạt Free hôm nay chưa (Postgres). */
export async function hasActivatedFreePlanTodayPg(employerId: string): Promise<boolean> {
  if (!employerId || !(await pgReady())) return false;
  const prisma = getPrisma()!;
  const row = await prisma.employerSubscription.findUnique({
    where: { employerId },
    select: { lastFreeActivatedAt: true },
  });
  if (!row?.lastFreeActivatedAt) return false;
  return row.lastFreeActivatedAt.toISOString() >= startOfTodayVietnamIso();
}

export function maskContactOnCvData<T extends { phone: string; email: string }>(
  data: T,
  reveal: boolean
): T {
  if (reveal) return data;
  return {
    ...data,
    phone: "",
    email: "",
  };
}

export { dailyCvCap };
