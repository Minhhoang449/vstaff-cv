/**
 * Bổ sung hub SEO theo nhu cầu tìm kiếm phổ biến (nội bộ):
 * tìm việc làm, đi làm ngay, nhóm nghề, cấp bậc, tỉnh/thành, ngành × tỉnh.
 * Không đưa tên đối thủ vào copy công khai.
 */
import { INDUSTRIES } from "@/data/industries";
import { PROVINCES, shortProvinceName } from "@/data/vietnam-locations";
import type { KeywordDraft } from "@/lib/seo/keyword-hubs";
import { ROLE_CITIES } from "@/lib/seo/keyword-hubs";
import { slugifyVi } from "@/lib/seo/slugify";
import { siteConfig } from "@/lib/site";

export const COMPETITOR_HUBS: KeywordDraft[] = [
  {
    slug: "tim-viec-lam",
    kind: "keyword",
    eyebrow: "Tìm việc làm",
    title: "Tìm việc làm — góc nhà tuyển dụng tìm ứng viên",
    h1: "Tìm việc làm & tìm ứng viên",
    description: `Hướng dẫn nhà tuyển dụng dùng kho CV để lấp vị trí khi thị trường đang “tìm việc làm” — trên ${siteConfig.name}.`,
    intro: `“Tìm việc làm” là nhu cầu lớn của ứng viên. Với ${siteConfig.name}, hub này giúp nhà tuyển dụng chủ động headhunt từ kho hồ sơ thay vì chỉ đăng tin chờ apply.`,
    sections: [
      {
        heading: "Hai chiều của cùng thị trường",
        body: "Ứng viên tìm việc làm; NTD tìm ứng viên. Kho hồ sơ giúp NTD tiếp cận đúng lúc ứng viên đang mở cơ hội.",
      },
      {
        heading: "Lọc theo tỉnh · ngành · hình thức",
        body: "Bắt đầu từ địa bàn, rồi ngành/vị trí, sau đó fresher/remote/full-time để shortlist gọn.",
      },
      {
        heading: `Bắt đầu trên ${siteConfig.name}`,
        body: `Đăng ký NTD → chọn bài theo tỉnh hoặc nghề → lọc CV → mở liên hệ theo gói.`,
      },
    ],
    faqs: [
      {
        q: "Có đăng tin việc làm không?",
        a: `${siteConfig.name} tập trung kho CV/headhunt. Có thể dùng song song kênh đăng tin khác.`,
      },
    ],
    tags: ["tìm việc làm", "tuyển dụng", "ứng viên"],
    priority: 0.94,
  },
  {
    slug: "viec-di-lam-ngay",
    kind: "keyword",
    eyebrow: "Đi làm ngay",
    title: "Việc đi làm ngay — tuyển ứng viên onboard sớm",
    h1: "Việc đi làm ngay",
    description: `Cách NTD ưu tiên ứng viên sẵn sàng onboard sớm (“đi làm ngay”) trên kho hồ sơ ${siteConfig.name}.`,
    intro: `Khi cần fill nhanh, hãy ưu tiên hồ sơ đang tìm việc và xác nhận thời gian onboard ngay khi liên hệ.`,
    sections: [
      {
        heading: "Ai phù hợp?",
        body: "Ứng viên đang nghỉ việc / hết notice ngắn, fresher sẵn sàng, hoặc ứng viên nêu rõ có thể bắt đầu sớm.",
      },
      {
        heading: "Cách lọc & liên hệ",
        body: "Shortlist theo địa bàn + ngành, hỏi notice period ngay câu đầu. Tránh mở liên hệ nếu JD yêu cầu onboard sau 2–3 tháng.",
      },
      {
        heading: "Rủi ro cần tránh",
        body: "Tuyển gấp dễ hạ tiêu chí quá mức. Giữ tiêu chí cứng (kỹ năng/địa bàn), chỉ nới thời gian KN nếu cần.",
      },
    ],
    faqs: [
      {
        q: "Có lọc đúng “đi làm ngay” không?",
        a: "Hỏi trực tiếp khi gọi/nhắn. Ưu tiên hồ sơ cập nhật gần và đang tìm việc.",
      },
    ],
    tags: ["đi làm ngay", "tuyển nhanh", "onboard"],
    priority: 0.88,
  },
  {
    slug: "viec-khong-can-cv",
    kind: "keyword",
    eyebrow: "Không cần CV",
    title: "Việc không cần CV — góc NTD khi tiếp cận ứng viên",
    h1: "Việc không cần CV",
    description: `Khi nào NTD nên giảm rào hồ sơ (“không cần CV”) và vẫn dùng kho CV hiệu quả trên ${siteConfig.name}.`,
    intro: `Một số vị trí operational cho phép ứng tuyển nhanh không CV. NTD vẫn có thể headhunt từ kho hồ sơ rồi phỏng vấn ngắn để xác minh.`,
    sections: [
      {
        heading: "Vị trí thường gặp",
        body: "Sales floor, CSKH, kho, bảo vệ, một số part-time — ưu tiên thái độ và sẵn sàng ca làm hơn CV dài.",
      },
      {
        heading: "Vẫn nên có checklist",
        body: "Địa bàn, ca làm, mức lương kỳ vọng, kinh nghiệm tối thiểu. Ghi chú sau mỗi cuộc gọi.",
      },
      {
        heading: "Dùng kho hồ sơ thế nào?",
        body: "Lọc ngành/địa bàn, mở liên hệ, phỏng vấn nhanh. Không bỏ qua xác minh năng lực chỉ vì “không cần CV”.",
      },
    ],
    faqs: [
      {
        q: `${siteConfig.name} có phải trang không cần CV không?`,
        a: "Kho hồ sơ vẫn dựa trên CV chuẩn hoá. Bài này giải thích intent tìm kiếm phổ biến của thị trường tuyển dụng.",
      },
    ],
    tags: ["không cần cv", "tuyển dụng"],
    priority: 0.8,
  },
  {
    slug: "tuyen-dung-nhan-su",
    kind: "keyword",
    eyebrow: "Tuyển dụng",
    title: "Tuyển dụng nhân sự — tìm người cho doanh nghiệp",
    h1: "Tuyển dụng nhân sự",
    description: `Hướng dẫn tuyển dụng nhân sự: NTD dùng kho CV để sourcing và rút ngắn thời gian fill trên ${siteConfig.name}.`,
    intro: `“Tuyển dụng nhân sự” là cụm NTD và HR thường tìm. Kết hợp đăng tin + headhunt giúp rút ngắn thời gian fill.`,
    sections: [
      {
        heading: "Quy trình gọn",
        body: "JD → lọc kho → shortlist → mở liên hệ → phỏng vấn → offer.",
      },
      {
        heading: "Khi nào headhunt mạnh hơn đăng tin?",
        body: "Tin ít CV, vị trí cạnh tranh, hoặc cần đúng địa bàn/ngành.",
      },
    ],
    faqs: [
      {
        q: "SME bắt đầu thế nào?",
        a: `Đăng ký Free trên ${siteConfig.name}, thử 1 vị trí, đo tỉ lệ phản hồi rồi nâng gói.`,
      },
    ],
    tags: ["tuyển dụng nhân sự", "hr"],
    priority: 0.86,
  },
  {
    slug: "viec-lam-toan-quoc",
    kind: "keyword",
    eyebrow: "Toàn quốc",
    title: "Việc làm toàn quốc — tuyển đa địa bàn",
    h1: "Việc làm toàn quốc",
    description: `Chiến lược NTD tuyển nhiều tỉnh / toàn quốc trên kho hồ sơ ${siteConfig.name}.`,
    intro: `Tag “toàn quốc” dùng khi chấp nhận ứng viên nhiều tỉnh hoặc remote. NTD cần ghi rõ hình thức làm việc khi liên hệ.`,
    sections: [
      {
        heading: "Khi nào dùng toàn quốc?",
        body: "Remote/hybrid, sales theo vùng, hoặc mở nhiều chi nhánh.",
      },
      {
        heading: "Cách lọc",
        body: "Có thể bỏ hẹp địa bàn, siết kỹ năng và sẵn sàng digi/relocate.",
      },
    ],
    faqs: [
      {
        q: "Nên ưu tiên local trước không?",
        a: "Nếu onsite bắt buộc — có. Nếu remote — toàn quốc giúp mở pipeline.",
      },
    ],
    tags: ["toàn quốc", "việc làm"],
    priority: 0.78,
  },
];

