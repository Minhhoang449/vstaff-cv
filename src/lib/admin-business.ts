import "server-only";

import type { AdminActivationRow } from "@/lib/admin/business-types";
import { getPrisma, isDatabaseReady } from "@/lib/db";
import { listPaymentOrders } from "@/lib/payments/store";
import type { PaymentOrder } from "@/lib/payments/types";

function addDays(iso: string, days: number) {
  return new Date(new Date(iso).getTime() + days * 24 * 60 * 60 * 1000).toISOString();
}

async function resolveCompanyNames(employerIds: string[]): Promise<Map<string, string>> {
  const unique = [...new Set(employerIds.filter(Boolean))];
  const map = new Map<string, string>();
  if (!unique.length) return map;

  try {
    if (!(await isDatabaseReady())) {
      unique.forEach((id) => map.set(id, id));
      return map;
    }
    const prisma = getPrisma();
    if (!prisma) {
      unique.forEach((id) => map.set(id, id));
      return map;
    }
    const users = await prisma.user.findMany({
      where: { id: { in: unique } },
      select: { id: true, email: true, company: true, companyProfile: true },
    });
    for (const u of users) {
      const profile =
        u.companyProfile && typeof u.companyProfile === "object"
          ? (u.companyProfile as { companyName?: string })
          : null;
      map.set(
        u.id,
        profile?.companyName?.trim() || u.company?.trim() || u.email || u.id
      );
    }
    for (const id of unique) {
      if (!map.has(id)) map.set(id, id);
    }
  } catch {
    unique.forEach((id) => map.set(id, id));
  }
  return map;
}

export function orderToAdminActivation(
  order: PaymentOrder,
  company: string
): AdminActivationRow {
  const now = Date.now();
  let status: AdminActivationRow["status"] = "pending";
  let activatedAt = order.createdAt;
  let expiresAt = order.expiresAt;

  if (order.status === "cancelled") {
    status = "cancelled";
  } else if (order.status === "paid") {
    activatedAt = order.paidAt || order.createdAt;
    expiresAt =
      order.durationDays > 0
        ? addDays(activatedAt, order.durationDays)
        : addDays(activatedAt, 3650);
    status = new Date(expiresAt).getTime() < now ? "expired" : "active";
  } else if (order.status === "expired") {
    status = "expired";
  } else {
    status = new Date(order.expiresAt).getTime() < now ? "cancelled" : "pending";
  }

  return {
    id: order.id,
    company,
    planName: order.planName,
    amount: order.amount,
    promoCode: order.promoCode ?? null,
    activatedAt,
    expiresAt,
    status,
  };
}

export async function listAdminActivations(): Promise<AdminActivationRow[]> {
  const orders = await listPaymentOrders();
  const companies = await resolveCompanyNames(orders.map((o) => o.employerId));
  return orders.map((o) =>
    orderToAdminActivation(
      o,
      companies.get(o.employerId) || o.employerEmail || o.employerId
    )
  );
}

/** Đơn đã thanh toán — dùng tính doanh thu. */
export function getRecognizedRevenueActivations(rows: AdminActivationRow[]) {
  return rows.filter((a) => a.status === "active" || a.status === "expired");
}

export function buildMonthlyRevenue(
  rows: AdminActivationRow[],
  now = new Date()
) {
  const months: { key: string; label: string; amount: number; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleDateString("vi-VN", { month: "short", year: "numeric" });
    months.push({ key, label, amount: 0, count: 0 });
  }

  const map = new Map(months.map((m) => [m.key, m]));
  for (const row of getRecognizedRevenueActivations(rows)) {
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

export function getCurrentMonthRevenue(rows: AdminActivationRow[], now = new Date()) {
  const monthly = buildMonthlyRevenue(rows, now);
  const key = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const current = monthly.find((m) => m.key === key);
  return {
    key,
    label: now.toLocaleDateString("vi-VN", { month: "long", year: "numeric" }),
    amount: current?.amount ?? 0,
    count: current?.count ?? 0,
  };
}

export function buildRevenueByPlan(rows: AdminActivationRow[]) {
  const map = new Map<string, { planName: string; amount: number; count: number }>();
  for (const row of getRecognizedRevenueActivations(rows)) {
    const cur = map.get(row.planName) ?? { planName: row.planName, amount: 0, count: 0 };
    cur.amount += row.amount;
    cur.count += 1;
    map.set(row.planName, cur);
  }
  return [...map.values()].sort((a, b) => b.amount - a.amount);
}

export async function getAdminRevenueSnapshot() {
  const activations = await listAdminActivations();
  return {
    activations,
    monthly: buildMonthlyRevenue(activations),
    byPlan: buildRevenueByPlan(activations),
    currentMonth: getCurrentMonthRevenue(activations),
    recognized: getRecognizedRevenueActivations(activations),
  };
}
