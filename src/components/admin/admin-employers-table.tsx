"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProDropdown } from "@/components/ui/pro-dropdown";
import type { EmployerPlan } from "@/data/employer-plans";
import {
  formatAdminDate,
  formatCvQuotaLabel,
  type AdminEmployerRow,
  type AdminEmployerStatus,
} from "@/lib/admin/business-types";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1.5 flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20";

const STATUS_STYLE: Record<AdminEmployerStatus, { label: string; className: string }> = {
  active: {
    label: "Đang dùng",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70",
  },
  trial: {
    label: "Dùng thử",
    className: "bg-sky-50 text-sky-700 ring-1 ring-sky-200/70",
  },
  expired: {
    label: "Hết hạn",
    className: "bg-zinc-100 text-zinc-600",
  },
  suspended: {
    label: "Tạm khóa",
    className: "bg-red-50 text-red-700 ring-1 ring-red-200/70",
  },
};

type Props = {
  initialRows: AdminEmployerRow[];
  plans: EmployerPlan[];
};

export function AdminEmployersTable({ initialRows, plans }: Props) {
  const router = useRouter();
  const [rows, setRows] = useState(initialRows);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [current, setCurrent] = useState<AdminEmployerRow | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [planId, setPlanId] = useState("free");
  const [accountStatus, setAccountStatus] = useState<"active" | "suspended">("active");
  const [password, setPassword] = useState("");

  function openEdit(row: AdminEmployerRow) {
    setCurrent(row);
    setCompany(row.company);
    setEmail(row.email);
    setPhone(row.phone || "");
    setPlanId(row.planId || "free");
    setAccountStatus(row.status === "suspended" ? "suspended" : "active");
    setPassword("");
    setError(null);
    setEditOpen(true);
  }

  function openDelete(row: AdminEmployerRow) {
    setCurrent(row);
    setError(null);
    setDeleteOpen(true);
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!current || !company.trim() || !email.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/employers/${current.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company,
          email,
          phone,
          planId,
          accountStatus,
          ...(password.trim() ? { password: password.trim() } : {}),
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        employer?: AdminEmployerRow;
        error?: string;
      } | null;
      if (!res.ok || !data?.employer) {
        setError(data?.error || "Không cập nhật được.");
        return;
      }
      setRows((prev) => prev.map((r) => (r.id === current.id ? data.employer! : r)));
      setEditOpen(false);
      router.refresh();
    } catch {
      setError("Không kết nối được máy chủ.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete() {
    if (!current) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/employers/${current.id}`, { method: "DELETE" });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setError(data?.error || "Không xóa được.");
        return;
      }
      setRows((prev) => prev.filter((r) => r.id !== current.id));
      setDeleteOpen(false);
      router.refresh();
    } catch {
      setError("Không kết nối được máy chủ.");
    } finally {
      setSaving(false);
    }
  }

  const planOptions = plans.map((p) => ({ value: p.id, label: `${p.name} · ${p.durationLabel}` }));
  const statusOptions = [
    { value: "active", label: "Đang hoạt động" },
    { value: "suspended", label: "Tạm khóa" },
  ];

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[56rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/80 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                <th className="min-w-[12rem] px-4 py-3 font-semibold sm:px-5">Công ty</th>
                <th className="min-w-[11rem] px-3 py-3 font-semibold">Email</th>
                <th className="min-w-[7rem] px-3 py-3 font-semibold">Gói</th>
                <th className="min-w-[7rem] px-3 py-3 font-semibold">Hạn mức CV</th>
                <th className="min-w-[7rem] px-3 py-3 font-semibold">Kích hoạt</th>
                <th className="min-w-[7rem] px-3 py-3 font-semibold">Trạng thái</th>
                <th className="w-[6.5rem] px-4 py-3 text-right font-semibold sm:px-5">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm text-zinc-500">
                    Không có NTD khớp bộ lọc.
                  </td>
                </tr>
              ) : (
                rows.map((row) => {
                  const status = STATUS_STYLE[row.status];
                  return (
                    <tr key={row.id} className="bg-white transition hover:bg-zinc-50/70">
                      <td className="px-4 py-4 align-middle font-semibold text-zinc-900 sm:px-5">
                        {row.company}
                      </td>
                      <td className="px-3 py-4 align-middle text-zinc-600">{row.email}</td>
                      <td className="px-3 py-4 align-middle text-zinc-700">{row.planName}</td>
                      <td className="px-3 py-4 align-middle tabular-nums text-zinc-700">
                        {formatCvQuotaLabel(row.cvUsed, row.cvLimit)}
                      </td>
                      <td className="px-3 py-4 align-middle text-zinc-600">
                        {formatAdminDate(row.activatedAt)}
                      </td>
                      <td className="px-3 py-4 align-middle">
                        <span
                          className={cn(
                            "inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold",
                            status.className
                          )}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right sm:px-5">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => openEdit(row)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition hover:bg-zinc-50 hover:text-[var(--primary)]"
                            aria-label={`Sửa ${row.company}`}
                          >
                            <Pencil className="h-3.5 w-3.5" aria-hidden />
                          </button>
                          <button
                            type="button"
                            onClick={() => openDelete(row)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                            aria-label={`Xóa ${row.company}`}
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
      </div>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent size="lg" className="gap-0 overflow-y-auto p-5">
          <DialogHeader>
            <DialogTitle>Sửa nhà tuyển dụng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin, gói và trạng thái tài khoản trên Postgres.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={onSave} className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-zinc-800">Công ty *</label>
                <input
                  required
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800">Email *</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800">Điện thoại</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800">Gói</label>
                <div className="mt-1.5">
                  <ProDropdown value={planId} onChange={setPlanId} options={planOptions} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800">Trạng thái tài khoản</label>
                <div className="mt-1.5">
                  <ProDropdown
                    value={accountStatus}
                    onChange={(v) => setAccountStatus(v as "active" | "suspended")}
                    options={statusOptions}
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-zinc-800">
                  Mật khẩu mới <span className="font-normal text-zinc-400">(tuỳ chọn)</span>
                </label>
                <input
                  type="password"
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Để trống nếu không đổi"
                  className={inputClass}
                />
              </div>
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditOpen(false)}
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

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="gap-0 p-5">
          <DialogHeader>
            <DialogTitle>Xóa nhà tuyển dụng?</DialogTitle>
            <DialogDescription>
              Xóa vĩnh viễn tài khoản{" "}
              <span className="font-semibold text-zinc-800">{current?.company}</span> (
              {current?.email}). Gói và unlock CV liên quan cũng bị gỡ.
            </DialogDescription>
          </DialogHeader>
          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
          <div className="mt-5 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setDeleteOpen(false)}
              className="inline-flex h-10 items-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700"
            >
              Hủy
            </button>
            <button
              type="button"
              disabled={saving}
              onClick={onDelete}
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-red-600 px-4 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Xóa
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
