import Link from "next/link";
import { listBlogPosts } from "@/lib/seo/blog-catalog";
import { getSiteUrl, siteConfig } from "@/lib/site";

const FEATURED_SLUGS = [
  "tim-viec-lam",
  "viec-di-lam-ngay",
  "viec-lam-ha-noi",
  "viec-lam-ho-chi-minh",
  "viec-lam-it-phan-mem",
  "tuyen-truong-phong",
  "cv-mien-phi-cho-nha-tuyen-dung",
  "tim-ung-vien-mien-phi",
];

export function HomeSeoSection() {
  const siteUrl = getSiteUrl();
  const posts = listBlogPosts();
  const featured = FEATURED_SLUGS.map((s) => posts.find((p) => p.slug === s)).filter(Boolean);
  const roles = posts
    .filter((p) => p.kind === "keyword" && p.slug.startsWith("tuyen-") && !p.slug.includes("-tai-"))
    .slice(0, 10);
  const industries = posts.filter((p) => p.kind === "industry").slice(0, 8);
  const provinces = posts.filter((p) => p.kind === "province").slice(0, 8);

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `${siteConfig.name} — Headhunter & kho hồ sơ ứng viên`,
    description: siteConfig.description,
    url: siteUrl,
    inLanguage: "vi-VN",
    isPartOf: {
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteUrl,
    },
  };

  return (
    <section className="bg-white py-16 sm:py-20" aria-labelledby="seo-heading">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />

      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-4 border-b border-[var(--border)] pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <h2
              id="seo-heading"
              className="font-display text-2xl font-medium tracking-tight text-zinc-900 sm:text-3xl"
            >
              Khám phá theo nhu cầu tuyển dụng
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base">
              CV miễn phí, cung cấp hồ sơ, tìm ứng viên và việc làm theo ngành, tỉnh thành.
            </p>
          </div>
          <Link
            href="/blog"
            className="shrink-0 text-sm font-semibold text-[var(--primary)] transition hover:opacity-80"
          >
            Xem tất cả bài viết →
          </Link>
        </div>

        {featured.length > 0 ? (
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {featured.map((p) =>
              p ? (
                <div key={p.slug}>
                  <Link
                    href={p.path}
                    className="text-sm font-semibold text-zinc-900 hover:text-[var(--primary)]"
                  >
                    {p.h1}
                  </Link>
                  <p className="mt-0.5 text-sm text-zinc-500">{p.description}</p>
                </div>
              ) : null
            )}
          </div>
        ) : null}

        <div className="mt-12 grid gap-12 md:grid-cols-3">
          <div>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Tuyển theo vị trí
            </h3>
            <ul className="mt-4 space-y-2">
              {roles.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={p.path}
                    className="text-sm text-zinc-700 transition hover:text-[var(--primary)]"
                  >
                    {p.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Theo địa bàn
            </h3>
            <ul className="mt-4 space-y-2">
              {provinces.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={p.path}
                    className="text-sm text-zinc-700 transition hover:text-[var(--primary)]"
                  >
                    {p.h1.replace("Headhunt ứng viên tại ", "")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-zinc-400">
              Theo ngành
            </h3>
            <ul className="mt-4 space-y-2">
              {industries.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={p.path}
                    className="text-sm text-zinc-700 transition hover:text-[var(--primary)]"
                  >
                    {p.h1.replace("Headhunt ứng viên ngành ", "")}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
