import type { ReactNode } from "react";
import Link from "next/link";
import { VstaffLogo } from "@/components/home/vstaff-logo";
import { siteConfig } from "@/lib/site";

type Props = {
  /** Nhãn nhỏ trên form (Đăng nhập / Đăng ký). */
  title: string;
  description: string;
  children: ReactNode;
  highlights?: readonly string[];
};

const DEFAULT_HIGHLIGHTS = [
  "Kho hồ sơ ứng viên chất lượng",
  "Lọc theo ngành, kỹ năng, địa bàn",
  "Headhunt nhanh — không cần đăng tin",
] as const;

/** Split 2 cột: trái brand (theo banner), phải form. */
export function AuthPageShell({
  title,
  description,
  children,
  highlights = DEFAULT_HIGHLIGHTS,
}: Props) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* —— Trái: thông tin brand —— */}
      <aside className="relative flex min-h-[22rem] items-center justify-center overflow-hidden bg-[#063540] px-6 py-12 text-zinc-100 sm:px-10 sm:py-14 lg:min-h-screen lg:px-12 xl:px-16">
        {/* Gradient chiều sâu */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(155deg, #0a4552 0%, #063540 45%, #042a33 100%)",
          }}
          aria-hidden
        />
        {/* Lưới nhạt */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.004]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
          aria-hidden
        />
        {/* Ánh nhẹ góc dưới */}
        <div
          className="pointer-events-none absolute -right-24 bottom-0 h-[24rem] w-[24rem] rounded-full"
          style={{
            background: "radial-gradient(circle, rgba(125,255,179,0.07) 0%, transparent 65%)",
          }}
          aria-hidden
        />
        {/* Vignette mép */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 100% 90% at 50% 45%, transparent 40%, rgba(2,20,26,0.4) 100%)",
          }}
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-md text-left">
          <VstaffLogo light href="/" size="brand" className="gap-3" />

          <p className="mt-10 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#9be8c0]">
            Nhà tuyển dụng
          </p>
          <h1 className="mt-4 font-display text-3xl font-medium leading-[1.15] tracking-tight text-white sm:text-4xl xl:text-[2.65rem]">
            Headhunter số cho nhà tuyển dụng
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-zinc-300 sm:text-[0.95rem]">
            {siteConfig.description}
          </p>

          <ul className="mt-8 space-y-3.5 border-t border-white/10 pt-8">
            {highlights.map((item) => (
              <li
                key={item}
                className="flex items-start gap-3 text-sm text-zinc-100 sm:text-[0.95rem]"
              >
                <span
                  className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#7dffb3]"
                  aria-hidden
                />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* —— Phải: form —— */}
      <div className="flex flex-col bg-[var(--background)] lg:min-h-screen">
        <div className="flex flex-1 flex-col justify-center px-6 py-10 sm:px-10 lg:px-14 xl:px-20">
          <div className="mx-auto w-full max-w-md">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Tài khoản
            </p>
            <h2 className="mt-2 font-display text-3xl font-medium tracking-tight text-zinc-900">
              {title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">{description}</p>

            <div className="mt-8">{children}</div>

            <div className="mt-8 space-y-2 text-center text-xs text-zinc-400">
              <p>
                Cần hỗ trợ?{" "}
                <Link
                  href="mailto:hello@vstaff.vn"
                  className="font-medium text-[var(--primary)] hover:underline"
                >
                  hello@vstaff.vn
                </Link>
                {" · "}
                <Link href="/" className="font-medium text-[var(--primary)] hover:underline">
                  Về trang chủ
                </Link>
              </p>
              <p>© {new Date().getFullYear()} {siteConfig.name}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
