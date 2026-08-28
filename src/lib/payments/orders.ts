import { randomBytes } from "node:crypto";
import { applyPaidPlanToSubscription, hasActivatedFreePlanTodayPg } from "@/lib/employer-unlocks";
import { bumpPromoUsedCount, getPromotionByCode } from "@/lib/promotions";
import { getServicePlanById } from "@/lib/service-plans";
import { EMPLOYER_PLANS } from "@/data/employer-plans";
import { startOfTodayVietnamIso } from "@/lib/vietnam-time";
import {
  applyPromoToPrice,
  isPromoUsable,
  promoAppliesToPlan,
} from "@/lib/promo-pricing";
import { getSePayConfig } from "@/lib/payments/config";
import {
  getOrderByCode,
  listOrdersForEmployer,
  markSePayProcessed,
  saveOrder,
  wasSePayProcessed,
} from "@/lib/payments/store";
import type { PaymentOrder, SePayWebhookPayload } from "@/lib/payments/types";
import { buildVietQrImageUrl, getBankTransferInfo } from "@/lib/payments/vietqr";

function makeCode(prefix: string) {
  const rand = randomBytes(4).toString("hex").toUpperCase();
  return `${prefix}${rand}`;
}

export async function createPaymentOrder(input: {
  employerId: string;
  employerEmail: string;
  planId: string;
  promoCode?: string;
}) {
  const plan = await getServicePlanById(input.planId);
  if (!plan) throw new Error("INVALID_PLAN");
  if (plan.price <= 0) throw new Error("FREE_PLAN");

  let amount = plan.price;
  let originalAmount: number | null = null;
  let promoCode: string | null = null;

  if (input.promoCode?.trim()) {
    const promo = await getPromotionByCode(input.promoCode);
    if (!promo || !isPromoUsable(promo)) throw new Error("INVALID_PROMO");
    if (!promoAppliesToPlan(promo, plan.id)) throw new Error("PROMO_PLAN_MISMATCH");
    const priced = applyPromoToPrice(plan.price, promo);
    amount = priced.amount;
    originalAmount = priced.originalAmount;
    promoCode = promo.code;
  }

  const { paymentPrefix } = getSePayConfig();
  const now = Date.now();
  const code = makeCode(paymentPrefix);

  const order: PaymentOrder = {
    id: `ord_${randomBytes(8).toString("hex")}`,
    code,
    employerId: input.employerId,
    employerEmail: input.employerEmail,
    planId: plan.id,
    planName: plan.name,
    amount,
    originalAmount,
    promoCode,
    durationDays: plan.durationDays,
    cvLimit: plan.cvLimit,
    status: "pending",
    createdAt: new Date(now).toISOString(),
    paidAt: null,
    expiresAt: new Date(now + 30 * 60 * 1000).toISOString(),
    sepayTxnId: null,
    transferAmount: null,
    gateway: null,
  };

  await saveOrder(order);

  const qrImageUrl = buildVietQrImageUrl({ amount: order.amount, addInfo: order.code });
  const bank = getBankTransferInfo();

  return { order, qrImageUrl, bank };
}

export async function activateFreePlan(input: {
  employerId: string;
  employerEmail: string;
}) {
  const plan =
    (await getServicePlanById("free")) || EMPLOYER_PLANS.find((p) => p.id === "free") || null;
  if (!plan) throw new Error("INVALID_PLAN");

  if (await hasActivatedFreePlanTodayPg(input.employerId)) {
    throw new Error("FREE_DAILY_LIMIT");
  }

  const now = Date.now();
  const order: PaymentOrder = {
    id: `ord_${randomBytes(8).toString("hex")}`,
    code: `FREE${randomBytes(3).toString("hex").toUpperCase()}`,
    employerId: input.employerId,
    employerEmail: input.employerEmail,
    planId: plan.id,
    planName: plan.name,
    amount: 0,
    durationDays: 0,
    cvLimit: plan.cvLimit,
    status: "paid",
    createdAt: new Date(now).toISOString(),
    paidAt: new Date(now).toISOString(),
    expiresAt: new Date(now).toISOString(),
    sepayTxnId: null,
    transferAmount: 0,
    gateway: null,
  };
  await saveOrder(order);
  await applyPaidPlanToSubscription(input.employerId, {
    planId: plan.id,
    planName: plan.name,
    cvLimit: plan.cvLimit,
    durationDays: 3650,
  });
  return order;
}

