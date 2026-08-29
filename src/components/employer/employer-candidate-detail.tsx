import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import {
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Languages,
  Lock,
  Mail,
  MapPin,
  Phone,
  Sparkles,
} from "lucide-react";
import { INDUSTRIES } from "@/data/industries";
import {
  cvScoreTone,
  formatExperienceYears,
  formatUpdatedAgo,
  genderLabel,
  jobSeekingLabel,
  type CandidateProfile,
} from "@/lib/candidates-shared";
import { cvTemplateLabel, type VstaffCvDocumentData } from "@/lib/cv/cv-document-data";
import { VstaffCvPreview } from "@/components/cv/vstaff-cv-preview";
import { EmployerCandidateAvatar } from "@/components/employer/employer-candidate-avatar";
import { EmployerCvDownloadButton } from "@/components/employer/employer-cv-download-button";
import { EmployerUnlockContactButton } from "@/components/employer/employer-unlock-contact-button";
import { cn } from "@/lib/utils";

type Props = {
  candidate: CandidateProfile;
  cvData: VstaffCvDocumentData;
  unlocked: boolean;
  cvQuotaLabel: string;
};

function MetaPill({
  icon: Icon,
  children,
}: {
  icon: ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  children: ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-50 px-2.5 py-1 text-xs font-medium text-zinc-700 ring-1 ring-zinc-200/80">
      <Icon className="h-3.5 w-3.5 text-zinc-400" aria-hidden />
      {children}
    </span>
  );
}

function CvScorePill({ score, label }: { score: number; label: string }) {
  const tone = cvScoreTone(score);
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold ring-1",
        tone === "emerald" && "bg-emerald-50 text-emerald-700 ring-emerald-200",
        tone === "sky" && "bg-sky-50 text-sky-700 ring-sky-200",
        tone === "amber" && "bg-amber-50 text-amber-800 ring-amber-200",
        tone === "zinc" && "bg-zinc-100 text-zinc-600 ring-zinc-200"
      )}
    >
      <Sparkles className="h-3.5 w-3.5" aria-hidden />
      CV {score}
      <span className="font-medium opacity-80">· {label}</span>
    </span>
  );
}

