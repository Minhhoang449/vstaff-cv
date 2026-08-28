import { AdminPageShell } from "@/components/admin/admin-page-shell";
import type { Metadata } from "next";
import { formatAdminDate } from "@/lib/admin/business-types";
import { formatVnd } from "@/data/employer-plans";
import { getAdminRevenueSnapshot } from "@/lib/admin-business";

export const metadata: Metadata = {
  title: "Thống kê doanh thu",
  robots: { index: false, follow: false },
};

export default async function AdminRevenuePage() {
  const { monthly, byPlan, recognized: transactions, currentMonth } =
    await getAdminRevenueSnapshot();

  const totalRevenue = transactions.reduce((sum, r) => sum + r.amount, 0);
  const maxMonth = Math.max(...monthly.map((m) => m.amount), 1);

  return (
    <AdminPageShell>
      <div className="space-y-6">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Kinh doanh
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-zinc-900">
            Thống kê doanh thu
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
            Doanh thu từ đơn SePay đã thanh toán trên Postgres (PaymentOrder).
          </p>
        </div>

        <ul className="grid gap-3 sm:grid-cols-3">
          <li className="rounded-xl border border-[var(--border)] bg-white p-4">
            <p className="text-xs font-medium text-zinc-500">Tổng doanh thu</p>
            <p className="mt-2 font-display text-2xl font-medium tracking-tight text-zinc-900">
              {formatVnd(totalRevenue)}
            </p>
          </li>
          <li className="rounded-xl border border-[var(--border)] bg-white p-4">
            <p className="text-xs font-medium text-zinc-500">Tháng này</p>
            <p className="mt-2 font-display text-2xl font-medium tracking-tight text-zinc-900">
              {formatVnd(currentMonth.amount)}
            </p>
            <p className="mt-1 text-xs text-zinc-500">{currentMonth.count} giao dịch</p>
          </li>
          <li className="rounded-xl border border-[var(--border)] bg-white p-4">
            <p className="text-xs font-medium text-zinc-500">Số giao dịch</p>
            <p className="mt-2 font-display text-2xl font-medium tracking-tight text-zinc-900">
              {transactions.length.toLocaleString("vi-VN")}
            </p>
          </li>
        </ul>

        <div className="grid gap-6 xl:grid-cols-2">
          <section className="rounded-xl border border-[var(--border)] bg-white p-5">
            <h2 className="text-sm font-semibold text-zinc-800">Doanh thu 6 tháng gần đây</h2>
            <ul className="mt-4 space-y-3">
              {monthly.map((m) => (
                <li key={m.key}>
                  <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                    <span className="font-medium text-zinc-700">{m.label}</span>
                    <span className="tabular-nums text-zinc-800">{formatVnd(m.amount)}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-[var(--primary)]"
                      style={{ width: `${Math.round((m.amount / maxMonth) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-white p-5">
            <h2 className="text-sm font-semibold text-zinc-800">Theo gói dịch vụ</h2>
            <ul className="mt-4 divide-y divide-zinc-100">
              {byPlan.map((row) => (
                <li
                  key={row.planName}
                  className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span>
                    <span className="block text-sm font-semibold text-zinc-900">{row.planName}</span>
                    <span className="mt-0.5 block text-xs text-zinc-500">
                      {row.count} lần kích hoạt
                    </span>
                  </span>
                  <span className="text-sm font-semibold tabular-nums text-zinc-900">
                    {formatVnd(row.amount)}
                  </span>
                </li>
              ))}
              {byPlan.length === 0 ? (
                <li className="py-6 text-center text-sm text-zinc-500">Chưa có doanh thu</li>
              ) : null}
            </ul>
          </section>
        </div>

        <section className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
          <div className="border-b border-zinc-100 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-semibold text-zinc-800">Giao dịch gần đây</h2>
          </div>
          <div className="overflow-x-auto">
            {transactions.length === 0 ? (
              <div className="px-5 py-12 text-center text-sm text-zinc-500">
                Chưa có giao dịch thanh toán.
              </div>
            ) : (
              <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/80 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                    <th className="px-4 py-3 font-semibold sm:px-5">Ngày</th>
                    <th className="px-3 py-3 font-semibold">Công ty</th>
                    <th className="px-3 py-3 font-semibold">Gói</th>
                    <th className="px-3 py-3 font-semibold">Mã KM</th>
                    <th className="px-4 py-3 text-right font-semibold sm:px-5">Số tiền</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {transactions.map((row) => (
                    <tr key={row.id} className="bg-white">
                      <td className="px-4 py-3.5 text-zinc-600 sm:px-5">
                        {formatAdminDate(row.activatedAt)}
                      </td>
                      <td className="px-3 py-3.5 font-medium text-zinc-900">{row.company}</td>
                      <td className="px-3 py-3.5 text-zinc-700">{row.planName}</td>
                      <td className="px-3 py-3.5 font-mono text-xs text-zinc-600">
                        {row.promoCode ?? "—"}
                      </td>
                      <td className="px-4 py-3.5 text-right font-semibold tabular-nums text-zinc-900 sm:px-5">
                        {formatVnd(row.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </AdminPageShell>
  );
}
