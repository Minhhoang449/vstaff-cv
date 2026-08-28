import { INDUSTRIES } from "@/data/industries";
import { PROVINCES, shortProvinceName } from "@/data/vietnam-locations";
import {
  KEYWORD_HUBS,
  POPULAR_ROLES,
  ROLE_CITIES,
  buildCandidateRolePost,
  buildRoleCityPost,
  buildRolePost,
} from "@/lib/seo/keyword-hubs";
import { listJobboardPatternDrafts } from "@/lib/seo/jobboard-patterns";
import { listCompetitorPatternDrafts } from "@/lib/seo/competitor-seo-patterns";
import { slugifyVi } from "@/lib/seo/slugify";
import { siteConfig } from "@/lib/site";

export type BlogPost = {
  slug: string;
  path: string;
  title: string;
  h1: string;
  description: string;
  eyebrow: string;
  /** Đoạn mở */
  intro: string;
  /** Các mục nội dung */
  sections: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
  tags: string[];
  priority: number;
  kind: "guide" | "industry" | "province" | "combo" | "keyword";
};

const SEO_INDUSTRIES = INDUSTRIES.filter((i) => i.id !== "other");

/** Tỉnh/thành ưu tiên (combo) — tránh thin content quá nhiều. */
const MAJOR_PROVINCE_CODES = new Set(["01", "79", "48", "31", "92", "56", "75", "68"]);

function industrySlug(name: string) {
  return slugifyVi(name);
}

function provinceSlug(name: string) {
  return slugifyVi(shortProvinceName(name));
}

