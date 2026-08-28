import Link from "next/link";
import { siteConfig } from "@/lib/site";

export type LegalSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
};

type Props = {
  title: string;
  description: string;
  updatedAt: string;
  sections: LegalSection[];
  jsonLd: Record<string, unknown>;
  related?: { href: string; label: string }[];
};

/** Trang pháp lý — đồng bộ tone marketing / brand Vstaff. */
export function LegalDocument({
  title,
  description,
  updatedAt,
  sections,
  jsonLd,
  related = [],
}: Props) {
  const updatedLabel = new Date(updatedAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <article className="bg-[var(--background)]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero — nền tối cố định (tránh mất contrast) */}
      <header
        className="relative overflow-hidden border-b border-[#0a4552]"
        style={{ backgroundColor: "#063540", color: "#f3f1ec" }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(155deg, #0a4552 0%, #063540 48%, #042a33 100%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.004]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-20 bottom-0 h-64 w-64 rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(125,255,179,0.1) 0%, transparent 65%)",
          }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <nav aria-label="Breadcrumb" className="text-sm" style={{ color: "#9ca3af" }}>
            <ol className="flex flex-wrap items-center gap-1.5">
              <li>
                <Link href="/" className="transition hover:opacity-80" style={{ color: "#9be8c0" }}>
                  Trang chủ
                </Link>
              </li>
              <li aria-hidden style={{ color: "#6b7280" }}>
                /
              </li>
              <li className="font-medium" style={{ color: "#e5e7eb" }} aria-current="page">
                {title}
              </li>
            </ol>
          </nav>

          <p
            className="mt-8 text-[0.7rem] font-semibold uppercase tracking-[0.22em]"
            style={{ color: "#9be8c0" }}
          >
            Pháp lý
          </p>
          <h1
            className="mt-3 max-w-3xl font-display text-3xl font-medium tracking-tight sm:text-4xl lg:text-[2.65rem]"
            style={{ color: "#ffffff" }}
          >
            {title}
          </h1>
          <p
            className="mt-4 max-w-2xl text-sm leading-relaxed sm:text-base"
            style={{ color: "#d4d4d8" }}
          >
            {description}
          </p>
          <p className="mt-5 text-sm" style={{ color: "#a1a1aa" }}>
            Cập nhật lần cuối:{" "}
            <time dateTime={updatedAt} className="font-medium" style={{ color: "#e4e4e7" }}>
              {updatedLabel}
            </time>
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[18rem_minmax(0,1fr)]">
          {/* Mục lục */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Mục lục
            </p>
            <nav aria-label="Mục lục tài liệu" className="mt-4">
              <ol className="space-y-1 border-l border-[var(--border)]">
                {sections.map((section) => {
                  const id = slugify(section.heading);
                  return (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className="block border-l-2 border-transparent py-1.5 pl-4 text-sm leading-snug text-zinc-600 transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
                      >
                        {section.heading}
                      </a>
                    </li>
                  );
                })}
              </ol>
            </nav>

            {related.length > 0 ? (
              <div className="mt-8 hidden lg:block">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  Liên quan
                </p>
                <ul className="mt-3 space-y-2">
                  {related.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-sm font-medium text-[var(--primary)] hover:underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </aside>

          {/* Nội dung */}
          <div className="min-w-0">
            <div className="space-y-10 rounded-2xl border border-[var(--border)] bg-white p-6 sm:p-8 lg:p-10">
              {sections.map((section) => {
                const id = slugify(section.heading);
                return (
                  <section key={id} id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28">
                    <h2
                      id={`${id}-heading`}
                      className="font-display text-xl font-medium tracking-tight text-zinc-900 sm:text-2xl"
                    >
                      {section.heading}
                    </h2>
                    {section.paragraphs?.map((p, i) => (
                      <p
                        key={`${id}-p-${i}`}
                        className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-[0.95rem]"
                      >
                        {p}
                      </p>
                    ))}
                    {section.bullets && section.bullets.length > 0 ? (
                      <ul className="mt-4 space-y-2.5">
                        {section.bullets.map((item, i) => (
                          <li
                            key={`${id}-b-${i}`}
                            className="flex items-start gap-3 text-sm leading-relaxed text-zinc-600 sm:text-[0.95rem]"
                          >
                            <span
                              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]"
                              aria-hidden
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                );
              })}

              <div className="border-t border-zinc-100 pt-6">
                <p className="text-sm leading-relaxed text-zinc-500">
                  Tài liệu này áp dụng cho nền tảng {siteConfig.name}. Mọi thắc mắc vui lòng liên hệ{" "}
                  <a
                    href="mailto:hello@vstaff.vn"
                    className="font-medium text-[var(--primary)] hover:underline"
                  >
                    hello@vstaff.vn
                  </a>
                  .
                </p>
              </div>
            </div>

            {related.length > 0 ? (
              <aside className="mt-8 lg:hidden">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                  Tài liệu liên quan
                </p>
                <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                  {related.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="font-medium text-[var(--primary)] hover:underline"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </aside>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
