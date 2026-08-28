"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { LayoutDashboard, LogOut, Menu, X } from "lucide-react";
import { VstaffLogo } from "@/components/home/vstaff-logo";
import { cn } from "@/lib/utils";

const NAV_GUEST = [
  { href: "/blog", label: "Blog" },
  { href: "/gioi-thieu", label: "Giới thiệu" },
  { href: "/lien-he", label: "Liên hệ" },
] as const;

const btnOutline =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-md border border-[var(--primary)]/80 px-4 text-sm font-semibold tracking-wide text-[var(--primary)] transition hover:bg-[var(--primary)]/5";
const btnPrimary =
  "inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold tracking-wide text-[var(--primary-foreground)] transition hover:opacity-92";
const navItemClass =
  "inline-flex h-10 items-center rounded-md px-3 text-sm font-medium tracking-wide text-zinc-600 outline-none transition-colors hover:bg-zinc-50 hover:text-[var(--primary)]";

function dashboardHref(role?: string) {
  if (role === "ADMIN") return "/dashboard/admin";
  return "/dashboard/employer";
}

function dashboardLabel(role?: string) {
  if (role === "ADMIN") return "Quản trị";
  return "Bảng điều khiển";
}

export function HomeHeader() {
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isLoading = status === "loading";
  const user = session?.user;
  const role = user?.role;
  const isAuthed = status === "authenticated" && !!user;

  const navItems = isAuthed
    ? [
        { href: "/dashboard/employer/tim-ung-vien", label: "Tìm ứng viên" },
        { href: dashboardHref(role), label: dashboardLabel(role) },
      ]
    : [...NAV_GUEST];

  async function onSignOut() {
    setSigningOut(true);
    await signOut({ callbackUrl: "/" });
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)]/80 bg-[var(--background)]/90 backdrop-blur-md">
      <div className="flex h-16 w-full items-center justify-between gap-6 px-4 sm:px-6 lg:h-[4.25rem] lg:px-8 xl:px-10">
        <div className="flex min-w-0 flex-1 items-center">
          <VstaffLogo className="shrink-0" />

          <nav
            className="ml-8 hidden min-w-0 items-center gap-0.5 xl:ml-10 2xl:ml-12 lg:flex"
            aria-label="Điều hướng chính"
          >
            {navItems.map((item) => (
              <Link key={item.href + item.label} href={item.href} className={navItemClass}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2.5 sm:gap-3">
          {isLoading ? (
            <span className="hidden h-10 w-40 animate-pulse rounded-md bg-zinc-200/80 sm:block" />
          ) : isAuthed ? (
            <>
              <span className="hidden max-w-[12rem] truncate text-sm text-zinc-600 xl:inline">
                {user.email}
              </span>
              <Link href={dashboardHref(role)} className={cn(btnOutline, "hidden sm:inline-flex")}>
                <LayoutDashboard className="h-4 w-4" aria-hidden />
                {dashboardLabel(role)}
              </Link>
              <button
                type="button"
                onClick={onSignOut}
                disabled={signingOut}
                className={btnPrimary}
              >
                <LogOut className="h-4 w-4" aria-hidden />
                {signingOut ? "Đang thoát..." : "Đăng xuất"}
              </button>
            </>
          ) : (
            <>
              <Link href="/dang-ky" className={cn(btnOutline, "hidden sm:inline-flex")}>
                Đăng ký
              </Link>
              <Link href="/dang-nhap" className={btnPrimary}>
                Đăng nhập NTD
              </Link>
            </>
          )}

          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 transition hover:bg-zinc-50 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-zinc-100 bg-white lg:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <nav className="flex flex-col gap-1 px-4 py-3 sm:px-6" aria-label="Menu mobile">
          {navItems.map((item) => (
            <Link
              key={item.href + item.label}
              href={item.href}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          <div className="mt-3 grid gap-2">
            {isAuthed ? (
              <>
                {user.email ? (
                  <p className="px-1 text-xs text-zinc-500">{user.email}</p>
                ) : null}
                <Link
                  href={dashboardHref(role)}
                  className="rounded-lg border border-[var(--primary)] px-3 py-2.5 text-center text-sm font-semibold text-[var(--primary)]"
                  onClick={() => setMobileOpen(false)}
                >
                  {dashboardLabel(role)}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    void onSignOut();
                  }}
                  disabled={signingOut}
                  className="rounded-lg bg-[var(--primary)] px-3 py-2.5 text-center text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-70"
                >
                  {signingOut ? "Đang thoát..." : "Đăng xuất"}
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/dang-ky"
                  className="rounded-lg border border-[var(--primary)] px-3 py-2.5 text-center text-sm font-semibold text-[var(--primary)]"
                  onClick={() => setMobileOpen(false)}
                >
                  Đăng ký NTD
                </Link>
                <Link
                  href="/dang-nhap"
                  className="rounded-lg bg-[var(--primary)] px-3 py-2.5 text-center text-sm font-semibold text-[var(--primary-foreground)]"
                  onClick={() => setMobileOpen(false)}
                >
                  Đăng nhập NTD
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
