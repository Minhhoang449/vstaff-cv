import { EmployerPageShell } from "@/components/employer/employer-page-shell";
import { EmployerSavedTable } from "@/components/employer/employer-saved-table";
import { EmployerSavedToolbar } from "@/components/employer/employer-saved-toolbar";
import { Pagination } from "@/components/pagination";
import type { Metadata } from "next";
import Link from "next/link";
import { Bookmark, Info } from "lucide-react";
import { auth } from "@/auth";
import { maskContactOnCvData } from "@/lib/employer-unlocks";
import { listSavedCandidatesForEmployer } from "@/lib/saved-candidates";

export const metadata: Metadata = {
  title: "Ứng viên đã lưu",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{
  page?: string;
  q?: string;
  industry?: string;
  viewed?: string;
  status?: string;
  province?: string;
}>;

export default async function EmployerSavedCandidatesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  const employerId = session?.user?.id ?? "";
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const filters = {
    q: sp.q,
    industry: sp.industry,
    viewed: sp.viewed,
    status: sp.status,
    province: sp.province,
  };

  const pool = await listSavedCandidatesForEmployer(employerId, {
    page,
    q: filters.q,
    industry: filters.industry,
    status: filters.status,
    province: filters.province,
    viewed:
      filters.viewed === "viewed" || filters.viewed === "unviewed"
        ? filters.viewed
        : "",
  });

  const hasFilter = Boolean(
    filters.q || filters.industry || filters.status || filters.province || filters.viewed
  );
  const emptyPool = pool.total === 0 && !hasFilter;
  const publicItems = pool.data.map((c) => maskContactOnCvData(c, false));

  return (
    <EmployerPageShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Hồ sơ
            </p>
            <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-zinc-900">
              Ứng viên đã lưu
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-600">
              Chỉ những hồ sơ bạn đã lưu từ Tìm ứng viên — theo dõi và xuất danh sách riêng của tài
              khoản.
            </p>
          </div>
          <p className="text-sm text-zinc-500">
            <span className="font-semibold tabular-nums text-[var(--primary)]">
              {pool.total.toLocaleString("vi-VN")}
            </span>{" "}
            hồ sơ
            {pool.totalPages > 1 ? (
              <span className="text-zinc-400">
                {" "}
                · trang {pool.page}/{pool.totalPages}
              </span>
            ) : null}
          </p>
        </div>

        {emptyPool ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--primary)]">
              <Bookmark className="h-5 w-5" aria-hidden />
            </span>
            <p className="mt-4 text-sm font-medium text-zinc-800">Chưa có ứng viên đã lưu</p>
            <p className="mt-1 max-w-sm text-sm text-zinc-500">
              Từ trang Tìm ứng viên, bấm Lưu hồ sơ để theo dõi tại đây.
            </p>
            <Link
              href="/dashboard/employer/tim-ung-vien"
              className="mt-6 inline-flex h-10 items-center rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-92"
            >
              Đi tìm ứng viên
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_4px_24px_-8px_rgba(15,40,60,0.12)]">
            <EmployerSavedToolbar values={filters} total={pool.total} items={publicItems} />
            <EmployerSavedTable
              key={`${filters.q}-${filters.industry}-${filters.status}-${filters.province}-${filters.viewed}-${pool.page}`}
              items={publicItems}
            />
            <div className="border-t border-zinc-100 px-2">
              <Pagination
                page={pool.page}
                totalPages={pool.totalPages}
                basePath="/dashboard/employer/da-luu"
                query={filters}
              />
            </div>
            <div className="flex items-start gap-2 border-t border-zinc-100 px-4 py-3 text-xs text-zinc-500 sm:px-5">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden />
              <p>
                Hồ sơ bạn đã đánh dấu lưu — chỉ hiện trên tài khoản của bạn.{" "}
                <Link
                  href="/dashboard/employer/tim-ung-vien"
                  className="font-medium text-[var(--primary)] hover:underline"
                >
                  Tiếp tục tìm ứng viên
                </Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </EmployerPageShell>
  );
}
