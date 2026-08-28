/**
 * Pattern SEO việc làm theo tỉnh / vị trí / hình thức / kỹ năng.
 * Copy công khai không nhắc tên đối thủ.
 */
import { siteConfig } from "@/lib/site";
import type { KeywordDraft } from "@/lib/seo/keyword-hubs";
import { POPULAR_ROLES, ROLE_CITIES } from "@/lib/seo/keyword-hubs";
import { PROVINCES, shortProvinceName } from "@/data/vietnam-locations";
import { slugifyVi } from "@/lib/seo/slugify";

export const JOB_FACETS: {
  slug: string;
  name: string;
  eyebrow: string;
  seekerPhrase: string;
}[] = [
  {
    slug: "viec-lam-fresher",
    name: "Fresher / mới ra trường",
    eyebrow: "Fresher",
    seekerPhrase: "việc làm fresher",
  },
  {
    slug: "viec-lam-thuc-tap",
    name: "Thực tập",
    eyebrow: "Thực tập",
    seekerPhrase: "việc làm thực tập",
  },
  {
    slug: "viec-lam-part-time",
    name: "Part-time / bán thời gian",
    eyebrow: "Part-time",
    seekerPhrase: "việc làm part time",
  },
  {
    slug: "viec-lam-remote",
    name: "Remote / làm việc từ xa",
    eyebrow: "Remote",
    seekerPhrase: "việc làm remote",
  },
  {
    slug: "viec-lam-khong-yeu-cau-kinh-nghiem",
    name: "Không yêu cầu kinh nghiệm",
    eyebrow: "Không YC KN",
    seekerPhrase: "việc làm không yêu cầu kinh nghiệm",
  },
  {
    slug: "viec-lam-full-time",
    name: "Full-time / toàn thời gian",
    eyebrow: "Full-time",
    seekerPhrase: "việc làm full time",
  },
  {
    slug: "viec-lam-luong-cao",
    name: "Lương cao / đãi ngộ tốt",
    eyebrow: "Lương cao",
    seekerPhrase: "việc làm lương cao",
  },
  {
    slug: "viec-lam-tai-nha",
    name: "Làm việc tại nhà",
    eyebrow: "Tại nhà",
    seekerPhrase: "việc làm tại nhà",
  },
];

export const JOB_SKILLS: { slugPart: string; name: string }[] = [
  { slugPart: "excel", name: "Excel" },
  { slugPart: "tieng-anh", name: "Tiếng Anh" },
  { slugPart: "react", name: "React" },
  { slugPart: "nodejs", name: "Node.js" },
  { slugPart: "php", name: "PHP" },
  { slugPart: "java", name: "Java" },
  { slugPart: "python", name: "Python" },
  { slugPart: "auto-cad", name: "AutoCAD" },
  { slugPart: "photoshop", name: "Photoshop" },
  { slugPart: "sap", name: "SAP" },
  { slugPart: "salesforce", name: "Salesforce" },
  { slugPart: "digital-marketing", name: "Digital Marketing" },
];