export const OCCUPATION_GROUPS: { slugPart: string; name: string; hints: string }[] = [
  { slugPart: "hanh-chinh-thu-ky", name: "Hành chính - Thư ký", hints: "lịch họp, văn thư, hỗ trợ quản lý" },
  { slugPart: "an-ninh-bao-ve", name: "An ninh - Bảo vệ", hints: "ca làm, địa bàn, chứng chỉ nếu có" },
  { slugPart: "thiet-ke-sang-tao", name: "Thiết kế - Sáng tạo", hints: "portfolio, tool design, brief" },
  { slugPart: "kien-truc-noi-that", name: "Kiến trúc - Nội thất", hints: "AutoCAD, SketchUp, công trình" },
  { slugPart: "khach-san-nha-hang-du-lich", name: "Khách sạn - Nhà hàng - Du lịch", hints: "ca xoay, ngoại ngữ, dịch vụ" },
  { slugPart: "ban-le-cua-hang", name: "Bán lẻ - Cửa hàng", hints: "doanh số, ca làm, soft skills" },
  { slugPart: "ngan-hang-tai-chinh", name: "Ngân hàng - Tài chính", hints: "chứng chỉ, compliance, KPIs" },
  { slugPart: "xay-dung-bat-dong-san", name: "Xây dựng - Bất động sản", hints: "công trình, sales BĐS, kỹ sư" },
  { slugPart: "giao-duc-dao-tao", name: "Giáo dục - Đào tạo", hints: "giảng dạy, nội dung, chứng chỉ sư phạm" },
  { slugPart: "y-te-duoc", name: "Y tế - Dược", hints: "bằng cấp hành nghề, ca trực" },
  { slugPart: "van-tai-lai-xe", name: "Vận tải - Lái xe", hints: "bằng lái, tuyến, xe" },
  { slugPart: "san-xuat-cong-nhan", name: "Sản xuất - Công nhân", hints: "ca kíp, KCN, an toàn lao động" },
  { slugPart: "it-phan-mem", name: "IT - Phần mềm", hints: "stack, năm KN, remote/onsite" },
  { slugPart: "marketing-truyen-thong", name: "Marketing - Truyền thông", hints: "channel, content, performance" },
  { slugPart: "ke-toan-kiem-toan", name: "Kế toán - Kiểm toán", hints: "thuế, tổng hợp, phần mềm kế toán" },
  { slugPart: "nhan-su-dao-tao", name: "Nhân sự - Đào tạo", hints: "recruitment, C&B, training" },
  { slugPart: "cham-soc-khach-hang", name: "Chăm sóc khách hàng", hints: "hotline, chat, ca làm" },
  { slugPart: "logistics-kho-van", name: "Logistics - Kho vận", hints: "xuất nhập, WMS, ca kho" },
  { slugPart: "co-khi-ky-thuat", name: "Cơ khí - Kỹ thuật", hints: "bảo trì, vận hành máy, an toàn" },
  { slugPart: "phap-ly-compliance", name: "Pháp lý - Compliance", hints: "hợp đồng, quy định ngành" },
];

