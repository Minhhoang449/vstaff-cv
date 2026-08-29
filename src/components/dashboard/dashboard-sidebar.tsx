"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import type { DashboardNavGroup } from "@/components/dashboard/dashboard-nav-types";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

type Props = {
  groups: readonly DashboardNavGroup[];
  ariaLabel: string;
  drawerTitle: string;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
};

export function DashboardSidebar({
  groups,
  ariaLabel,
  drawerTitle,
  mobileOpen,
  onMobileOpenChange,
}: Props) {
  const pathname = usePathname();

  const nav = (
    <nav className="flex flex-1 flex-col gap-5 overflow-y-auto px-3 py-4" aria-label={ariaLabel}>
      {groups.map((group) => (
        <div key={group.title}>
          <p className="px-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-zinc-400">
            {group.title}
          </p>
          <ul className="mt-2 space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href, item.exact);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => onMobileOpenChange(false)}
                    className={cn(
                      "flex min-h-[2.75rem] items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition",
                      active
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-[var(--primary)]"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0 opacity-90" aria-hidden />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <>
      <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-64 shrink-0 flex-col self-start overflow-y-auto border-r border-[var(--border)] bg-white lg:flex">
        {nav}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
            aria-label="Đóng menu"
            onClick={() => onMobileOpenChange(false)}
          />
          <aside className="relative flex h-full w-[min(18rem,88vw)] flex-col bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <span className="text-sm font-semibold text-zinc-900">{drawerTitle}</span>
              <button
                type="button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg hover:bg-zinc-100"
                onClick={() => onMobileOpenChange(false)}
                aria-label="Đóng menu"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      ) : null}
    </>
  );
}
