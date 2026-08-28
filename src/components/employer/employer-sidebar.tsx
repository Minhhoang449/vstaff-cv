"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BadgePercent,
  Bookmark,
  CreditCard,
  Eye,
  History,
  LayoutDashboard,
  ListChecks,
  Mail,
  Menu,
  Search,
  Settings,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const NAV_GROUPS = [
  {
    title: "Làm việc",
    items: [
      { href: "/dashboard/employer", label: "Tổng quan", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/employer/tim-ung-vien", label: "Tìm ứng viên", icon: Search },
      { href: "/dashboard/employer/da-luu", label: "Ứng viên đã lưu", icon: Bookmark },
      { href: "/dashboard/employer/da-mo", label: "Ứng viên đã mở", icon: Eye },
    ],
  },
  {
    title: "Tự động hóa",
    items: [
      {
        href: "/dashboard/employer/danh-sach",
        label: "Danh sách ứng viên",
        icon: ListChecks,
      },
      { href: "/dashboard/employer/email", label: "Email tự động", icon: Mail },
    ],
  },
  {
    title: "Tài khoản",
    items: [
      { href: "/dashboard/employer/bang-gia", label: "Bảng giá", icon: CreditCard },
      { href: "/dashboard/employer/khuyen-mai", label: "Khuyến mãi", icon: BadgePercent },
      {
        href: "/dashboard/employer/lich-su-kich-hoat",
        label: "Lịch sử kích hoạt",
        icon: History,
      },
      { href: "/dashboard/employer/cai-dat", label: "Cài đặt", icon: Settings },
    ],
  },
] as const;

function isActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function EmployerSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-1 flex-col gap-6 px-3 py-4" aria-label="Menu nhà tuyển dụng">
      {NAV_GROUPS.map((group) => (
        <div key={group.title}>
          <p className="px-2.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-zinc-400">
            {group.title}
          </p>
          <ul className="mt-2 space-y-0.5">
            {group.items.map((item) => {
              const active = isActive(pathname, item.href, "exact" in item ? item.exact : false);
              const Icon = item.icon;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition",
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
      <div className="flex items-center gap-2 border-b border-[var(--border)] bg-white px-4 py-3 lg:hidden">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)]"
          onClick={() => setOpen(true)}
          aria-label="Mở menu"
        >
          <Menu className="h-4 w-4" />
        </button>
        <span className="text-sm font-medium text-zinc-700">Menu NTD</span>
      </div>

      <aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 flex-col self-start overflow-y-auto border-r border-[var(--border)] bg-white lg:flex">
        {nav}
      </aside>

      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Đóng menu"
            onClick={() => setOpen(false)}
          />
          <aside className="relative flex h-full w-72 max-w-[85vw] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
              <span className="text-sm font-semibold">Menu NTD</span>
              <button
                type="button"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md hover:bg-zinc-100"
                onClick={() => setOpen(false)}
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      ) : null}
    </>
  );
}
