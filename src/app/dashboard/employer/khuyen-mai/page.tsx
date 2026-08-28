import { EmployerPageShell } from "@/components/employer/employer-page-shell";
import type { Metadata } from "next";
import Link from "next/link";
import { BadgePercent, Clock, Tag } from "lucide-react";
import { EMPLOYER_PLANS } from "@/data/employer-plans";
import { listPromotions } from "@/lib/promotions";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Khuyến mãi",
  robots: { index: false, follow: false },
};

const STATUS_STYLE = {
  active: {
    label: "Đang diễn ra",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70",
  },
  upcoming: {
    label: "Sắp mở",
    className: "bg-sky-50 text-sky-700 ring-1 ring-sky-200/70",
  },
  ended: {
    label: "Đã kết thúc",
    className: "bg-zinc-100 text-zinc-500",
  },
} as const;

const PLAN_NAME = new Map(EMPLOYER_PLANS.map((p) => [p.id, p.name]));

function formatExpiry(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function planLabel(planIds?: string[]) {
  if (!planIds?.length) return "Mọi gói trả phí";
  return planIds.map((id) => PLAN_NAME.get(id) || id).join(", ");
}

export default async function EmployerPromotionsPage() {
  const promos = await listPromotions();

  return (
    <EmployerPageShell>
      <div className="space-y-8">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Tài khoản
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-zinc-900">
            Khuyến mãi
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
            Chọn mã để chuyển sang Bảng giá với ưu đãi đã gắn sẵn — thanh toán sẽ trừ đúng giá sau
            giảm.
          </p>
        </div>

        {promos.length === 0 ? (
          <div className="rounded-xl border border-[var(--border)] bg-white px-6 py-14 text-center text-sm text-zinc-500">
            Chưa có chương trình khuyến mãi.
          </div>
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {promos.map((promo) => {
              const status = STATUS_STYLE[promo.status];
              const ended = promo.status === "ended";
              const usable = promo.status === "active";
              const href = usable
                ? `/dashboard/employer/bang-gia?promo=${encodeURIComponent(promo.code)}`
                : "/dashboard/employer/bang-gia";

              return (
                <li
                  key={promo.id}
                  className={cn(
                    "flex flex-col rounded-xl border bg-white p-5",
                    promo.status === "active"
                      ? "border-[var(--accent)]/40"
                      : "border-[var(--border)]",
                    ended && "opacity-75"
                  )}
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--accent)]/15 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-[#8a6a28]">
                      <BadgePercent className="h-3 w-3" aria-hidden />
                      {promo.badge}
                    </span>
                    <span
                      className={cn(
                        "inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold",
                        status.className
                      )}
                    >
                      {status.label}
                    </span>
                  </div>

                  <h2 className="mt-3 text-base font-semibold text-zinc-900">{promo.title}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{promo.body}</p>
                  <p className="mt-2 text-xs text-zinc-500">
                    Áp dụng: <span className="font-medium text-zinc-700">{planLabel(promo.planIds)}</span>
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-2.5 py-1.5 font-mono text-xs font-semibold tracking-wide text-zinc-800">
                      <Tag className="h-3.5 w-3.5 text-zinc-500" aria-hidden />
                      {promo.code}
                    </span>
                    <span className="font-semibold text-[var(--primary)]">
                      {promo.discountLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-zinc-500">
                      <Clock className="h-3.5 w-3.5" aria-hidden />
                      Hết hạn {formatExpiry(promo.expiresAt)}
                    </span>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link
                      href={href}
                      className={cn(
                        "inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold transition",
                        usable
                          ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-92"
                          : ended
                            ? "pointer-events-none border border-zinc-200 text-zinc-400"
                            : "border border-[var(--border)] text-zinc-600 hover:bg-zinc-50"
                      )}
                    >
                      {usable ? "Dùng mã trên Bảng giá" : "Xem bảng giá"}
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </EmployerPageShell>
  );
}
