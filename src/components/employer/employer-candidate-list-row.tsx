"use client";

import Link from "next/link";
import { BadgeCheck, Briefcase, Building2, Eye, MapPin, Sparkles } from "lucide-react";
import { EmployerCandidateAvatar } from "@/components/employer/employer-candidate-avatar";
import { EmployerSaveCandidateButton } from "@/components/employer/employer-save-candidate-button";
import { INDUSTRIES } from "@/data/industries";
import {
  cvScoreTone,
  formatExperienceYears,
  formatUpdatedAgo,
  type CandidateProfile,
} from "@/lib/candidates-shared";

function ViewedBadge({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--primary)] ${className ?? ""}`}
    >
      <Eye className="h-3.5 w-3.5" aria-hidden />
      Đã xem
    </span>
  );
}

function CvScoreBadge({ candidate }: { candidate: CandidateProfile }) {
  const tone = cvScoreTone(candidate.cvScore);
  const toneClass =
    tone === "emerald"
      ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
      : tone === "sky"
        ? "bg-sky-50 text-sky-700 ring-sky-200"
        : tone === "amber"
          ? "bg-amber-50 text-amber-800 ring-amber-200"
          : "bg-zinc-100 text-zinc-600 ring-zinc-200";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ${toneClass}`}
      title={`Đánh giá độ đầy đủ CV: ${candidate.cvScore}/100`}
    >
      <Sparkles className="h-3 w-3" aria-hidden />
      CV {candidate.cvScore}
      <span className="font-medium opacity-80">· {candidate.cvScoreLabel}</span>
    </span>
  );
}

function industryLabel(industryId: string) {
  return INDUSTRIES.find((i) => i.id === industryId)?.name || industryId || "—";
}

type Props = {
  candidate: CandidateProfile;
  initialSaved?: boolean;
};

export function EmployerCandidateListRow({ candidate, initialSaved = false }: Props) {
  const isActive = candidate.jobSeekingStatus === "active";
  const position = (candidate.desiredPosition || candidate.title || "—").toUpperCase();

  return (
    <article className="px-4 py-4 transition hover:bg-zinc-50/80 sm:px-5 sm:py-5">
      <div className="flex gap-3.5 sm:gap-4">
        <EmployerCandidateAvatar
          href={`/dashboard/employer/ung-vien/${candidate.slug}`}
          size="md"
          name={candidate.fullName}
        />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <Link
              href={`/dashboard/employer/ung-vien/${candidate.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[15px] font-semibold text-zinc-900 hover:text-[var(--primary)] hover:underline"
            >
              {candidate.fullName}
            </Link>
            {isActive ? (
              <>
                <BadgeCheck className="h-4 w-4 text-sky-500" aria-hidden />
                <span className="inline-flex items-center rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700">
                  Tích cực tìm việc
                </span>
              </>
            ) : null}
            <span className="text-sm text-zinc-500">({candidate.age} tuổi)</span>
            <CvScoreBadge candidate={candidate} />
          </div>

          <p className="mt-1.5 line-clamp-2 max-w-3xl text-[15px] font-bold uppercase tracking-wide text-[var(--primary)]">
            {position}
          </p>

          <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-zinc-600">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-zinc-400" aria-hidden />
              {industryLabel(candidate.industryId)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Briefcase className="h-3.5 w-3.5 text-zinc-400" aria-hidden />
              {formatExperienceYears(candidate.experienceYears)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-zinc-400" aria-hidden />
              {candidate.wardName}, {candidate.location}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-end justify-between gap-2">
            <p className="text-xs text-zinc-400">
              Hồ sơ cập nhật {formatUpdatedAgo(candidate.updatedAt)}
            </p>
            <div className="flex items-center gap-2 sm:hidden">
              <EmployerSaveCandidateButton
                slug={candidate.slug}
                initialSaved={initialSaved}
                compact
              />
              {candidate.isViewed ? <ViewedBadge /> : null}
            </div>
          </div>
        </div>

        <div className="hidden min-h-[5.5rem] w-[6.5rem] shrink-0 flex-col items-end justify-between self-stretch sm:flex">
          <EmployerSaveCandidateButton slug={candidate.slug} initialSaved={initialSaved} />
          {candidate.isViewed ? <ViewedBadge /> : null}
        </div>
      </div>
    </article>
  );
}
