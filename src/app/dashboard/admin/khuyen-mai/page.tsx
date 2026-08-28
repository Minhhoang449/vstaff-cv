import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminPromosManager } from "@/components/admin/admin-promos-manager";
import type { Metadata } from "next";
import { listAdminPromotions } from "@/lib/promotions";

export const metadata: Metadata = {
  title: "Khuyến mãi Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPromotionsPage() {
  const promotions = await listAdminPromotions();

  return (
    <AdminPageShell>
      <div className="space-y-5">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Kinh doanh
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-zinc-900">
            Khuyến mãi
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
            Quản lý mã giảm giá trên Postgres — đồng bộ trang NTD.
          </p>
        </div>

        <AdminPromosManager initialPromos={promotions} />
      </div>
    </AdminPageShell>
  );
}
