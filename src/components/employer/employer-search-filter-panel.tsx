"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Filter, Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { INDUSTRIES } from "@/data/industries";
import { PROVINCES, getWards, shortProvinceName } from "@/data/vietnam-locations";
import {
  EDUCATION_LEVELS,
  EXPERIENCE_FILTERS,
  GENDERS,
  JOB_SEEKING_STATUSES,
  LANGUAGES,
  WORK_TYPES,
} from "@/lib/candidates-shared";
import { ProDropdown } from "@/components/ui/pro-dropdown";
import { cn } from "@/lib/utils";

export type EmployerSearchFilterValues = {
  q?: string;
  province?: string;
  ward?: string;
  industry?: string;
  gender?: string;
  language?: string;
  education?: string;
  experience?: string;
  workType?: string;
  status?: string;
  sort?: string;
  unviewed?: string;
};

type Props = {
  values: EmployerSearchFilterValues;
  basePath?: string;
};

type AdvKey = "experience" | "workType" | "gender" | "language" | "education" | "status";

const ADV_FILTERS: { key: AdvKey; label: string; shortLabel: string; badge?: string }[] = [
  { key: "experience", label: "Kinh nghiệm", shortLabel: "Kinh nghiệm" },
  { key: "workType", label: "Hình thức làm việc", shortLabel: "Hình thức" },
  { key: "gender", label: "Giới tính", shortLabel: "Giới tính" },
  { key: "language", label: "Ngôn ngữ", shortLabel: "Ngôn ngữ" },
  { key: "education", label: "Bằng cấp", shortLabel: "Bằng cấp" },
  { key: "status", label: "Trạng thái tìm việc", shortLabel: "Trạng thái", badge: "Mới" },
];

const inputClass =
  "mt-1.5 flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20";

