"use client";

import { useRouter } from "next/navigation";
import { Download, Filter, Search } from "lucide-react";
import { INDUSTRIES } from "@/data/industries";
import { PROVINCES, shortProvinceName } from "@/data/vietnam-locations";
import {
  JOB_SEEKING_STATUSES,
  formatExperienceYears,
  type CandidateProfile,
} from "@/lib/candidates-shared";
import { buildCsv, downloadCsv } from "@/lib/export-csv";
import { ProDropdown } from "@/components/ui/pro-dropdown";

export type SavedFilterValues = {
  q?: string;
  industry?: string;
  viewed?: string;
  status?: string;
  province?: string;
};

export type SavedExportRow = CandidateProfile & { savedAt?: string };

type Props = {
  values: SavedFilterValues;
  total: number;
  items?: SavedExportRow[];
  basePath?: string;
};

const VIEWED_OPTIONS = [
  { value: "", label: "Tất cả trạng thái xem" },
  { value: "viewed", label: "Đã xem" },
  { value: "unviewed", label: "Chưa xem" },
];

function industryName(id: string) {
  return INDUSTRIES.find((i) => i.id === id)?.name ?? id;
}

function formatSavedDate(iso?: string) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export function EmployerSavedToolbar({
  values,
  total,
  items = [],
  basePath = "/dashboard/employer/da-luu",
}: Props) {
  const router = useRouter();

  function push(next: SavedFilterValues) {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  function exportList() {
    const headers = [
      "Họ tên",
      "Vị trí",
      "SĐT",
      "Email",
      "Ngành",
      "Địa điểm",
      "Ngày lưu",
      "Kinh nghiệm",
      "Học vấn",
      "Hình thức",
      "Đã xem",
    ];
    const rows = items.map((c) => [
      c.fullName,
      c.desiredPosition,
      c.phone,
      c.email,
      industryName(c.industryId),
      `${c.wardName}, ${c.location}`,
      formatSavedDate(c.savedAt),
      formatExperienceYears(c.experienceYears),
      c.education || "",
      c.workType || "",
      c.isViewed ? "Đã xem" : "Chưa xem",
    ]);
    downloadCsv("ung-vien-da-luu.csv", buildCsv(headers, rows));
  }

  const industryOptions = [
    { value: "", label: "Tất cả ngành nghề" },
    ...INDUSTRIES.map((i) => ({ value: i.id, label: i.name })),
  ];

  const provinceOptions = [
    { value: "", label: "Tất cả địa điểm" },
    ...PROVINCES.map((p) => ({ value: p.code, label: shortProvinceName(p.name) })),
  ];

  const statusOptions = JOB_SEEKING_STATUSES.map((s) =>
    s.id === "" ? { value: "", label: "Tất cả trạng thái UV" } : { value: s.id, label: s.label }
  );

  return (
    <div className="border-b border-zinc-100 bg-white px-4 py-3 sm:px-5">
      <div className="flex flex-wrap items-center gap-2 lg:flex-nowrap lg:gap-2.5">
        <div className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-zinc-800">
          <Filter className="h-4 w-4 text-[var(--primary)]" aria-hidden />
          <span className="hidden sm:inline">Bộ lọc</span>
        </div>

        <div className="relative min-w-[11rem] flex-1 basis-full sm:basis-[12rem] lg:basis-0 lg:min-w-[10rem]">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex w-8 items-center justify-center text-zinc-400">
            <Search className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          </span>
          <input
            type="search"
            defaultValue={values.q ?? ""}
            placeholder="Tên, vị trí…"
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

        <div className="min-w-[9rem] flex-1 sm:flex-none sm:w-[10.5rem] lg:w-[11rem]">
          <ProDropdown
            value={values.industry ?? ""}
            onChange={(industry) => push({ ...values, industry })}
            options={industryOptions}
            triggerClassName="h-9 shadow-none"
          />
        </div>

        <div className="min-w-[9rem] flex-1 sm:flex-none sm:w-[10.5rem] lg:w-[11rem]">
          <ProDropdown
            value={values.viewed ?? ""}
            onChange={(viewed) => push({ ...values, viewed })}
            options={VIEWED_OPTIONS}
            triggerClassName="h-9 shadow-none"
          />
        </div>

        <div className="min-w-[9rem] flex-1 sm:flex-none sm:w-[10.5rem] lg:w-[11rem]">
          <ProDropdown
            value={values.status ?? ""}
            onChange={(status) => push({ ...values, status })}
            options={statusOptions}
            triggerClassName="h-9 shadow-none"
          />
        </div>

        <div className="min-w-[9rem] flex-1 sm:flex-none sm:w-[10.5rem] lg:w-[10.5rem]">
          <ProDropdown
            value={values.province ?? ""}
            onChange={(province) => push({ ...values, province })}
            options={provinceOptions}
            triggerClassName="h-9 shadow-none"
          />
        </div>

        <button
          type="button"
          disabled={items.length === 0}
          className="ml-auto inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)]/10 px-3 text-sm font-semibold whitespace-nowrap text-[var(--primary)] transition hover:bg-[var(--primary)]/15 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={exportList}
          title={items.length === 0 ? "Chưa có dữ liệu để tải" : `Tải ${total} hồ sơ (Excel CSV)`}
        >
          <Download className="h-4 w-4" aria-hidden />
          Tải danh sách
        </button>
      </div>
    </div>
  );
}
