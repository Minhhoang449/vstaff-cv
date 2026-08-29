"use client";

import { useEffect, useState } from "react";
import { Briefcase, Search, Sparkles, Users } from "lucide-react";
import { EmployerPageShell } from "@/components/employer/employer-page-shell";
import { cn } from "@/lib/utils";

const MESSAGES = [
  "Đang mở kho ứng viên cho bạn…",
  "AI headhunt đang sắp xếp hồ sơ nóng…",
  "Lọc ứng viên xịn — gần xong rồi!",
  "Đếm CV trong kho — thêm chút nữa thôi…",
  "Chuẩn bị bàn làm việc tuyển dụng…",
];

type Props = {
  /** Trang tìm ứng viên full-width — skeleton 2 cột */
  variant?: "default" | "search";
};

function FunLoaderCore({ compact }: { compact?: boolean }) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 2600);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col items-center text-center",
        compact ? "gap-3 py-6" : "gap-5 py-10"
      )}
    >
      <div className="relative flex h-[5rem] w-[5rem] items-center justify-center">
        <div
          className="employer-loader-orbit-ring pointer-events-none absolute inset-0"
          aria-hidden
        >
          <Sparkles className="absolute left-1/2 top-0 h-4 w-4 -translate-x-1/2 text-[var(--accent)]" />
          <Briefcase className="absolute bottom-0 left-1/2 h-4 w-4 -translate-x-1/2 text-[var(--primary)]/65" />
        </div>
        <div className="employer-loader-bounce flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)]/10 shadow-inner">
          <Users className="h-7 w-7 text-[var(--primary)]" aria-hidden />
        </div>
      </div>

      <div className="min-h-[2.75rem] max-w-xs px-2">
        <p
          key={msgIndex}
          className="employer-loader-msg text-sm font-medium text-zinc-700"
        >
          {MESSAGES[msgIndex]}
        </p>
      </div>

      <div className="h-1.5 w-44 overflow-hidden rounded-full bg-zinc-200/80">
        <div className="employer-loader-shimmer h-full w-1/2 rounded-full bg-gradient-to-r from-transparent via-[var(--primary)] to-transparent" />
      </div>

      <p className="text-[11px] text-zinc-400">Vstaff · Tool AI & Bot CV</p>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-zinc-100">
      <div className="flex flex-col gap-3 p-2 sm:gap-4 sm:p-3 lg:flex-row lg:items-start lg:gap-4 lg:p-4">
        <aside className="w-full shrink-0 lg:w-[17.5rem] xl:w-[18.5rem]">
          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_4px_24px_-8px_rgba(15,40,60,0.12)]">
            <div className="mb-4 flex items-center gap-2">
              <Search className="h-4 w-4 text-[var(--primary)]" aria-hidden />
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
            </div>
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-9 animate-pulse rounded-lg bg-zinc-100" />
              ))}
            </div>
          </div>
        </aside>
        <section className="min-w-0 flex-1">
          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_4px_24px_-8px_rgba(15,40,60,0.12)]">
            <FunLoaderCore compact />
            <div className="space-y-0 border-t border-zinc-100 px-4 pb-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex gap-3 border-b border-zinc-50 py-4 last:border-0"
                >
                  <div className="h-11 w-11 shrink-0 animate-pulse rounded-full bg-zinc-100" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-2/3 animate-pulse rounded bg-zinc-100" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-zinc-50" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function EmployerDashboardLoading({ variant = "default" }: Props) {
  if (variant === "search") {
    return <SearchSkeleton />;
  }

  return (
    <EmployerPageShell>
      <div className="flex min-h-[min(70vh,32rem)] items-center justify-center">
        <div className="w-full max-w-sm rounded-2xl border border-zinc-200/80 bg-white px-6 shadow-[0_8px_32px_-12px_rgba(15,40,60,0.14)]">
          <FunLoaderCore />
        </div>
      </div>
    </EmployerPageShell>
  );
}