/** Đã kích hoạt gói Free trong ngày (Asia/Ho_Chi_Minh) chưa. */
export async function hasActivatedFreePlanToday(employerId: string): Promise<boolean> {
  if (!employerId) return false;
  try {
    if (await hasActivatedFreePlanTodayPg(employerId)) return true;
  } catch {
    /* ignore */
  }
  try {
    const dayStart = startOfTodayVietnamIso();
    const existing = await listOrdersForEmployer(employerId);
    return existing.some((o) => {
      if (o.planId !== "free" || o.status !== "paid") return false;
      const at = o.paidAt || o.createdAt || "";
      return at >= dayStart;
    });
  } catch {
    return false;
  }
}

function extractPaymentCode(payload: SePayWebhookPayload, prefix: string) {
  const raw = (payload.code || payload.content || "").toUpperCase().replace(/\s+/g, "");
  if (!raw) return null;
  if (payload.code) {
    const c = String(payload.code).toUpperCase().replace(/\s+/g, "");
    if (c.startsWith(prefix)) return c;
  }
  const re = new RegExp(`${prefix}[A-Z0-9]{6,20}`);
  const m = raw.match(re);
  return m?.[0] ?? null;
}

export async function fulfillSePayWebhook(payload: SePayWebhookPayload) {
  const txnId = payload.id != null ? String(payload.id) : "";
  if (!txnId) {
    return { ok: false as const, status: 400, message: "Missing transaction id" };
  }

  if (await wasSePayProcessed(txnId)) {
    return { ok: true as const, duplicate: true };
  }

  if (payload.transferType && payload.transferType !== "in") {
    await markSePayProcessed(txnId);
    return { ok: true as const, ignored: true, reason: "not_incoming" };
  }

  const { paymentPrefix } = getSePayConfig();
  const code = extractPaymentCode(payload, paymentPrefix);
  if (!code) {
    await markSePayProcessed(txnId);
    return { ok: true as const, ignored: true, reason: "no_code" };
  }

  const order = await getOrderByCode(code);
  if (!order) {
    await markSePayProcessed(txnId);
    return { ok: true as const, ignored: true, reason: "order_not_found" };
  }

  if (order.status === "paid") {
    await markSePayProcessed(txnId);
    return { ok: true as const, duplicate: true };
  }

  const amount = Number(payload.transferAmount ?? 0);
  if (amount < order.amount) {
    return {
      ok: false as const,
      status: 422,
      message: `Amount mismatch: got ${amount}, expect ${order.amount}`,
    };
  }

  const paid: PaymentOrder = {
    ...order,
    status: "paid",
    paidAt: new Date().toISOString(),
    sepayTxnId: txnId,
    transferAmount: amount,
    gateway: payload.gateway ?? null,
  };
  await saveOrder(paid);
  await markSePayProcessed(txnId);
  await applyPaidPlanToSubscription(order.employerId, {
    planId: order.planId,
    planName: order.planName,
    cvLimit: order.cvLimit,
    durationDays: order.durationDays,
  });
  if (order.promoCode) {
    await bumpPromoUsedCount(order.promoCode);
  }

  return { ok: true as const, order: paid };
}

export function getPublicOrderView(order: PaymentOrder) {
  const qrImageUrl =
    order.status === "pending"
      ? buildVietQrImageUrl({ amount: order.amount, addInfo: order.code })
      : null;
  return {
    id: order.id,
    code: order.code,
    planId: order.planId,
    planName: order.planName,
    amount: order.amount,
    originalAmount: order.originalAmount ?? null,
    promoCode: order.promoCode ?? null,
    status: order.status,
    createdAt: order.createdAt,
    paidAt: order.paidAt,
    expiresAt: order.expiresAt,
    qrImageUrl,
    bank: getBankTransferInfo(),
  };
}