export function buildViecLamPillar(): KeywordDraft {
  return {
    slug: "viec-lam",
    kind: "keyword",
    eyebrow: "Việc làm",
    title: "Việc làm & tuyển dụng — góc nhà tuyển dụng tìm ứng viên",
    h1: "Việc làm cho nhà tuyển dụng (headhunt CV)",
    description: `Trang tổng hợp việc làm theo góc NTD: tìm ứng viên, lọc CV theo ngành–địa bàn, mở liên hệ trên ${siteConfig.name}.`,
    intro: `“Việc làm” là điểm vào phổ biến khi tìm cơ hội nghề nghiệp. Tại ${siteConfig.name}, hub này giúp nhà tuyển dụng hiểu cách dùng kho hồ sơ để lấp vị trí thay vì chỉ đăng tin chờ apply.`,
    sections: [
      {
        heading: "Việc làm theo địa bàn",
        body: "NTD nên bắt đầu từ tỉnh/thành cần tuyển, rồi mới chọn ngành/vị trí. Lọc local giúp giảm no-show phỏng vấn.",
      },
      {
        heading: "Việc làm theo vị trí",
        body: "Mỗi chức danh (kế toán, sales, IT…) có tiêu chí cứng khác nhau. Shortlist theo vai trò trước khi mở liên hệ.",
      },
      {
        heading: "Việc làm theo hình thức",
        body: "Fresher, part-time, remote, full-time — ghi rõ hình thức trong outreach để ứng viên tự lọc.",
      },
      {
        heading: "Khác gì đăng tin việc làm?",
        body: `${siteConfig.name} tập trung kho CV/headhunt: NTD chủ động tìm hồ sơ. Có thể dùng song song kênh đăng tin.`,
      },
    ],
    faqs: [
      {
        q: "Ứng viên có nộp đơn trên đây không?",
        a: "Mô hình hiện tại ưu tiên NTD mở liên hệ từ kho hồ sơ. Blog “việc làm” mang tính SEO/kiến thức tuyển dụng.",
      },
      {
        q: "Làm sao bắt đầu?",
        a: `Đăng ký NTD, chọn bài theo tỉnh hoặc vị trí bên dưới, rồi lọc CV trên ${siteConfig.name}.`,
      },
    ],
    tags: ["việc làm", "tuyển dụng", "hub"],
    priority: 0.95,
  };
}

export function buildViecLamCityPost(fullName: string, code: string): KeywordDraft {
  const short = shortProvinceName(fullName);
  const slug = `viec-lam-tai-${slugifyVi(short)}`;
  return {
    slug,
    kind: "keyword",
    eyebrow: "Việc làm theo tỉnh",
    title: `Việc làm tại ${short} — tuyển dụng & tìm ứng viên local`,
    h1: `Việc làm tại ${short}`,
    description: `Việc làm / tuyển dụng tại ${short}: góc nhà tuyển dụng lọc ứng viên địa bàn, đọc CV và mở liên hệ trên ${siteConfig.name}.`,
    intro: `“Việc làm tại ${short}” là truy vấn phổ biến. Với NTD, đó là tín hiệu nên ưu tiên hồ sơ sẵn sàng làm việc tại ${short}.`,
    sections: [
      {
        heading: `Tuyển tại ${short} nên lọc thế nào?`,
        body: `Đặt địa bàn ${short} là tiêu chí cứng, rồi mới thêm ngành và kinh nghiệm. Giảm hồ sơ khác tỉnh nếu vị trí onsite.`,
      },
      {
        heading: "Nội dung liên hệ local",
        body: `Nêu rõ địa điểm văn phòng/chi nhánh tại ${short}, ca làm việc và hỗ trợ đi lại (nếu có).`,
      },
      {
        heading: "Kết hợp vị trí phổ biến",
        body: `Sales, kế toán, hành chính, kho, IT… tại ${short} thường có nhu cầu ổn định. Xem thêm bài tuyển theo vị trí tại cùng địa bàn.`,
      },
      {
        heading: "Đo hiệu quả",
        body: "Theo dõi tỉ lệ phản hồi theo tuần. Nếu thấp, nới bán kính địa bàn hoặc siết lại JD/đãi ngộ trong tin nhắn.",
      },
    ],
    faqs: [
      {
        q: `Ở đâu tìm ứng viên tại ${short}?`,
        a: `Đăng ký trên ${siteConfig.name}, lọc tỉnh/thành ${short} trong kho hồ sơ, lưu shortlist rồi mở liên hệ theo gói.`,
      },
    ],
    tags: [`việc làm ${short}`, short, "địa bàn", code],
    priority: 0.8,
  };
}

