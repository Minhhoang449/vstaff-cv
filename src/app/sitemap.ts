import type { MetadataRoute } from "next";
import { listBlogPosts } from "@/lib/seo/blog-catalog";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${siteUrl}/blog`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/gioi-thieu`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/lien-he`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/dieu-khoan-su-dung`,
      lastModified: new Date("2026-08-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/chinh-sach-bao-mat`,
      lastModified: new Date("2026-08-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteUrl}/quy-che-hoat-dong`,
      lastModified: new Date("2026-08-01"),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = listBlogPosts().map((p) => ({
    url: `${siteUrl}${p.path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: p.priority,
  }));

  return [...staticRoutes, ...blogRoutes];
}
