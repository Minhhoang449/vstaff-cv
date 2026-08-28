import { EmployerPageShell } from "@/components/employer/employer-page-shell";
import { EmployerCreateListButton } from "@/components/employer/employer-create-list-button";
import { EmployerDeliveryJobsPanel } from "@/components/employer/employer-delivery-jobs-panel";
import { EmployerExportCandidatesButton } from "@/components/employer/employer-export-candidates-button";
import { EmployerListTable } from "@/components/employer/employer-list-table";
import type { Metadata } from "next";
import Link from "next/link";
import { Info } from "lucide-react";
import { auth } from "@/auth";
import { formatCvQuota } from "@/data/employer-subscription";
import {
  DELIVERY_DAILY_CV_LIMIT,
  getDeliveryJob,
  getEmployerDailyDeliveryUsage,
  getMatchedCandidatesForJob,
  listDeliveryJobsForEmployer,
} from "@/lib/delivery-jobs";
import { getEmployerSubscriptionState } from "@/lib/employer-unlocks";

export const metadata: Metadata = {
  title: "Danh sách ứng viên",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{
  job?: string;
}>;

export default async function EmployerCandidateListsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const session = await auth();
  const employerId = session?.user?.id ?? "";
  const sp = await searchParams;
  const jobId = sp.job?.trim() || "";

  const [jobs, sub, daily] = await Promise.all([
    listDeliveryJobsForEmployer(employerId),
    getEmployerSubscriptionState(employerId || undefined),
    employerId
      ? getEmployerDailyDeliveryUsage(employerId)
      : Promise.resolve({
          used: 0,
          remaining: DELIVERY_DAILY_CV_LIMIT,
          limit: DELIVERY_DAILY_CV_LIMIT,
          deliveredIds: new Set<string>(),
        }),
  ]);

  const activeJob = jobId ? await getDeliveryJob(employerId, jobId) : null;
  const matched = activeJob ? await getMatchedCandidatesForJob(activeJob) : [];

  return (
    <EmployerPageShell>
      <div className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Tự động hóa
            </p>
            <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-zinc-900">
              Danh sách ứng viên
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
              Đặt lệnh lọc — khớp mềm theo vị trí & kinh nghiệm liên quan (vd. “Kinh doanh” gồm bán
              hàng, tư vấn…), thiếu thì mở sang ngành gần. Ưu tiên CV mới trong cùng mức khớp. Tối
              đa{" "}
              <span className="font-semibold text-zinc-800">
                {DELIVERY_DAILY_CV_LIMIT} CV/ngày
              </span>{" "}
              (hôm nay: {daily.used}/{daily.limit})
              {sub
                ? ` · gói ${sub.planName}: ${formatCvQuota(sub.cvUsed, sub.cvLimit, sub.planId, sub.cvUsedToday)}`
                : " · chưa đăng ký gói"}
              .
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-sm text-zinc-500">
              <span className="font-semibold tabular-nums text-[var(--primary)]">
                {jobs.length}
              </span>{" "}
              lệnh lọc
            </p>
            <EmployerCreateListButton dailyRemaining={daily.remaining} />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_4px_24px_-8px_rgba(15,40,60,0.12)]">
          <div className="border-b border-zinc-100 px-4 py-3 sm:px-5">
            <h2 className="text-sm font-semibold text-zinc-800">Lệnh lọc & lịch gửi</h2>
            <p className="mt-0.5 text-xs text-zinc-500">
              Không phải toàn bộ kho CV — chỉ các lệnh bạn tạo để hệ thống lọc và gửi.
            </p>
          </div>
          <EmployerDeliveryJobsPanel
            key={jobs.map((j) => j.id + j.status).join("|")}
            jobs={jobs}
            activeJobId={activeJob?.id}
          />
          <div className="flex items-start gap-2 border-t border-zinc-100 px-4 py-3 text-xs text-zinc-500 sm:px-5">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden />
            <p>
              Muốn tự chọn hồ sơ?{" "}
              <Link
                href="/dashboard/employer/tim-ung-vien"
                className="font-medium text-[var(--primary)] hover:underline"
              >
                Tìm ứng viên
              </Link>{" "}
              rồi{" "}
              <Link
                href="/dashboard/employer/da-luu"
                className="font-medium text-[var(--primary)] hover:underline"
              >
                lưu hồ sơ
              </Link>
              .
            </p>
          </div>
        </div>

        {activeJob ? (
          <div className="overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-[0_4px_24px_-8px_rgba(15,40,60,0.12)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 px-4 py-3 sm:px-5">
              <div>
                <h2 className="text-sm font-semibold text-zinc-800">
                  Hồ sơ khớp: {activeJob.position}
                </h2>
                <p className="mt-0.5 text-xs text-zinc-500">
                  Ưu tiên CV mới · tối đa {DELIVERY_DAILY_CV_LIMIT}/lần chạy trong hạn mức ngày —{" "}
                  {matched.length} ứng viên.
                </p>
              </div>
              <EmployerExportCandidatesButton
                items={matched}
                fileName={`lenh-loc-${activeJob.id.slice(0, 10)}.csv`}
              />
            </div>
            <EmployerListTable items={matched} mode="list" />
          </div>
        ) : null}
      </div>
    </EmployerPageShell>
  );
}
