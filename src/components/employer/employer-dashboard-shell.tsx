"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Menu } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { EMPLOYER_NAV_GROUPS } from "@/components/employer/employer-nav";
import { EmployerPlanQuotaBar } from "@/components/employer/employer-plan-quota-bar";
import { VstaffLogo } from "@/components/home/vstaff-logo";
import { Button } from "@/components/ui/button";
import type { EmployerSubscription } from "@/data/employer-subscription";

type Props = {
  children: ReactNode;
  subscription: EmployerSubscription | null;
  userEmail: string | null;
  signOutAction: () => Promise<void>;
};

export function EmployerDashboardShell({
  children,
  subscription,
  userEmail,
  signOutAction,
}: Props) {
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/95 backdrop-blur-sm">
        <div className="flex min-h-14 flex-wrap items-center gap-2 px-3 py-2 sm:gap-3 sm:px-6 sm:py-0">
          <button
            type="button"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] lg:hidden"
            onClick={() => setNavOpen(true)}
            aria-label="Mở menu"
          >
            <Menu className="h-4 w-4" aria-hidden />
          </button>

          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <VstaffLogo />
            <span className="hidden h-4 w-px bg-zinc-200 sm:block" aria-hidden />
            <span className="hidden text-sm text-zinc-500 sm:inline">Nhà tuyển dụng</span>
          </div>

          <div className="flex w-full min-w-0 items-center justify-end gap-2 sm:ml-auto sm:w-auto sm:gap-3">
            {subscription ? (
              <div className="min-w-0 flex-1 sm:flex-none">
                <EmployerPlanQuotaBar subscription={subscription} />
              </div>
            ) : null}
            <span className="hidden max-w-[12rem] truncate text-sm text-zinc-600 xl:inline">
              {userEmail}
            </span>
            <Link
              href="/dashboard/employer/tim-ung-vien"
              className="hidden text-sm font-medium text-[var(--primary)] hover:underline lg:inline"
            >
              Tìm ứng viên
            </Link>
            <form action={signOutAction}>
              <Button type="submit" variant="outline" size="sm" className="shrink-0">
                <span className="hidden sm:inline">Đăng xuất</span>
                <span className="sm:hidden">Thoát</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <DashboardSidebar
          groups={EMPLOYER_NAV_GROUPS}
          ariaLabel="Menu nhà tuyển dụng"
          drawerTitle="Menu NTD"
          mobileOpen={navOpen}
          onMobileOpenChange={setNavOpen}
        />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
