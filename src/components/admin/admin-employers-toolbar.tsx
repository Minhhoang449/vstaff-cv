"use client";

import { useRouter } from "next/navigation";
import { Filter, RotateCcw, Search } from "lucide-react";
import type { AdminEmployerStatus } from "@/lib/admin/business-types";
import { ProDropdown } from "@/components/ui/pro-dropdown";

export type AdminEmployerFilterValues = {
  q?: string;
  plan?: string;
  status?: string;
};

type Props = {
  values: AdminEmployerFilterValues;
  total: number;
  planNames?: string[];
  basePath?: string;
};

const STATUS_OPTIONS: { value: AdminEmployerStatus | ""; label: string }[] = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "active", label: "Đang dùng" },
  { value: "trial", label: "Dùng thử" },
  { value: "expired", label: "Hết hạn" },
  { value: "suspended", label: "Tạm khóa" },
];

export function AdminEmployersToolbar({
  values,
  total,
  planNames = [],
  basePath = "/dashboard/admin/nha-tuyen-dung",
}: Props) {
  const router = useRouter();

  function push(next: AdminEmployerFilterValues) {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  const hasFilters = Object.values(values).some(Boolean);

  const planOptions = [
    { value: "", label: "Tất cả gói" },
    ...planNames.map((name) => ({ value: name, label: name })),
  ];

  return (
    <div className="rounded-xl border border-[var(--border)] bg-white px-4 py-3 sm:px-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-zinc-800">
          <Filter className="h-4 w-4 text-[var(--primary)]" aria-hidden />
          <span className="hidden sm:inline">Bộ lọc</span>
        </div>

        <div className="relative min-w-[12rem] flex-1 basis-full sm:basis-[14rem] lg:min-w-[14rem] lg:flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex w-8 items-center justify-center text-zinc-400">
            <Search className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          </span>
          <input
            type="search"
            defaultValue={values.q ?? ""}
            key={values.q ?? ""}
            placeholder="Công ty, email…"
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

        <div className="min-w-[9.5rem] flex-1 sm:flex-none sm:w-[11rem]">
          <ProDropdown
            value={values.plan ?? ""}
            onChange={(plan) => push({ ...values, plan })}
            options={planOptions}
            triggerClassName="h-9 shadow-none"
          />
        </div>

        <div className="min-w-[9.5rem] flex-1 sm:flex-none sm:w-[11rem]">
          <ProDropdown
            value={values.status ?? ""}
            onChange={(status) => push({ ...values, status })}
            options={STATUS_OPTIONS}
            triggerClassName="h-9 shadow-none"
          />
        </div>

        {hasFilters ? (
          <button
            type="button"
            onClick={() => push({})}
            className="inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-zinc-200 px-3 text-sm font-medium text-zinc-600 transition hover:bg-zinc-50"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden />
            Xóa lọc
          </button>
        ) : null}

        <p className="ml-auto text-xs font-medium whitespace-nowrap text-zinc-500">
          {total.toLocaleString("vi-VN")} NTD
        </p>
      </div>
    </div>
  );
}