export function buildViecLamRolePost(role: (typeof POPULAR_ROLES)[number]): KeywordDraft {
  return {
    slug: `viec-lam-${role.slugPart}`,
    kind: "keyword",
    eyebrow: "Việc làm theo vị trí",
    title: `Việc làm ${role.name} — góc NTD tìm ứng viên`,
    h1: `Việc làm ${role.name}`,
    description: `Việc làm ${role.name}: cách nhà tuyển dụng tìm CV, shortlist và liên hệ ứng viên phù hợp trên ${siteConfig.name}.`,
    intro: `Người tìm việc gõ “việc làm ${role.name}”; nhà tuyển dụng cần nguồn ứng viên ${role.name}. Bài này hướng dẫn NTD headhunt đúng vai trò.`,
    sections: [
      {
        heading: `Tiêu chí tuyển ${role.name}`,
        body: `Chốt kỹ năng then chốt${role.aliases[0] ? ` (liên quan ${role.aliases[0]})` : ""}, năm KN, địa bàn và hình thức làm việc trước khi lọc kho.`,
      },
      {
        heading: "Cách đọc CV nhanh",
        body: `Ưu tiên đúng chức danh/kinh nghiệm gần với ${role.name}. Loại sớm hồ sơ lệch ngành để tiết kiệm hạn mức mở liên hệ.`,
      },
      {
        heading: "Outreach hiệu quả",
        body: `Tin nhắn nêu vị trí ${role.name}, 1 lý do chọn hồ sơ, khung đãi ngộ và CTA rõ.`,
      },
      {
        heading: "Mở rộng theo tỉnh",
        body: `Khi cần local, kết hợp “${role.name} + tỉnh/thành”. Xem các bài việc làm ${role.name} tại Hà Nội, TP.HCM…`,
      },
    ],
    faqs: [
      {
        q: `Tìm ứng viên ${role.name} ở đâu?`,
        a: `Trên ${siteConfig.name}: đăng ký NTD → tìm theo từ khóa/ngành liên quan ${role.name} → mở liên hệ theo gói.`,
      },
    ],
    tags: [`việc làm ${role.name}`, role.name, "tuyển dụng", ...role.aliases],
    priority: 0.78,
  };
}

export function buildViecLamRoleCityPost(
  role: (typeof POPULAR_ROLES)[number],
  city: (typeof ROLE_CITIES)[number]
): KeywordDraft {
  return {
    slug: `viec-lam-${role.slugPart}-tai-${city.slugPart}`,
    kind: "keyword",
    eyebrow: "Việc làm × địa bàn",
    title: `Việc làm ${role.name} tại ${city.name}`,
    h1: `Việc làm ${role.name} tại ${city.name}`,
    description: `Việc làm ${role.name} tại ${city.name}: NTD lọc ứng viên local, đọc CV và mở liên hệ trên ${siteConfig.name}.`,
    intro: `Cụm “việc làm ${role.name} tại ${city.name}” có nhu cầu tìm kiếm cao. NTD dùng cùng ý định để lọc kho hồ sơ local.`,
    sections: [
      {
        heading: "Bộ lọc đề xuất",
        body: `Vị trí/ngành gắn ${role.name} + địa bàn ${city.name} + khoảng KN. Shortlist 15–25 hồ sơ trước khi mở liên hệ.`,
      },
      {
        heading: "Xác nhận khi gọi",
        body: `Hỏi khả năng làm việc tại ${city.name}, thời gian onboard và mức lương kỳ vọng.`,
      },
      {
        heading: "Khác bài “tuyển …” thế nào?",
        body: `Bài “việc làm …” nhắm truy vấn người tìm việc; bài “tuyển …” nhắm truy vấn NTD. Cùng mục tiêu: giúp bạn tìm đúng ứng viên.`,
      },
    ],
    faqs: [
      {
        q: `Có nhiều ứng viên ${role.name} tại ${city.name}?`,
        a: `Tuỳ kho theo thời điểm. Lọc trên ${siteConfig.name} và điều chỉnh bán kính nếu shortlist mỏng.`,
      },
    ],
    tags: [`việc làm ${role.name}`, city.name, role.name],
    priority: 0.6,
  };
}

