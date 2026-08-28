import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import {
  LEGAL_UPDATED_AT,
  buildLegalJsonLd,
  legalPaths,
  termsOfUse,
} from "@/data/legal";
import { siteConfig } from "@/lib/site";

const path = legalPaths.terms;

export const metadata: Metadata = {
  title: termsOfUse.title,
  description: termsOfUse.description,
  keywords: termsOfUse.keywords,
  openGraph: {
    title: `${termsOfUse.title} | ${siteConfig.name}`,
    description: termsOfUse.description,
    type: "article",
    url: path,
  },
  alternates: {
    canonical: path,
  },
  robots: { index: true, follow: true },
};

export default function TermsOfUsePage() {
  return (
    <LegalDocument
      title={termsOfUse.title}
      description={termsOfUse.description}
      updatedAt={LEGAL_UPDATED_AT}
      sections={termsOfUse.sections}
      jsonLd={buildLegalJsonLd({
        title: termsOfUse.title,
        description: termsOfUse.description,
        path,
        updatedAt: LEGAL_UPDATED_AT,
      })}
      related={[
        { href: legalPaths.privacy, label: "Chính sách bảo mật" },
        { href: legalPaths.rules, label: "Quy chế hoạt động" },
      ]}
    />
  );
}
