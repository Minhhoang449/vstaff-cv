import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import {
  LEGAL_UPDATED_AT,
  buildLegalJsonLd,
  legalPaths,
  operatingRules,
} from "@/data/legal";
import { siteConfig } from "@/lib/site";

const path = legalPaths.rules;

export const metadata: Metadata = {
  title: operatingRules.title,
  description: operatingRules.description,
  keywords: operatingRules.keywords,
  openGraph: {
    title: `${operatingRules.title} | ${siteConfig.name}`,
    description: operatingRules.description,
    type: "article",
    url: path,
  },
  alternates: {
    canonical: path,
  },
  robots: { index: true, follow: true },
};

export default function OperatingRulesPage() {
  return (
    <LegalDocument
      title={operatingRules.title}
      description={operatingRules.description}
      updatedAt={LEGAL_UPDATED_AT}
      sections={operatingRules.sections}
      jsonLd={buildLegalJsonLd({
        title: operatingRules.title,
        description: operatingRules.description,
        path,
        updatedAt: LEGAL_UPDATED_AT,
      })}
      related={[
        { href: legalPaths.terms, label: "Điều khoản sử dụng" },
        { href: legalPaths.privacy, label: "Chính sách bảo mật" },
      ]}
    />
  );
}
