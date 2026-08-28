import type { CandidateProfile } from "@/lib/candidates-shared";

export function candidatePersonJsonLd(candidate: CandidateProfile, siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: candidate.fullName,
      jobTitle: candidate.title,
      description: candidate.summary,
      address: {
        "@type": "PostalAddress",
        addressLocality: candidate.location,
        addressCountry: "VN",
      },
      knowsAbout: candidate.skills,
      url: `${siteUrl}/dashboard/employer/ung-vien/${candidate.slug}`,
    },
    dateModified: candidate.updatedAt,
  };
}
