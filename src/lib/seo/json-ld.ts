import { getSiteUrl, siteConfig } from "@/lib/site";

export function organizationJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    legalName: siteConfig.name,
    url: siteUrl,
    logo: `${siteUrl}/brand/vstaff-logo.png`,
    image: `${siteUrl}/brand/vstaff-logo.png`,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phoneTel,
    address: {
      "@type": "PostalAddress",
      streetAddress: siteConfig.address,
      addressCountry: "VN",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: `+84${siteConfig.phoneTel.replace(/^0/, "")}`,
        contactType: "customer service",
        areaServed: "VN",
        availableLanguage: ["Vietnamese"],
      },
    ],
    sameAs: [] as string[],
  };
}

export function websiteJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteUrl,
    description: siteConfig.description,
    inLanguage: "vi-VN",
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteUrl,
    },
  };
}

export function siteNavigationJsonLd() {
  const siteUrl = getSiteUrl();
  const items = [
    { name: "Trang chủ", path: "/" },
    { name: "Blog", path: "/blog" },
    { name: "Giới thiệu", path: "/gioi-thieu" },
    { name: "Liên hệ", path: "/lien-he" },
    { name: "Đăng ký nhà tuyển dụng", path: "/dang-ky" },
  ];
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, i) => ({
      "@type": "SiteNavigationElement",
      position: i + 1,
      name: item.name,
      url: `${siteUrl}${item.path}`,
    })),
  };
}
