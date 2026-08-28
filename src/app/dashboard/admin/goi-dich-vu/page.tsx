import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminPlansManager } from "@/components/admin/admin-plans-manager";
import type { Metadata } from "next";
import { listAdminActivations } from "@/lib/admin-business";
import { listServicePlans } from "@/lib/service-plans";

export const metadata: Metadata = {
  title: "Gói & kích hoạt",
  robots: { index: false, follow: false },
};

export default async function AdminPlansPage() {
  const [plans, activations] = await Promise.all([
    listServicePlans(),
    listAdminActivations(),
  ]);

  return (
    <AdminPageShell>
      <div className="space-y-6">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Kinh doanh
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-zinc-900">
            Gói & kích hoạt
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
            Điều chỉnh danh mục gói dịch vụ và lịch sử kích hoạt từ Postgres.
          </p>
        </div>

        <AdminPlansManager initialPlans={plans} activations={activations} />
      </div>
    </AdminPageShell>
  );
}
