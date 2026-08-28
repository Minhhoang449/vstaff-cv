export type FeaturedCompany = {
  id: string;
  slug: string;
  name: string;
  industry: string;
  location: string;
  openJobs: number;
  logoText: string;
};

export const FEATURED_COMPANIES: FeaturedCompany[] = [
  {
    id: "c1",
    slug: "technova",
    name: "TechNova Solutions",
    industry: "Công nghệ thông tin",
    location: "TP. Hồ Chí Minh",
    openJobs: 24,
    logoText: "TN",
  },
  {
    id: "c2",
    slug: "woori-bank",
    name: "Woori Bank Vietnam",
    industry: "Tài chính / Ngân hàng",
    location: "Hà Nội",
    openJobs: 18,
    logoText: "WB",
  },
  {
    id: "c3",
    slug: "orient-retail",
    name: "Orient Retail Group",
    industry: "Bán lẻ",
    location: "Hà Nội",
    openJobs: 31,
    logoText: "OR",
  },
  {
    id: "c4",
    slug: "growth-lab",
    name: "Growth Lab Agency",
    industry: "Marketing",
    location: "Đà Nẵng",
    openJobs: 9,
    logoText: "GL",
  },
  {
    id: "c5",
    slug: "cloudbridge",
    name: "CloudBridge VN",
    industry: "Phần mềm",
    location: "TP. Hồ Chí Minh",
    openJobs: 15,
    logoText: "CB",
  },
  {
    id: "c6",
    slug: "saigon-trade",
    name: "Saigon Trade Co.",
    industry: "Thương mại",
    location: "TP. Hồ Chí Minh",
    openJobs: 12,
    logoText: "ST",
  },
  {
    id: "c7",
    slug: "logistics-express",
    name: "Logistics Express",
    industry: "Logistics",
    location: "Bắc Ninh",
    openJobs: 20,
    logoText: "LE",
  },
  {
    id: "c8",
    slug: "vstaff-partners",
    name: "Vstaff Partners",
    industry: "Tư vấn nhân sự",
    location: "Toàn quốc",
    openJobs: 27,
    logoText: "VS",
  },
];
