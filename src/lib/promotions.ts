import "server-only";

import type { AdminPromoRow } from "@/lib/admin/business-types";
import { getPrisma, isDatabaseReady } from "@/lib/db";
import type { PromoDiscountType } from "@/lib/promo-pricing";
import { resolveDiscount } from "@/lib/promo-pricing";

export type PromoStatus = "active" | "upcoming" | "ended";

export type Promotion = {
  id: string;
  badge: string;
  title: string;
  body: string;
  code: string;
  discountLabel: string;
  expiresAt: string;
  status: PromoStatus;
  sortOrder?: number;
  usedCount?: number;
  /** Gói áp dụng; rỗng = mọi gói trả phí */
  planIds?: string[];
  discountType?: PromoDiscountType;
  discountValue?: number;
};

const DEFAULT_PROMOS: Promotion[] = [
  {
    id: "promo-standard-15",
    badge: "Giảm giá",
    title: "Giảm 15% gói Phổ biến",
    body: "Áp dụng khi kích hoạt gói 30 ngày không giới hạn CV.",
    code: "PHOBIEN15",
    discountLabel: "-15%",
    expiresAt: "2026-12-31T23:59:59+07:00",
    status: "active",
    sortOrder: 1,
    usedCount: 0,
    planIds: ["standard"],
    discountType: "percent",
    discountValue: 15,
  },
  {
    id: "promo-trial",
    badge: "Dùng thử",
    title: "Gói Trải nghiệm ưu đãi NTD mới",
    body: "5 ngày · 200 CV với mức giá đặc biệt — kiểm chứng kho hồ sơ trước khi nâng gói.",
    code: "TRIAL399",
    discountLabel: "399.000₫",
    expiresAt: "2026-12-31T23:59:59+07:00",
    status: "active",
    sortOrder: 2,
    usedCount: 0,
    planIds: ["trial"],
    discountType: "fixed_price",
    discountValue: 399_000,
  },
  {
    id: "promo-quarter",
    badge: "Sắp mở",
    title: "Giảm 20% gói Chuyên nghiệp",
    body: "Ưu đãi theo quý cho NTD dùng liên tục — sẽ mở đăng ký đầu tháng sau.",
    code: "CHUYENNGHIEP20",
    discountLabel: "-20%",
    expiresAt: "2027-03-31T23:59:59+07:00",
    status: "upcoming",
    sortOrder: 3,
    usedCount: 0,
    planIds: ["pro"],
    discountType: "percent",
    discountValue: 20,
  },
];

const DEFAULT_BY_CODE = new Map(DEFAULT_PROMOS.map((p) => [p.code, p]));

function enrich(raw: Promotion): Promotion {
  const fallback = DEFAULT_BY_CODE.get((raw.code || "").toUpperCase());
  const discount = resolveDiscount(raw);
  return {
    ...raw,
    code: (raw.code || "").toUpperCase(),
    planIds: raw.planIds?.length ? raw.planIds : fallback?.planIds ?? [],
    discountType: raw.discountType || discount.type,
    discountValue: raw.discountValue ?? discount.value,
  };
}

function resolveStatus(p: Promotion, now = Date.now()): PromoStatus {
  if (p.status === "upcoming") {
    if (new Date(p.expiresAt).getTime() < now) return "ended";
    return "upcoming";
  }
  if (new Date(p.expiresAt).getTime() < now) return "ended";
  return p.status === "ended" ? "ended" : "active";
}

function rowToPromo(row: {
  id: string;
  badge: string;
  title: string;
  body: string;
  code: string;
  discountLabel: string;
  expiresAt: string;
  status: string;
  sortOrder: number | null;
  usedCount: number;
  planIds: string[];
  discountType: string | null;
  discountValue: number | null;
}): Promotion {
  return enrich({
    id: row.id,
    badge: row.badge,
    title: row.title,
    body: row.body,
    code: row.code,
    discountLabel: row.discountLabel,
    expiresAt: row.expiresAt,
    status: row.status as PromoStatus,
    sortOrder: row.sortOrder ?? undefined,
    usedCount: row.usedCount,
    planIds: row.planIds,
    discountType: (row.discountType as PromoDiscountType) || undefined,
    discountValue: row.discountValue ?? undefined,
  });
}

async function ensureDefaultPromotions() {
  if (!(await isDatabaseReady())) return;
  const prisma = getPrisma();
  if (!prisma) return;
  const count = await prisma.promotion.count();
  if (count > 0) return;
  await prisma.promotion.createMany({
    data: DEFAULT_PROMOS.map((p) => ({
      id: p.id,
      badge: p.badge,
      title: p.title,
      body: p.body,
      code: p.code,
      discountLabel: p.discountLabel,
      expiresAt: p.expiresAt,
      status: p.status,
      sortOrder: p.sortOrder ?? null,
      usedCount: p.usedCount ?? 0,
      planIds: p.planIds ?? [],
      discountType: p.discountType ?? null,
      discountValue: p.discountValue ?? null,
    })),
  });
}

