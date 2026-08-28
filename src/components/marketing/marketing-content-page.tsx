import type { ReactNode } from "react";
import Link from "next/link";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

/** Hero + khung nội dung marketing (Giới thiệu / Liên hệ). */
export function MarketingContentPage({ eyebrow, title, description, children }: Props) {
  return (
    <div className="bg-[var(--background)]">
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
            {eyebrow}
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
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">{children}</div>
    </div>
  );
}
