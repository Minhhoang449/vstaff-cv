"use client";

import { useRouter } from "next/navigation";
import { Download, Filter, Search } from "lucide-react";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { ProDropdown } from "@/components/ui/pro-dropdown";
import type { EmailCampaignRow } from "@/components/employer/employer-email-table";

export type EmailFilterValues = {
  q?: string;
  status?: string;
  audience?: string;
};

type Props = {
  values: EmailFilterValues;
  total: number;
  items?: EmailCampaignRow[];
  basePath?: string;
};

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "sent", label: "Đã gửi" },
  { value: "partial", label: "Gửi một phần" },
  { value: "failed", label: "Gửi lỗi" },
];

const AUDIENCE_OPTIONS = [
  { value: "", label: "Tất cả đối tượng" },
  { value: "opened", label: "Đã mở" },
];

const AUDIENCE_LABEL: Record<string, string> = {
  opened: "Đã mở",
  saved: "Đã lưu",
  list: "Gửi hàng ngày",
};

const STATUS_LABEL: Record<string, string> = {
  sent: "Đã gửi",
  partial: "Gửi một phần",
  failed: "Gửi lỗi",
  draft: "Nháp",
  scheduled: "Đã lên lịch",
};

export function EmployerEmailToolbar({
  values,
  total,
  items = [],
  basePath = "/dashboard/employer/email",
}: Props) {
  const router = useRouter();

  function push(next: EmailFilterValues) {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  function exportCsv() {
    const headers = ["Tiêu đề", "Từ", "Đối tượng", "Người nhận", "Trạng thái", "Thời gian"];
    const rows = items.map((row) => [
      row.subject,
      row.fromName || "",
      AUDIENCE_LABEL[row.audience] || row.audience,
      row.recipientCount,
      STATUS_LABEL[row.status] || row.status,
      new Date(row.sentAt).toLocaleString("vi-VN"),
    ]);
    downloadCsv(`lich-su-email-${total}.csv`, buildCsv(headers, rows));
  }

  return (
    <div className="border-b border-zinc-100 bg-white px-4 py-3 sm:px-5">
      <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap lg:gap-2.5">
        <div className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-zinc-800">
          <Filter className="h-4 w-4 text-[var(--primary)]" aria-hidden />
          <span className="hidden sm:inline">Bộ lọc</span>
        </div>

        <div className="relative min-w-[12rem] flex-1 basis-full sm:basis-[14rem] lg:basis-0 lg:min-w-[12rem]">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex w-8 items-center justify-center text-zinc-400">
            <Search className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          </span>
          <input
            type="search"
            defaultValue={values.q ?? ""}
            placeholder="Tìm theo tiêu đề…"
            className="h-9 w-full rounded-lg border border-zinc-200 bg-white py-0 pr-3 pl-8 text-sm leading-9 text-zinc-800 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                push({ ...values, q: (e.target as HTMLInputElement).value.trim() });
              }
            }}
            onBlur={(e) => {
              const q = e.target.value.trim();
              if (q !== (values.q ?? "")) push({ ...values, q });
            }}
          />
        </div>

        <div className="min-w-[9.5rem] flex-1 sm:flex-none sm:w-[11rem] lg:w-[12rem]">
          <ProDropdown
            value={values.status ?? ""}
            onChange={(status) => push({ ...values, status })}
            options={STATUS_OPTIONS}
            triggerClassName="h-9 shadow-none"
          />
        </div>

        <div className="min-w-[9.5rem] flex-1 sm:flex-none sm:w-[11rem] lg:w-[12rem]">
          <ProDropdown
            value={values.audience ?? ""}
            onChange={(audience) => push({ ...values, audience })}
            options={AUDIENCE_OPTIONS}
            triggerClassName="h-9 shadow-none"
          />
        </div>

        <button
          type="button"
          disabled={items.length === 0}
          className="ml-auto inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)]/10 px-3 text-sm font-semibold whitespace-nowrap text-[var(--primary)] transition hover:bg-[var(--primary)]/15 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={exportCsv}
        >
          <Download className="h-4 w-4" aria-hidden />
          Tải danh sách
        </button>
      </div>
    </div>
  );
}
