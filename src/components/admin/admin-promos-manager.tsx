"use client";

import { useState, type FormEvent } from "react";
import { Check, Loader2, Pencil, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProDropdown } from "@/components/ui/pro-dropdown";
import {
  formatAdminDate,
  type AdminPromoRow,
} from "@/lib/admin/business-types";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1.5 flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20";

const STATUS_STYLE = {
  active: {
    label: "Đang diễn ra",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70",
  },
  upcoming: {
    label: "Sắp mở",
    className: "bg-sky-50 text-sky-700 ring-1 ring-sky-200/70",
  },
  ended: { label: "Đã kết thúc", className: "bg-zinc-100 text-zinc-500" },
} as const;

const STATUS_OPTIONS = [
  { value: "active", label: "Đang diễn ra" },
  { value: "upcoming", label: "Sắp mở" },
  { value: "ended", label: "Đã kết thúc" },
];

function toDateInput(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function fromDateInput(date: string) {
  if (!date) return new Date().toISOString();
  return new Date(`${date}T23:59:59+07:00`).toISOString();
}

type Props = {
  initialPromos: AdminPromoRow[];
};

export function AdminPromosManager({ initialPromos }: Props) {
  const [rows, setRows] = useState<AdminPromoRow[]>(() =>
    initialPromos.map((r) => ({ ...r }))
  );
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<AdminPromoRow | null>(null);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [discountLabel, setDiscountLabel] = useState("");
  const [status, setStatus] = useState<AdminPromoRow["status"]>("active");
  const [expiresAt, setExpiresAt] = useState("");
  const [usedCount, setUsedCount] = useState("0");

  function openCreate() {
    setEditing(null);
    setCode("");
    setTitle("");
    setDiscountLabel("");
    setStatus("active");
    setExpiresAt(toDateInput(new Date(Date.now() + 30 * 86400000).toISOString()));
    setUsedCount("0");
    setError(null);
    setOpen(true);
  }

  function openEdit(row: AdminPromoRow) {
    setEditing(row);
    setCode(row.code);
    setTitle(row.title);
    setDiscountLabel(row.discountLabel);
    setStatus(row.status);
    setExpiresAt(toDateInput(row.expiresAt));
    setUsedCount(String(row.usedCount));
    setError(null);
    setOpen(true);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!code.trim() || !title.trim() || !discountLabel.trim() || !expiresAt) return;

    const payload: AdminPromoRow = {
      id: editing?.id ?? "",
      code: code.trim().toUpperCase(),
      title: title.trim(),
      discountLabel: discountLabel.trim(),
      status,
      expiresAt: fromDateInput(expiresAt),
      usedCount: Math.max(0, Number(usedCount) || 0),
      badge: editing?.badge,
      body: editing?.body,
      sortOrder: editing?.sortOrder,
    };

    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/promotions", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as {
        promotion?: AdminPromoRow;
        error?: string;
      } | null;
      if (!res.ok || !data?.promotion) {
        setError(data?.error || "Không lưu được khuyến mãi.");
        return;
      }
      const next = data.promotion;
      setRows((prev) => {
        if (editing) return prev.map((r) => (r.id === editing.id ? next : r));
        return [next, ...prev];
      });
      setOpen(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Không kết nối được máy chủ.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-zinc-500">
          Mã KM lưu trên Postgres — đồng bộ trang NTD.
        </p>
        <div className="flex items-center gap-2">
          {saved ? (
            <span className="flex items-center gap-1 text-sm font-medium text-emerald-700">
              <Check className="h-4 w-4" aria-hidden />
              Đã lưu Postgres
            </span>
          ) : null}
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-3.5 text-sm font-semibold text-[var(--primary-foreground)]"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Thêm mã
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
        <div className="overflow-x-auto">
          {rows.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-zinc-500">
              Chưa có khuyến mãi. Bấm Thêm mã để tạo.
            </div>
          ) : (
            <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/80 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                  <th className="min-w-[8rem] px-4 py-3 font-semibold sm:px-5">Mã</th>
                  <th className="min-w-[14rem] px-3 py-3 font-semibold">Chương trình</th>
                  <th className="min-w-[6rem] px-3 py-3 font-semibold">Ưu đãi</th>
                  <th className="min-w-[5rem] px-3 py-3 font-semibold">Đã dùng</th>
                  <th className="min-w-[7rem] px-3 py-3 font-semibold">Hết hạn</th>
                  <th className="min-w-[7rem] px-3 py-3 font-semibold">Trạng thái</th>
                  <th className="w-[5rem] px-4 py-3 text-right font-semibold sm:px-5">Sửa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {rows.map((row) => {
                  const st = STATUS_STYLE[row.status];
                  return (
                    <tr key={row.id} className="bg-white transition hover:bg-zinc-50/70">
                      <td className="px-4 py-4 font-mono text-xs font-semibold text-zinc-900 sm:px-5">
                        {row.code}
                      </td>
                      <td className="px-3 py-4 text-zinc-800">{row.title}</td>
                      <td className="px-3 py-4 font-semibold text-[var(--primary)]">
                        {row.discountLabel}
                      </td>
                      <td className="px-3 py-4 tabular-nums text-zinc-700">{row.usedCount}</td>
                      <td className="px-3 py-4 text-zinc-600">
                        {formatAdminDate(row.expiresAt)}
                      </td>
                      <td className="px-3 py-4">
                        <span
                          className={cn(
                            "inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold",
                            st.className
                          )}
                        >
                          {st.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right sm:px-5">
                        <button
                          type="button"
                          onClick={() => openEdit(row)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition hover:bg-zinc-50 hover:text-[var(--primary)]"
                          aria-label={`Sửa ${row.code}`}
                        >
                          <Pencil className="h-3.5 w-3.5" aria-hidden />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="gap-0 overflow-y-auto p-5">
          <DialogHeader>
            <DialogTitle>{editing ? "Sửa khuyến mãi" : "Thêm khuyến mãi"}</DialogTitle>
            <DialogDescription>
              Lưu lên Postgres — hiện trên trang Khuyến mãi của NTD.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={onSubmit} className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-zinc-800">
                  Mã <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className={inputClass}
                  placeholder="PHOBIEN15"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800">
                  Ưu đãi <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  value={discountLabel}
                  onChange={(e) => setDiscountLabel(e.target.value)}
                  className={inputClass}
                  placeholder="-15% hoặc 399.000₫"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-800">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-zinc-800">Trạng thái</label>
                <div className="mt-1.5">
                  <ProDropdown
                    value={status}
                    onChange={(v) => setStatus(v as AdminPromoRow["status"])}
                    options={STATUS_OPTIONS}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800">
                  Hết hạn <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-800">Đã dùng</label>
              <input
                type="number"
                min={0}
                value={usedCount}
                onChange={(e) => setUsedCount(e.target.value)}
                className={inputClass}
              />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 items-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] disabled:opacity-60"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                Lưu
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
