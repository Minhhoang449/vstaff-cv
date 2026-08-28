import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminSystemSettingsForm } from "@/components/admin/admin-system-settings-form";
import type { Metadata } from "next";
import { getSystemSettings } from "@/lib/system-settings";

export const metadata: Metadata = {
  title: "Cài đặt hệ thống",
  robots: { index: false, follow: false },
};

export default async function AdminSettingsPage() {
  const settings = await getSystemSettings();

  return (
    <AdminPageShell>
      <div className="space-y-6">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Hệ thống
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-zinc-900">
            Cài đặt
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
            Thông tin nền tảng, liên hệ hỗ trợ và quyền đăng ký / bảo trì — lưu trên Postgres.
          </p>
        </div>

        <AdminSystemSettingsForm initialSettings={settings} />
      </div>
    </AdminPageShell>
  );
}
