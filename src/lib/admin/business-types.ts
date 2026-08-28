/** Shared admin business types (safe for client components). */

export type AdminEmployerStatus = "active" | "trial" | "expired" | "suspended";

export type AdminEmployerRow = {
  id: string;
  company: string;
  email: string;
  planId: string;
  planName: string;
  status: AdminEmployerStatus;
  cvUsed: number;
  cvLimit: number | null;
  activatedAt: string;
  phone?: string;
};

export function formatCvQuotaLabel(used: number, limit: number | null) {
  if (limit == null) return `${used.toLocaleString("vi-VN")} / ∞`;
  return `${used.toLocaleString("vi-VN")} / ${limit.toLocaleString("vi-VN")}`;
}

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
  badge?: string;
  body?: string;
  sortOrder?: number;
};

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
