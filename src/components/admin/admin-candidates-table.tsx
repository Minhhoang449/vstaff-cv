"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Loader2, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { INDUSTRIES } from "@/data/industries";
import type { CandidateProfile } from "@/lib/candidates-shared";
import { cn } from "@/lib/utils";

function industryName(id: string) {
  return INDUSTRIES.find((i) => i.id === id)?.name ?? id;
}

function candidateCode(id: string) {
  const tail = id.replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase();
  return `UV-${tail || id.slice(0, 8).toUpperCase()}`;
}

type Props = {
  items: CandidateProfile[];
};

export function AdminCandidatesTable({ items: initial }: Props) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [current, setCurrent] = useState<CandidateProfile | null>(null);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onDelete() {
    if (!current) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/candidates/${encodeURIComponent(current.id)}`, {
        method: "DELETE",
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setError(data?.error || "Không xóa được.");
        return;
      }
      setItems((prev) => prev.filter((r) => r.id !== current.id));
      setOpen(false);
      setCurrent(null);
      router.refresh();
    } catch {
      setError("Không kết nối được máy chủ.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-zinc-100 bg-zinc-50/80 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
              <th className="min-w-[7.5rem] px-4 py-3 font-semibold sm:px-5">Mã UV</th>
              <th className="min-w-[12rem] px-3 py-3 font-semibold">Ứng viên</th>
              <th className="min-w-[8rem] px-3 py-3 font-semibold">Số điện thoại</th>
              <th className="min-w-[10rem] px-3 py-3 font-semibold">Vị trí</th>
              <th className="min-w-[9rem] px-3 py-3 font-semibold">Ngành</th>
              <th className="min-w-[8rem] px-3 py-3 font-semibold">Địa điểm</th>
              <th className="min-w-[7rem] px-3 py-3 font-semibold">Công khai</th>
              <th className="w-[7.5rem] px-4 py-3 text-right font-semibold sm:px-5">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-zinc-500">
                  Không có hồ sơ khớp bộ lọc.
                </td>
              </tr>
            ) : (
              items.map((c) => {
                const code = candidateCode(c.id);
                return (
                  <tr key={c.id} className="bg-white transition hover:bg-zinc-50/70">
                    <td className="px-4 py-4 align-middle sm:px-5">
                      <code className="rounded bg-zinc-100 px-1.5 py-0.5 font-mono text-[11px] font-semibold tracking-wide text-zinc-800">
                        {code}
                      </code>
                    </td>
                    <td className="px-3 py-4 align-middle">
                      <p className="font-semibold text-zinc-900">{c.fullName}</p>
                      <p className="mt-0.5 text-xs text-zinc-400">{c.email || "—"}</p>
                    </td>
                    <td className="px-3 py-4 align-middle tabular-nums text-zinc-800">
                      {c.phone || "—"}
                    </td>
                    <td className="px-3 py-4 align-middle text-zinc-700">{c.desiredPosition}</td>
                    <td className="px-3 py-4 align-middle text-zinc-600">
                      {industryName(c.industryId)}
                    </td>
                    <td className="px-3 py-4 align-middle text-zinc-600">{c.location}</td>
                    <td className="px-3 py-4 align-middle">
                      <span
                        className={cn(
                          "inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold",
                          c.isPublic
                            ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70"
                            : "bg-zinc-100 text-zinc-600"
                        )}
                      >
                        {c.isPublic ? "Công khai" : "Ẩn"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right align-middle sm:px-5">
                      <div className="inline-flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/employer/ung-vien/${c.slug}`}
                          className="text-xs font-semibold text-[var(--primary)] hover:underline"
                        >
                          CV
                        </Link>
                        <button
                          type="button"
                          title="Xóa ứng viên"
                          onClick={() => {
                            setCurrent(c);
                            setError(null);
                            setOpen(true);
                          }}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Dialog
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (!next) {
            setCurrent(null);
            setError(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa ứng viên?</DialogTitle>
            <DialogDescription>
              Xóa vĩnh viễn hồ sơ{" "}
              <span className="font-semibold text-zinc-800">{current?.fullName}</span>
              {current ? (
                <>
                  {" "}
                  (<code className="text-xs">{candidateCode(current.id)}</code>)
                </>
              ) : null}
              . SĐT/email đã mở, đã lưu liên quan cũng bị gỡ.
            </DialogDescription>
          </DialogHeader>
          {error ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          ) : null}
          <div className="mt-2 flex justify-end gap-2">
            <button
              type="button"
              disabled={saving}
              onClick={() => setOpen(false)}
              className="inline-flex h-10 items-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={() => void onDelete()}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Xóa hồ sơ
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
