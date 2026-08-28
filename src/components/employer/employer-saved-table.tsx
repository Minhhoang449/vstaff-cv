"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { EmployerCandidateAvatar } from "@/components/employer/employer-candidate-avatar";
import { EmployerCandidateRowActions } from "@/components/employer/employer-candidate-row-actions";
import { INDUSTRIES } from "@/data/industries";
import {
  formatExperienceYears,
  type CandidateProfile,
} from "@/lib/candidates-shared";

export type SavedCandidateRow = CandidateProfile & {
  savedAt: string;
};

function industryName(id: string) {
  return INDUSTRIES.find((i) => i.id === id)?.name ?? id;
}

function formatSavedDate(iso: string) {
  return new Date(iso).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

type Props = {
  items: SavedCandidateRow[];
};

export function EmployerSavedTable({ items: initial }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function unsave(c: SavedCandidateRow) {
    setBusyId(c.id);
    try {
      const res = await fetch(
        `/api/employer/saved?candidateId=${encodeURIComponent(c.id)}`,
        { method: "DELETE" }
      );
      if (res.ok) {
        setItems((prev) => prev.filter((x) => x.id !== c.id));
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm font-medium text-zinc-800">Không có hồ sơ khớp bộ lọc</p>
        <p className="mt-1 max-w-sm text-sm text-zinc-500">
          Thử xóa bộ lọc hoặc lưu thêm ứng viên từ trang Tìm ứng viên.
        </p>
        <Link
          href="/dashboard/employer/tim-ung-vien"
          className="mt-5 inline-flex h-9 items-center rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)]"
        >
          Đi tìm ứng viên
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[52rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-100 bg-zinc-50/80 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
            <th className="min-w-[16rem] px-4 py-3 font-semibold sm:px-5">Ứng viên</th>
            <th className="min-w-[9rem] px-3 py-3 font-semibold">Ngành</th>
            <th className="min-w-[7rem] px-3 py-3 font-semibold">Ngày lưu</th>
            <th className="min-w-[6.5rem] px-3 py-3 font-semibold">Kinh nghiệm</th>
            <th className="min-w-[8rem] px-3 py-3 font-semibold">Học vấn</th>
            <th className="min-w-[7.5rem] px-3 py-3 font-semibold">Hình thức</th>
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
                      {c.wardName}, {c.location} · {c.age} tuổi
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-3 py-4 align-middle text-zinc-600">{industryName(c.industryId)}</td>

              <td className="px-3 py-4 align-middle whitespace-nowrap">
                <p className="text-zinc-800">{formatSavedDate(c.savedAt)}</p>
                <p className="mt-0.5 text-xs text-zinc-400">Đã lưu</p>
              </td>

              <td className="px-3 py-4 align-middle whitespace-nowrap text-zinc-700">
                {formatExperienceYears(c.experienceYears)}
              </td>

              <td className="px-3 py-4 align-middle text-zinc-700">
                {c.education || "—"}
              </td>

              <td className="px-3 py-4 align-middle text-zinc-700">
                {c.workType || "—"}
              </td>

              <td className="px-4 py-4 align-middle sm:px-5">
                <EmployerCandidateRowActions
                  candidate={c}
                  mode="saved"
                  removing={busyId === c.id}
                  onRemove={() => unsave(c)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