const EVERGREEN: Omit<BlogPost, "path">[] = [
  {
    slug: "headhunt-la-gi",
    kind: "guide",
    eyebrow: "Kiến thức tuyển dụng",
    title: "Headhunt là gì? Khi nào doanh nghiệp nên dùng headhunter",
    h1: "Headhunt là gì?",
    description: `Giải thích headhunt, khác gì đăng tin tuyển dụng, và khi nào nên dùng nền tảng như ${siteConfig.name}.`,
    intro: `Headhunt là cách nhà tuyển dụng chủ động tìm và tiếp cận ứng viên phù hợp, thay vì chỉ đăng tin rồi chờ ứng tuyển. Với kho hồ sơ chuẩn hoá, ${siteConfig.name} giúp NTD rút ngắn thời gian tìm đúng người.`,
    sections: [
      {
        heading: "Headhunt khác đăng tin việc làm thế nào?",
        body: "Đăng tin phụ thuộc ứng viên chủ động apply. Headhunt đảo chiều: NTD tìm trong kho CV, lọc theo ngành/địa bàn/kinh nghiệm rồi mở liên hệ khi cần. Phù hợp vị trí cạnh tranh hoặc cần tuyển nhanh.",
      },
      {
        heading: "Quy trình headhunt trên nền tảng số",
        body: "Thường gồm: xác định tiêu chí → tìm/lọc hồ sơ → lưu danh sách → mở liên hệ (SĐT/email) theo hạn mức gói → liên hệ và sàng lọc. Toàn bộ nằm trong một tài khoản nhà tuyển dụng.",
      },
      {
        heading: "Khi nào nên bắt đầu?",
        body: "Khi cần tuyển vị trí khó, mở rộng đội ngũ theo địa bàn, hoặc muốn chủ động tiếp cận ứng viên đang tìm việc / mở cơ hội. Có thể bắt đầu từ gói trải nghiệm rồi nâng hạn mức khi ổn định.",
      },
    ],
    faqs: [
      {
        q: `${siteConfig.name} có phải trang đăng tin không?`,
        a: "Không. Đây là nền tảng headhunter số tập trung kho CV và công cụ tìm/lưu/mở liên hệ cho nhà tuyển dụng.",
      },
      {
        q: "Ứng viên có phải trả phí không?",
        a: "Kho hồ sơ phục vụ NTD. Ứng viên được quản trị qua quy trình cập nhật hồ sơ của nền tảng.",
      },
    ],
    tags: ["headhunt", "tuyển dụng"],
    priority: 0.8,
  },
  {
    slug: "cach-doc-cv-ung-vien",
    kind: "guide",
    eyebrow: "Kỹ năng NTD",
    title: "Cách đọc CV ứng viên nhanh và chọn đúng hồ sơ",
    h1: "Cách đọc CV ứng viên hiệu quả",
    description:
      "Checklist đọc CV: vị trí mong muốn, kinh nghiệm, ngành, địa bàn — giúp NTD lọc hồ sơ headhunt nhanh hơn.",
    intro:
      "Đọc CV không phải đọc từng dòng. Với kho hồ sơ lớn, NTD cần khung đánh giá ngắn để loại nhanh hồ sơ không khớp và giữ lại ứng viên tiềm năng.",
    sections: [
      {
        heading: "Ưu tiên tín hiệu khớp vai trò",
        body: "Nhìn vị trí mong muốn, số năm kinh nghiệm và ngành trước. Nếu lệch hoàn toàn so với JD nội bộ, có thể bỏ qua sớm để tiết kiệm hạn mức mở liên hệ.",
      },
      {
        heading: "Địa bàn và hình thức làm việc",
        body: "Ứng viên khác tỉnh hoặc chỉ nhận remote có thể không phù hợp nếu bạn cần onsite. Lọc địa bàn trước khi mở SĐT/email.",
      },
      {
        heading: "Khi nào nên mở liên hệ?",
        body: "Khi hồ sơ khớp ≥70% tiêu chí cứng (ngành, kinh nghiệm, địa bàn). Mở liên hệ tiêu tốn hạn mức gói — nên ưu tiên danh sách đã lưu.",
      },
    ],
    faqs: [
      {
        q: "Có cần đọc hết phần summary không?",
        a: "Summary hữu ích nhưng dễ viết chung chung. Ưu tiên vị trí, kinh nghiệm và kỹ năng cụ thể.",
      },
    ],
    tags: ["cv", "tuyển dụng"],
    priority: 0.75,
  },
  {
    slug: "checklist-tuyen-dung-headhunt",
    kind: "guide",
    eyebrow: "Quy trình",
    title: "Checklist tuyển dụng headhunt cho nhà tuyển dụng",
    h1: "Checklist tuyển dụng theo hướng headhunt",
    description: `Các bước chuẩn bị trước khi tìm CV trên ${siteConfig.name}: tiêu chí, ngân sách gói, kịch bản liên hệ.`,
    intro:
      "Headhunt hiệu quả khi NTD chuẩn bị rõ tiêu chí trước. Checklist dưới đây giúp tránh mở liên hệ lan man và đốt hạn mức CV.",
    sections: [
      {
        heading: "1. Chốt tiêu chí cứng",
        body: "Ngành, địa bàn, khoảng kinh nghiệm, hình thức làm việc. Đây là bộ lọc bắt buộc trước khi xem chi tiết hồ sơ.",
      },
      {
        heading: "2. Chuẩn bị hạn mức mở liên hệ",
        body: "Ước lượng số ứng viên cần gọi trong tuần. Chọn gói phù hợp (Free theo ngày hoặc gói có hạn mức lớn hơn) để không gián đoạn giữa chiến dịch.",
      },
      {
        heading: "3. Kịch bản liên hệ ngắn",
        body: "Tin nhắn/gọi nên nêu rõ công ty, vị trí, lý do tiếp cận. Giữ ngắn để tăng tỉ lệ phản hồi.",
      },
    ],
    faqs: [
      {
        q: "Nên mở bao nhiêu hồ sơ mỗi ngày?",
        a: "Tùy pipeline phỏng vấn. Nhiều NTD bắt đầu 5–15 hồ sơ/ngày cho một vị trí, rồi điều chỉnh theo tỉ lệ trả lời.",
      },
    ],
    tags: ["checklist", "headhunt"],
    priority: 0.75,
  },
  {
    slug: "loi-ich-kho-ho-so-ung-vien",
    kind: "guide",
    eyebrow: "Sản phẩm",
    title: "Lợi ích kho hồ sơ ứng viên so với đăng tin truyền thống",
    h1: "Vì sao NTD dùng kho hồ sơ ứng viên?",
    description: `So sánh kho CV headhunt với đăng tin: tốc độ, chủ động tiếp cận, kiểm soát chi phí mở liên hệ trên ${siteConfig.name}.`,
    intro:
      "Kho hồ sơ giúp NTD chủ động. Thay vì chờ ứng tuyển, bạn tìm đúng nhóm ứng viên rồi quyết định khi nào mở liên hệ.",
    sections: [
      {
        heading: "Chủ động pipeline",
        body: "Bạn quyết định tốc độ tuyển: lọc hôm nay, liên hệ tuần này, không phụ thuộc lưu lượng apply theo chiến dịch tin.",
      },
      {
        heading: "Chi phí theo mức dùng",
        body: "Mở liên hệ theo hạn mức gói giúp kiểm soát chi phí tiếp cận từng hồ sơ, thay vì trả theo tin đăng mà chưa chắc có CV chất lượng.",
      },
      {
        heading: "Tái sử dụng danh sách",
        body: "Hồ sơ đã lưu / đã mở có thể dùng lại cho vòng sau hoặc vị trí tương tự trong cùng ngành.",
      },
    ],
    faqs: [
      {
        q: "Có thay thế hoàn toàn HR agency không?",
        a: "Kho hồ sơ phù hợp nội bộ NTD tự headhunt. Vị trí rất senior/executive vẫn có thể kết hợp agency chuyên biệt.",
      },
    ],
    tags: ["kho hồ sơ", "ntd"],
    priority: 0.7,
  },
];