export const JOB_LEVELS: { slugPart: string; name: string; seeker: string }[] = [
  { slugPart: "nhan-vien", name: "Nhân viên", seeker: "việc làm nhân viên" },
  { slugPart: "chuyen-vien", name: "Chuyên viên", seeker: "việc làm chuyên viên" },
  { slugPart: "truong-nhom", name: "Trưởng nhóm", seeker: "tuyển trưởng nhóm" },
  { slugPart: "truong-phong", name: "Trưởng phòng", seeker: "tuyển trưởng phòng" },
  { slugPart: "quan-ly", name: "Quản lý", seeker: "tuyển quản lý" },
  { slugPart: "giam-doc", name: "Giám đốc", seeker: "tuyển giám đốc" },
  { slugPart: "thuc-tap-sinh-intern", name: "Intern / thực tập sinh", seeker: "tuyển thực tập sinh" },
];

function buildOccupationPost(g: (typeof OCCUPATION_GROUPS)[number]): KeywordDraft {
  return {
    slug: `viec-lam-${g.slugPart}`,
    kind: "keyword",
    eyebrow: "Theo nghề nghiệp",
    title: `Việc làm ${g.name} — góc nhà tuyển dụng`,
    h1: `Việc làm ${g.name}`,
    description: `Việc làm nhóm ${g.name}: NTD lọc CV, shortlist và mở liên hệ trên ${siteConfig.name}.`,
    intro: `Nhóm nghề “${g.name}” giúp NTD định hướng bộ lọc kho hồ sơ theo lĩnh vực ứng viên thường tìm.`,
    sections: [
      {
        heading: `Tiêu chí khi tuyển ${g.name}`,
        body: `Ưu tiên tín hiệu: ${g.hints}. Kết hợp địa bàn và hình thức làm việc trước khi mở liên hệ.`,
      },
      {
        heading: "Cách shortlist",
        body: "Lọc ngành gần nhóm nghề → lưu 15–30 hồ sơ → mở theo độ khớp JD.",
      },
      {
        heading: "Outreach",
        body: `Nêu rõ vị trí thuộc nhóm ${g.name}, lý do chọn hồ sơ và CTA gọi lại.`,
      },
    ],
    faqs: [
      {
        q: `Tìm ứng viên ${g.name} ở đâu?`,
        a: `Đăng ký NTD trên ${siteConfig.name}, tìm theo ngành/từ khóa liên quan ${g.name}.`,
      },
    ],
    tags: [g.name, "nghề nghiệp", "việc làm"],
    priority: 0.76,
  };
}

