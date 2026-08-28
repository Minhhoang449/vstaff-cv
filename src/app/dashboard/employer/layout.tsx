import Link from "next/link";
import { auth, signOut } from "@/auth";
import { EmployerPlanQuotaBar } from "@/components/employer/employer-plan-quota-bar";
import { EmployerSidebar } from "@/components/employer/employer-sidebar";
import { VstaffLogo } from "@/components/home/vstaff-logo";
import { Button } from "@/components/ui/button";
import { getEmployerSubscriptionState } from "@/lib/employer-unlocks";

export default async function EmployerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  let subscription = null;
  try {
    subscription = await getEmployerSubscriptionState(session?.user?.id);
  } catch {
    // DB lỗi — ẩn thanh gói, vẫn cho vào dashboard
    subscription = null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--background)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-white/95 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between gap-3 px-4 sm:gap-4 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <VstaffLogo />
            <span className="hidden h-4 w-px bg-zinc-200 sm:block" aria-hidden />
            <span className="hidden text-sm text-zinc-500 sm:inline">Nhà tuyển dụng</span>
          </div>

          <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:gap-3">
            {subscription ? <EmployerPlanQuotaBar subscription={subscription} /> : null}
            <span className="hidden max-w-[12rem] truncate text-sm text-zinc-600 xl:inline">
              {session?.user?.email}
            </span>
            <Link
              href="/dashboard/employer/tim-ung-vien"
              className="hidden text-sm font-medium text-[var(--primary)] hover:underline lg:inline"
            >
              Tìm ứng viên
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button type="submit" variant="outline" size="sm">
                Đăng xuất
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <EmployerSidebar />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
