"use client";

import { useState } from "react";
import { Heart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  slug: string;
  initialSaved?: boolean;
  className?: string;
  compact?: boolean;
};

export function EmployerSaveCandidateButton({
  slug,
  initialSaved = false,
  className,
  compact,
}: Props) {
  const [saved, setSaved] = useState(initialSaved);
  const [pending, setPending] = useState(false);

  async function toggle() {
    if (pending) return;
    setPending(true);
    const next = !saved;
    setSaved(next);
    try {
      const res = await fetch(
        next
          ? "/api/employer/saved"
          : `/api/employer/saved?slug=${encodeURIComponent(slug)}`,
        next
          ? {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ slug }),
            }
          : { method: "DELETE" }
      );
      if (!res.ok) {
        setSaved(!next);
      }
    } catch {
      setSaved(!next);
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className={cn(
        "inline-flex items-center gap-1.5 px-0 py-1 text-sm font-medium transition disabled:opacity-60",
        saved
          ? "text-[var(--primary)]"
          : "text-[var(--primary)] hover:opacity-80",
        className
      )}
      aria-pressed={saved}
      title={saved ? "Bỏ lưu hồ sơ" : "Lưu hồ sơ"}
    >
      {pending ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
      ) : (
        <Heart className={cn("h-4 w-4", saved && "fill-current")} aria-hidden />
      )}
      {compact ? null : saved ? "Đã lưu" : "Lưu hồ sơ"}
    </button>
  );
}
