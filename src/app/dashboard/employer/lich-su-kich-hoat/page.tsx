import { EmployerPageShell } from "@/components/employer/employer-page-shell";
import { EmployerInvoiceDownloadButton } from "@/components/employer/employer-invoice-download-button";
import type { Metadata } from "next";
import Link from "next/link";
import { CreditCard } from "lucide-react";
import { auth } from "@/auth";
import { formatVnd, EMPLOYER_PLANS } from "@/data/employer-plans";
import { getEmployerSubscriptionState } from "@/lib/employer-unlocks";
import { listOrdersForEmployer } from "@/lib/payments/store";
import type { PaymentOrder } from "@/lib/payments/types";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Lịch sử kích hoạt",
  robots: { index: false, follow: false },
};

type ActivationStatus = "active" | "expired" | "pending" | "cancelled";

type ActivationRow = {
  id: string;
  planId: string;
  planName: string;
  amount: number;
  promoCode: string | null;
  activatedAt: string;
  expiresAt: string;
  status: ActivationStatus;
  cvUsed: number;
  cvLimit: number | null;
  /** Đơn SePay/Free đã paid — cho phép tải hóa đơn */
  canDownloadInvoice: boolean;
};

const STATUS_STYLE: Record<ActivationStatus, { label: string; className: string }> = {
  active: {
    label: "Đang dùng",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70",
  },
  expired: {
    label: "Hết hạn",
    className: "bg-zinc-100 text-zinc-600",
  },
  pending: {
    label: "Chờ thanh toán",
    className: "bg-amber-50 text-amber-800 ring-1 ring-amber-200/70",
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-red-50 text-red-700 ring-1 ring-red-200/70",
  },
};

function addDays(iso: string, days: number) {
  const t = new Date(iso).getTime() + days * 24 * 60 * 60 * 1000;
  return new Date(t).toISOString();
}

function orderToRow(
  order: PaymentOrder,
  currentPlanId: string | undefined,
  currentCvUsed: number
): ActivationRow {
  const now = Date.now();
  let status: ActivationStatus = "pending";
  let activatedAt = order.createdAt;
  let expiresAt = order.expiresAt;

  if (order.status === "cancelled") {
    status = "cancelled";
  } else if (order.status === "paid") {
    activatedAt = order.paidAt || order.createdAt;
    expiresAt =
      order.durationDays > 0
        ? addDays(activatedAt, order.durationDays)
        : addDays(activatedAt, 3650);
    const expMs = new Date(expiresAt).getTime();
    status = expMs < now ? "expired" : "active";
    if (status === "active" && currentPlanId && order.planId !== currentPlanId) {
      status = "expired";
    }
  } else {
    status = "pending";
    if (new Date(order.expiresAt).getTime() < now) status = "cancelled";
  }

  return {
    id: order.id,
    planId: order.planId,
    planName: order.planName,
    amount: order.amount,
    promoCode: order.promoCode ?? null,
    activatedAt,
    expiresAt,
    status,
    cvUsed: status === "active" ? currentCvUsed : 0,
    cvLimit: order.cvLimit,
    canDownloadInvoice: order.status === "paid",
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatCvQuotaRow(row: ActivationRow) {
  const plan = EMPLOYER_PLANS.find((p) => p.id === row.planId);
  // Free: hạn mức theo ngày (cvPerDay), không phải tổng gói không giới hạn
  if (row.planId === "free" || (plan?.cvPerDay != null && plan.cvPerDay > 0)) {
    return plan?.cvLimitLabel || `${plan?.cvPerDay ?? 2} CV / ngày`;
  }
  if (row.cvLimit == null) {
    return `${row.cvUsed.toLocaleString("vi-VN")} / Không giới hạn`;
  }
  return `${row.cvUsed.toLocaleString("vi-VN")} / ${row.cvLimit.toLocaleString("vi-VN")}`;
}

export default async function EmployerActivationHistoryPage() {
  const session = await auth();
  const employerId = session?.user?.id ?? "";
  const [orders, sub] = await Promise.all([
    employerId ? listOrdersForEmployer(employerId) : Promise.resolve([]),
    getEmployerSubscriptionState(employerId || undefined),
  ]);

  const items = orders.map((o) =>
    orderToRow(o, sub?.planId ?? "", sub?.cvUsed ?? 0)
  );

  return (
    <EmployerPageShell>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Tài khoản
            </p>
            <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-zinc-900">
              Lịch sử kích hoạt
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
              Lịch sử mua và kích hoạt gói dịch vụ của tài khoản. Đơn thanh toán thành công có thể tải
              hóa đơn PDF.
            </p>
          </div>
          <Link
            href="/dashboard/employer/bang-gia"
            className="inline-flex h-10 items-center gap-1.5 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-92"
          >
            <CreditCard className="h-4 w-4" aria-hidden />
            Chọn gói mới
          </Link>
        </div>

        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <p className="text-sm font-medium text-zinc-800">Chưa có lần kích hoạt nào</p>
              <p className="mt-1 max-w-sm text-sm text-zinc-500">
                Khi bạn chọn và thanh toán gói, lịch sử sẽ hiện tại đây.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[58rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/80 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                    <th className="min-w-[9rem] px-4 py-3 font-semibold sm:px-5">Gói</th>
                    <th className="min-w-[7rem] px-3 py-3 font-semibold">Số tiền</th>
                    <th className="min-w-[7rem] px-3 py-3 font-semibold">Mã KM</th>
                    <th className="min-w-[8rem] px-3 py-3 font-semibold">Kích hoạt</th>
                    <th className="min-w-[8rem] px-3 py-3 font-semibold">Hết hạn</th>
                    <th className="min-w-[9rem] px-3 py-3 font-semibold">Hạn mức CV</th>
                    <th className="min-w-[8rem] px-3 py-3 font-semibold">Trạng thái</th>
                    <th className="min-w-[7rem] px-4 py-3 text-right font-semibold sm:px-5">
                      Hóa đơn
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {items.map((row) => {
                    const status = STATUS_STYLE[row.status];
                    return (
                      <tr key={row.id} className="bg-white transition hover:bg-zinc-50/70">
                        <td className="px-4 py-4 align-middle font-semibold text-zinc-900 sm:px-5">
                          {row.planName}
                        </td>
                        <td className="px-3 py-4 align-middle tabular-nums text-zinc-800">
                          {formatVnd(row.amount)}
                        </td>
                        <td className="px-3 py-4 align-middle">
                          {row.promoCode ? (
                            <span className="font-mono text-xs font-medium text-zinc-700">
                              {row.promoCode}
                            </span>
                          ) : (
                            <span className="text-zinc-400">—</span>
                          )}
                        </td>
                        <td className="px-3 py-4 align-middle text-zinc-600">
                          {formatDate(row.activatedAt)}
                        </td>
                        <td className="px-3 py-4 align-middle text-zinc-600">
                          {formatDate(row.expiresAt)}
                        </td>
                        <td className="px-3 py-4 align-middle tabular-nums text-zinc-700">
                          {formatCvQuotaRow(row)}
                        </td>
                        <td className="px-3 py-4 align-middle">
                          <span
                            className={cn(
                              "inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold",
                              status.className
                            )}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 align-middle sm:px-5">
                          {row.canDownloadInvoice ? (
                            <EmployerInvoiceDownloadButton orderId={row.id} />
                          ) : (
                            <span className="block text-right text-xs text-zinc-400">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </EmployerPageShell>
  );
}
