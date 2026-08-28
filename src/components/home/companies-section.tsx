import Link from "next/link";
import { Building2, MapPin } from "lucide-react";
import { FEATURED_COMPANIES } from "@/data/companies";

export function CompaniesSection() {
  return (
    <section className="bg-zinc-50 py-12 sm:py-14" aria-labelledby="companies-heading">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="companies-heading"
              className="text-2xl font-bold tracking-tight text-[var(--primary)]"
            >
              Công ty nổi bật
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Nhà tuyển dụng đang tìm ứng viên trên Vstaff
            </p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-semibold text-[var(--primary)] hover:underline"
          >
            Xem blog tuyển dụng
          </Link>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURED_COMPANIES.map((company) => (
            <Link
              key={company.id}
              href="/dang-ky"
              className="rounded-xl border border-zinc-200 bg-white p-4 transition hover:border-[var(--primary)]/35 hover:shadow-md"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-sm font-bold text-[var(--primary-foreground)]">
                  {company.logoText}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-zinc-900">{company.name}</h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                    <Building2 className="h-3.5 w-3.5" />
                    <span className="truncate">{company.industry}</span>
                  </p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-500">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">{company.location}</span>
                  </p>
                </div>
              </div>
              <p className="mt-4 text-xs font-medium text-[var(--primary)]">
                {company.openJobs} việc đang tuyển
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
