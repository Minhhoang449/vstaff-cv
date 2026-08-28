"use client";

import { useState, type FormEvent } from "react";
import { AlertTriangle, Check, Loader2, Mail, Shield } from "lucide-react";
import type { SystemSettings } from "@/lib/system-settings-types";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1.5 flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20";

type ToggleRowProps = {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  danger?: boolean;
};

function ToggleRow({ id, title, description, checked, onChange, danger }: ToggleRowProps) {
  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-start justify-between gap-4 rounded-lg border px-4 py-3.5 transition",
        danger && checked
          ? "border-amber-200 bg-amber-50/70"
          : "border-zinc-200 bg-white hover:border-zinc-300"
      )}
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-zinc-900">{title}</span>
        <span className="mt-0.5 block text-sm leading-relaxed text-zinc-500">{description}</span>
      </span>
      <span className="relative mt-0.5 inline-flex h-6 w-11 shrink-0 items-center">
        <input
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="peer sr-only"
        />
        <span
          className={cn(
            "absolute inset-0 rounded-full transition",
            danger && checked
              ? "bg-amber-500 peer-focus-visible:ring-amber-500/30"
              : "bg-zinc-200 peer-checked:bg-[var(--primary)] peer-focus-visible:ring-[var(--primary)]/30",
            "peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2"
          )}
          aria-hidden
        />
        <span
          className={cn(
            "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition",
            "peer-checked:translate-x-5"
          )}
          aria-hidden
        />
      </span>
    </label>
  );
}

type Props = {
  initialSettings: SystemSettings;
};

export function AdminSystemSettingsForm({ initialSettings }: Props) {
  const [siteName, setSiteName] = useState(initialSettings.siteName);
  const [supportEmail, setSupportEmail] = useState(initialSettings.supportEmail);
  const [supportPhone, setSupportPhone] = useState(initialSettings.supportPhone);
  const [allowEmployerSignup, setAllowEmployerSignup] = useState(
    initialSettings.allowEmployerSignup
  );
  const [maintenance, setMaintenance] = useState(initialSettings.maintenance);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!siteName.trim() || !supportEmail.trim()) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteName,
          supportEmail,
          supportPhone,
          allowEmployerSignup,
          maintenance,
        } satisfies SystemSettings),
      });
      const data = (await res.json().catch(() => null)) as {
        settings?: SystemSettings;
        error?: string;
      } | null;
      if (!res.ok) {
        setError(data?.error || "Không lưu được cài đặt.");
        return;
      }
      if (data?.settings) {
        setSiteName(data.settings.siteName);
        setSupportEmail(data.settings.supportEmail);
        setSupportPhone(data.settings.supportPhone);
        setAllowEmployerSignup(data.settings.allowEmployerSignup);
        setMaintenance(data.settings.maintenance);
      }
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Không kết nối được máy chủ.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-5">
          <section className="rounded-xl border border-[var(--border)] bg-white p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-[var(--secondary)] text-[var(--primary)]">
                <Shield className="h-4 w-4" aria-hidden />
              </span>
              <div>
                <h2 className="text-sm font-semibold text-zinc-900">Thông tin nền tảng</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  Tên và liên hệ hiển thị cho nhà tuyển dụng.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label htmlFor="admin-site-name" className="text-sm font-medium text-zinc-800">
                  Tên nền tảng
                </label>
                <input
                  id="admin-site-name"
                  required
                  value={siteName}
                  onChange={(e) => setSiteName(e.target.value)}
                  placeholder="Vstaff"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="admin-support-email" className="text-sm font-medium text-zinc-800">
                  Email hỗ trợ
                </label>
                <input
                  id="admin-support-email"
                  type="email"
                  required
                  value={supportEmail}
                  onChange={(e) => setSupportEmail(e.target.value)}
                  placeholder="support@vstaff.vn"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="admin-support-phone" className="text-sm font-medium text-zinc-800">
                  Hotline
                </label>
                <input
                  id="admin-support-phone"
                  type="tel"
                  value={supportPhone}
                  onChange={(e) => setSupportPhone(e.target.value)}
                  placeholder="1900 …"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-[var(--border)] bg-white p-5 sm:p-6">
            <div>
              <h2 className="text-sm font-semibold text-zinc-900">Đăng ký & truy cập</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Bật / tắt kênh đăng ký và chế độ bảo trì.
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <ToggleRow
                id="admin-allow-employer"
                title="Đăng ký nhà tuyển dụng"
                description="Cho phép NTD tự tạo tài khoản trên trang đăng ký."
                checked={allowEmployerSignup}
                onChange={setAllowEmployerSignup}
              />
              <ToggleRow
                id="admin-maintenance"
                title="Chế độ bảo trì"
                description="Tạm khóa trang công khai; admin và tài khoản nội bộ vẫn vào được."
                checked={maintenance}
                onChange={setMaintenance}
                danger
              />
            </div>

            {maintenance ? (
              <p
                role="status"
                className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm text-amber-900"
              >
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                Site đang ở chế độ bảo trì — khách sẽ thấy thông báo tạm dừng dịch vụ.
              </p>
            ) : null}
          </section>

          <div className="flex flex-wrap items-center justify-end gap-3 rounded-xl border border-[var(--border)] bg-white px-4 py-3.5 sm:px-5">
            {error ? (
              <p className="mr-auto text-sm text-red-600">{error}</p>
            ) : saved ? (
              <p className="mr-auto flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                <Check className="h-4 w-4" aria-hidden />
                Đã lưu Postgres
              </p>
            ) : (
              <p className="mr-auto text-sm text-zinc-500">
                Lưu vào Postgres `SystemSetting`.
              </p>
            )}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex h-10 items-center gap-1.5 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-92 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
              Lưu cài đặt
            </button>
          </div>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
          <div className="rounded-xl border border-[var(--border)] bg-white p-5">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-zinc-400">
              Xem nhanh
            </p>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-zinc-500">Nền tảng</dt>
                <dd className="mt-0.5 font-semibold text-zinc-900">{siteName.trim() || "—"}</dd>
              </div>
              <div>
                <dt className="text-zinc-500">Hỗ trợ</dt>
                <dd className="mt-0.5 flex items-center gap-1.5 font-medium text-zinc-800">
                  <Mail className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden />
                  <span className="truncate">{supportEmail.trim() || "—"}</span>
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Trạng thái</dt>
                <dd className="mt-0.5">
                  {maintenance ? (
                    <span className="inline-flex rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-900">
                      Bảo trì
                    </span>
                  ) : (
                    <span className="inline-flex rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                      Đang hoạt động
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-zinc-500">Đăng ký NTD</dt>
                <dd className="mt-0.5 text-zinc-800">
                  {allowEmployerSignup ? "Đang mở" : "Đã đóng"}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </form>
  );
}
