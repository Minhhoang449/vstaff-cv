import { cn } from "@/lib/utils";
import { EmployerEmailRowActions } from "@/components/employer/employer-email-row-actions";

export type EmailCampaignStatus = "sent" | "partial" | "scheduled" | "draft" | "failed";

export type EmailCampaignRow = {
  id: string;
  subject: string;
  fromName: string;
  audience: "saved" | "opened" | "list";
  status: EmailCampaignStatus;
  recipientCount: number;
  sentAt: string;
  testMode?: boolean;
  previewUrls?: string[];
};

const AUDIENCE_LABEL: Record<EmailCampaignRow["audience"], string> = {
  saved: "Đã lưu",
  opened: "Đã mở",
  list: "Gửi hàng ngày",
};

const STATUS_STYLE: Record<
  EmailCampaignStatus,
  { label: string; className: string }
> = {
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
  draft: {
    label: "Nháp",
    className: "bg-zinc-100 text-zinc-600",
  },
  failed: {
    label: "Gửi lỗi",
    className: "bg-red-50 text-red-700 ring-1 ring-red-200/70",
  },
};

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

type Props = {
  items: EmailCampaignRow[];
};

export function EmployerEmailTable({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm font-medium text-zinc-800">Chưa có chiến dịch email</p>
        <p className="mt-1 max-w-sm text-sm text-zinc-500">
          Bấm &quot;Soạn email&quot; để tạo chiến dịch gửi đồng loạt tới ứng viên.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-100 bg-zinc-50/80 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            <th className="min-w-[14rem] px-4 py-3 font-semibold sm:px-5">Tiêu đề</th>
            <th className="min-w-[8rem] px-3 py-3 font-semibold">Đối tượng</th>
            <th className="min-w-[6rem] px-3 py-3 font-semibold">Người nhận</th>
            <th className="min-w-[7rem] px-3 py-3 font-semibold">Trạng thái</th>
            <th className="min-w-[9rem] px-3 py-3 font-semibold">Thời gian</th>
            <th className="w-[6rem] px-4 py-3 text-right font-semibold sm:px-5">
              <span className="sr-only">Hành động</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {items.map((row) => {
            const status = STATUS_STYLE[row.status];
            return (
              <tr key={row.id} className="bg-white transition hover:bg-zinc-50/70">
                <td className="px-4 py-4 align-middle sm:px-5">
                  <p className="font-semibold text-zinc-900">{row.subject}</p>
                  <p className="mt-0.5 text-xs text-zinc-400">Từ: {row.fromName || "—"}</p>
                </td>
                <td className="px-3 py-4 align-middle text-zinc-600">
                  {AUDIENCE_LABEL[row.audience]}
                </td>
                <td className="px-3 py-4 align-middle tabular-nums text-zinc-800">
                  {row.recipientCount.toLocaleString("vi-VN")}
                </td>
                <td className="px-3 py-4 align-middle">
                  <span
                    className={cn(
                      "inline-flex rounded-md px-1.5 py-0.5 text-[11px] font-medium",
                      status.className
                    )}
                  >
                    {status.label}
                  </span>
                </td>
                <td className="px-3 py-4 align-middle text-zinc-600">
                  {formatWhen(row.sentAt)}
                </td>
                <td className="px-4 py-4 align-middle sm:px-5">
                  <div className="flex justify-end">
                    <EmployerEmailRowActions row={row} />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