export function EmployerCandidateDetail({
  candidate,
  cvData,
  unlocked,
  cvQuotaLabel,
}: Props) {
  const industryName =
    INDUSTRIES.find((i) => i.id === candidate.industryId)?.name ?? candidate.industryId;
  const isActive = candidate.jobSeekingStatus === "active";

  return (
    <div className="mx-auto max-w-6xl space-y-4 pb-10 lg:space-y-5">
      {/* Top nav */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/dashboard/employer/tim-ung-vien"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-600 transition hover:text-[var(--primary)]"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Tìm ứng viên
        </Link>
        <p className="text-xs text-zinc-400">
          Cập nhật {formatUpdatedAgo(candidate.updatedAt)}
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-start xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="order-2 min-w-0 space-y-4 lg:order-1">
          {/* Profile hero */}
          <section className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_4px_24px_-8px_rgba(15,40,60,0.12)] sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-5">
              <EmployerCandidateAvatar
                size="lg"
                name={candidate.fullName}
                className="mx-auto shrink-0 rounded-2xl p-2 sm:mx-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="font-display text-xl font-medium tracking-tight text-zinc-900 sm:text-[1.65rem]">
                    {candidate.fullName}
                  </h1>
                  <span className="text-sm text-zinc-500">({candidate.age} tuổi)</span>
                  {isActive ? (
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-1.5 py-0.5 text-[11px] font-medium text-emerald-700">
                      {jobSeekingLabel(candidate.jobSeekingStatus)}
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-md bg-zinc-100 px-1.5 py-0.5 text-[11px] font-medium text-zinc-600">
                      {jobSeekingLabel(candidate.jobSeekingStatus)}
                    </span>
                  )}
                  <CvScorePill score={candidate.cvScore} label={candidate.cvScoreLabel} />
                </div>
                <p className="mt-1.5 text-sm font-medium text-zinc-700 sm:text-[15px]">
                  {candidate.title}
                  <span className="font-normal text-zinc-400"> · </span>
                  <span className="font-normal text-zinc-600">{industryName}</span>
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <MetaPill icon={MapPin}>
                    {[candidate.wardName, candidate.location].filter(Boolean).join(", ")}
                  </MetaPill>
                  <MetaPill icon={Briefcase}>
                    {formatExperienceYears(candidate.experienceYears)}
                  </MetaPill>
                  <MetaPill icon={GraduationCap}>{candidate.education}</MetaPill>
                  <MetaPill icon={Languages}>
                    {candidate.languages.slice(0, 3).join(", ")}
                  </MetaPill>
                </div>
              </div>
            </div>

            {candidate.summary ? (
              <div className="mt-5 border-t border-zinc-100 pt-5">
                <h2 className="text-[0.65rem] font-semibold tracking-[0.14em] text-zinc-400 uppercase">
                  Giới thiệu
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 sm:text-[15px]">
                  {candidate.summary}
                </p>
              </div>
            ) : null}

            {candidate.skills.length > 0 ? (
              <div className="mt-5 border-t border-zinc-100 pt-5">
                <h2 className="text-[0.65rem] font-semibold tracking-[0.14em] text-zinc-400 uppercase">
                  Kỹ năng
                </h2>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {candidate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-md bg-[var(--secondary)] px-2 py-0.5 text-xs font-medium text-zinc-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          {/* CV preview */}
          <section className="space-y-3">
            <div className="flex flex-wrap items-end justify-between gap-2 px-0.5">
              <div className="min-w-0">
                <h2 className="text-base font-semibold text-zinc-900">CV Vstaff</h2>
                <p className="mt-0.5 text-sm text-zinc-500">
                  {cvTemplateLabel(cvData.templateId)} · phù hợp ngành {cvData.industryName}
                </p>
              </div>
              <EmployerCvDownloadButton slug={candidate.slug} fullName={candidate.fullName} />
            </div>
            <div className="overflow-x-auto">
              <VstaffCvPreview data={cvData} revealContact={unlocked} />
            </div>
          </section>
        </div>

        {/* Sticky action rail — hiện trước trên mobile */}
        <aside className="order-1 lg:order-2 lg:sticky lg:top-[calc(3.5rem+1rem)]">
          <div className="rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-[0_4px_24px_-8px_rgba(15,40,60,0.12)] sm:p-5">
            <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-zinc-400 uppercase">
              Thao tác nhanh
            </p>
            <div className="mt-3 space-y-2.5">
              <EmployerCvDownloadButton
                slug={candidate.slug}
                fullName={candidate.fullName}
                fullWidth
              />
              <EmployerUnlockContactButton
                slug={candidate.slug}
                unlocked={unlocked}
                cvRemainingLabel={cvQuotaLabel}
                fullWidth
              />

              <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 px-3 py-2.5">
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
                  <Phone className="h-3.5 w-3.5" aria-hidden />
                  Số điện thoại
                </p>
                {unlocked ? (
                  candidate.phone ? (
                    <a
                      href={`tel:${candidate.phone}`}
                      className="mt-1 block text-sm font-semibold text-[var(--primary)] hover:underline"
                    >
                      {candidate.phone}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-zinc-500">—</p>
                  )
                ) : (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500">
                    <Lock className="h-3.5 w-3.5" aria-hidden />
                    Đã khóa
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-zinc-100 bg-zinc-50/60 px-3 py-2.5">
                <p className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-400">
                  <Mail className="h-3.5 w-3.5" aria-hidden />
                  Email
                </p>
                {unlocked ? (
                  candidate.email ? (
                    <a
                      href={`mailto:${candidate.email}`}
                      className="mt-1 block break-all text-sm font-semibold text-[var(--primary)] hover:underline"
                    >
                      {candidate.email}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm font-medium text-zinc-500">—</p>
                  )
                ) : (
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500">
                    <Lock className="h-3.5 w-3.5" aria-hidden />
                    Đã khóa
                  </p>
                )}
              </div>
            </div>

            <div className="mt-5 border-t border-zinc-100 pt-4">
              <p className="text-[0.65rem] font-semibold tracking-[0.14em] text-zinc-400 uppercase">
                Hồ sơ nhanh
              </p>
              <dl className="mt-2.5 space-y-2 text-sm text-zinc-700">
                <div className="flex justify-between gap-3">
                  <dt className="text-zinc-400">Giới tính</dt>
                  <dd className="font-medium">{genderLabel(candidate.gender)}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-zinc-400">Hình thức</dt>
                  <dd className="text-right font-medium">{candidate.workType}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-zinc-400">Vị trí mong muốn</dt>
                  <dd className="max-w-[9rem] text-right font-medium">
                    {candidate.desiredPosition}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
