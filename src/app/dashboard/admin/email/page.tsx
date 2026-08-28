import { AdminPageShell } from "@/components/admin/admin-page-shell";
import type { Metadata } from "next";
import { formatAdminDateTime } from "@/data/admin-demo";
import { listEmailCampaigns } from "@/lib/email/store";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Email Admin",
  robots: { index: false, follow: false },
};

const STATUS_STYLE = {
  sent: {
    label: "Đã gửi",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70",
  },
  partial: {
    label: "Gửi một phần",
    className: "bg-amber-50 text-amber-800 ring-1 ring-amber-200/70",
  },
  scheduled: {
    label: "Đã lên lịch",
    className: "bg-sky-50 text-sky-700 ring-1 ring-sky-200/70",
  },
  draft: { label: "Nháp", className: "bg-zinc-100 text-zinc-600" },
  failed: {
    label: "Gửi lỗi",
    className: "bg-red-50 text-red-700 ring-1 ring-red-200/70",
  },
} as const;

export default async function AdminEmailPage() {
  const campaigns = await listEmailCampaigns();

  return (
    <AdminPageShell>
      <div className="space-y-5">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Kinh doanh
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-zinc-900">
            Email
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
            Chiến dịch email do nhà tuyển dụng gửi trên hệ thống.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
          {campaigns.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <p className="text-sm font-medium text-zinc-800">Chưa có chiến dịch email</p>
              <p className="mt-1 text-sm text-zinc-500">
                Khi NTD gửi email, chiến dịch sẽ xuất hiện tại đây.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-100 bg-zinc-50/80 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                    <th className="min-w-[16rem] px-4 py-3 font-semibold sm:px-5">Tiêu đề</th>
                    <th className="min-w-[10rem] px-3 py-3 font-semibold">NTD</th>
                    <th className="min-w-[6rem] px-3 py-3 font-semibold">Người nhận</th>
                    <th className="min-w-[7rem] px-3 py-3 font-semibold">Trạng thái</th>
                    <th className="min-w-[9rem] px-4 py-3 font-semibold sm:px-5">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {campaigns.map((row) => {
                    const status =
                      STATUS_STYLE[row.status as keyof typeof STATUS_STYLE] ?? STATUS_STYLE.failed;
                    return (
                      <tr key={row.id} className="bg-white transition hover:bg-zinc-50/70">
                        <td className="px-4 py-4 font-semibold text-zinc-900 sm:px-5">
                          {row.testMode ? `[Thử] ${row.subject}` : row.subject}
                          {row.fromName ? (
                            <p className="mt-0.5 text-xs font-normal text-zinc-400">
                              Từ: {row.fromName}
                            </p>
                          ) : null}
                        </td>
                        <td className="px-3 py-4 text-zinc-600">{row.employerEmail || row.employerId}</td>
                        <td className="px-3 py-4 tabular-nums text-zinc-800">
                          {row.recipientCount.toLocaleString("vi-VN")}
                        </td>
                        <td className="px-3 py-4">
                          <span
                            className={cn(
                              "inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold",
                              status.className
                            )}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-zinc-600 sm:px-5">
                          {formatAdminDateTime(row.sentAt)}
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
    </AdminPageShell>
  );
}
