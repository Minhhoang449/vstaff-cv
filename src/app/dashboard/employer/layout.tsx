import { auth, signOut } from "@/auth";
import { EmployerDashboardShell } from "@/components/employer/employer-dashboard-shell";
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
    subscription = null;
  }

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <EmployerDashboardShell
      subscription={subscription}
      userEmail={session?.user?.email ?? null}
      signOutAction={signOutAction}
    >
      {children}
    </EmployerDashboardShell>
  );
}
