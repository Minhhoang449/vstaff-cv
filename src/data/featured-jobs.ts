export type FeaturedJob = {
  id: string;
  slug: string;
  title: string;
  company: string;
  companyInitials: string;
  salary: string;
  salaryBand: "all" | "under10" | "10-20" | "20-40" | "over40" | "negotiable";
  location: string;
  region: "random" | "hn" | "hcm" | "north" | "south";
  industryId: string;
};

export const JOB_LOCATION_FILTERS = [
  { id: "random", label: "Tất cả" },
  { id: "hn", label: "Hà Nội" },
  { id: "hcm", label: "TP. Hồ Chí Minh" },
  { id: "north", label: "Miền Bắc" },
  { id: "south", label: "Miền Nam" },
] as const;

export const JOB_SALARY_FILTERS = [
  { id: "all", label: "Tất cả mức lương" },
  { id: "under10", label: "Dưới 10 triệu" },
  { id: "10-20", label: "10 - 20 triệu" },
  { id: "20-40", label: "20 - 40 triệu" },
  { id: "over40", label: "Trên 40 triệu" },
  { id: "negotiable", label: "Thoả thuận" },
] as const;

export const FEATURED_JOBS: FeaturedJob[] = [
  {
    id: "j1",
    slug: "ke-toan-tong-hop",
    title: "Kế Toán Tổng Hợp",
    company: "Công ty TNHH Tài Chính Á Châu",
    companyInitials: "AC",
    salary: "10 - 15 triệu",
    salaryBand: "10-20",
    location: "Hà Nội",
    region: "hn",
    industryId: "accounting",
  },
  {
    id: "j2",
    slug: "nhan-vien-kinh-doanh-thiet-bi",
    title: "Nhân Viên Kinh Doanh Thiết Bị Garage Oto - Hà Nội",
    company: "Công ty TNHH Uni Việt",
    companyInitials: "UV",
    salary: "15 - 20 triệu",
    salaryBand: "10-20",
    location: "Hà Nội",
    region: "hn",
    industryId: "sales",
  },
  {
    id: "j3",
    slug: "ke-toan-quan-tri",
    title: "Management Accounting / Kế toán Quản trị",
    company: "Woori Bank Vietnam",
    companyInitials: "WB",
    salary: "15 - 25 triệu",
    salaryBand: "20-40",
    location: "Hà Nội",
    region: "hn",
    industryId: "finance",
  },
  {
    id: "j4",
    slug: "frontend-developer",
    title: "Frontend Developer (React/Next.js)",
    company: "TechNova Solutions",
    companyInitials: "TN",
    salary: "20 - 35 triệu",
    salaryBand: "20-40",
    location: "TP. Hồ Chí Minh",
    region: "hcm",
    industryId: "it-software",
  },
  {
    id: "j5",
    slug: "chuyen-vien-nhan-su",
    title: "Chuyên viên Nhân sự",
    company: "Orient Retail Group",
    companyInitials: "OR",
    salary: "12 - 18 triệu",
    salaryBand: "10-20",
    location: "Hà Nội & Hải Phòng",
    region: "north",
    industryId: "hr",
  },
  {
    id: "j6",
    slug: "digital-marketing",
    title: "Digital Marketing Executive",
    company: "Growth Lab Agency",
    companyInitials: "GL",
    salary: "10 - 16 triệu",
    salaryBand: "10-20",
    location: "Đà Nẵng",
    region: "south",
    industryId: "marketing",
  },
  {
    id: "j7",
    slug: "backend-node",
    title: "Backend Engineer (Node.js)",
    company: "CloudBridge VN",
    companyInitials: "CB",
    salary: "25 - 40 triệu",
    salaryBand: "20-40",
    location: "TP. Hồ Chí Minh",
    region: "hcm",
    industryId: "it-software",
  },
  {
    id: "j8",
    slug: "tro-ly-kinh-doanh",
    title: "Trợ lý Kinh doanh",
    company: "Saigon Trade Co.",
    companyInitials: "ST",
    salary: "8 - 12 triệu",
    salaryBand: "under10",
    location: "TP. Hồ Chí Minh",
    region: "south",
    industryId: "sales",
  },
  {
    id: "j9",
    slug: "nhan-vien-kho",
    title: "Nhân viên Kho vận",
    company: "Logistics Express",
    companyInitials: "LE",
    salary: "8 - 11 triệu",
    salaryBand: "under10",
    location: "Bắc Ninh",
    region: "north",
    industryId: "logistics",
  },
  {
    id: "j10",
    slug: "cong-nhan-san-xuat",
    title: "Công nhân Sản xuất",
    company: "Precision Factory",
    companyInitials: "PF",
    salary: "9 - 13 triệu",
    salaryBand: "10-20",
    location: "Đồng Nai",
    region: "south",
    industryId: "manufacturing",
  },
  {
    id: "j11",
    slug: "bao-ve-toa-nha",
    title: "Nhân viên Bảo vệ tòa nhà",
    company: "SecureHome",
    companyInitials: "SH",
    salary: "7 - 9 triệu",
    salaryBand: "under10",
    location: "Hà Nội",
    region: "hn",
    industryId: "other",
  },
  {
    id: "j12",
    slug: "lai-xe-giao-hang",
    title: "Lái xe giao hàng",
    company: "FastShip VN",
    companyInitials: "FS",
    salary: "Thoả thuận",
    salaryBand: "negotiable",
    location: "TP. Hồ Chí Minh",
    region: "hcm",
    industryId: "logistics",
  },
];

export type FeaturedJobFilters = {
  region: string;
  salaryBand: string;
  industryId: string;
};

export function filterFeaturedJobs(jobs: FeaturedJob[], filters: FeaturedJobFilters) {
  return jobs.filter((job) => {
    if (filters.region !== "random" && job.region !== filters.region) return false;
    if (filters.salaryBand !== "all" && job.salaryBand !== filters.salaryBand) return false;
    if (filters.industryId !== "all" && job.industryId !== filters.industryId) return false;
    return true;
  });
}
