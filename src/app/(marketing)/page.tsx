import type { Metadata } from "next";
import { HomeHero } from "@/components/home/home-hero";
import { HomeIntroSections } from "@/components/home/home-intro-sections";
import { HomeSeoSection } from "@/components/home/home-seo-section";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: `${siteConfig.name} — Headhunter, cung cấp CV & tìm ứng viên`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteConfig.name} — Headhunter & kho hồ sơ ứng viên`,
    description: siteConfig.description,
    url: "/",
    type: "website",
    images: [
      {
        url: "/brand/vstaff-logo.png",
        width: 1024,
        height: 1024,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Headhunter & kho hồ sơ ứng viên`,
    description: siteConfig.description,
    images: ["/brand/vstaff-logo.png"],
  },
};

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <HomeIntroSections />
      <HomeSeoSection />
    </>
  );
}
