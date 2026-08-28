import { EMPLOYER_PLANS } from "@/data/employer-plans";
import { vietnamCalendarDate } from "@/lib/vietnam-time";

/** Gói đang dùng của NTD. */
export type EmployerSubscription = {
  planId: string;
  planName: string;
  /** Tổng CV đã mở trong chu kỳ gói (trần cvLimit). */
  cvUsed: number;
  /** null = không giới hạn tổng (Free theo ngày hoặc gói unlimited). */
  cvLimit: number | null;
  /** Số CV đã mở trong ngày (gói Free / cvPerDay). */
  cvUsedToday?: number;
  /** Ngày VN (YYYY-MM-DD) tương ứng cvUsedToday. */
  cvUsageDay?: string;
  activatedAt: string;
  expiresAt: string;
  /** Đã xác nhận có đơn kích hoạt hợp lệ — tránh list orders mỗi request. */
  activationVerified?: boolean;
};

const freePlan = EMPLOYER_PLANS.find((p) => p.id === "free")!;

/**
 * Snapshot gói Free khi NTD chủ động kích hoạt (Bảng giá → Dùng Free).
 * Không dùng để seed user mới — chưa đăng ký gói = không có subscription.
 */
export function getDefaultEmployerSubscription(): EmployerSubscription {
  const now = Date.now();
  return {
    planId: freePlan.id,
    planName: freePlan.name,
    cvUsed: 0,
    cvLimit: freePlan.cvLimit,
    cvUsedToday: 0,
    cvUsageDay: vietnamCalendarDate(),
    activatedAt: new Date(now).toISOString(),
    /** Free không hết hạn theo ngày — mốc xa; UI hiện «Không thời hạn». */
    expiresAt: new Date(now + 3650 * 24 * 60 * 60 * 1000).toISOString(),
  };
}

/** @deprecated Dùng getDefaultEmployerSubscription — trước đây seed nhầm gói trial 200 CV. */
export function getDemoEmployerSubscription(): EmployerSubscription {
  return getDefaultEmployerSubscription();
}

export function daysRemaining(expiresAtIso: string, now = Date.now()) {
  const diff = new Date(expiresAtIso).getTime() - now;
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
}

function planMeta(planId?: string | null) {
  if (!planId) return null;
  return EMPLOYER_PLANS.find((p) => p.id === planId) ?? null;
}

/** Free / gói có cvPerDay — hạn mức theo ngày. */
export function isDailyCvPlan(planId?: string | null) {
  const p = planMeta(planId);
  return Boolean(p?.cvPerDay != null && p.cvPerDay > 0) || planId === "free";
}

export function dailyCvCap(planId?: string | null): number | null {
  const p = planMeta(planId);
  if (p?.cvPerDay != null && p.cvPerDay > 0) return p.cvPerDay;
  if (planId === "free") return 2;
  return null;
}

/** Chuẩn hóa đếm CV trong ngày theo lịch VN. */
export function normalizeDailyCvUsage(
  sub: EmployerSubscription,
  now = new Date()
): EmployerSubscription {
  const today = vietnamCalendarDate(now);
  if (sub.cvUsageDay === today) {
    return {
      ...sub,
      cvUsedToday: Math.max(0, sub.cvUsedToday ?? 0),
      cvUsageDay: today,
    };
  }
  return { ...sub, cvUsedToday: 0, cvUsageDay: today };
}

export function formatCvQuota(
  used: number,
  limit: number | null,
  planId?: string | null,
  usedToday?: number
) {
  const plan = planMeta(planId);
  const perDay = dailyCvCap(planId);
  if (perDay != null) {
    const todayUsed = Math.max(0, usedToday ?? 0);
    const label = plan?.cvLimitLabel || `${perDay} CV / ngày`;
    return `${todayUsed} / ${perDay} hôm nay · ${label}`;
  }
  if (limit == null) {
    return used > 0
      ? `Không giới hạn · ${used.toLocaleString("vi-VN")} đã mở`
      : "Không giới hạn CV";
  }
  return `${used.toLocaleString("vi-VN")} / ${limit.toLocaleString("vi-VN")} CV`;
}

export function formatExpiryShort(
  expiresAtIso: string,
  now = Date.now(),
  planId?: string | null
) {
  if (isDailyCvPlan(planId)) {
    return "Không thời hạn";
  }
  const days = daysRemaining(expiresAtIso, now);
  if (days <= 0) return "Đã hết hạn";
  if (days === 1) return "Còn 1 ngày";
  return `Còn ${days} ngày`;
}
