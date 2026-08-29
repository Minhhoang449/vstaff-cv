import { auth, signOut } from "@/auth";
import { AdminDashboardShell } from "@/components/admin/admin-dashboard-shell";
import { getAdminRevenueSnapshot } from "@/lib/admin-business";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const { currentMonth } = await getAdminRevenueSnapshot();

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <AdminDashboardShell
      userEmail={session?.user?.email ?? null}
      revenueAmount={currentMonth.amount}
      revenueCount={currentMonth.count}
      revenueLabel={currentMonth.label}
      signOutAction={signOutAction}
    >
      {children}
    </AdminDashboardShell>
  );
}
