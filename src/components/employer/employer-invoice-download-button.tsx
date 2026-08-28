"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  orderId: string;
  className?: string;
};

export function EmployerInvoiceDownloadButton({ orderId, className }: Props) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function download() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/payments/invoices/${encodeURIComponent(orderId)}`);
      if (!res.ok) {
        const body = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error || "Không tải được hóa đơn.");
      }
      const blob = await res.blob();
      const cd = res.headers.get("Content-Disposition") || "";
      const match = cd.match(/filename="([^"]+)"/);
      const filename = match?.[1] || `Hoa-don-Vstaff-${orderId.slice(0, 10)}.pdf`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi tải hóa đơn.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={cn("flex flex-col items-end gap-1", className)}>
      <button
        type="button"
        onClick={() => void download()}
        disabled={busy}
        className="inline-flex h-8 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-2.5 text-xs font-semibold text-zinc-700 transition hover:border-[var(--primary)]/40 hover:text-[var(--primary)] disabled:opacity-60"
      >
        {busy ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
        ) : (
          <Download className="h-3.5 w-3.5" aria-hidden />
        )}
        Hóa đơn
      </button>
      {error ? <p className="max-w-[10rem] text-right text-[10px] text-red-600">{error}</p> : null}
    </div>
  );
}
