"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import type { FeaturedJob } from "@/data/featured-jobs";
import { cn } from "@/lib/utils";

type Props = {
  job: FeaturedJob;
};

export function JobCard({ job }: Props) {
  const [saved, setSaved] = useState(false);

  return (
    <article className="group flex h-full flex-col rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-[var(--primary)]/35 hover:shadow-[0_8px_24px_rgba(15,76,92,0.08)]">
      <div className="flex gap-3">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-sm font-bold tracking-wide text-[var(--primary)]">
          {job.companyInitials}
        </div>

        <div className="min-w-0 flex-1">
          <Link
            href="/dang-ky"
            className="line-clamp-2 text-[0.9375rem] font-semibold leading-snug text-zinc-800 transition group-hover:text-[var(--primary)]"
          >
            {job.title}
          </Link>
          <p className="mt-1.5 truncate text-sm text-zinc-500">{job.company}</p>
        </div>
      </div>

      <div className="mt-auto flex items-center gap-2 pt-4">
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
          {job.salary}
        </span>
        <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-700">
          {job.location}
        </span>
        <button
          type="button"
          onClick={() => setSaved((v) => !v)}
          className={cn(
            "ml-auto inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition",
            saved
              ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
              : "border-[var(--primary)]/50 text-[var(--primary)] hover:bg-[var(--primary)]/5"
          )}
          aria-label={saved ? "Bỏ lưu việc làm" : "Lưu việc làm"}
          aria-pressed={saved}
        >
          <Heart className={cn("h-4 w-4", saved && "fill-current")} />
        </button>
      </div>
    </article>
  );
}