function buildLevelPost(level: (typeof JOB_LEVELS)[number]): KeywordDraft {
  return {
    slug: `tuyen-${level.slugPart}`,
    kind: "keyword",
    eyebrow: "Theo cấp bậc",
    title: `${level.seeker} — góc nhà tuyển dụng`,
    h1: level.seeker.charAt(0).toUpperCase() + level.seeker.slice(1),
    description: `Cách NTD lọc và tiếp cận ứng viên cấp bậc ${level.name} trên kho hồ sơ ${siteConfig.name}.`,
    intro: `Bộ lọc cấp bậc (${level.name}) giúp thu hẹp đúng seniority. Sai cấp bậc là lý do phổ biến khiến outreach thất bại.`,
    sections: [
      {
        heading: `Dấu hiệu hồ sơ cấp ${level.name}`,
        body: "Nhìn title gần nhất, scope quản lý, và số năm KN. Tránh mở liên hệ nếu seniority lệch JD.",
      },
      {
        heading: "Đãi ngộ & thông điệp",
        body: `Cấp ${level.name} cần thông điệp khác nhau về quyền lợi, quyền quyết định và lộ trình.`,
      },
      {
        heading: "Đo conversion",
        body: "Theo dõi tỉ lệ phản hồi theo cấp bậc để điều chỉnh đãi ngộ hoặc tiêu chí.",
      },
    ],
    faqs: [
      {
        q: "Có lọc đúng cấp bậc trên kho không?",
        a: "Dựa vào title/KN trên CV và xác minh khi liên hệ. Kết hợp từ khóa chức danh.",
      },
    ],
    tags: [level.name, "cấp bậc", "tuyển dụng"],
    priority: 0.74,
  };
}