function buildIndustryPost(name: string, id: string): BlogPost {
  const slug = `tuyen-ung-vien-${industrySlug(name)}`;
  return {
    slug,
    path: `/blog/${slug}`,
    kind: "industry",
    eyebrow: "Theo ngành",
    title: `Tuyển / headhunt ứng viên ${name}`,
    h1: `Headhunt ứng viên ngành ${name}`,
    description: `Hướng dẫn nhà tuyển dụng tìm và tiếp cận ứng viên ngành ${name}: tiêu chí lọc CV, shortlist, cách đọc hồ sơ và mở liên hệ hiệu quả trên ${siteConfig.name}.`,
    intro: `Ngành ${name} thường cạnh tranh về nhân sự. Bài viết giúp NTD xác định tiêu chí, lọc hồ sơ và chủ động headhunt thay vì chỉ đăng tin chờ ứng tuyển.`,
    sections: [
      {
        heading: `Tiêu chí cứng khi tuyển ${name}`,
        body: `Ưu tiên khớp ngành ${name}, số năm kinh nghiệm và kỹ năng cốt lõi của vai trò. Ghi rõ onsite/remote và địa bàn để giảm hồ sơ lệch.`,
      },
      {
        heading: "Cách lọc hồ sơ nhanh",
        body: `Bắt đầu từ bộ lọc ngành ${name}, sau đó thu hẹp theo tỉnh/thành và kinh nghiệm. Lưu danh sách ngắn trước khi mở liên hệ để không lãng phí hạn mức.`,
      },
      {
        heading: "Gợi ý nội dung liên hệ",
        body: `Nêu rõ công ty, vị trí thuộc nhóm ${name}, và lý do hồ sơ được chọn (kinh nghiệm/địa bàn). Tránh tin nhắn chung chung.`,
      },
      {
        heading: "Đo hiệu quả sau 1 tuần",
        body: `Theo dõi tỉ lệ phản hồi và số phỏng vấn trên mỗi 10 hồ sơ đã mở thuộc ngành ${name}. Siết hoặc nới bộ lọc dựa trên số liệu thực tế.`,
      },
    ],
    faqs: [
      {
        q: `Ở đâu tìm ứng viên ${name}?`,
        a: `Trên ${siteConfig.name}, đăng ký tài khoản NTD rồi tìm theo ngành ${name}. Có thể kết hợp lọc tỉnh/thành nếu cần tuyển địa phương.`,
      },
      {
        q: "Có cần mô tả JD dài không?",
        a: "JD nội bộ vẫn cần, nhưng khi headhunt hãy rút thành 3–5 tiêu chí cứng để lọc CV trước.",
      },
    ],
    tags: [name, "headhunt", id],
    priority: 0.65,
  };
}

