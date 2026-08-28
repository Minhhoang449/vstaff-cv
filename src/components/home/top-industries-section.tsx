import Link from "next/link";
import { INDUSTRIES } from "@/data/industries";
import { industryBlogPath } from "@/lib/seo/blog-catalog";

const TOP_INDUSTRY_IDS = [
  "it-software",
  "sales",
  "marketing",
  "accounting",
  "finance",
  "hr",
  "design",
  "logistics",
  "manufacturing",
  "customer-service",
  "healthcare",
  "education",
] as const;

export function TopIndustriesSection() {
  const items = TOP_INDUSTRY_IDS.map((id) => INDUSTRIES.find((i) => i.id === id)).filter(Boolean);

  return (
    <section className="bg-white py-12 sm:py-14" aria-labelledby="top-industries-heading">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2
              id="top-industries-heading"
              className="text-2xl font-bold tracking-tight text-[var(--primary)]"
            >
              Top ngành nghề nổi bật
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Đọc hướng dẫn headhunt theo ngành — trang công khai, không cần đăng nhập
            </p>
          </div>
          <Link
            href="/blog"
            className="text-sm font-semibold text-[var(--primary)] hover:underline"
          >
            Xem blog tuyển dụng
          </Link>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((industry) =>
            industry ? (
              <Link
                key={industry.id}
                href={industryBlogPath(industry.name)}
                className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-zinc-50/80 px-4 py-3.5 transition hover:border-[var(--primary)]/40 hover:bg-white hover:shadow-sm"
              >
                <span className="text-sm font-semibold text-zinc-800">{industry.name}</span>
                <span className="shrink-0 text-xs font-medium text-[var(--primary)]">
                  Xem bài viết
                </span>
              </Link>
            ) : null
          )}
        </div>
      </div>
    </section>
  );
}