export async function listPromotions(): Promise<Promotion[]> {
  try {
    if (!(await isDatabaseReady())) {
      return DEFAULT_PROMOS.map((p) => ({ ...p, status: resolveStatus(p) }));
    }
    const prisma = getPrisma();
    if (!prisma) {
      return DEFAULT_PROMOS.map((p) => ({ ...p, status: resolveStatus(p) }));
    }

    await ensureDefaultPromotions();
    const rows = await prisma.promotion.findMany();
    return rows
      .map((r) => {
        const raw = rowToPromo(r);
        return { ...raw, status: resolveStatus(raw) };
      })
      .sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));
  } catch (err) {
    console.warn("[promotions] list failed — using defaults", err);
    return DEFAULT_PROMOS.map((p) => ({ ...p, status: resolveStatus(p) }));
  }
}

export async function getPromotionByCode(code: string): Promise<Promotion | null> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return null;
  try {
    if (!(await isDatabaseReady())) {
      const fallback = DEFAULT_BY_CODE.get(normalized);
      return fallback ? { ...fallback, status: resolveStatus(fallback) } : null;
    }
    const prisma = getPrisma();
    if (!prisma) {
      const fallback = DEFAULT_BY_CODE.get(normalized);
      return fallback ? { ...fallback, status: resolveStatus(fallback) } : null;
    }

    await ensureDefaultPromotions();
    const row = await prisma.promotion.findUnique({ where: { code: normalized } });
    if (!row) {
      const fallback = DEFAULT_BY_CODE.get(normalized);
      return fallback ? { ...fallback, status: resolveStatus(fallback) } : null;
    }
    const raw = rowToPromo(row);
    return { ...raw, status: resolveStatus(raw) };
  } catch {
    const fallback = DEFAULT_BY_CODE.get(normalized);
    return fallback ? { ...fallback, status: resolveStatus(fallback) } : null;
  }
}

export async function listAdminPromotions(): Promise<AdminPromoRow[]> {
  const promos = await listPromotions();
  return promos.map((p) => ({
    id: p.id,
    code: p.code,
    title: p.title,
    discountLabel: p.discountLabel,
    status: p.status,
    expiresAt: p.expiresAt,
    usedCount: p.usedCount ?? 0,
    badge: p.badge,
    body: p.body,
    sortOrder: p.sortOrder,
  }));
}

export async function upsertPromotion(
  input: AdminPromoRow & { badge?: string; body?: string; planIds?: string[] }
): Promise<AdminPromoRow> {
  if (!(await isDatabaseReady())) throw new Error("DATABASE_UNAVAILABLE");
  const prisma = getPrisma();
  if (!prisma) throw new Error("DATABASE_UNAVAILABLE");

  const id =
    input.id?.trim() ||
    `promo-${input.code.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  const existing = await prisma.promotion.findUnique({ where: { id } });
  const discount = resolveDiscount({
    code: input.code,
    discountLabel: input.discountLabel,
  });

  const doc = {
    id,
    badge: (input.badge || existing?.badge || "Ưu đãi").trim(),
    title: input.title.trim(),
    body: (input.body || existing?.body || input.title).trim(),
    code: input.code.trim().toUpperCase(),
    discountLabel: input.discountLabel.trim(),
    expiresAt: input.expiresAt,
    status: input.status,
    sortOrder: input.sortOrder ?? existing?.sortOrder ?? Date.now(),
    usedCount: Math.max(0, Number(input.usedCount) || 0),
    planIds: input.planIds ?? existing?.planIds ?? [],
    discountType: discount.type,
    discountValue: discount.value,
  };

  await prisma.promotion.upsert({
    where: { id },
    create: doc,
    update: {
      badge: doc.badge,
      title: doc.title,
      body: doc.body,
      code: doc.code,
      discountLabel: doc.discountLabel,
      expiresAt: doc.expiresAt,
      status: doc.status,
      sortOrder: doc.sortOrder,
      usedCount: doc.usedCount,
      planIds: doc.planIds,
      discountType: doc.discountType,
      discountValue: doc.discountValue,
    },
  });

  return {
    id: doc.id,
    code: doc.code,
    title: doc.title,
    discountLabel: doc.discountLabel,
    status: resolveStatus(doc as Promotion),
    expiresAt: doc.expiresAt,
    usedCount: doc.usedCount,
    badge: doc.badge,
    body: doc.body,
    sortOrder: doc.sortOrder,
  };
}

export async function bumpPromoUsedCount(code: string) {
  const promo = await getPromotionByCode(code);
  if (!promo) return;
  try {
    if (!(await isDatabaseReady())) return;
    const prisma = getPrisma();
    if (!prisma) return;
    await prisma.promotion.update({
      where: { id: promo.id },
      data: { usedCount: (promo.usedCount ?? 0) + 1 },
    });
  } catch (err) {
    console.warn("[promotions] bump usedCount failed", err);
  }
}