function buildProvincePost(fullName: string, code: string): BlogPost {
  const short = shortProvinceName(fullName);
  const slug = `ung-vien-tai-${provinceSlug(fullName)}`;
  return {
    slug,
    path: `/blog/${slug}`,
    kind: "province",
    eyebrow: "Theo địa bàn",
    title: `Tìm ứng viên tại ${short} — headhunt địa phương`,
    h1: `Headhunt ứng viên tại ${short}`,
    description: `Gợi ý tuyển dụng và headhunt tại ${short}: lọc hồ sơ theo địa bàn, kết hợp ngành, chuẩn bị liên hệ và mở CV trên ${siteConfig.name}.`,
    intro: `Tuyển tại ${short} cần ưu tiên ứng viên sẵn sàng làm việc tại địa bàn. Headhunt giúp NTD chủ động tìm hồ sơ local thay vì chờ apply từ tin đăng.`,
    sections: [
      {
        heading: `Vì sao lọc theo ${short}?`,
        body: `Ứng viên khác tỉnh có thể không phù hợp nếu vị trí yêu cầu có mặt tại ${short}. Lọc địa bàn sớm giúp tăng tỉ lệ đồng ý phỏng vấn.`,
      },
      {
        heading: "Kết hợp ngành + địa bàn",
        body: `Sau khi chọn ${short}, thêm bộ lọc ngành để thu hẹp. Ví dụ tuyển sales hoặc IT tại cùng địa bàn sẽ có chiến lược liên hệ khác nhau.`,
      },
      {
        heading: "Chuẩn bị trước khi gọi",
        body: "Xác nhận ca làm việc, địa điểm văn phòng/chi nhánh và phúc lợi địa phương để trả lời nhanh khi ứng viên hỏi lại.",
      },
      {
        heading: `Lưu ý thị trường ${short}`,
        body: `Mức kỳ vọng lương và hình thức làm việc có thể khác các tỉnh lớn. Ghi khung đãi ngộ trong tin nhắn đầu để giảm vòng trao đổi vô ích.`,
      },
    ],
    faqs: [
      {
        q: `Làm sao tìm CV tại ${short}?`,
        a: `Đăng ký NTD trên ${siteConfig.name}, dùng bộ lọc tỉnh/thành ${short} trong kho hồ sơ, rồi lưu hoặc mở liên hệ theo gói.`,
      },
    ],
    tags: [short, "địa bàn", code],
    priority: 0.65,
  };
}

function buildComboPost(industryName: string, provinceName: string): BlogPost {
  const short = shortProvinceName(provinceName);
  const slug = `ung-vien-${industrySlug(industryName)}-tai-${provinceSlug(provinceName)}`;
  return {
    slug,
    path: `/blog/${slug}`,
    kind: "combo",
    eyebrow: "Ngành × địa bàn",
    title: `Ứng viên ${industryName} tại ${short}`,
    h1: `Tìm ứng viên ${industryName} tại ${short}`,
    description: `Headhunt ứng viên ${industryName} tại ${short}: bộ lọc ngành–địa bàn, shortlist CV, nội dung liên hệ và tối ưu hạn mức trên ${siteConfig.name}.`,
    intro: `Nhu cầu tuyển ${industryName} tại ${short} thường cần vừa khớp chuyên môn vừa gắn địa bàn. Bài viết gợi ý cách NTD chủ động tìm hồ sơ thay vì chỉ đăng tin.`,
    sections: [
      {
        heading: "Bộ lọc đề xuất",
        body: `Kết hợp ngành ${industryName} + địa bàn ${short} + khoảng kinh nghiệm. Lưu 10–20 hồ sơ khớp nhất trước khi mở liên hệ hàng loạt.`,
      },
      {
        heading: "Điểm cần xác nhận khi liên hệ",
        body: `Hỏi rõ khả năng làm việc tại ${short}, thời gian onboard và mức kỳ vọng. Tránh mở liên hệ nếu hồ sơ ghi địa bàn khác mà không chấp nhận relocate.`,
      },
      {
        heading: "Tối ưu hạn mức CV",
        body: "Chỉ mở hồ sơ đã qua lọc cứng. Dùng danh sách đã lưu để gọi theo đợt, đo tỉ lệ phản hồi rồi điều chỉnh tiêu chí.",
      },
      {
        heading: `Góc nhìn local ${short}`,
        body: `Với vị trí ${industryName} tại ${short}, nêu rõ địa điểm làm việc và hình thức (onsite/hybrid) ngay câu đầu để ứng viên tự lọc trước khi trao đổi sâu.`,
      },
    ],
    faqs: [
      {
        q: `Có nhiều ứng viên ${industryName} tại ${short} không?`,
        a: `Tuỳ thời điểm cập nhật kho. Trên ${siteConfig.name} bạn lọc theo ngành và tỉnh/thành để xem hồ sơ công khai phù hợp.`,
      },
    ],
    tags: [industryName, short],
    priority: 0.55,
  };
}

