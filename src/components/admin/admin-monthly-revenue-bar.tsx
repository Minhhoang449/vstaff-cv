import Link from "next/link";
import { Wallet } from "lucide-react";
import { getAdminRevenueSnapshot } from "@/lib/admin-business";

function formatRevenueVnd(amount: number) {
  return `${new Intl.NumberFormat("vi-VN").format(amount)}₫`;
}

/** Doanh thu tháng hiện tại trên header admin — link sang trang thống kê. */
export async function AdminMonthlyRevenueBar() {
  const { currentMonth } = await getAdminRevenueSnapshot();
  const { amount, count, label } = currentMonth;

  return (
    <Link
      href="/dashboard/admin/doanh-thu"
      className="group flex min-w-0 max-w-full items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/90 px-2.5 py-1.5 transition hover:border-[var(--primary)]/35 hover:bg-[var(--primary)]/[0.04] sm:gap-2.5 sm:px-3"
      title={`Doanh thu ${label} — xem thống kê`}
    >
      <Wallet className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden />
      <span className="hidden whitespace-nowrap text-[11px] font-semibold text-zinc-500 sm:inline">
        DT tháng
      </span>
      <span className="tabular-nums text-xs font-semibold text-zinc-900">
        {formatRevenueVnd(amount)}
      </span>
      <span className="hidden h-3.5 w-px bg-zinc-200 md:block" aria-hidden />
      <span className="hidden whitespace-nowrap text-[11px] text-zinc-500 md:inline">
        {count} GD
      </span>
    </Link>
  );
}
