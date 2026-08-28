import { AdminPageShell } from "@/components/admin/admin-page-shell";
import { AdminEmployersTable } from "@/components/admin/admin-employers-table";
import { AdminEmployersToolbar } from "@/components/admin/admin-employers-toolbar";
import type { Metadata } from "next";
import { listAdminEmployers } from "@/lib/admin-employers";
import { listServicePlans } from "@/lib/service-plans";

export const metadata: Metadata = {
  title: "Quản lý nhà tuyển dụng",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{
  q?: string;
  plan?: string;
  status?: string;
}>;

export default async function AdminEmployersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const sp = await searchParams;
  const filters = {
    q: sp.q?.trim() || undefined,
    plan: sp.plan?.trim() || undefined,
    status: sp.status?.trim() || undefined,
  };

  const [all, plans] = await Promise.all([listAdminEmployers(), listServicePlans()]);

  const q = filters.q?.toLowerCase() ?? "";
  let items = all;
  if (q) {
    items = items.filter(
      (r) =>
        r.company.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)
    );
  }
  if (filters.plan) items = items.filter((r) => r.planName === filters.plan);
  if (filters.status) {
    items = items.filter((r) => r.status === filters.status);
  }

  return (
    <AdminPageShell>
      <div className="space-y-5">
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            Quản lý
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium tracking-tight text-zinc-900">
            Nhà tuyển dụng
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-600">
            Tài khoản NTD trên Postgres — tìm, sửa thông tin / gói, tạm khóa hoặc xóa.
          </p>
        </div>

        <AdminEmployersToolbar
          values={filters}
          total={items.length}
          planNames={plans.map((p) => p.name)}
        />

        <AdminEmployersTable
          key={`${filters.q || ""}-${filters.plan || ""}-${filters.status || ""}`}
          initialRows={items}
          plans={plans}
        />
      </div>
    </AdminPageShell>
  );
}
