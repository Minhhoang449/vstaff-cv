"use client";

import { Download } from "lucide-react";
import { INDUSTRIES } from "@/data/industries";
import {
  formatExperienceYears,
  formatSalary,
  jobSeekingLabel,
  type CandidateProfile,
} from "@/lib/candidates-shared";
import { buildCsv, downloadCsv } from "@/lib/export-csv";

type Props = {
  items: CandidateProfile[];
  fileName?: string;
  label?: string;
};

function industryName(id: string) {
  return INDUSTRIES.find((i) => i.id === id)?.name ?? id;
}

export function EmployerExportCandidatesButton({
  items,
  fileName = "danh-sach-ung-vien.csv",
  label = "Tải danh sách",
}: Props) {
  function onClick() {
    const headers = [
      "Họ tên",
      "Vị trí",
      "SĐT",
      "Email",
      "Ngành",
      "Địa điểm",
      "Kinh nghiệm",
      "Lương mong muốn",
      "Trạng thái tìm việc",
      "Tuổi",
    ];
    const rows = items.map((c) => [
      c.fullName,
      c.desiredPosition,
      c.phone,
      c.email,
      industryName(c.industryId),
      `${c.wardName}, ${c.location}`,
      formatExperienceYears(c.experienceYears),
      formatSalary(c.salaryExpect),
      jobSeekingLabel(c.jobSeekingStatus),
      c.age,
    ]);
    downloadCsv(fileName, buildCsv(headers, rows));
  }

  return (
    <button
      type="button"
      disabled={items.length === 0}
      onClick={onClick}
      className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)]/10 px-3 text-sm font-semibold whitespace-nowrap text-[var(--primary)] transition hover:bg-[var(--primary)]/15 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Download className="h-4 w-4" aria-hidden />
      {label}
    </button>
  );
}