let _cache: BlogPost[] | null = null;

export function listBlogPosts(): BlogPost[] {
  if (_cache) return _cache;

  const posts: BlogPost[] = [
    ...EVERGREEN.map((p) => ({ ...p, path: `/blog/${p.slug}` })),
    ...KEYWORD_HUBS.map((p) => ({ ...p, path: `/blog/${p.slug}` })),
    ...listJobboardPatternDrafts().map((p) => ({ ...p, path: `/blog/${p.slug}` })),
    ...listCompetitorPatternDrafts().map((p) => ({ ...p, path: `/blog/${p.slug}` })),
  ];

  for (const role of POPULAR_ROLES) {
    const draft = buildRolePost(role);
    posts.push({ ...draft, path: `/blog/${draft.slug}` });
    const cand = buildCandidateRolePost(role);
    posts.push({ ...cand, path: `/blog/${cand.slug}` });
  }

  // Top roles × major cities (long-tail việc làm / tuyển dụng)
  const topRoles = POPULAR_ROLES.slice(0, 12);
  for (const role of topRoles) {
    for (const city of ROLE_CITIES) {
      const draft = buildRoleCityPost(role, city);
      posts.push({ ...draft, path: `/blog/${draft.slug}` });
    }
  }

  for (const ind of SEO_INDUSTRIES) {
    posts.push(buildIndustryPost(ind.name, ind.id));
  }
  for (const prov of PROVINCES) {
    posts.push(buildProvincePost(prov.name, prov.code));
  }

  const majors = PROVINCES.filter((p) => MAJOR_PROVINCE_CODES.has(p.code));
  // Top ngành × tỉnh lớn — đủ dày cho SEO, tránh hàng nghìn trang mỏng
  const topIndustries = SEO_INDUSTRIES.slice(0, 16);
  for (const ind of topIndustries) {
    for (const prov of majors) {
      posts.push(buildComboPost(ind.name, prov.name));
    }
  }

  // Deduplicate by slug
  const map = new Map<string, BlogPost>();
  for (const p of posts) map.set(p.slug, p);
  _cache = Array.from(map.values());
  return _cache;
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return listBlogPosts().find((p) => p.slug === slug);
}

export function industryBlogPath(industryName: string): string {
  return `/blog/tuyen-ung-vien-${industrySlug(industryName)}`;
}

export function provinceBlogPath(provinceFullName: string): string {
  return `/blog/ung-vien-tai-${provinceSlug(provinceFullName)}`;
}

export function relatedBlogPosts(post: BlogPost, limit = 8): BlogPost[] {
  const all = listBlogPosts().filter((p) => p.slug !== post.slug);
  const scored = all.map((p) => {
    let score = 0;
    if (p.kind === post.kind) score += 2;
    if (p.eyebrow === post.eyebrow) score += 3;
    for (const t of post.tags) {
      if (p.tags.includes(t)) score += 2;
    }
    // Cross-link viec-lam ↔ tuyen ↔ ung-vien cùng vị trí/địa bàn
    const a = post.slug.replace(/^(viec-lam-|tuyen-|ung-vien-)/, "");
    const b = p.slug.replace(/^(viec-lam-|tuyen-|ung-vien-)/, "");
    if (a && b && (a === b || a.endsWith(b) || b.endsWith(a))) score += 4;
    return { p, score };
  });
  return scored
    .filter((x) => x.score > 0)
    .sort((x, y) => y.score - x.score)
    .slice(0, limit)
    .map((x) => x.p);
}
