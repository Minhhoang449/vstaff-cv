"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { INDUSTRIES } from "@/data/industries";
import { industryBlogPath } from "@/lib/seo/blog-catalog";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 6;

type Props = {
  className?: string;
};

export function HomeIndustryMenu({ className }: Props) {
  const [page, setPage] = useState(0);
  const totalPages = Math.max(1, Math.ceil(INDUSTRIES.length / PAGE_SIZE));

  const items = useMemo(() => {
    const start = page * PAGE_SIZE;
    return INDUSTRIES.slice(start, start + PAGE_SIZE);
  }, [page]);

  return (
    <aside
      className={cn(
        "flex h-full min-h-0 flex-col overflow-hidden rounded-xl bg-white shadow-md",
        className
      )}
    >
      <ul className="flex-1 divide-y divide-zinc-100">
        {items.map((item) => (
          <li key={item.id}>
            <Link
              href={industryBlogPath(item.name)}
              className="flex items-center justify-between gap-2 px-4 py-2.5 text-sm text-zinc-700 transition hover:bg-zinc-50 hover:text-[var(--primary)]"
            >
              <span className="truncate">{item.name}</span>
              <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" />
            </Link>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-center gap-3 border-t border-zinc-100 px-3 py-2.5">
        <button
          type="button"
          className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 disabled:opacity-40"
          disabled={page <= 0}
          onClick={() => setPage((p) => Math.max(0, p - 1))}
          aria-label="Trang ngành nghề trước"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="min-w-[3rem] text-center text-xs font-medium text-zinc-500">
          {page + 1}/{totalPages}
        </span>
        <button
          type="button"
          className="rounded-md p-1 text-zinc-500 hover:bg-zinc-100 disabled:opacity-40"
          disabled={page >= totalPages - 1}
          onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
          aria-label="Trang ngành nghề sau"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
