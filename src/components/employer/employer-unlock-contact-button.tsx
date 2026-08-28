"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreditCard, Loader2, Lock, Unlock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  unlocked: boolean;
  cvRemainingLabel?: string;
  fullWidth?: boolean;
};

export function EmployerUnlockContactButton({
  slug,
  unlocked,
  cvRemainingLabel,
  fullWidth,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(unlocked);
  const [quotaOpen, setQuotaOpen] = useState(false);
  const [quotaMessage, setQuotaMessage] = useState("");

  async function onUnlock() {
    if (done || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/employer/candidates/${encodeURIComponent(slug)}/unlock`, {
        method: "POST",
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        code?: string;
        unlocked?: boolean;
      } | null;
      if (!res.ok) {
        const msg = data?.error || "Không mở được hồ sơ.";
        if (data?.code === "NO_QUOTA" || data?.code === "EXPIRED" || res.status === 402) {
          setQuotaMessage(msg);
          setQuotaOpen(true);
          return;
        }
        setError(msg);
        return;
      }
      setDone(true);
      router.refresh();
    } catch {
      setError("Không kết nối được máy chủ.");
    } finally {
      setLoading(false);
    }
  }

  const unlockControl = done ? (
    <span
      className={cn(
        "inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-emerald-50 px-3 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200",
        fullWidth && "w-full"
      )}
    >
      <Unlock className="h-4 w-4" aria-hidden />
      Đã mở liên hệ
    </span>
  ) : (
    <>
      <button
        type="button"
        onClick={() => void onUnlock()}
        disabled={loading}
        className={cn(
          "inline-flex h-10 items-center justify-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-50",
          fullWidth && "w-full"
        )}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
          <Lock className="h-4 w-4" aria-hidden />
        )}
        Mở hồ sơ (−1 CV)
      </button>
      {cvRemainingLabel ? (
        <span className={cn("text-[11px] text-zinc-500", fullWidth ? "text-center" : "text-right")}>
          {cvRemainingLabel}
        </span>
      ) : null}
      {error ? (
        <span
          className={cn(
            "max-w-[16rem] text-[11px] text-red-600",
            fullWidth ? "text-center" : "text-right"
          )}
        >
          {error}
        </span>
      ) : null}
    </>
  );

  return (
    <>
      <div className={cn("flex flex-col gap-1", fullWidth ? "items-stretch" : "items-end")}>
        {unlockControl}
      </div>

      <Dialog open={quotaOpen} onOpenChange={setQuotaOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Hết hạn mức mở hồ sơ</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-zinc-600">
              {quotaMessage ||
                "Bạn đã dùng hết số lượt mở CV của gói hiện tại. Nâng gói để tiếp tục xem SĐT và email ứng viên."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => setQuotaOpen(false)}
              className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
            >
              Đóng
            </button>
            <Link
              href="/dashboard/employer/bang-gia"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-92"
              onClick={() => setQuotaOpen(false)}
            >
              <CreditCard className="h-4 w-4" aria-hidden />
              Nâng gói ngay
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
