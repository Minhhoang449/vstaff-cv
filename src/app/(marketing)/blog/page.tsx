import type { Metadata } from "next";
import Link from "next/link";
import { listBlogPosts } from "@/lib/seo/blog-catalog";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog tuyển dụng, CV & việc làm",
  description: `SEO việc làm theo tỉnh, vị trí, fresher/remote — cùng CV miễn phí, cung cấp CV, tìm ứng viên trên ${siteConfig.name}.`,
  keywords: siteConfig.keywords,
  alternates: { canonical: "/blog" },
  openGraph: {
    title: `Blog | ${siteConfig.name}`,
    description: `Blog từ khóa tuyển dụng, CV và việc làm trên ${siteConfig.name}.`,
    url: "/blog",
    type: "website",
    images: [{ url: "/brand/vstaff-logo.png", width: 1024, height: 1024, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog | ${siteConfig.name}`,
    description: `Blog từ khóa tuyển dụng, CV và việc làm trên ${siteConfig.name}.`,
    images: ["/brand/vstaff-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const JOBBOARD_EYEBROWS = new Set([
  "Việc làm",
  "Việc làm theo tỉnh",
  "Việc làm theo vị trí",
  "Việc làm × địa bàn",
  "Theo nghề nghiệp",
  "Theo cấp bậc",
  "Theo kỹ năng",
  "Tìm việc làm",
  "Đi làm ngay",
  "Không cần CV",
  "Toàn quốc",
  "Ngành × tỉnh",
  "Fresher",
  "Thực tập",
  "Part-time",
  "Remote",
  "Không YC KN",
  "Full-time",
  "Lương cao",
  "Tại nhà",
]);

const ROLE_EYEBROWS = new Set([
  "Tuyển theo vị trí",
  "Vị trí × địa bàn",
  "Ứng viên theo vị trí",
]);

export default function BlogIndexPage() {
  const posts = listBlogPosts();
  const keywords = posts.filter((p) => p.kind === "keyword");

  const viecLamPillar = keywords.filter((p) =>
    ["viec-lam", "tim-viec-lam", "viec-di-lam-ngay", "viec-khong-can-cv", "viec-lam-toan-quoc"].includes(
      p.slug
    )
  );
  const viecLamCities = keywords.filter(
    (p) => p.eyebrow === "Việc làm theo tỉnh" || p.eyebrow === "Việc làm tỉnh (VNW)"
  );
  const viecLamRoles = keywords.filter((p) => p.eyebrow === "Việc làm theo vị trí");
  const occupations = keywords.filter((p) => p.eyebrow === "Theo nghề nghiệp");
  const levels = keywords.filter((p) => p.eyebrow === "Theo cấp bậc");
  const industryCities = keywords.filter((p) => p.eyebrow === "Ngành × tỉnh").slice(0, 40);
  const viecLamRoleCities = keywords
    .filter((p) => p.eyebrow === "Việc làm × địa bàn")
    .slice(0, 40);
  const facets = keywords.filter((p) =>
    ["Fresher", "Thực tập", "Part-time", "Remote", "Không YC KN", "Full-time", "Lương cao", "Tại nhà"].includes(
      p.eyebrow
    )
  );
  const skills = keywords.filter((p) => p.eyebrow === "Theo kỹ năng");

  const hubs = keywords.filter(
    (p) => !JOBBOARD_EYEBROWS.has(p.eyebrow) && !ROLE_EYEBROWS.has(p.eyebrow)
  );
  const roleCandidates = keywords.filter((p) => p.eyebrow === "Ứng viên theo vị trí");
  const roles = keywords.filter((p) => p.eyebrow === "Tuyển theo vị trí");
  const roleCities = keywords.filter((p) => p.eyebrow === "Vị trí × địa bàn").slice(0, 36);
  const guides = posts.filter((p) => p.kind === "guide");
  const industries = posts.filter((p) => p.kind === "industry");
  const provinces = posts.filter((p) => p.kind === "province");
  const combos = posts.filter((p) => p.kind === "combo").slice(0, 24);
  const siteUrl = getSiteUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Blog ${siteConfig.name}`,
    url: `${siteUrl}/blog`,
    inLanguage: "vi-VN",
    publisher: { "@type": "Organization", name: siteConfig.name, url: siteUrl },
  };

  return (
    <div className="bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header
        className="border-b border-[#0a4552]"
        style={{ backgroundColor: "#063540", color: "#f3f1ec" }}
      >
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <p
            className="text-[0.7rem] font-semibold uppercase tracking-[0.18em]"
            style={{ color: "#9be8c0" }}
          >
            Blog · Từ khóa tuyển dụng
          </p>
          <h1 className="mt-3 font-display text-3xl font-medium tracking-tight sm:text-4xl">
            Blog tuyển dụng, CV & việc làm
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed sm:text-base" style={{ color: "#d4d4d8" }}>
            Việc làm theo tỉnh, theo vị trí, fresher/remote, kỹ năng — viết góc nhà tuyển dụng. Đọc
            không cần đăng nhập.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-14 px-4 py-12 sm:px-6 lg:px-8">
        <BlogGroup title="Hub việc làm & tuyển dụng" posts={viecLamPillar} />
        <BlogGroup title="Việc làm theo hình thức" posts={facets} />
        <BlogGroup title="Theo nghề nghiệp" posts={occupations} columns />
        <BlogGroup title="Theo cấp bậc" posts={levels} columns />
        <BlogGroup title="Việc làm theo tỉnh/thành" posts={viecLamCities} columns />
        <BlogGroup title="Việc làm theo vị trí" posts={viecLamRoles} columns />
        <BlogGroup title="Ngành × thành phố" posts={industryCities} columns />
        <BlogGroup title="Việc làm × thành phố (long-tail)" posts={viecLamRoleCities} columns />
        <BlogGroup title="Ứng viên theo kỹ năng" posts={skills} columns />
        <BlogGroup title="Từ khóa NTD (CV · cung cấp · tìm ứng viên)" posts={hubs} />
        <BlogGroup title="Tuyển theo vị trí" posts={roles} columns />
        <BlogGroup title="Ứng viên theo vị trí" posts={roleCandidates} columns />
        <BlogGroup title="Tuyển × thành phố" posts={roleCities} columns />
        <BlogGroup title="Kiến thức headhunt" posts={guides} />
        <BlogGroup title="Theo ngành" posts={industries} columns />
        <BlogGroup title="Theo địa bàn (headhunt)" posts={provinces} columns />
        <BlogGroup title="Ngành × địa bàn" posts={combos} columns />
      </div>
    </div>
  );
}

function BlogGroup({
  title,
  posts,
  columns,
}: {
  title: string;
  posts: ReturnType<typeof listBlogPosts>;
  columns?: boolean;
}) {
  if (posts.length === 0) return null;
  return (
    <section>
      <h2 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-zinc-400">
        {title}
      </h2>
      <ul className={columns ? "mt-4 columns-1 gap-x-8 sm:columns-2 lg:columns-3" : "mt-4 space-y-3"}>
        {posts.map((p) => (
          <li key={p.slug} className={columns ? "mb-2 break-inside-avoid" : undefined}>
            <Link
              href={p.path}
              className="text-sm font-medium text-zinc-800 transition hover:text-[var(--primary)]"
            >
              {p.h1}
            </Link>
            {!columns ? (
              <p className="mt-1 text-sm text-zinc-500">{p.description}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
