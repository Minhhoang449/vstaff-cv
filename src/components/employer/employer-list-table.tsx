import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { EmployerCandidateAvatar } from "@/components/employer/employer-candidate-avatar";
import { EmployerCandidateRowActions } from "@/components/employer/employer-candidate-row-actions";
import { INDUSTRIES } from "@/data/industries";
import {
  formatExperienceYears,
  type CandidateProfile,
} from "@/lib/candidates-shared";

function industryName(id: string) {
  return INDUSTRIES.find((i) => i.id === id)?.name ?? id;
}

type Props = {
  items: CandidateProfile[];
  emptyHint?: string;
  /** opened = đã mở; list = lệnh lọc / danh sách gửi */
  mode?: "opened" | "list";
};

export function EmployerListTable({
  items,
  emptyHint = "Chưa có hồ sơ khớp lệnh lọc này. Thử nới tiêu chí khi tạo lệnh mới.",
  mode = "list",
}: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm font-medium text-zinc-800">Không có hồ sơ</p>
        <p className="mt-1 max-w-sm text-sm text-zinc-500">{emptyHint}</p>
        <Link
          href="/dashboard/employer/tim-ung-vien"
          className="mt-5 inline-flex h-9 items-center rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)]"
        >
          Mở Tìm ứng viên
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[60rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-100 bg-zinc-50/80 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            <th className="min-w-[14rem] px-4 py-3 font-semibold sm:px-5">Ứng viên</th>
            <th className="min-w-[8.5rem] px-3 py-3 font-semibold">SĐT</th>
            <th className="min-w-[12rem] px-3 py-3 font-semibold">Email</th>
            <th className="min-w-[8rem] px-3 py-3 font-semibold">Ngành</th>
            <th className="min-w-[6.5rem] px-3 py-3 font-semibold">Kinh nghiệm</th>
            <th className="min-w-[8rem] px-3 py-3 font-semibold">Học vấn</th>
            <th className="min-w-[11rem] px-4 py-3 text-right font-semibold sm:px-5">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {items.map((c) => (
            <tr key={c.id} className="bg-white transition hover:bg-zinc-50/70">
              <td className="px-4 py-4 align-middle sm:px-5">
                <div className="flex gap-3">
                  <EmployerCandidateAvatar
                    href={`/dashboard/employer/ung-vien/${c.slug}`}
                    size="sm"
                    name={c.fullName}
                  />
                  <div className="min-w-0">
                    <Link
                      href={`/dashboard/employer/ung-vien/${c.slug}`}
                      className="font-semibold text-zinc-900 hover:text-[var(--primary)] hover:underline"
                    >
                      {c.fullName}
                    </Link>
                    <p className="mt-0.5 line-clamp-1 text-sm text-zinc-700">{c.desiredPosition}</p>
                    <p className="mt-0.5 text-xs text-zinc-400">
                      {c.wardName}, {c.location}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-3 py-4 align-middle">
                {c.phone ? (
                  <a
                    href={`tel:${c.phone}`}
                    className="inline-flex items-center gap-1.5 font-medium tabular-nums whitespace-nowrap text-zinc-800 hover:text-[var(--primary)]"
                  >
                    <Phone className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden />
                    {c.phone}
                  </a>
                ) : (
                  <span className="text-zinc-400">—</span>
                )}
              </td>

              <td className="px-3 py-4 align-middle">
                {c.email ? (
                  <a
                    href={`mailto:${c.email}`}
                    className="inline-flex max-w-[14rem] items-center gap-1.5 truncate text-zinc-700 hover:text-[var(--primary)]"
                    title={c.email}
                  >
                    <Mail className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden />
                    <span className="truncate">{c.email}</span>
                  </a>
                ) : (
                  <span className="text-zinc-400">—</span>
                )}
              </td>

              <td className="px-3 py-4 align-middle text-zinc-600">{industryName(c.industryId)}</td>

              <td className="px-3 py-4 align-middle whitespace-nowrap text-zinc-700">
                {formatExperienceYears(c.experienceYears)}
              </td>

              <td className="px-3 py-4 align-middle text-zinc-700">
                {c.education || "—"}
              </td>

              <td className="px-4 py-4 align-middle sm:px-5">
                <EmployerCandidateRowActions candidate={c} mode={mode} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