function buildCityAlias(fullName: string, code: string): KeywordDraft {
  const short = shortProvinceName(fullName);
  const slug = `viec-lam-${slugifyVi(short)}`;
  return {
    slug,
    kind: "keyword",
    eyebrow: "Việc làm theo tỉnh",
    title: `Việc làm ${short} — tuyển dụng local`,
    h1: `Việc làm ${short}`,
    description: `Việc làm ${short}: NTD lọc ứng viên địa bàn và mở liên hệ trên ${siteConfig.name}.`,
    intro: `Trang này giúp nhà tuyển dụng tối ưu sourcing ứng viên sẵn sàng làm việc tại ${short}.`,
    sections: [
      {
        heading: `Ưu tiên ứng viên tại ${short}`,
        body: `Lọc địa bàn ${short} trước. Hỏi commute/relocate nếu hồ sơ ghi tỉnh lân cận.`,
      },
      {
        heading: "Kết hợp ngành",
        body: "Sau địa bàn, thêm ngành/vị trí để shortlist không bị loãng.",
      },
      {
        heading: "Gợi ý liên quan",
        body: `Xem thêm “việc làm tại ${short}” và các bài vị trí × ${short} để bao phủ nhu cầu local.`,
      },
    ],
    faqs: [
      {
        q: `Khác gì trang việc làm tại ${short}?`,
        a: "Cùng intent địa bàn; slug khác để bao phủ cách người dùng tìm kiếm. Nội dung bổ trợ lẫn nhau.",
      },
    ],
    tags: [`việc làm ${short}`, short, "địa bàn", code],
    priority: 0.77,
  };
}

function buildIndustryCityPost(industryName: string, cityName: string): KeywordDraft {
  const short = cityName;
  return {
    slug: `viec-lam-${slugifyVi(industryName)}-tai-${slugifyVi(short)}`,
    kind: "keyword",
    eyebrow: "Ngành × tỉnh",
    title: `Việc làm ${industryName} tại ${short}`,
    h1: `Việc làm ${industryName} tại ${short}`,
    description: `Việc làm ${industryName} tại ${short}: NTD headhunt CV theo ngành và địa bàn trên ${siteConfig.name}.`,
    intro: `Cụm ngành × địa bàn giúp NTD lọc kho đúng ngữ cảnh tuyển dụng tại ${short}.`,
    sections: [
      {
        heading: "Bộ lọc",
        body: `Ngành ${industryName} + ${short} + KN. Shortlist 10–25 hồ sơ rồi mở liên hệ.`,
      },
      {
        heading: "Xác minh",
        body: `Hỏi sẵn sàng làm tại ${short} và mức kỳ vọng phù hợp thị trường ngành.`,
      },
      {
        heading: "Tối ưu hạn mức",
        body: "Chỉ mở hồ sơ khớp cả ngành lẫn địa bàn.",
      },
    ],
    faqs: [
      {
        q: "Có trùng bài headhunt ngành × tỉnh không?",
        a: "Bài “việc làm …” nhắm truy vấn tìm việc; bài headhunt nhắm NTD. Cùng mục tiêu sourcing.",
      },
    ],
    tags: [industryName, short, "việc làm"],
    priority: 0.58,
  };
}

export function listCompetitorPatternDrafts(): KeywordDraft[] {
  const drafts: KeywordDraft[] = [
    ...COMPETITOR_HUBS,
    ...OCCUPATION_GROUPS.map(buildOccupationPost),
    ...JOB_LEVELS.map(buildLevelPost),
  ];

  for (const prov of PROVINCES) {
    drafts.push(buildCityAlias(prov.name, prov.code));
  }

  const topIndustries = INDUSTRIES.filter((i) => i.id !== "other").slice(0, 12);
  for (const ind of topIndustries) {
    for (const city of ROLE_CITIES.slice(0, 7)) {
      drafts.push(buildIndustryCityPost(ind.name, city.name));
    }
  }

  return drafts;
}