export function EmployerSearchFilterPanel({
  values,
  basePath = "/dashboard/employer/tim-ung-vien",
}: Props) {
  const router = useRouter();
  const [q, setQ] = useState(values.q ?? "");
  const [province, setProvince] = useState(values.province ?? "");
  const [ward, setWard] = useState(values.ward ?? "");
  const [industry, setIndustry] = useState(values.industry ?? "");
  const [gender, setGender] = useState(values.gender ?? "");
  const [language, setLanguage] = useState(values.language ?? "");
  const [education, setEducation] = useState(values.education ?? "");
  const [experience, setExperience] = useState(values.experience ?? "");
  const [workType, setWorkType] = useState(values.workType ?? "");
  const [status, setStatus] = useState(values.status ?? "");
  const [openAdv, setOpenAdv] = useState<AdvKey | null>(null);
  const [unviewedOnly, setUnviewedOnly] = useState(values.unviewed === "1");

  const wards = useMemo(() => getWards(province), [province]);

  const advValues: Record<AdvKey, string> = {
    experience,
    workType,
    gender,
    language,
    education,
    status,
  };

  const activeCount = [
    q,
    province,
    ward,
    industry,
    gender,
    language,
    education,
    experience,
    workType,
    status,
    unviewedOnly ? "1" : "",
  ].filter(Boolean).length;

  function setAdv(key: AdvKey, value: string) {
    if (key === "experience") setExperience(value);
    if (key === "workType") setWorkType(value);
    if (key === "gender") setGender(value);
    if (key === "language") setLanguage(value);
    if (key === "education") setEducation(value);
    if (key === "status") setStatus(value);
  }

  function advOptions(key: AdvKey) {
    if (key === "experience")
      return EXPERIENCE_FILTERS.map((x) => ({ value: x.id, label: x.label }));
    if (key === "workType")
      return [
        { value: "", label: "Tất cả" },
        ...WORK_TYPES.map((x) => ({ value: x, label: x })),
      ];
    if (key === "gender") return GENDERS.map((x) => ({ value: x.id, label: x.label }));
    if (key === "language")
      return [
        { value: "", label: "Tất cả" },
        ...LANGUAGES.map((x) => ({ value: x, label: x })),
      ];
    if (key === "education")
      return [
        { value: "", label: "Tất cả" },
        ...EDUCATION_LEVELS.map((x) => ({ value: x, label: x })),
      ];
    return JOB_SEEKING_STATUSES.map((x) => ({ value: x.id, label: x.label }));
  }

  function applySearch(e?: React.FormEvent) {
    e?.preventDefault();
    const params = new URLSearchParams();
    const entries: Record<string, string> = {
      q,
      province,
      ward,
      industry,
      gender,
      language,
      education,
      experience,
      workType,
      status,
      sort: values.sort || "relevant",
      unviewed: unviewedOnly ? "1" : "",
    };
    Object.entries(entries).forEach(([k, v]) => {
      if (v) params.set(k, v);
    });
    const qs = params.toString();
    router.push(qs ? `${basePath}?${qs}` : basePath);
  }

  function clearAll() {
    setQ("");
    setProvince("");
    setWard("");
    setIndustry("");
    setGender("");
    setLanguage("");
    setEducation("");
    setExperience("");
    setWorkType("");
    setStatus("");
    setOpenAdv(null);
    setUnviewedOnly(false);
    router.push(basePath);
  }

  const industryOptions = [
    { value: "", label: "Chọn ngành nghề" },
    ...INDUSTRIES.map((ind) => ({ value: ind.id, label: ind.name })),
  ];

  const provinceOptions = [
    { value: "", label: "Tỉnh / Thành phố" },
    ...PROVINCES.map((p) => ({ value: p.code, label: shortProvinceName(p.name) })),
  ];

  const wardOptions = [
    {
      value: "",
      label: province ? "Quận / Huyện (phường/xã)" : "Chọn tỉnh trước",
    },
    ...wards.map((w) => ({ value: w.code, label: w.name })),
  ];

  return (
    <form onSubmit={applySearch} className="flex h-full flex-col bg-white">
      <div className="flex items-center justify-between gap-2 border-b border-zinc-200/90 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--primary)]/10 text-[var(--primary)]">
            <SlidersHorizontal className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-tight text-zinc-900">Bộ lọc</p>
            <p className="text-[11px] text-zinc-500">
              {activeCount > 0 ? `${activeCount} điều kiện đang áp dụng` : "Tinh chỉnh kết quả tìm"}
            </p>
          </div>
        </div>
        {activeCount > 0 ? (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs font-semibold text-[var(--primary)] hover:underline"
          >
            Xóa hết
          </button>
        ) : null}
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-4">
        <section className="space-y-3">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-zinc-400">
            Tìm kiếm cơ bản
          </p>
          <div>
            <label htmlFor="q" className="text-sm font-medium text-zinc-700">
              Vị trí cần tuyển
            </label>
            <input
              id="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="VD: Nhân viên kinh doanh"
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="industry" className="text-sm font-medium text-zinc-700">
              Ngành nghề
            </label>
            <ProDropdown
              id="industry"
              className="mt-1.5"
              value={industry}
              onChange={setIndustry}
              options={industryOptions}
              placeholder="Chọn ngành nghề"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-700">Địa điểm</p>
            <ProDropdown
              className="mt-1.5"
              value={province}
              onChange={(code) => {
                setProvince(code);
                setWard("");
              }}
              options={provinceOptions}
              placeholder="Tỉnh / Thành phố"
            />
            <ProDropdown
              className="mt-1.5"
              value={ward}
              onChange={setWard}
              options={wardOptions}
              placeholder="Quận / Huyện"
              disabled={!province}
            />
          </div>
        </section>

        <div className="h-px bg-zinc-100" />

        <section>
          <div className="flex items-center gap-1.5">
            <Filter className="h-3.5 w-3.5 text-zinc-400" aria-hidden />
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-zinc-400">
              Yêu cầu nâng cao
            </p>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {ADV_FILTERS.map((item) => {
              const selectedValue = advValues[item.key];
              const selectedLabel = advOptions(item.key).find((o) => o.value === selectedValue)?.label;
              const hasValue = !!selectedValue;
              const isOpen = openAdv === item.key;

              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setOpenAdv(isOpen ? null : item.key)}
                  className={cn(
                    "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-left text-[12px] transition",
                    isOpen
                      ? "border-[var(--primary)] bg-[var(--primary)] text-[var(--primary-foreground)] shadow-sm"
                      : hasValue
                        ? "border-[var(--primary)]/30 bg-[var(--primary)]/8 font-medium text-[var(--primary)]"
                        : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                  )}
                >
                  {!hasValue && !isOpen ? (
                    <Plus className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
                  ) : (
                    <Check className="h-3 w-3 shrink-0 opacity-90" aria-hidden />
                  )}
                  <span className="truncate">
                    {hasValue && selectedLabel && selectedLabel !== "Tất cả"
                      ? `${item.shortLabel}: ${selectedLabel}`
                      : item.shortLabel}
                  </span>
                  {item.badge && !hasValue ? (
                    <span
                      className={cn(
                        "rounded px-1 py-px text-[9px] font-bold uppercase",
                        isOpen ? "bg-white/20 text-white" : "bg-rose-500 text-white"
                      )}
                    >
                      {item.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>

          {openAdv ? (
            <div className="mt-3 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_10px_30px_-14px_rgba(15,23,42,0.35)]">
              <div className="flex items-center justify-between border-b border-zinc-100 px-3 py-2.5">
                <p className="text-sm font-semibold text-zinc-800">
                  {ADV_FILTERS.find((a) => a.key === openAdv)?.label}
                </p>
                <button
                  type="button"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
                  onClick={() => setOpenAdv(null)}
                  aria-label="Đóng"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <ul className="max-h-52 overflow-y-auto py-1.5" role="listbox">
                {advOptions(openAdv).map((opt) => {
                  const active = advValues[openAdv] === opt.value;
                  return (
                    <li key={opt.value || "__all"} role="option" aria-selected={active}>
                      <button
                        type="button"
                        className={cn(
                          "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm transition",
                          active
                            ? "bg-[var(--primary)]/8 font-medium text-[var(--primary)]"
                            : "text-zinc-700 hover:bg-zinc-50"
                        )}
                        onClick={() => {
                          setAdv(openAdv, opt.value);
                          setOpenAdv(null);
                        }}
                      >
                        <span
                          className={cn(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                            active
                              ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                              : "border-zinc-300"
                          )}
                        >
                          {active ? <Check className="h-2.5 w-2.5" strokeWidth={3} aria-hidden /> : null}
                        </span>
                        <span className="min-w-0 flex-1">{opt.label}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </section>

        <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-zinc-100 bg-zinc-50/60 px-3 py-2.5 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={unviewedOnly}
            onChange={(e) => setUnviewedOnly(e.target.checked)}
            className="size-4 accent-[var(--primary)]"
          />
          Chỉ hiện hồ sơ chưa xem
        </label>
      </div>

      <div className="shrink-0 border-t border-zinc-200/90 bg-white/95 p-3 backdrop-blur-sm">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex h-11 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-100"
          >
            Xóa bộ lọc
          </button>
          <button
            type="submit"
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] text-sm font-semibold text-[var(--primary-foreground)] shadow-sm transition hover:opacity-92"
          >
            <Search className="h-4 w-4" aria-hidden />
            Tìm ứng viên
          </button>
        </div>
      </div>
    </form>
  );
}
