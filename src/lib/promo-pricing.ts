/** Client-safe promo pricing helpers */

export type PromoDiscountType = "percent" | "fixed_price" | "fixed_off";

export type PromoPricingInput = {
  code: string;
  discountLabel: string;
  status?: string;
  expiresAt?: string;
  planIds?: string[];
  discountType?: PromoDiscountType;
  discountValue?: number;
};

export function isPromoUsable(promo: PromoPricingInput, now = Date.now()) {
  if (promo.status && promo.status !== "active") return false;
  if (promo.expiresAt && new Date(promo.expiresAt).getTime() < now) return false;
  return true;
}

export function promoAppliesToPlan(promo: PromoPricingInput, planId: string) {
  if (planId === "free") return false;
  const ids = promo.planIds?.filter(Boolean) ?? [];
  if (ids.length === 0) return true;
  return ids.includes(planId);
}

function parseVnMoney(label: string): number | null {
  const cleaned = label.replace(/[^\d]/g, "");
  if (!cleaned) return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

export function resolveDiscount(promo: PromoPricingInput): {
  type: PromoDiscountType;
  value: number;
} {
  if (promo.discountType && promo.discountValue != null && promo.discountValue >= 0) {
    return { type: promo.discountType, value: promo.discountValue };
  }
  const label = (promo.discountLabel || "").trim();
  const percent = label.match(/^-?\s*(\d+(?:[.,]\d+)?)\s*%$/);
  if (percent) {
    return { type: "percent", value: Number(percent[1].replace(",", ".")) };
  }
  const money = parseVnMoney(label);
  if (money != null) {
    // Nhãn kiểu "399.000₫" = giá cố định sau KM
    return { type: "fixed_price", value: money };
  }
  return { type: "percent", value: 0 };
}

export function applyPromoToPrice(basePrice: number, promo: PromoPricingInput | null | undefined) {
  if (!promo || basePrice <= 0) {
    return { amount: basePrice, originalAmount: basePrice, saved: 0, applied: false };
  }
  const { type, value } = resolveDiscount(promo);
  let amount = basePrice;
  if (type === "percent" && value > 0) {
    amount = Math.round(basePrice * (1 - Math.min(100, value) / 100));
  } else if (type === "fixed_price" && value >= 0) {
    amount = value;
  } else if (type === "fixed_off" && value > 0) {
    amount = Math.max(0, basePrice - value);
  }
  amount = Math.max(0, Math.round(amount));
  const saved = Math.max(0, basePrice - amount);
  return {
    amount,
    originalAmount: basePrice,
    saved,
    applied: saved > 0 || amount !== basePrice,
  };
}
