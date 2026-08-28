import { EMPLOYER_PLANS, formatVnd } from "@/data/employer-plans";

export type AdminEmployerStatus = "active" | "trial" | "expired" | "suspended";

export type AdminEmployerRow = {
  id: string;
  company: string;
  email: string;
  planName: string;
  status: AdminEmployerStatus;
  cvUsed: number;
  cvLimit: number | null;
  activatedAt: string;
};

export type AdminActivationRow = {
  id: string;
  company: string;
  planName: string;
  amount: number;
  promoCode: string | null;
  activatedAt: string;
  expiresAt: string;
  status: "active" | "expired" | "pending" | "cancelled";
};

export type AdminPromoRow = {
  id: string;
  code: string;
  title: string;
  discountLabel: string;
  status: "active" | "upcoming" | "ended";
  expiresAt: string;
  usedCount: number;
};

export const ADMIN_EMPLOYERS: AdminEmployerRow[] = [
  {
    id: "ntd-1",
    company: "Vstaff Demo Co.",
    email: "employer@demo.local",
    planName: "Trải nghiệm",
    status: "trial",
    cvUsed: 47,
    cvLimit: 200,
    activatedAt: "2026-08-20T09:00:00+07:00",
  },
  {
    id: "ntd-2",
    company: "TechNova Solutions",
    email: "hr@technova.vn",
    planName: "Phổ biến",
    status: "active",
    cvUsed: 312,
    cvLimit: null,
    activatedAt: "2026-08-01T10:00:00+07:00",
  },
  {
    id: "ntd-3",
    company: "Woori Bank Vietnam",
    email: "talent@woori.vn",
    planName: "Chuyên nghiệp",
    status: "active",
    cvUsed: 890,
    cvLimit: null,
    activatedAt: "2026-05-12T08:30:00+07:00",
  },
  {
    id: "ntd-4",
    company: "Orient Retail Group",
    email: "recruit@orient.vn",
    planName: "Free",
    status: "active",
    cvUsed: 2,
    cvLimit: 2,
    activatedAt: "2026-08-24T07:00:00+07:00",
  },
  {
    id: "ntd-5",
    company: "Saigon Trade Co.",
    email: "hr@saigontrade.vn",
    planName: "Phổ biến",
    status: "expired",
    cvUsed: 210,
    cvLimit: null,
    activatedAt: "2026-06-01T11:00:00+07:00",
  },
  {
    id: "ntd-6",
    company: "CloudBridge VN",
    email: "people@cloudbridge.vn",
    planName: "Trải nghiệm",
    status: "suspended",
    cvUsed: 12,
    cvLimit: 200,
    activatedAt: "2026-08-10T14:00:00+07:00",
  },
];

export const ADMIN_ACTIVATIONS: AdminActivationRow[] = [
  {
    id: "act-a1",
    company: "TechNova Solutions",
    planName: "Phổ biến",
    amount: 841_500,
    promoCode: "PHOBIEN15",
    activatedAt: "2026-08-01T10:00:00+07:00",
    expiresAt: "2026-08-31T23:59:59+07:00",
    status: "active",
  },
  {
    id: "act-a2",
    company: "Vstaff Demo Co.",
    planName: "Trải nghiệm",
    amount: 399_000,
    promoCode: "TRIAL399",
    activatedAt: "2026-08-20T09:00:00+07:00",
    expiresAt: "2026-08-25T23:59:59+07:00",
    status: "active",
  },
  {
    id: "act-a3",
    company: "Saigon Trade Co.",
    planName: "Phổ biến",
    amount: 990_000,
    promoCode: null,
    activatedAt: "2026-06-01T11:00:00+07:00",
    expiresAt: "2026-07-01T23:59:59+07:00",
    status: "expired",
  },
  {
    id: "act-a4",
    company: "Woori Bank Vietnam",
    planName: "Chuyên nghiệp",
    amount: 2_490_000,
    promoCode: null,
    activatedAt: "2026-05-12T08:30:00+07:00",
    expiresAt: "2026-09-09T23:59:59+07:00",
    status: "active",
  },
  {
    id: "act-a5",
    company: "CloudBridge VN",
    planName: "Phổ biến",
    amount: 990_000,
    promoCode: null,
    activatedAt: "2026-08-22T16:00:00+07:00",
    expiresAt: "2026-09-21T23:59:59+07:00",
    status: "pending",
  },
  {
    id: "act-a6",
    company: "Orient Retail Group",
    planName: "Phổ biến",
    amount: 990_000,
    promoCode: null,
    activatedAt: "2026-07-08T10:00:00+07:00",
    expiresAt: "2026-08-07T23:59:59+07:00",
    status: "expired",
  },
  {
    id: "act-a7",
    company: "Growth Lab Agency",
    planName: "Trải nghiệm",
    amount: 399_000,
    promoCode: "TRIAL399",
    activatedAt: "2026-07-15T14:00:00+07:00",
    expiresAt: "2026-07-20T23:59:59+07:00",
    status: "expired",
  },
  {
    id: "act-a8",
    company: "FastShip VN",
    planName: "Chuyên nghiệp",
    amount: 2_490_000,
    promoCode: "CHUYENNGHIEP20",
    activatedAt: "2026-04-02T09:00:00+07:00",
    expiresAt: "2026-08-01T23:59:59+07:00",
    status: "expired",
  },
  {
    id: "act-a9",
    company: "SecureHome",
    planName: "Phổ biến",
    amount: 841_500,
    promoCode: "PHOBIEN15",
    activatedAt: "2026-03-18T11:30:00+07:00",
    expiresAt: "2026-04-17T23:59:59+07:00",
    status: "expired",
  },
  {
    id: "act-a10",
    company: "Logistics Express",
    planName: "Trải nghiệm",
    amount: 399_000,
    promoCode: null,
    activatedAt: "2026-08-05T08:00:00+07:00",
    expiresAt: "2026-08-10T23:59:59+07:00",
    status: "expired",
  },
];

