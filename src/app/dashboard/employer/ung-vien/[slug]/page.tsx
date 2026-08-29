import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EmployerPageShell } from "@/components/employer/employer-page-shell";
import { EmployerCandidateDetail } from "@/components/employer/employer-candidate-detail";
import { auth } from "@/auth";
import { getCandidateBySlug, markCandidateViewed } from "@/lib/candidates";
import { toVstaffCvDocumentData } from "@/lib/cv/cv-document-data";
import { formatCvQuota } from "@/data/employer-subscription";
import {
  getEmployerSubscriptionState,
  isCandidateContactUnlocked,
  maskContactOnCvData,
} from "@/lib/employer-unlocks";

export const metadata: Metadata = {
  title: "Chi tiết ứng viên",
  robots: { index: false, follow: false },
};

type Params = Promise<{ slug: string }>;

export default async function EmployerCandidateDetailPage({ params }: { params: Params }) {
  const { slug } = await params;
  const session = await auth();
  const employerId =
    session?.user?.role === "EMPLOYER" || session?.user?.role === "ADMIN"
      ? session.user.id
      : undefined;

  const candidate = await getCandidateBySlug(slug, { employerId });
  if (!candidate) notFound();

  if (employerId && session?.user?.role === "EMPLOYER") {
    await markCandidateViewed(employerId, candidate.id);
  }

  const isAdmin = session?.user?.role === "ADMIN";
  const [unlocked, subscription] = await Promise.all([
    isAdmin || !employerId
      ? Promise.resolve(isAdmin)
      : isCandidateContactUnlocked(employerId, candidate.id),
    getEmployerSubscriptionState(employerId),
  ]);

  const safeCandidate = maskContactOnCvData(candidate, unlocked);
  const cvData = maskContactOnCvData(toVstaffCvDocumentData(candidate), unlocked);

  return (
    <EmployerPageShell>
      <EmployerCandidateDetail
        candidate={safeCandidate}
        cvData={cvData}
        unlocked={unlocked}
        cvQuotaLabel={
          subscription
            ? formatCvQuota(
                subscription.cvUsed,
                subscription.cvLimit,
                subscription.planId,
                subscription.cvUsedToday
              )
            : ""
        }
      />
    </EmployerPageShell>
  );
}
