import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogArticlePage } from "@/components/marketing/blog-article-page";
import { getBlogPost, listBlogPosts, relatedBlogPosts } from "@/lib/seo/blog-catalog";
import { siteConfig } from "@/lib/site";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return listBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) {
    return {
      title: "Không tìm thấy bài viết",
      robots: { index: false, follow: true },
    };
  }
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: siteConfig.name }],
    category: "Tuyển dụng",
    alternates: { canonical: post.path },
    openGraph: {
      title: post.title,
      description: post.description,
      url: post.path,
      type: "article",
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      images: [
        {
          url: "/brand/vstaff-logo.png",
          width: 1024,
          height: 1024,
          alt: post.h1,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/brand/vstaff-logo.png"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();
  return <BlogArticlePage post={post} related={relatedBlogPosts(post)} />;
}
