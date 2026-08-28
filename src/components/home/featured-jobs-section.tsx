"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, ChevronDown, ChevronLeft, ChevronRight, Filter } from "lucide-react";
import {
  FEATURED_JOBS,
  JOB_LOCATION_FILTERS,
  JOB_SALARY_FILTERS,
  filterFeaturedJobs,
} from "@/data/featured-jobs";
import { INDUSTRIES } from "@/data/industries";
import { JobCard } from "@/components/home/job-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 9;

type FilterKey = "location" | "salary" | "industry";

const FILTER_TYPES: { key: FilterKey; label: string }[] = [
  { key: "location", label: "Địa điểm" },
  { key: "salary", label: "Mức lương" },
  { key: "industry", label: "Ngành nghề" },
];

type PillOption = { id: string; label: string };

export function FeaturedJobsSection() {
  const [filterType, setFilterType] = useState<FilterKey>("location");
  const [region, setRegion] = useState("random");
  const [salaryBand, setSalaryBand] = useState("all");
  const [industryId, setIndustryId] = useState("all");
  const [page, setPage] = useState(0);
  const pillsRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(
    () => filterFeaturedJobs(FEATURED_JOBS, { region, salaryBand, industryId }),
    [region, salaryBand, industryId]
  );

  const totalPages = Math.max(1, Math.ceil(Math.max(filtered.length, 1) / PAGE_SIZE));
  const safePage = Math.min(page, totalPages - 1);
  const pageJobs = filtered.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  const filterTypeLabel =
    FILTER_TYPES.find((t) => t.key === filterType)?.label ?? "Địa điểm";

  const pills: PillOption[] = useMemo(() => {
    if (filterType === "location") {
      return JOB_LOCATION_FILTERS.map((f) => ({ id: f.id, label: f.label }));
    }
    if (filterType === "salary") {
      return JOB_SALARY_FILTERS.map((f) => ({ id: f.id, label: f.label }));
    }
    return [
      { id: "all", label: "Tất cả" },
      ...INDUSTRIES.map((i) => ({ id: i.id, label: i.name })),
    ];
  }, [filterType]);

  const activePillId =
    filterType === "location" ? region : filterType === "salary" ? salaryBand : industryId;

  function onSelectPill(id: string) {
    setPage(0);
    if (filterType === "location") setRegion(id);
    else if (filterType === "salary") setSalaryBand(id);
    else setIndustryId(id);
  }

  function onChangeFilterType(next: FilterKey) {
    setFilterType(next);
  }

  function scrollPills(dir: -1 | 1) {
    pillsRef.current?.scrollBy({ left: dir * 220, behavior: "smooth" });
  }

  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="featured-jobs-heading">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            id="featured-jobs-heading"
            className="text-2xl font-bold tracking-tight text-[var(--primary)]"
          >
            Việc làm nổi bật
          </h2>
          <Link
            href="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary)] hover:underline"
          >
            Xem blog việc làm
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 1 dropdown trái + pills cuộn ngang (full phần còn lại) */}
        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex h-10 w-fit shrink-0 items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 text-sm font-medium text-zinc-700 shadow-sm outline-none hover:bg-zinc-50"
              >
                <Filter className="h-4 w-4 text-[var(--primary)]" />
                <span>
                  Lọc theo: <span className="font-semibold text-zinc-900">{filterTypeLabel}</span>
                </span>
                <ChevronDown className="h-4 w-4 opacity-60" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="min-w-[12rem]">
              {FILTER_TYPES.map((type) => (
                <DropdownMenuItem
                  key={type.key}
                  className="flex items-center justify-between gap-3"
                  onSelect={() => onChangeFilterType(type.key)}
                >
                  {type.label}
                  {filterType === type.key && <Check className="h-4 w-4 text-[var(--primary)]" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex min-w-0 flex-1 items-center gap-2">
            <button
              type="button"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/5"
              onClick={() => scrollPills(-1)}
              aria-label="Cuộn trái"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="relative min-w-0 flex-1">
              <div
                ref={pillsRef}
                className="flex gap-2 overflow-x-auto scroll-smooth px-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {pills.map((pill) => (
                  <button
                    key={pill.id}
                    type="button"
                    onClick={() => onSelectPill(pill.id)}
                    className={cn(
                      "shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition",
                      activePillId === pill.id
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200"
                    )}
                  >
                    {pill.label}
                  </button>
                ))}
              </div>
              {/* Gợi ý còn nội dung khi list dài */}
              <div
                className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent sm:w-10"
                aria-hidden
              />
            </div>

            <button
              type="button"
              className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/5"
              onClick={() => scrollPills(1)}
              aria-label="Cuộn phải"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pageJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>

        {pageJobs.length === 0 && (
          <p className="py-10 text-center text-sm text-zinc-500">
            Chưa có việc làm phù hợp bộ lọc này.
          </p>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--primary)] text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white disabled:opacity-40"
              disabled={safePage <= 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              aria-label="Trang trước"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-zinc-600">
              {safePage + 1} / {totalPages}
            </span>
            <button
              type="button"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--primary)] text-[var(--primary)] transition hover:bg-[var(--primary)] hover:text-white disabled:opacity-40"
              disabled={safePage >= totalPages - 1}
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              aria-label="Trang sau"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