/** Giao dịch tính doanh thu: bỏ pending / cancelled. */
export function getRecognizedRevenueActivations() {
  return ADMIN_ACTIVATIONS.filter((a) => a.status === "active" || a.status === "expired");
}

export function buildMonthlyRevenue(now = new Date()) {
  const months: { key: string; label: string; amount: number; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("vi-VN", { month: "short", year: "numeric" });
    months.push({ key, label, amount: 0, count: 0 });
  }

  const map = new Map(months.map((m) => [m.key, m]));
  for (const row of getRecognizedRevenueActivations()) {
    const d = new Date(row.activatedAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const bucket = map.get(key);
    if (bucket) {
      bucket.amount += row.amount;
      bucket.count += 1;
    }
  }
  return months;
}

/** Doanh thu tháng hiện tại (cho header admin). */
export function getCurrentMonthRevenue(now = new Date()) {
  const monthly = buildMonthlyRevenue(now);
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const current = monthly.find((m) => m.key === key);
  return {
    key,
    label: now.toLocaleDateString("vi-VN", { month: "long", year: "numeric" }),
    amount: current?.amount ?? 0,
    count: current?.count ?? 0,
  };
}

export function buildRevenueByPlan() {
  const map = new Map<string, { planName: string; amount: number; count: number }>();
  for (const row of getRecognizedRevenueActivations()) {
    const cur = map.get(row.planName) ?? { planName: row.planName, amount: 0, count: 0 };
    cur.amount += row.amount;
    cur.count += 1;
    map.set(row.planName, cur);
  }
  return [...map.values()].sort((a, b) => b.amount - a.amount);
}

export const ADMIN_PROMOS: AdminPromoRow[] = [
  {
    id: "km-1",
    code: "PHOBIEN15",
    title: "Giảm 15% gói Phổ biến",
    discountLabel: "-15%",
    status: "active",
    expiresAt: "2026-08-31T23:59:59+07:00",
    usedCount: 24,
  },
  {
    id: "km-2",
    code: "TRIAL399",
    title: "Gói Trải nghiệm ưu đãi",
    discountLabel: "399.000₫",
    status: "active",
    expiresAt: "2026-09-15T23:59:59+07:00",
    usedCount: 61,
  },
  {
    id: "km-3",
    code: "CHUYENNGHIEP20",
    title: "Giảm 20% gói Chuyên nghiệp",
    discountLabel: "-20%",
    status: "upcoming",
    expiresAt: "2026-10-31T23:59:59+07:00",
    usedCount: 0,
  },
  {
    id: "km-4",
    code: "HE2026",
    title: "Flash sale mùa hè",
    discountLabel: "-25%",
    status: "ended",
    expiresAt: "2026-07-31T23:59:59+07:00",
    usedCount: 118,
  },
];

export function formatAdminDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function formatAdminDateTime(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCvQuotaLabel(used: number, limit: number | null) {
  if (limit == null) return `${used.toLocaleString("vi-VN")} / ∞`;
  return `${used.toLocaleString("vi-VN")} / ${limit.toLocaleString("vi-VN")}`;
}

export function adminPlanSummary() {
  return EMPLOYER_PLANS.map((p) => ({
    id: p.id,
    name: p.name,
    priceLabel: formatVnd(p.price),
    durationLabel: p.durationLabel,
    cvLimitLabel: p.cvLimitLabel,
  }));
}
