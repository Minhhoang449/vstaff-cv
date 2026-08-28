import { EmployerPageShell } from "@/components/employer/employer-page-shell";
import { EmployerPlanCheckoutButton } from "@/components/employer/employer-plan-checkout-button";
import type { Metadata } from "next";
import Link from "next/link";
import { Check, Tag, X } from "lucide-react";
import { auth } from "@/auth";
import { formatVnd } from "@/data/employer-plans";
import { getPromotionByCode } from "@/lib/promotions";
import { listServicePlans } from "@/lib/service-plans";
import { isSePayCheckoutConfigured } from "@/lib/payments/config";
import { hasActivatedFreePlanToday } from "@/lib/payments/orders";
import {
  applyPromoToPrice,
  isPromoUsable,
  promoAppliesToPlan,
} from "@/lib/promo-pricing";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Bảng giá",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ promo?: string }>;

export default async function EmployerPricingPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  const sp = await searchParams;
  const promoParam = (sp.promo || "").trim().toUpperCase();
  const sepayReady = isSePayCheckoutConfigured();
  const [plans, promoRaw, freeLockedToday] = await Promise.all([
    listServicePlans(),
    promoParam ? getPromotionByCode(promoParam) : Promise.resolve(null),
    session?.user?.id
      ? hasActivatedFreePlanToday(session.user.id)
      : Promise.resolve(false),
  ]);

  const promo =
    promoRaw && isPromoUsable(promoRaw)
      ? promoRaw
      : promoParam && promoRaw
        ? promoRaw
        : null;
  const promoActive = Boolean(promo && isPromoUsable(promo));
  const promoInvalid = Boolean(promoParam && (!promoRaw || !isPromoUsable(promoRaw)));

  return (
    <EmployerPageShell>
      <div className="space-y-8">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Tài khoản
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-zinc-900">
            Bảng giá
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
            Chọn gói phù hợp để truy cập kho CV và công cụ headhunter. Thanh toán chuyển khoản qua
            SePay (VietQR) — gói tự kích hoạt khi nhận tiền.
          </p>
          {!sepayReady ? (
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Chưa cấu hình SePay bank account. Thêm{" "}
              <code className="font-mono text-xs">SEPAY_BANK_ACCOUNT</code>,{" "}
              <code className="font-mono text-xs">SEPAY_BANK_BIN</code> vào{" "}
              <code className="font-mono text-xs">.env.local</code> (xem{" "}
              <code className="font-mono text-xs">.env.example</code>).
            </p>
          ) : null}

          {promoActive && promo ? (
            <div className="mt-4 flex flex-wrap items-start justify-between gap-3 rounded-xl border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-4 py-3">
              <div className="min-w-0">
                <p className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-900">
                  <Tag className="h-4 w-4 text-[#8a6a28]" aria-hidden />
                  Đang áp dụng mã{" "}
                  <span className="font-mono tracking-wide">{promo.code}</span>
                </p>
                <p className="mt-1 text-sm text-zinc-600">
                  {promo.title} · {promo.discountLabel}
                  {promo.planIds?.length
                    ? ` · chỉ gói: ${plans
                        .filter((p) => promo.planIds!.includes(p.id))
                        .map((p) => p.name)
                        .join(", ") || promo.planIds.join(", ")}`
                    : " · mọi gói trả phí"}
                </p>
              </div>
              <Link
                href="/dashboard/employer/bang-gia"
                className="inline-flex items-center gap-1 text-xs font-semibold text-zinc-600 hover:text-zinc-900"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                Bỏ mã
              </Link>
            </div>
          ) : null}

          {promoInvalid ? (
            <p className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Mã <span className="font-mono font-semibold">{promoParam}</span> không còn hiệu lực
              hoặc không tồn tại.{" "}
              <Link
                href="/dashboard/employer/khuyen-mai"
                className="font-semibold underline underline-offset-2"
              >
                Xem khuyến mãi
              </Link>
            </p>
          ) : null}
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => {
            const applies =
              promoActive && promo ? promoAppliesToPlan(promo, plan.id) : false;
            const priced = applies ? applyPromoToPrice(plan.price, promo) : null;
            const showPromo = Boolean(priced?.applied);

            return (
              <article
                key={plan.id}
                className={cn(
                  "flex flex-col rounded-xl border bg-white p-6",
                  plan.highlight
                    ? "border-[var(--primary)] shadow-[0_0_0_1px_var(--primary)]"
                    : "border-[var(--border)]",
                  showPromo && "ring-1 ring-[var(--accent)]/50"
                )}
              >
                {showPromo ? (
                  <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[#8a6a28]">
                    Có mã KM
                  </p>
                ) : plan.highlight ? (
                  <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--primary)]">
                    Phổ biến nhất
                  </p>
                ) : plan.id === "free" ? (
                  <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-[var(--accent)]">
                    Bắt đầu miễn phí
                  </p>
                ) : (
                  <p className="mb-3 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-transparent">
                    —
                  </p>
                )}
                <h2 className="text-lg font-semibold text-zinc-900">{plan.name}</h2>
                <div className="mt-3">
                  {showPromo && priced ? (
                    <>
                      <p className="text-sm text-zinc-400 line-through tabular-nums">
                        {formatVnd(priced.originalAmount)}
                      </p>
                      <p className="font-display text-3xl font-medium tracking-tight text-zinc-900">
                        {formatVnd(priced.amount)}
                      </p>
                      <p className="mt-0.5 text-xs font-semibold text-[var(--primary)]">
                        Tiết kiệm {formatVnd(priced.saved)} · {promo!.code}
                      </p>
                    </>
                  ) : (
                    <p className="font-display text-3xl font-medium tracking-tight text-zinc-900">
                      {formatVnd(plan.price)}
                    </p>
                  )}
                </div>
                <p className="mt-1 text-sm text-zinc-500">
                  {plan.durationLabel} · {plan.cvLimitLabel}
                </p>

                <ul className="mt-6 flex-1 space-y-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-zinc-600">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-[var(--primary)]"
                        aria-hidden
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <EmployerPlanCheckoutButton
                  plan={plan}
                  highlight={plan.highlight}
                  promoCode={applies && promo ? promo.code : undefined}
                  displayAmount={showPromo && priced ? priced.amount : undefined}
                  freeLockedToday={plan.id === "free" ? freeLockedToday : false}
                />
              </article>
            );
          })}
        </div>

        <p className="text-sm text-zinc-500">
          Xem thêm mã ưu đãi tại{" "}
          <Link
            href="/dashboard/employer/khuyen-mai"
            className="font-semibold text-[var(--primary)] underline-offset-2 hover:underline"
          >
            Khuyến mãi
          </Link>
          .
        </p>

        <div className="overflow-x-auto rounded-lg border border-[var(--border)] bg-white">
          <table className="w-full min-w-[36rem] text-left text-sm">
            <thead className="bg-[var(--primary)] text-white">
              <tr>
                <th className="px-4 py-3 font-semibold">Gói dịch vụ</th>
                <th className="px-4 py-3 font-semibold">Thời hạn</th>
                <th className="px-4 py-3 font-semibold">Hạn mức</th>
                <th className="px-4 py-3 font-semibold">Giá</th>
              </tr>
            </thead>
            <tbody>
              {plans.map((plan, i) => {
                const applies =
                  promoActive && promo ? promoAppliesToPlan(promo, plan.id) : false;
                const priced = applies ? applyPromoToPrice(plan.price, promo) : null;
                return (
                  <tr
                    key={plan.id}
                    className={i % 2 === 0 ? "bg-[var(--primary)]/[0.04]" : "bg-white"}
                  >
                    <td className="px-4 py-3 font-medium text-zinc-900">{plan.name}</td>
                    <td className="px-4 py-3 text-zinc-600">{plan.durationLabel}</td>
                    <td className="px-4 py-3 text-zinc-600">{plan.cvLimitLabel}</td>
                    <td className="px-4 py-3 font-semibold text-zinc-900">
                      {priced?.applied ? (
                        <span className="inline-flex flex-col">
                          <span className="text-xs font-normal text-zinc-400 line-through">
                            {formatVnd(priced.originalAmount)}
                          </span>
                          {formatVnd(priced.amount)}
                        </span>
                      ) : (
                        formatVnd(plan.price)
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </EmployerPageShell>
  );
}
