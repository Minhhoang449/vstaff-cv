"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Clock, Loader2, Pause, Play, Trash2 } from "lucide-react";
import { INDUSTRIES } from "@/data/industries";
import { PROVINCES, shortProvinceName } from "@/data/vietnam-locations";
import {
  deliverySlotLabel,
  type CandidateDeliveryJob,
  type DeliveryJobStatus,
} from "@/lib/delivery-job-types";
import { formatDeliveryDateTimeVi } from "@/lib/delivery-slot-schedule";
import { cn } from "@/lib/utils";

const STATUS: Record<DeliveryJobStatus, { label: string; className: string }> = {
  active: {
    label: "Đang chạy",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70",
  },
  paused: {
    label: "Tạm dừng",
    className: "bg-amber-50 text-amber-800 ring-1 ring-amber-200/70",
  },
  ended: {
    label: "Đã kết thúc",
    className: "bg-zinc-100 text-zinc-600",
  },
};

function provinceLabel(code: string) {
  const p = PROVINCES.find((x) => x.code === code);
  return p ? shortProvinceName(p.name) : code;
}

function industryLabel(id: string) {
  return INDUSTRIES.find((i) => i.id === id)?.name || "Tất cả ngành";
}

function formatDate(iso: string) {
  return formatDeliveryDateTimeVi(iso);
}

type Props = {
  jobs: CandidateDeliveryJob[];
  activeJobId?: string;
};

export function EmployerDeliveryJobsPanel({ jobs: initial, activeJobId }: Props) {
  const router = useRouter();
  const [jobs, setJobs] = useState(initial);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function setStatus(id: string, status: DeliveryJobStatus) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/employer/delivery-jobs/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = (await res.json().catch(() => null)) as {
        job?: CandidateDeliveryJob;
      } | null;
      if (res.ok && data?.job) {
        setJobs((prev) => prev.map((j) => (j.id === id ? data.job! : j)));
        router.refresh();
      }
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Xóa lệnh lọc này?")) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/employer/delivery-jobs/${id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== id));
        router.refresh();
        if (activeJobId === id) router.push("/dashboard/employer/danh-sach");
      }
    } finally {
      setBusyId(null);
    }
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
        <p className="text-sm font-medium text-zinc-800">Chưa có lệnh lọc nào</p>
        <p className="mt-1 max-w-md text-sm text-zinc-500">
          Tạo lệnh lọc theo tiêu chí tìm ứng viên — hệ thống khớp hồ sơ và gửi theo lịch trong hạn
          mức gói của bạn.
        </p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-zinc-100">
      {jobs.map((job) => {
        const st = STATUS[job.status];
        const active = activeJobId === job.id;
        return (
          <li
            key={job.id}
            className={cn(
              "px-4 py-4 transition sm:px-5",
              active ? "bg-[var(--primary)]/[0.04]" : "hover:bg-zinc-50/80"
            )}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href={`/dashboard/employer/danh-sach?job=${job.id}`}
                    className="text-base font-semibold text-zinc-900 hover:text-[var(--primary)] hover:underline"
                  >
                    {job.position}
                  </Link>
                  <span
                    className={cn(
                      "inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold",
                      st.className
                    )}
                  >
                    {st.label}
                  </span>
                </div>
                <p className="mt-1 text-sm text-zinc-600">
                  {industryLabel(job.industryId)} · {provinceLabel(job.provinceCode)}
                  {job.language ? ` · ${job.language}` : ""}
                  {job.gender ? ` · ${job.gender}` : ""}
                </p>
                <p className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" aria-hidden />
                    {deliverySlotLabel(job.delivery)}
                  </span>
                  <span>
                    Khớp{" "}
                    <span className="font-semibold tabular-nums text-zinc-700">
                      {job.matchedCount}
                    </span>{" "}
                    hồ sơ
                  </span>
                  <span>Tạo {formatDate(job.createdAt)}</span>
                  {job.lastRunAt ? (
                    <span>Gửi gần nhất {formatDate(job.lastRunAt)}</span>
                  ) : (
                    <span className="text-amber-700">Chờ khung {deliverySlotLabel(job.delivery)}</span>
                  )}
                </p>
                {job.notes ? (
                  <p className="mt-1.5 line-clamp-2 text-xs text-zinc-500">{job.notes}</p>
                ) : null}
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <Link
                  href={`/dashboard/employer/danh-sach?job=${job.id}`}
                  className="inline-flex h-8 items-center rounded-lg border border-[var(--primary)] px-2.5 text-xs font-semibold text-[var(--primary)] hover:bg-[var(--primary)]/5"
                >
                  Xem UV khớp
                </Link>
                {job.status === "active" ? (
                  <button
                    type="button"
                    disabled={busyId === job.id}
                    onClick={() => setStatus(job.id, "paused")}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-50"
                    title="Tạm dừng"
                  >
                    {busyId === job.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Pause className="h-3.5 w-3.5" />
                    )}
                  </button>
                ) : job.status === "paused" ? (
                  <button
                    type="button"
                    disabled={busyId === job.id}
                    onClick={() => setStatus(job.id, "active")}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 disabled:opacity-50"
                    title="Tiếp tục"
                  >
                    {busyId === job.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Play className="h-3.5 w-3.5" />
                    )}
                  </button>
                ) : null}
                <button
                  type="button"
                  disabled={busyId === job.id}
                  onClick={() => remove(job.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                  title="Xóa"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
