import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import {
  LEGAL_UPDATED_AT,
  buildLegalJsonLd,
  legalPaths,
  privacyPolicy,
} from "@/data/legal";
import { siteConfig } from "@/lib/site";

const path = legalPaths.privacy;

export const metadata: Metadata = {
  title: privacyPolicy.title,
  description: privacyPolicy.description,
  keywords: privacyPolicy.keywords,
  openGraph: {
    title: `${privacyPolicy.title} | ${siteConfig.name}`,
    description: privacyPolicy.description,
    type: "article",
    url: path,
  },
  alternates: {
    canonical: path,
  },
  robots: { index: true, follow: true },
};

export default function PrivacyPolicyPage() {
  return (
    <LegalDocument
      title={privacyPolicy.title}
      description={privacyPolicy.description}
      updatedAt={LEGAL_UPDATED_AT}
      sections={privacyPolicy.sections}
      jsonLd={buildLegalJsonLd({
        title: privacyPolicy.title,
        description: privacyPolicy.description,
        path,
        updatedAt: LEGAL_UPDATED_AT,
      })}
      related={[
        { href: legalPaths.terms, label: "Điều khoản sử dụng" },
        { href: legalPaths.rules, label: "Quy chế hoạt động" },
      ]}
    />
  );
}
