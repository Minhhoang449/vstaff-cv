import { EmployerPageShell } from "@/components/employer/employer-page-shell";
import { EmployerListTable } from "@/components/employer/employer-list-table";
import { EmployerListToolbar } from "@/components/employer/employer-list-toolbar";
import { Pagination } from "@/components/pagination";
import type { Metadata } from "next";
import Link from "next/link";
import { Eye, Info } from "lucide-react";
import { auth } from "@/auth";
import { listUnlockedCandidatesForEmployer } from "@/lib/employer-unlocks";

export const metadata: Metadata = {
  title: "Ứng viên đã mở",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{
  page?: string;
  q?: string;
  industry?: string;
  status?: string;
  province?: string;
}>;

export default async function EmployerOpenedCandidatesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const filters = {
    q: sp.q,
    industry: sp.industry,
    status: sp.status,
    province: sp.province,
  };

  const employerId = session?.user?.id ?? "";
  const pool = employerId
    ? await listUnlockedCandidatesForEmployer(employerId, {
        page,
        q: filters.q,
        industry: filters.industry,
        status: filters.status,
        province: filters.province,
      })
    : {
        data: [],
        total: 0,
        page: 1,
        totalPages: 1,
        pageSize: 12,
        source: "db" as const,
      };

  const items = pool.data;
  const empty =
    pool.total === 0 && !filters.q && !filters.industry && !filters.status && !filters.province;

  return (
    <EmployerPageShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Làm việc
            </p>
            <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-zinc-900">
              Ứng viên đã mở
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
              Chỉ hồ sơ bạn đã mở liên hệ (−1 CV) — SĐT và email hiện đủ để liên hệ lại, không cần mở
              lại.
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

        {empty ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-200 bg-white px-6 py-16 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--secondary)] text-[var(--primary)]">
              <Eye className="h-5 w-5" aria-hidden />
            </span>
            <p className="mt-4 text-sm font-medium text-zinc-800">Chưa mở liên hệ hồ sơ nào</p>
            <p className="mt-1 max-w-sm text-sm text-zinc-500">
              Vào chi tiết ứng viên và bấm &quot;Mở hồ sơ (−1 CV)&quot; — SĐT/email sẽ xuất hiện tại
              đây.
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
            <EmployerListToolbar
              values={filters}
              total={pool.total}
              items={items}
              basePath="/dashboard/employer/da-mo"
              exportFileName="ung-vien-da-mo.csv"
            />
            <EmployerListTable
              items={items}
              mode="opened"
              emptyHint="Chỉ hiện hồ sơ đã mở liên hệ. Thử xóa bộ lọc hoặc mở thêm từ Tìm ứng viên."
            />
            <div className="border-t border-zinc-100 px-2">
              <Pagination
                page={pool.page}
                totalPages={pool.totalPages}
                basePath="/dashboard/employer/da-mo"
                query={filters}
              />
            </div>
            <div className="flex items-start gap-2 border-t border-zinc-100 px-4 py-3 text-xs text-zinc-500 sm:px-5">
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden />
              <p>
                Hồ sơ đã mở SĐT & email (−1 CV / hồ sơ).{" "}
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
