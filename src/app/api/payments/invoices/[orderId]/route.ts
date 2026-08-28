import { NextResponse } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import { auth } from "@/auth";
import {
  PaymentInvoicePdf,
  type PaymentInvoicePdfData,
} from "@/components/payments/payment-invoice-pdf";
import { formatVnd, EMPLOYER_PLANS } from "@/data/employer-plans";
import { getCvBrandLogoSrc } from "@/lib/cv/cv-brand-logo";
import { registerCvPdfFonts } from "@/lib/cv/register-cv-fonts";
import { getEmployerCompanyProfile } from "@/lib/employer-profile";
import { getOrderById } from "@/lib/payments/store";

export const runtime = "nodejs";

type Params = Promise<{ orderId: string }>;

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function durationLabel(days: number, planId: string) {
  if (planId === "free" || !days || days <= 0) {
    const plan = EMPLOYER_PLANS.find((p) => p.id === planId);
    return plan?.durationLabel || "Không thời hạn";
  }
  if (days % 30 === 0) return `${days / 30} tháng`;
  return `${days} ngày`;
}

function cvLimitLabel(order: { planId: string; cvLimit: number | null }) {
  const plan = EMPLOYER_PLANS.find((p) => p.id === order.planId);
  if (plan?.cvPerDay != null && plan.cvPerDay > 0) {
    return plan.cvLimitLabel || `${plan.cvPerDay} CV / ngày`;
  }
  if (order.cvLimit == null) return plan?.cvLimitLabel || "Không giới hạn CV";
  return `${order.cvLimit.toLocaleString("vi-VN")} CV`;
}

function invoiceFilename(code: string) {
  const safe = code.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 32) || "order";
  return `Hoa-don-Vstaff-${safe}.pdf`;
}

export async function GET(_req: Request, ctx: { params: Params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { orderId } = await ctx.params;
  const order = await getOrderById(orderId);
  if (!order) {
    return NextResponse.json({ error: "Không tìm thấy đơn." }, { status: 404 });
  }

  if (order.employerId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (order.status !== "paid") {
    return NextResponse.json(
      { error: "Chỉ tải hóa đơn cho đơn đã thanh toán thành công." },
      { status: 400 }
    );
  }

  const profile = await getEmployerCompanyProfile(order.employerId);
  const paidAt = order.paidAt || order.createdAt;
  const original =
    order.originalAmount != null && order.originalAmount > order.amount
      ? order.originalAmount
      : null;
  const saved = original != null ? original - order.amount : null;

  const data: PaymentInvoicePdfData = {
    invoiceNo: `HD-${order.code}`,
    orderCode: order.code,
    issuedAt: formatDateTime(new Date().toISOString()),
    paidAt: formatDateTime(paidAt),
    buyerName: profile.companyName || session.user.name || "Nhà tuyển dụng",
    buyerEmail: profile.email || order.employerEmail || session.user.email || "",
    buyerAddress: [profile.address, profile.province].filter(Boolean).join(", ") || undefined,
    buyerPhone: profile.phone || undefined,
    planName: order.planName,
    durationLabel: durationLabel(order.durationDays, order.planId),
    cvLimitLabel: cvLimitLabel(order),
    amount: order.amount,
    originalAmount: original,
    promoCode: order.promoCode ?? null,
    amountLabel: formatVnd(order.amount),
    originalAmountLabel: original != null ? formatVnd(original) : null,
    savedLabel: saved != null && saved > 0 ? formatVnd(saved) : null,
    sepayTxnId: order.sepayTxnId,
    gateway: order.gateway,
    logoSrc: getCvBrandLogoSrc(),
  };

  registerCvPdfFonts();
  const doc = createElement(PaymentInvoicePdf, {
    data,
  }) as unknown as ReactElement<DocumentProps>;
  const buffer = await renderToBuffer(doc);
  const filename = invoiceFilename(order.code);

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
