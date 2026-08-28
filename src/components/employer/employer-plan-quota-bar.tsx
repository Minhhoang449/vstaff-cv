import Link from "next/link";
import { CalendarClock, FileStack } from "lucide-react";
import {
  formatCvQuota,
  formatExpiryShort,
  isDailyCvPlan,
  type EmployerSubscription,
} from "@/data/employer-subscription";
import { cn } from "@/lib/utils";

type Props = {
  subscription: EmployerSubscription;
};

export function EmployerPlanQuotaBar({ subscription }: Props) {
  const { cvUsed, cvLimit, expiresAt, planName, planId } = subscription;
  const dailyPlan = isDailyCvPlan(planId);
  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
  );
  const cvRatio = cvLimit != null && cvLimit > 0 ? Math.min(1, cvUsed / cvLimit) : 0;
  const cvNearLimit = cvLimit != null && cvRatio >= 0.8;
  const timeUrgent = !dailyPlan && daysLeft <= 2;

  return (
    <Link
      href="/dashboard/employer/bang-gia"
      className="group flex min-w-0 max-w-full items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50/90 px-2.5 py-1.5 transition hover:border-[var(--primary)]/35 hover:bg-[var(--primary)]/[0.04] sm:gap-3 sm:px-3"
      title="Xem bảng giá / nâng gói"
    >
      <span className="hidden truncate text-[11px] font-semibold text-zinc-500 lg:inline">
        {planName}
      </span>

      <span className="hidden h-3.5 w-px bg-zinc-200 lg:block" aria-hidden />

      <span className="flex min-w-0 items-center gap-1.5">
        <FileStack
          className={cn("h-3.5 w-3.5 shrink-0", cvNearLimit ? "text-amber-600" : "text-zinc-500")}
          aria-hidden
        />
        <span
          className={cn(
            "max-w-[11rem] truncate whitespace-nowrap text-xs font-semibold sm:max-w-none",
            cvLimit == null || dailyPlan ? "text-zinc-800" : "tabular-nums",
            cvNearLimit ? "text-amber-800" : "text-zinc-800"
          )}
        >
          {formatCvQuota(cvUsed, cvLimit, planId, subscription.cvUsedToday)}
        </span>
      </span>

      {/* Chỉ hiện thanh % khi gói có hạn mức CV tổng */}
      {cvLimit != null && !dailyPlan ? (
        <span
          className="hidden h-1.5 w-14 overflow-hidden rounded-full bg-zinc-200 sm:block"
          aria-hidden
        >
          <span
            className={cn(
              "block h-full rounded-full transition-all",
              cvNearLimit ? "bg-amber-500" : "bg-[var(--primary)]"
            )}
            style={{ width: `${Math.round(cvRatio * 100)}%` }}
          />
        </span>
      ) : null}

      <span className="hidden h-3.5 w-px bg-zinc-200 sm:block" aria-hidden />

      <span className="flex items-center gap-1.5">
        <CalendarClock
          className={cn("h-3.5 w-3.5 shrink-0", timeUrgent ? "text-amber-600" : "text-zinc-500")}
          aria-hidden
        />
        <span
          className={cn(
            "whitespace-nowrap text-xs font-semibold",
            timeUrgent ? "text-amber-800" : "text-zinc-700"
          )}
        >
          {formatExpiryShort(expiresAt, Date.now(), planId)}
        </span>
      </span>
    </Link>
  );
}
