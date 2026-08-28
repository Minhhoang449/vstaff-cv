"use client";

import { useRouter } from "next/navigation";
import { Filter, RotateCcw, Search } from "lucide-react";
import { INDUSTRIES } from "@/data/industries";
import { PROVINCES, shortProvinceName } from "@/data/vietnam-locations";
import {
  EDUCATION_LEVELS,
  EXPERIENCE_FILTERS,
  GENDERS,
} from "@/lib/candidates-shared";
import { ProDropdown } from "@/components/ui/pro-dropdown";

export type AdminCandidateFilterValues = {
  q?: string;
  industry?: string;
  province?: string;
  gender?: string;
  education?: string;
  experience?: string;
};

type Props = {
  values: AdminCandidateFilterValues;
  total: number;
  basePath?: string;
};

export function AdminCandidatesToolbar({
  values,
  total,
  basePath = "/dashboard/admin/ung-vien",
}: Props) {
  const router = useRouter();

  function push(next: AdminCandidateFilterValues) {
    const params = new URLSearchParams();
    Object.entries(next).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  const hasFilters = Object.values(values).some(Boolean);

  const industryOptions = [
    { value: "", label: "Tất cả ngành" },
    ...INDUSTRIES.map((i) => ({ value: i.id, label: i.name })),
  ];

  const provinceOptions = [
    { value: "", label: "Tất cả địa điểm" },
    ...PROVINCES.map((p) => ({ value: p.code, label: shortProvinceName(p.name) })),
  ];

  const genderOptions = GENDERS.map((g) =>
    g.id === "" ? { value: "", label: "Tất cả giới tính" } : { value: g.id, label: g.label }
  );

  const educationOptions = [
    { value: "", label: "Tất cả học vấn" },
    ...EDUCATION_LEVELS.map((e) => ({ value: e, label: e })),
  ];

  const experienceOptions = EXPERIENCE_FILTERS.map((e) =>
    e.id === "" ? { value: "", label: "Tất cả kinh nghiệm" } : { value: e.id, label: e.label }
  );

  return (
    <div className="rounded-xl border border-[var(--border)] bg-white px-4 py-3 sm:px-5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-zinc-800">
          <Filter className="h-4 w-4 text-[var(--primary)]" aria-hidden />
          <span className="hidden sm:inline">Bộ lọc</span>
        </div>

        <div className="relative min-w-[12rem] flex-1 basis-full sm:basis-[14rem] lg:min-w-[12rem] lg:flex-1">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex w-8 items-center justify-center text-zinc-400">
            <Search className="h-3.5 w-3.5" strokeWidth={2} aria-hidden />
          </span>
          <input
            type="search"
            defaultValue={values.q ?? ""}
            key={values.q ?? ""}
            placeholder="Tên, mã UV, SĐT, email…"
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

        <div className="min-w-[9rem] flex-1 sm:flex-none sm:w-[10.5rem]">
          <ProDropdown
            value={values.industry ?? ""}
            onChange={(industry) => push({ ...values, industry })}
            options={industryOptions}
            triggerClassName="h-9 shadow-none"
          />
        </div>

        <div className="min-w-[9rem] flex-1 sm:flex-none sm:w-[10.5rem]">
          <ProDropdown
            value={values.province ?? ""}
            onChange={(province) => push({ ...values, province })}
            options={provinceOptions}
            triggerClassName="h-9 shadow-none"
          />
        </div>

        <div className="min-w-[8.5rem] flex-1 sm:flex-none sm:w-[9.5rem]">
          <ProDropdown
            value={values.gender ?? ""}
            onChange={(gender) => push({ ...values, gender })}
            options={genderOptions}
            triggerClassName="h-9 shadow-none"
          />
        </div>

        <div className="min-w-[8.5rem] flex-1 sm:flex-none sm:w-[10rem]">
          <ProDropdown
            value={values.education ?? ""}
            onChange={(education) => push({ ...values, education })}
            options={educationOptions}
            triggerClassName="h-9 shadow-none"
          />
        </div>

        <div className="min-w-[8.5rem] flex-1 sm:flex-none sm:w-[10.5rem]">
          <ProDropdown
            value={values.experience ?? ""}
            onChange={(experience) => push({ ...values, experience })}
            options={experienceOptions}
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
          {total.toLocaleString("vi-VN")} hồ sơ
        </p>
      </div>
    </div>
  );
}
