import Link from "next/link";
import { VstaffLogo } from "@/components/home/vstaff-logo";
import { siteConfig } from "@/lib/site";

/** Header gọn — giữ cho chỗ không dùng HomeHeader. */
export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--border)]/80 bg-[var(--background)]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:h-[4.25rem] sm:px-6">
        <div className="flex items-center gap-4 sm:gap-6">
          <VstaffLogo />
          <nav className="hidden items-center gap-1 sm:flex">
            <Link
              href="/blog"
              className="rounded-md px-2.5 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50 hover:text-[var(--primary)]"
            >
              Blog
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/dang-ky"
            className="hidden h-9 items-center rounded-md border border-[var(--primary)]/80 px-3.5 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--primary)]/5 sm:inline-flex"
          >
            Đăng ký
          </Link>
          <Link
            href="/dang-nhap"
            className="inline-flex h-9 items-center rounded-md bg-[var(--primary)] px-3.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-92"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-zinc-200 bg-white py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <VstaffLogo size="sm" />
          <p>
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
        <div className="flex gap-4">
          <Link href="/blog" className="hover:text-[var(--primary)]">
            Blog
          </Link>
          <Link href="/dang-nhap" className="hover:text-[var(--primary)]">
            Đăng nhập
          </Link>
          <Link href="/dang-ky" className="hover:text-[var(--primary)]">
            Đăng ký
          </Link>
        </div>
      </div>
    </footer>
  );
}
