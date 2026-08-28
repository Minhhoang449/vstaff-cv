import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminCandidatesTable } from "@/components/admin/admin-candidates-table";
import { AdminCandidatesToolbar } from "@/components/admin/admin-candidates-toolbar";
import { Pagination } from "@/components/pagination";
import type { Metadata } from "next";
import Link from "next/link";
import { listCandidates } from "@/lib/candidates";

export const metadata: Metadata = {
  title: "Quản lý ứng viên",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{
  page?: string;
  q?: string;
  industry?: string;
  province?: string;
  gender?: string;
  education?: string;
  experience?: string;
}>;

export default async function AdminCandidatesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const filters = {
    q: sp.q?.trim() || undefined,
    industry: sp.industry?.trim() || undefined,
    province: sp.province?.trim() || undefined,
    gender: sp.gender?.trim() || undefined,
    education: sp.education?.trim() || undefined,
    experience: sp.experience?.trim() || undefined,
  };

  const result = await listCandidates({
    page,
    sort: "updated",
    ...filters,
  });

  const paginationQuery = {
    q: filters.q,
    industry: filters.industry,
    province: filters.province,
    gender: filters.gender,
    education: filters.education,
    experience: filters.experience,
  };

  return (
    <AdminPageShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Quản lý
            </p>
            <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-zinc-900">
              Ứng viên
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
              Kho hồ sơ trên hệ thống. Lọc, xem CV hoặc xóa hồ sơ không còn dùng.
            </p>
          </div>
          <Link
            href="/dashboard/admin/upload-ung-vien"
            className="inline-flex h-10 items-center rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-92"
          >
            Upload JSON
          </Link>
        </div>

        <AdminCandidatesToolbar values={filters} total={result.total} />

        <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
          <AdminCandidatesTable key={result.data.map((c) => c.id).join("|")} items={result.data} />
          {result.totalPages > 1 ? (
            <div className="border-t border-zinc-100 px-4 py-3 sm:px-5">
              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                basePath="/dashboard/admin/ung-vien"
                query={paginationQuery}
              />
            </div>
          ) : null}
        </div>
      </div>
    </AdminPageShell>
  );
}
