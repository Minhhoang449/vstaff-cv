import { AdminPageShell } from "@/components/admin/admin-page-shell";
import type { Metadata } from "next";
import Link from "next/link";
import {
  ADMIN_ACTIVATIONS,
  ADMIN_EMPLOYERS,
  ADMIN_PROMOS,
  formatAdminDateTime,
} from "@/data/admin-demo";
import { listCandidates } from "@/lib/candidates";
import { listEmailCampaigns } from "@/lib/email/store";
import { EMPLOYER_PLANS } from "@/data/employer-plans";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Tổng quan Admin",
  robots: { index: false, follow: false },
};

export default async function AdminOverviewPage() {
  const candidates = await listCandidates({ page: 1 });
  const activeEmployers = ADMIN_EMPLOYERS.filter(
    (e) => e.status === "active" || e.status === "trial"
  ).length;
  const activePlans = ADMIN_ACTIVATIONS.filter((a) => a.status === "active").length;
  const activePromos = ADMIN_PROMOS.filter((p) => p.status === "active").length;
  const recentEmails = (await listEmailCampaigns()).slice(0, 4);

  const stats = [
    {
      label: "Ứng viên (kho)",
      value: candidates.total.toLocaleString("vi-VN"),
      href: "/dashboard/admin/ung-vien",
    },
    {
      label: "NTD đang hoạt động",
      value: activeEmployers.toLocaleString("vi-VN"),
      href: "/dashboard/admin/nha-tuyen-dung",
    },
    {
      label: "Gói đang kích hoạt",
      value: activePlans.toLocaleString("vi-VN"),
      href: "/dashboard/admin/goi-dich-vu",
    },
    {
      label: "Khuyến mãi đang chạy",
      value: activePromos.toLocaleString("vi-VN"),
      href: "/dashboard/admin/khuyen-mai",
    },
  ];

  return (
    <AdminPageShell>
      <div className="space-y-8">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Dashboard
          </p>
          <h1 className="mt-2 font-display text-2xl font-medium tracking-tight text-zinc-900 sm:text-3xl">
            Tổng quan quản trị
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
            Theo dõi kho CV, nhà tuyển dụng, gói dịch vụ và hoạt động gửi email trên nền tảng.
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((s) => (
            <li key={s.label}>
              <Link
                href={s.href}
                className="block rounded-xl border border-[var(--border)] bg-white p-4 transition hover:border-[var(--primary)]/40"
              >
                <p className="text-xs font-medium text-zinc-500">{s.label}</p>
                <p className="mt-2 font-display text-2xl font-medium tracking-tight text-zinc-900">
                  {s.value}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-lg border border-[var(--border)] bg-white">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3 sm:px-5">
              <h2 className="text-sm font-semibold text-zinc-800">Gói dịch vụ</h2>
              <Link
                href="/dashboard/admin/goi-dich-vu"
                className="text-xs font-semibold text-[var(--primary)] hover:underline"
              >
                Chi tiết
              </Link>
            </div>
            <ul className="divide-y divide-[var(--border)]">
              {EMPLOYER_PLANS.map((plan) => (
                <li
                  key={plan.id}
                  className="flex items-center justify-between gap-3 px-4 py-3.5 sm:px-5"
                >
                  <span>
                    <span className="block text-sm font-semibold text-zinc-900">{plan.name}</span>
                    <span className="mt-0.5 block text-xs text-zinc-500">
                      {plan.durationLabel} · {plan.cvLimitLabel}
                    </span>
                  </span>
                  <span className="text-sm font-semibold text-zinc-800">
                    {plan.price === 0 ? "Miễn phí" : `${plan.price.toLocaleString("vi-VN")}₫`}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-lg border border-[var(--border)] bg-white">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3 sm:px-5">
              <h2 className="text-sm font-semibold text-zinc-800">Email gần đây</h2>
              <Link
                href="/dashboard/admin/email"
                className="text-xs font-semibold text-[var(--primary)] hover:underline"
              >
                Xem tất cả
              </Link>
            </div>
            <ul className="divide-y divide-[var(--border)]">
              {recentEmails.length === 0 ? (
                <li className="px-4 py-6 text-sm text-zinc-500 sm:px-5">
                  Chưa có chiến dịch email.
                </li>
              ) : (
                recentEmails.map((row) => (
                  <li key={row.id} className="px-4 py-3.5 sm:px-5">
                    <p className="text-sm font-semibold text-zinc-900">
                      {row.testMode ? `[Thử] ${row.subject}` : row.subject}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {row.employerEmail || row.employerId} · {row.recipientCount} người nhận ·{" "}
                      <span
                        className={cn(
                          row.status === "failed" ? "text-red-600" : "text-zinc-500"
                        )}
                      >
                        {row.status}
                      </span>{" "}
                      · {formatAdminDateTime(row.sentAt)}
                    </p>
                  </li>
                ))
              )}
            </ul>
          </section>
        </div>
      </div>
    </AdminPageShell>
  );
}
