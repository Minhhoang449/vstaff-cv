import { EmployerPageShell } from "@/components/employer/employer-page-shell";
import type { Metadata } from "next";
import Link from "next/link";
import {
  BadgePercent,
  Bookmark,
  CreditCard,
  Eye,
  ListChecks,
  Mail,
  Search,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { EMPLOYER_PLANS, formatVnd } from "@/data/employer-plans";
import { listMatchedCandidates, listRecentCandidates } from "@/lib/candidates";

export const metadata: Metadata = {
  title: "Tổng quan NTD",
  robots: { index: false, follow: false },
};

const QUICK_LINKS = [
  {
    href: "/dashboard/employer/tim-ung-vien",
    title: "Tìm ứng viên",
    desc: "Duyệt và lọc kho hồ sơ",
    icon: Search,
  },
  {
    href: "/dashboard/employer/da-luu",
    title: "Ứng viên đã lưu",
    desc: "Hồ sơ bạn đánh dấu",
    icon: Bookmark,
  },
  {
    href: "/dashboard/employer/da-mo",
    title: "Ứng viên đã mở",
    desc: "Hồ sơ đã xem — SĐT & email",
    icon: Eye,
  },
  {
    href: "/dashboard/employer/danh-sach",
    title: "Danh sách ứng viên",
    desc: "Chuẩn bị gửi CV tự động mỗi ngày",
    icon: ListChecks,
  },
  {
    href: "/dashboard/employer/email",
    title: "Email tự động",
    desc: "Gửi đồng loạt tới ứng viên",
    icon: Mail,
  },
] as const;

const PROMO_NOTICES = [
  {
    id: "promo-standard",
    badge: "Khuyến mãi",
    title: "Giảm 15% gói Phổ biến trong tuần này",
    body: "Áp dụng gói 30 ngày không giới hạn CV — ưu đãi demo cho NTD mới.",
    href: "/dashboard/employer/khuyen-mai",
    cta: "Xem khuyến mãi",
  },
  {
    id: "promo-trial",
    badge: "Dùng thử",
    title: "Gói Trải nghiệm 5 ngày — chỉ 399.000₫",
    body: "200 CV để kiểm chứng chất lượng kho hồ sơ trước khi nâng gói.",
    href: "/dashboard/employer/khuyen-mai",
    cta: "Xem ưu đãi",
  },
] as const;

function formatRelativeDate(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const days = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
  if (days === 0) return "Hôm nay";
  if (days === 1) return "Hôm qua";
  if (days < 7) return `${days} ngày trước`;
  return new Date(iso).toLocaleDateString("vi-VN");
}

export default async function EmployerDashboardPage() {
  const featured = EMPLOYER_PLANS.find((p) => p.highlight) ?? EMPLOYER_PLANS[1];

  const newCandidates = await listRecentCandidates(5);
  const matchSkills = ["React", "TypeScript", "Next.js"];
  const matchedCandidates = await listMatchedCandidates(matchSkills, 5);

  return (
    <EmployerPageShell>
      <div className="space-y-10">
      <div>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          Dashboard
        </p>
        <h1 className="mt-2 font-display text-2xl font-medium tracking-tight text-zinc-900 sm:text-3xl">
          Xin chào, nhà tuyển dụng
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600 sm:text-base">
          Headhunt từ kho CV: tìm hồ sơ, lưu ứng viên, thiết lập danh sách gửi tự động và email đồng
          loạt.
        </p>
      </div>

      <section aria-labelledby="promo-heading" className="space-y-3">
        <div className="flex items-center gap-2">
          <BadgePercent className="h-4 w-4 text-[var(--accent)]" aria-hidden />
          <h2 id="promo-heading" className="text-sm font-semibold text-zinc-800">
            Thông báo khuyến mãi
          </h2>
        </div>
        <ul className="grid gap-3 lg:grid-cols-2">
          {PROMO_NOTICES.map((notice) => (
            <li
              key={notice.id}
              className="flex flex-col justify-between gap-4 rounded-lg border border-[var(--accent)]/35 bg-gradient-to-br from-[#faf6ee] to-white p-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0">
                <span className="inline-flex rounded-md bg-[var(--accent)]/15 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wide text-[#8a6a28]">
                  {notice.badge}
                </span>
                <p className="mt-2 text-sm font-semibold text-zinc-900">{notice.title}</p>
                <p className="mt-1 text-sm text-zinc-600">{notice.body}</p>
              </div>
              <Link
                href={notice.href}
                className="inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-[var(--primary)] px-3.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-92"
              >
                {notice.cta}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="grid gap-6 xl:grid-cols-2">
        <section
          className="rounded-lg border border-[var(--border)] bg-white"
          aria-labelledby="new-candidates-heading"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-[var(--primary)]" aria-hidden />
              <h2 id="new-candidates-heading" className="text-sm font-semibold text-zinc-800">
                Ứng viên mới
              </h2>
            </div>
            <Link
              href="/dashboard/employer/tim-ung-vien"
              className="text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              Xem tất cả
            </Link>
          </div>
          <ul className="divide-y divide-[var(--border)]">
            {newCandidates.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-zinc-500 sm:px-5">
                Chưa có hồ sơ trong kho. Dữ liệu sẽ hiện sau khi admin import CV.
              </li>
            ) : (
              newCandidates.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/dashboard/employer/ung-vien/${c.slug}`}
                  className="flex items-start justify-between gap-3 px-4 py-3.5 transition hover:bg-zinc-50 sm:px-5"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-zinc-900">{c.fullName}</span>
                    <span className="mt-0.5 block truncate text-sm text-zinc-500">
                      {c.title} · {c.location}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-zinc-400">
                    {formatRelativeDate(c.updatedAt)}
                  </span>
                </Link>
              </li>
              ))
            )}
          </ul>
        </section>

        <section
          className="rounded-lg border border-[var(--border)] bg-white"
          aria-labelledby="match-candidates-heading"
        >
          <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-[var(--primary)]" aria-hidden />
              <h2 id="match-candidates-heading" className="text-sm font-semibold text-zinc-800">
                Ứng viên phù hợp
              </h2>
            </div>
            <Link
              href="/dashboard/employer/tim-ung-vien?skill=React"
              className="text-xs font-semibold text-[var(--primary)] hover:underline"
            >
              Lọc thêm
            </Link>
          </div>
          <p className="border-b border-[var(--border)] px-4 py-2 text-xs text-zinc-500 sm:px-5">
            Gợi ý theo kỹ năng: {matchSkills.join(", ")}.
          </p>
          <ul className="divide-y divide-[var(--border)]">
            {matchedCandidates.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-zinc-500 sm:px-5">
                Chưa có hồ sơ khớp kỹ năng. Thử{" "}
                <Link href="/dashboard/employer/tim-ung-vien" className="font-medium text-[var(--primary)] hover:underline">
                  tìm ứng viên
                </Link>
                .
              </li>
            ) : (
              matchedCandidates.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/dashboard/employer/ung-vien/${c.slug}`}
                  className="flex items-start justify-between gap-3 px-4 py-3.5 transition hover:bg-zinc-50 sm:px-5"
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-zinc-900">{c.fullName}</span>
                    <span className="mt-0.5 block truncate text-sm text-zinc-500">
                      {c.title} · {c.skills.slice(0, 3).join(", ")}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-md bg-[var(--secondary)] px-2 py-0.5 text-[0.65rem] font-semibold text-[var(--primary)]">
                    Match
                  </span>
                </Link>
              </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <section aria-labelledby="quick-heading">
        <h2 id="quick-heading" className="text-sm font-semibold text-zinc-800">
          Lối tắt
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {QUICK_LINKS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex gap-3 rounded-lg border border-[var(--border)] bg-white p-4 transition hover:border-[var(--primary)]/40 hover:bg-[var(--primary)]/[0.02]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--secondary)] text-[var(--primary)]">
                  <item.icon className="h-4 w-4" aria-hidden />
                </span>
                <span>
                  <span className="block text-sm font-semibold text-zinc-900">{item.title}</span>
                  <span className="mt-0.5 block text-sm text-zinc-500">{item.desc}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="rounded-lg border border-[var(--border)] bg-white p-5 sm:p-6"
        aria-labelledby="plan-heading"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 id="plan-heading" className="text-sm font-semibold text-zinc-800">
              Gói dịch vụ
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Gói đề xuất: <span className="font-medium text-zinc-800">{featured.name}</span> —{" "}
              {formatVnd(featured.price)} / {featured.durationLabel}
            </p>
          </div>
          <Link
            href="/dashboard/employer/bang-gia"
            className="inline-flex h-9 items-center gap-1.5 rounded-md bg-[var(--primary)] px-3.5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-92"
          >
            <CreditCard className="h-3.5 w-3.5" aria-hidden />
            Xem bảng giá
          </Link>
        </div>
      </section>
    </div>
    </EmployerPageShell>
  );
}