import "server-only";

import type { PaymentOrder } from "@/lib/payments/types";
import { getPrisma, isDatabaseReady } from "@/lib/db";

async function requirePrisma() {
  if (!(await isDatabaseReady())) throw new Error("DATABASE_UNAVAILABLE");
  const prisma = getPrisma();
  if (!prisma) throw new Error("DATABASE_UNAVAILABLE");
  return prisma;
}

function toOrder(row: {
  id: string;
  code: string;
  employerId: string;
  employerEmail: string;
  planId: string;
  planName: string;
  amount: number;
  originalAmount: number | null;
  promoCode: string | null;
  durationDays: number;
  cvLimit: number | null;
  status: string;
  createdAt: Date;
  paidAt: Date | null;
  expiresAt: Date;
  sepayTxnId: string | null;
  transferAmount: number | null;
  gateway: string | null;
}): PaymentOrder {
  return {
    id: row.id,
    code: row.code,
    employerId: row.employerId,
    employerEmail: row.employerEmail,
    planId: row.planId,
    planName: row.planName,
    amount: row.amount,
    originalAmount: row.originalAmount,
    promoCode: row.promoCode,
    durationDays: row.durationDays,
    cvLimit: row.cvLimit,
    status: row.status as PaymentOrder["status"],
    createdAt: row.createdAt.toISOString(),
    paidAt: row.paidAt?.toISOString() ?? null,
    expiresAt: row.expiresAt.toISOString(),
    sepayTxnId: row.sepayTxnId,
    transferAmount: row.transferAmount,
    gateway: row.gateway,
  };
}

export async function listPaymentOrders(): Promise<PaymentOrder[]> {
  try {
    const prisma = await requirePrisma();
    const rows = await prisma.paymentOrder.findMany({
      orderBy: { createdAt: "desc" },
      take: 500,
    });
    return rows.map(toOrder);
  } catch (err) {
    console.warn("[payments] listPaymentOrders failed", err);
    return [];
  }
}

export async function getOrderByCode(code: string): Promise<PaymentOrder | null> {
  try {
    const prisma = await requirePrisma();
    const row = await prisma.paymentOrder.findUnique({
      where: { code: code.toUpperCase() },
    });
    return row ? toOrder(row) : null;
  } catch (err) {
    console.warn("[payments] getOrderByCode failed", err);
    return null;
  }
}

export async function getOrderById(id: string): Promise<PaymentOrder | null> {
  try {
    const prisma = await requirePrisma();
    const row = await prisma.paymentOrder.findUnique({ where: { id } });
    return row ? toOrder(row) : null;
  } catch (err) {
    console.warn("[payments] getOrderById failed", err);
    return null;
  }
}

export async function saveOrder(order: PaymentOrder): Promise<PaymentOrder> {
  const prisma = await requirePrisma();
  const data = {
    id: order.id,
    code: order.code.toUpperCase(),
    employerId: order.employerId,
    employerEmail: order.employerEmail,
    planId: order.planId,
    planName: order.planName,
    amount: order.amount,
    originalAmount: order.originalAmount ?? null,
    promoCode: order.promoCode ?? null,
    durationDays: order.durationDays,
    cvLimit: order.cvLimit,
    status: order.status,
    createdAt: new Date(order.createdAt),
    paidAt: order.paidAt ? new Date(order.paidAt) : null,
    expiresAt: new Date(order.expiresAt),
    sepayTxnId: order.sepayTxnId,
    transferAmount: order.transferAmount,
    gateway: order.gateway,
  };
  await prisma.paymentOrder.upsert({
    where: { id: order.id },
    create: data,
    update: {
      code: data.code,
      employerId: data.employerId,
      employerEmail: data.employerEmail,
      planId: data.planId,
      planName: data.planName,
      amount: data.amount,
      originalAmount: data.originalAmount,
      promoCode: data.promoCode,
      durationDays: data.durationDays,
      cvLimit: data.cvLimit,
      status: data.status,
      paidAt: data.paidAt,
      expiresAt: data.expiresAt,
      sepayTxnId: data.sepayTxnId,
      transferAmount: data.transferAmount,
      gateway: data.gateway,
    },
  });
  return order;
}

export async function markSePayProcessed(txnId: string): Promise<void> {
  try {
    const prisma = await requirePrisma();
    await prisma.sePayProcessed.upsert({
      where: { id: String(txnId) },
      create: { id: String(txnId), at: new Date() },
      update: { at: new Date() },
    });
  } catch (err) {
    console.warn("[payments] markSePayProcessed failed", err);
  }
}

export async function wasSePayProcessed(txnId: string): Promise<boolean> {
  try {
    const prisma = await requirePrisma();
    const row = await prisma.sePayProcessed.findUnique({
      where: { id: String(txnId) },
    });
    return Boolean(row);
  } catch {
    return false;
  }
}

export async function listOrdersForEmployer(employerId: string): Promise<PaymentOrder[]> {
  try {
    const prisma = await requirePrisma();
    const rows = await prisma.paymentOrder.findMany({
      where: { employerId },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    return rows.map(toOrder);
  } catch (err) {
    console.warn("[payments] listOrdersForEmployer failed", err);
    return [];
  }
}
