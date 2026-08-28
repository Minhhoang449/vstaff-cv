"use client";

import { useState, type FormEvent } from "react";
import { Check, Loader2, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  formatAdminDate,
  type AdminActivationRow,
} from "@/lib/admin/business-types";
import { formatVnd, type EmployerPlan } from "@/data/employer-plans";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1.5 flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20";

const ACT_STATUS = {
  active: {
    label: "Đang dùng",
    className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/70",
  },
  expired: { label: "Hết hạn", className: "bg-zinc-100 text-zinc-600" },
  pending: {
    label: "Chờ thanh toán",
    className: "bg-amber-50 text-amber-800 ring-1 ring-amber-200/70",
  },
  cancelled: {
    label: "Đã hủy",
    className: "bg-red-50 text-red-700 ring-1 ring-red-200/70",
  },
} as const;

type Props = {
  initialPlans: EmployerPlan[];
  activations: AdminActivationRow[];
};

export function AdminPlansManager({ initialPlans, activations }: Props) {
  const [plans, setPlans] = useState<EmployerPlan[]>(() =>
    initialPlans.map((p) => ({ ...p, features: [...p.features] }))
  );
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [planOpen, setPlanOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<EmployerPlan | null>(null);
  const [planName, setPlanName] = useState("");
  const [planPrice, setPlanPrice] = useState("");
  const [planDurationDays, setPlanDurationDays] = useState("");
  const [planDurationLabel, setPlanDurationLabel] = useState("");
  const [planCvLimitLabel, setPlanCvLimitLabel] = useState("");
  const [planCvLimit, setPlanCvLimit] = useState("");
  const [planCvPerDay, setPlanCvPerDay] = useState("");
  const [planFeatures, setPlanFeatures] = useState("");
  const [planHighlight, setPlanHighlight] = useState(false);

  function openEditPlan(plan: EmployerPlan) {
    setEditingPlan(plan);
    setPlanName(plan.name);
    setPlanPrice(String(plan.price));
    setPlanDurationDays(String(plan.durationDays));
    setPlanDurationLabel(plan.durationLabel);
    setPlanCvLimitLabel(plan.cvLimitLabel);
    setPlanCvLimit(plan.cvLimit == null ? "" : String(plan.cvLimit));
    setPlanCvPerDay(plan.cvPerDay != null ? String(plan.cvPerDay) : "");
    setPlanFeatures(plan.features.join("\n"));
    setPlanHighlight(Boolean(plan.highlight));
    setError(null);
    setPlanOpen(true);
  }

  async function onSavePlan(e: FormEvent) {
    e.preventDefault();
    if (!editingPlan || !planName.trim() || !planDurationLabel.trim() || !planCvLimitLabel.trim()) {
      return;
    }
    const price = Math.max(0, Number(planPrice) || 0);
    const durationDays = Math.max(0, Number(planDurationDays) || 0);
    const cvLimitRaw = planCvLimit.trim();
    const cvLimit = cvLimitRaw === "" ? null : Math.max(0, Number(cvLimitRaw) || 0);
    const cvPerDayRaw = planCvPerDay.trim();
    const cvPerDay =
      cvPerDayRaw === "" ? undefined : Math.max(0, Number(cvPerDayRaw) || 0);
    const features = planFeatures
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    const nextPlans = plans.map((p) =>
      p.id === editingPlan.id
        ? {
            ...p,
            name: planName.trim(),
            price,
            durationDays,
            durationLabel: planDurationLabel.trim(),
            cvLimit,
            cvLimitLabel: planCvLimitLabel.trim(),
            cvPerDay,
            highlight: planHighlight,
            features: features.length ? features : p.features,
          }
        : planHighlight
          ? { ...p, highlight: false }
          : p
    );

    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/plans", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plans: nextPlans }),
      });
      const data = (await res.json().catch(() => null)) as {
        plans?: EmployerPlan[];
        error?: string;
      } | null;
      if (!res.ok) {
        setError(data?.error || "Không lưu được gói.");
        return;
      }
      setPlans(
        (data?.plans || nextPlans).map((p) => ({ ...p, features: [...(p.features || [])] }))
      );
      setPlanOpen(false);
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Không kết nối được máy chủ.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-zinc-500">
          Danh mục gói lưu trên Postgres — áp dụng cho Bảng giá và thanh toán NTD.
        </p>
        {saved ? (
          <span className="flex items-center gap-1 text-sm font-medium text-emerald-700">
            <Check className="h-4 w-4" aria-hidden />
            Đã lưu Postgres
          </span>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
        <div className="border-b border-zinc-100 px-4 py-3 sm:px-5">
          <h2 className="text-sm font-semibold text-zinc-800">Danh mục gói</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[40rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-100 bg-zinc-50/80 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                <th className="px-4 py-3 font-semibold sm:px-5">Gói</th>
                <th className="px-3 py-3 font-semibold">Thời hạn</th>
                <th className="px-3 py-3 font-semibold">Hạn mức</th>
                <th className="px-3 py-3 font-semibold">Giá</th>
                <th className="w-[5rem] px-4 py-3 text-right font-semibold sm:px-5">Sửa</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {plans.map((plan) => (
                <tr key={plan.id} className="bg-white transition hover:bg-zinc-50/70">
                  <td className="px-4 py-3.5 sm:px-5">
                    <span className="font-semibold text-zinc-900">{plan.name}</span>
                    {plan.highlight ? (
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-[var(--primary)]">
                        Phổ biến
                      </span>
                    ) : null}
                  </td>
                  <td className="px-3 py-3.5 text-zinc-600">{plan.durationLabel}</td>
                  <td className="px-3 py-3.5 text-zinc-600">{plan.cvLimitLabel}</td>
                  <td className="px-3 py-3.5 font-semibold text-zinc-900">
                    {formatVnd(plan.price)}
                  </td>
                  <td className="px-4 py-3.5 text-right sm:px-5">
                    <button
                      type="button"
                      onClick={() => openEditPlan(plan)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 text-zinc-600 transition hover:bg-zinc-50 hover:text-[var(--primary)]"
                      aria-label={`Sửa gói ${plan.name}`}
                    >
                      <Pencil className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-white">
        <div className="border-b border-zinc-100 px-4 py-3 sm:px-5">
          <h2 className="text-sm font-semibold text-zinc-800">Lịch sử kích hoạt</h2>
          <p className="mt-0.5 text-xs text-zinc-500">Từ đơn thanh toán Postgres (PaymentOrder).</p>
        </div>
        <div className="overflow-x-auto">
          {activations.length === 0 ? (
            <div className="px-5 py-12 text-center text-sm text-zinc-500">
              Chưa có đơn kích hoạt nào.
            </div>
          ) : (
            <table className="w-full min-w-[48rem] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/80 text-[11px] font-semibold tracking-wide text-zinc-500 uppercase">
                  <th className="min-w-[11rem] px-4 py-3 font-semibold sm:px-5">Công ty</th>
                  <th className="min-w-[7rem] px-3 py-3 font-semibold">Gói</th>
                  <th className="min-w-[7rem] px-3 py-3 font-semibold">Số tiền</th>
                  <th className="min-w-[7rem] px-3 py-3 font-semibold">Mã KM</th>
                  <th className="min-w-[7rem] px-3 py-3 font-semibold">Kích hoạt</th>
                  <th className="min-w-[7rem] px-3 py-3 font-semibold">Hết hạn</th>
                  <th className="min-w-[7rem] px-4 py-3 font-semibold sm:px-5">Trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {activations.map((row) => {
                  const status = ACT_STATUS[row.status];
                  return (
                    <tr key={row.id} className="bg-white transition hover:bg-zinc-50/70">
                      <td className="px-4 py-4 font-semibold text-zinc-900 sm:px-5">
                        {row.company}
                      </td>
                      <td className="px-3 py-4 text-zinc-700">{row.planName}</td>
                      <td className="px-3 py-4 tabular-nums text-zinc-800">
                        {formatVnd(row.amount)}
                      </td>
                      <td className="px-3 py-4 font-mono text-xs text-zinc-700">
                        {row.promoCode ?? "—"}
                      </td>
                      <td className="px-3 py-4 text-zinc-600">
                        {formatAdminDate(row.activatedAt)}
                      </td>
                      <td className="px-3 py-4 text-zinc-600">
                        {formatAdminDate(row.expiresAt)}
                      </td>
                      <td className="px-4 py-4 sm:px-5">
                        <span
                          className={cn(
                            "inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold",
                            status.className
                          )}
                        >
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Dialog open={planOpen} onOpenChange={setPlanOpen}>
        <DialogContent size="lg" className="gap-0 overflow-y-auto p-5">
          <DialogHeader>
            <DialogTitle>Sửa gói {editingPlan?.name}</DialogTitle>
            <DialogDescription>Điều chỉnh giá, thời hạn và hạn mức CV — lưu Postgres.</DialogDescription>
          </DialogHeader>
          <form onSubmit={onSavePlan} className="mt-4 space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-zinc-800">Tên gói *</label>
                <input
                  required
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800">Giá (VND) *</label>
                <input
                  required
                  type="number"
                  min={0}
                  value={planPrice}
                  onChange={(e) => setPlanPrice(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800">Số ngày</label>
                <input
                  type="number"
                  min={0}
                  value={planDurationDays}
                  onChange={(e) => setPlanDurationDays(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800">Nhãn thời hạn *</label>
                <input
                  required
                  value={planDurationLabel}
                  onChange={(e) => setPlanDurationLabel(e.target.value)}
                  className={inputClass}
                  placeholder="30 ngày"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800">
                  Hạn mức CV (số, trống = ∞)
                </label>
                <input
                  type="number"
                  min={0}
                  value={planCvLimit}
                  onChange={(e) => setPlanCvLimit(e.target.value)}
                  className={inputClass}
                  placeholder="200 hoặc để trống"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800">Nhãn hạn mức *</label>
                <input
                  required
                  value={planCvLimitLabel}
                  onChange={(e) => setPlanCvLimitLabel(e.target.value)}
                  className={inputClass}
                  placeholder="2 CV / ngày"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800">CV / ngày (Free)</label>
                <input
                  type="number"
                  min={0}
                  value={planCvPerDay}
                  onChange={(e) => setPlanCvPerDay(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex items-end pb-1">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-800">
                  <input
                    type="checkbox"
                    checked={planHighlight}
                    onChange={(e) => setPlanHighlight(e.target.checked)}
                    className="h-4 w-4 rounded border-zinc-300 text-[var(--primary)]"
                  />
                  Đánh dấu phổ biến nhất
                </label>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-800">
                Tính năng (mỗi dòng 1 mục)
              </label>
              <textarea
                value={planFeatures}
                onChange={(e) => setPlanFeatures(e.target.value)}
                rows={4}
                className="mt-1.5 w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setPlanOpen(false)}
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
                Lưu gói
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
