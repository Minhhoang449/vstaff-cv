"use client";

import Link from "next/link";
import { Wallet } from "lucide-react";

function formatRevenueVnd(amount: number) {
  return `${new Intl.NumberFormat("vi-VN").format(amount)}₫`;
}

type Props = {
  amount: number;
  count: number;
  label: string;
};

export function AdminMonthlyRevenueBarClient({ amount, count, label }: Props) {
  return (
    <Link
      href="/dashboard/admin/doanh-thu"
      className="group flex min-w-0 max-w-full flex-1 items-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-50/90 px-2 py-1.5 transition hover:border-[var(--primary)]/35 hover:bg-[var(--primary)]/[0.04] sm:flex-none sm:gap-2.5 sm:px-3"
      title={`Doanh thu ${label} — xem thống kê`}
    >
      <Wallet className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden />
      <span className="hidden whitespace-nowrap text-[11px] font-semibold text-zinc-500 sm:inline">
        DT tháng
      </span>
      <span className="truncate tabular-nums text-xs font-semibold text-zinc-900">
        {formatRevenueVnd(amount)}
      </span>
      <span className="hidden h-3.5 w-px bg-zinc-200 md:block" aria-hidden />
      <span className="hidden whitespace-nowrap text-[11px] text-zinc-500 md:inline">
        {count} GD
      </span>
    </Link>
  );
}
