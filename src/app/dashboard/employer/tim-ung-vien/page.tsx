import type { Metadata } from "next";
import { EmployerCandidateListRow } from "@/components/employer/employer-candidate-list-row";
import { EmployerResultSort } from "@/components/employer/employer-result-sort";
import { EmployerSearchFilterPanel } from "@/components/employer/employer-search-filter-panel";
import { Pagination } from "@/components/pagination";
import { auth } from "@/auth";
import { listCandidates } from "@/lib/candidates";
import { maskContactOnCvData } from "@/lib/employer-unlocks";
import { listSavedCandidateIds } from "@/lib/saved-candidates";

export const metadata: Metadata = {
  title: "Tìm ứng viên",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{
  page?: string;
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
}>;

export default async function EmployerSearchCandidatesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  const sp = await searchParams;
  const page = Number(sp.page ?? "1") || 1;
  const filters = {
    q: sp.q,
    province: sp.province,
    ward: sp.ward,
    industry: sp.industry,
    gender: sp.gender,
    language: sp.language,
    education: sp.education,
    experience: sp.experience,
    workType: sp.workType,
    status: sp.status,
    sort: sp.sort || "relevant",
    unviewed: sp.unviewed === "1" ? "1" : undefined,
  };

  const result = await listCandidates({
    page,
    q: filters.q,
    province: filters.province,
    ward: filters.ward,
    industry: filters.industry,
    gender: filters.gender,
    language: filters.language,
    education: filters.education,
    experience: filters.experience,
    workType: filters.workType,
    status: filters.status || undefined,
    sort: filters.sort,
    employerId: session?.user?.id,
    unviewedOnly: filters.unviewed === "1",
  });

  const savedIds = session?.user?.id
    ? await listSavedCandidateIds(session.user.id).catch(() => new Set<string>())
    : new Set<string>();

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-100">
      <div className="flex flex-col gap-3 p-3 lg:flex-row lg:items-start lg:gap-4 lg:p-4">
        <aside className="w-full shrink-0 lg:sticky lg:top-[calc(3.5rem+1rem)] lg:h-[calc(100vh-3.5rem-2rem)] lg:w-[17.5rem] xl:w-[18.5rem]">
          <div className="flex h-full max-h-[min(70vh,36rem)] flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_4px_24px_-8px_rgba(15,40,60,0.12)] lg:max-h-none">
            <EmployerSearchFilterPanel values={filters} />
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <div className="rounded-2xl border border-zinc-200/80 bg-white shadow-[0_4px_24px_-8px_rgba(15,40,60,0.12)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 bg-white px-4 py-3.5 sm:px-5">
              <div>
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-zinc-400">
                  Kết quả
                </p>
                <h1 className="mt-0.5 text-sm font-semibold text-zinc-800 sm:text-[15px]">
                  Tìm thấy{" "}
                  <span className="tabular-nums text-[var(--primary)]">
                    {result.total.toLocaleString("vi-VN")}
                  </span>{" "}
                  ứng viên phù hợp
                </h1>
              </div>
              <EmployerResultSort current={filters.sort || "relevant"} filters={filters} />
            </div>

            <div className="divide-y divide-zinc-100">
              {result.data.length > 0 ? (
                result.data.map((candidate) => (
                  <EmployerCandidateListRow
                    key={candidate.id}
                    candidate={maskContactOnCvData(candidate, false)}
                    initialSaved={savedIds.has(candidate.id)}
                  />
                ))
              ) : (
                <p className="px-5 py-20 text-center text-sm text-zinc-500">
                  Không tìm thấy ứng viên phù hợp với bộ lọc.
                </p>
              )}
            </div>

            <div className="border-t border-zinc-100 px-2">
              <Pagination
                page={result.page}
                totalPages={result.totalPages}
                basePath="/dashboard/employer/tim-ung-vien"
                query={filters}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
