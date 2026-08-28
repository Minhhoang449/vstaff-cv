import { EmployerPageShell } from "@/components/employer/employer-page-shell";
import { EmployerCompanySettingsForm } from "@/components/employer/employer-company-settings-form";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { getEmployerCompanyProfile } from "@/lib/employer-profile";

export const metadata: Metadata = {
  title: "Cài đặt",
  robots: { index: false, follow: false },
};

export default async function EmployerSettingsPage() {
  const session = await auth();
  const profile = session?.user?.id
    ? await getEmployerCompanyProfile(session.user.id)
    : null;

  return (
    <EmployerPageShell>
      <div className="space-y-6">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Tài khoản
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-zinc-900">
            Cài đặt
          </h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
              Thiết lập thông tin trang công ty. Thông tin được lưu theo tài khoản nhà tuyển dụng của
              bạn.
            </p>
        </div>

        <EmployerCompanySettingsForm initialProfile={profile} />
      </div>
    </EmployerPageShell>
  );
}