export function buildFacetPost(facet: (typeof JOB_FACETS)[number]): KeywordDraft {
  return {
    slug: facet.slug,
    kind: "keyword",
    eyebrow: facet.eyebrow,
    title: `${facet.seekerPhrase} — góc nhà tuyển dụng`,
    h1: facet.seekerPhrase.charAt(0).toUpperCase() + facet.seekerPhrase.slice(1),
    description: `${facet.seekerPhrase}: cách NTD tìm và tiếp cận ứng viên nhóm ${facet.name} trên kho hồ sơ ${siteConfig.name}.`,
    intro: `Truy vấn “${facet.seekerPhrase}” xuất hiện nhiều trên các trang tuyển dụng. NTD có thể dùng cùng nhóm ứng viên này trong chiến dịch headhunt.`,
    sections: [
      {
        heading: `Khi nào tuyển nhóm ${facet.name}?`,
        body: `Phù hợp khi JD thật sự khớp hình thức ${facet.name}. Tránh ghi fresher/remote trên tin nhắn nếu vị trí thực tế khác.`,
      },
      {
        heading: "Cách lọc hồ sơ",
        body: `Dùng từ khóa và tiêu chí kinh nghiệm/hình thức phù hợp ${facet.name}. Shortlist trước, mở liên hệ sau.`,
      },
      {
        heading: "Nội dung outreach",
        body: `Nêu rõ hình thức ${facet.name}, lịch làm việc và đãi ngộ liên quan để tăng tỉ lệ phản hồi.`,
      },
    ],
    faqs: [
      {
        q: `Ứng viên ${facet.name} phản hồi có nhanh không?`,
        a: "Thường nhanh hơn nhóm passive nếu JD và đãi ngộ rõ. Vẫn nên cá nhân hoá tin nhắn.",
      },
    ],
    tags: [facet.seekerPhrase, facet.name, "việc làm"],
    priority: 0.82,
  };
}

export function buildSkillPost(skill: (typeof JOB_SKILLS)[number]): KeywordDraft {
  return {
    slug: `ung-vien-biet-${skill.slugPart}`,
    kind: "keyword",
    eyebrow: "Theo kỹ năng",
    title: `Ứng viên biết ${skill.name} — tìm CV theo kỹ năng`,
    h1: `Tìm ứng viên biết ${skill.name}`,
    description: `Cách nhà tuyển dụng tìm ứng viên / CV có kỹ năng ${skill.name}: lọc kho hồ sơ và mở liên hệ trên ${siteConfig.name}.`,
    intro: `Nhiều NTD tìm “ứng viên ${skill.name}” hoặc “việc làm yêu cầu ${skill.name}”. Headhunt theo kỹ năng giúp siết shortlist đúng JD.`,
    sections: [
      {
        heading: `Nhận diện CV có ${skill.name}`,
        body: `Ưu tiên mục kỹ năng và mô tả công việc có dùng ${skill.name} kèm thành tích đo được (không chỉ liệt kê từ khoá).`,
      },
      {
        heading: "Kết hợp ngành + địa bàn",
        body: `Sau khi lọc ${skill.name}, thêm ngành và tỉnh để tránh hồ sơ lệch ngữ cảnh công việc.`,
      },
      {
        heading: "Câu hỏi xác minh",
        body: `Khi liên hệ, hỏi tình huống thực tế đã dùng ${skill.name} — giúp loại ứng viên chỉ ghi skill cho đẹp CV.`,
      },
    ],
    faqs: [
      {
        q: `Lọc ${skill.name} trên ${siteConfig.name} thế nào?`,
        a: "Dùng ô tìm kiếm/từ khóa kỹ năng kết hợp bộ lọc ngành–địa bàn, rồi lưu shortlist trước khi mở liên hệ.",
      },
    ],
    tags: [skill.name, "kỹ năng", "ứng viên"],
    priority: 0.7,
  };
}

export function listJobboardPatternDrafts(): KeywordDraft[] {
  const drafts: KeywordDraft[] = [
    buildViecLamPillar(),
    ...JOB_FACETS.map(buildFacetPost),
    ...JOB_SKILLS.map(buildSkillPost),
  ];

  for (const role of POPULAR_ROLES) {
    drafts.push(buildViecLamRolePost(role));
  }

  const cities = PROVINCES;
  for (const prov of cities) {
    drafts.push(buildViecLamCityPost(prov.name, prov.code));
  }

  // Role × city long-tail
  const topRoles = POPULAR_ROLES.slice(0, 15);
  for (const role of topRoles) {
    for (const city of ROLE_CITIES) {
      drafts.push(buildViecLamRoleCityPost(role, city));
    }
  }

  return drafts;
}
