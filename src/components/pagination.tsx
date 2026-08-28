import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  page: number;
  totalPages: number;
  basePath?: string;
  query?: Record<string, string | undefined>;
};

function buildHref(basePath: string, page: number, query: Record<string, string | undefined>) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

export function Pagination({ page, totalPages, basePath = "/dashboard/employer/tim-ung-vien", query = {} }: Props) {
  if (totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div className="flex items-center justify-center gap-3 py-6">
      {prevDisabled ? (
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 text-zinc-300"
          aria-disabled
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
      ) : (
        <Link
          href={buildHref(basePath, page - 1, query)}
          aria-label="Trang trước"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
        >
          <ChevronLeft className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </Link>
      )}

      <span className="min-w-[5.5rem] text-center text-sm tabular-nums text-zinc-500">
        {page} / {totalPages}
      </span>

      {nextDisabled ? (
        <span
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 text-zinc-300"
          aria-disabled
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </span>
      ) : (
        <Link
          href={buildHref(basePath, page + 1, query)}
          aria-label="Trang sau"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white text-zinc-700 transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
        >
          <ChevronRight className="h-4 w-4" strokeWidth={1.75} aria-hidden />
        </Link>
      )}
    </div>
  );
}
