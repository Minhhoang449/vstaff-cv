import Link from "next/link";
import type { BlogPost } from "@/lib/seo/blog-catalog";
import { getSiteUrl, siteConfig } from "@/lib/site";

type Props = {
  post: BlogPost;
  related: BlogPost[];
};

export function BlogArticlePage({ post, related }: Props) {
  const siteUrl = getSiteUrl();
  const canonical = `${siteUrl}${post.path}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    alternativeHeadline: post.h1,
    description: post.description,
    inLanguage: "vi-VN",
    keywords: post.tags.join(", "),
    datePublished: "2026-08-01",
    dateModified: "2026-08-27",
    author: { "@type": "Organization", name: siteConfig.name, url: siteUrl },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/brand/vstaff-logo.png`,
      },
    },
    image: [`${siteUrl}/brand/vstaff-logo.png`],
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonical,
    },
    url: canonical,
    isAccessibleForFree: true,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${siteUrl}/blog` },
      { "@type": "ListItem", position: 3, name: post.h1, item: canonical },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <article className="bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <header
        className="border-b border-[#0a4552]"
        style={{ backgroundColor: "#063540", color: "#f3f1ec" }}
      >
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
          <nav aria-label="Breadcrumb" className="text-sm" style={{ color: "#9ca3af" }}>
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" style={{ color: "#9be8c0" }}>
                  Trang chủ
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li>
                <Link href="/blog" style={{ color: "#9be8c0" }}>
                  Blog
                </Link>
              </li>
              <li aria-hidden>/</li>
              <li style={{ color: "#e5e7eb" }} aria-current="page">
                {post.eyebrow}
              </li>
            </ol>
          </nav>
          <p
            className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "#9be8c0" }}
          >
            {post.eyebrow}
          </p>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            {post.h1}
          </h1>
          <p className="mt-4 text-sm leading-relaxed sm:text-base" style={{ color: "#d4d4d8" }}>
            {post.description}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
        <p className="text-base leading-relaxed text-zinc-700">{post.intro}</p>

        <div className="mt-10 space-y-8">
          {post.sections.map((s) => (
            <section key={s.heading}>
              <h2 className="font-display text-xl font-medium tracking-tight text-zinc-900">
                {s.heading}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-[0.95rem]">
                {s.body}
              </p>
            </section>
          ))}
        </div>

        <section className="mt-12" aria-labelledby="blog-faq">
          <h2
            id="blog-faq"
            className="font-display text-xl font-medium tracking-tight text-zinc-900"
          >
            Câu hỏi thường gặp
          </h2>
          <dl className="mt-5 space-y-4">
            {post.faqs.map((f) => (
              <div key={f.q} className="rounded-xl border border-[var(--border)] bg-white px-5 py-4">
                <dt className="text-sm font-semibold text-zinc-900">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-zinc-600">{f.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <aside className="mt-12 rounded-2xl border border-[var(--border)] bg-white p-6 sm:p-8">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Dành cho nhà tuyển dụng
          </p>
          <h2 className="mt-2 font-display text-xl font-medium text-zinc-900">
            Bắt đầu headhunt trên {siteConfig.name}
          </h2>
          <p className="mt-2 text-sm text-zinc-600">
            Tạo tài khoản miễn phí để dùng kho hồ sơ. Không cần đăng nhập để đọc bài viết này — chỉ
            cần đăng ký khi bạn sẵn sàng tìm ứng viên.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/dang-ky"
              className="inline-flex h-10 items-center rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)]"
            >
              Đăng ký nhà tuyển dụng
            </Link>
            <Link
              href="/blog/viec-lam"
              className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700"
            >
              Hub việc làm
            </Link>
            <Link
              href="/lien-he"
              className="inline-flex h-10 items-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-700"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </aside>

        <nav className="mt-10 border-t border-[var(--border)] pt-8" aria-label="Khám phá thêm">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-zinc-400">
            Khám phá thêm
          </p>
          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
            <li>
              <Link href="/blog/tim-viec-lam" className="text-zinc-700 hover:text-[var(--primary)]">
                Tìm việc làm
              </Link>
            </li>
            <li>
              <Link href="/blog/viec-lam" className="text-zinc-700 hover:text-[var(--primary)]">
                Việc làm
              </Link>
            </li>
            <li>
              <Link href="/blog/viec-di-lam-ngay" className="text-zinc-700 hover:text-[var(--primary)]">
                Đi làm ngay
              </Link>
            </li>
            <li>
              <Link href="/blog/viec-khong-can-cv" className="text-zinc-700 hover:text-[var(--primary)]">
                Không cần CV
              </Link>
            </li>
            <li>
              <Link href="/blog/viec-lam-ha-noi" className="text-zinc-700 hover:text-[var(--primary)]">
                Việc làm Hà Nội
              </Link>
            </li>
            <li>
              <Link href="/blog/viec-lam-ho-chi-minh" className="text-zinc-700 hover:text-[var(--primary)]">
                Việc làm TP.HCM
              </Link>
            </li>
            <li>
              <Link href="/blog/viec-lam-fresher" className="text-zinc-700 hover:text-[var(--primary)]">
                Fresher
              </Link>
            </li>
            <li>
              <Link href="/blog/viec-lam-remote" className="text-zinc-700 hover:text-[var(--primary)]">
                Remote
              </Link>
            </li>
            <li>
              <Link href="/blog/tuyen-truong-phong" className="text-zinc-700 hover:text-[var(--primary)]">
                Trưởng phòng
              </Link>
            </li>
            <li>
              <Link href="/blog/viec-lam-it-phan-mem" className="text-zinc-700 hover:text-[var(--primary)]">
                IT - Phần mềm
              </Link>
            </li>
            <li>
              <Link href="/blog/tim-ung-vien-mien-phi" className="text-zinc-700 hover:text-[var(--primary)]">
                Tìm ứng viên miễn phí
              </Link>
            </li>
            <li>
              <Link href="/blog" className="text-zinc-700 hover:text-[var(--primary)]">
                Tất cả bài viết
              </Link>
            </li>
          </ul>
        </nav>

        {related.length > 0 ? (
          <section className="mt-12" aria-labelledby="related-blog">
            <h2
              id="related-blog"
              className="font-display text-xl font-medium tracking-tight text-zinc-900"
            >
              Bài viết liên quan
            </h2>
            <ul className="mt-4 space-y-2">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={r.path}
                    className="text-sm font-medium text-zinc-700 hover:text-[var(--primary)]"
                  >
                    {r.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  );
}
