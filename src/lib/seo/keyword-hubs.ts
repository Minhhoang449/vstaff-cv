/**
 * Cụm từ khóa SEO ưu tiên (intent NTD + nhu cầu tìm kiếm phổ biến).
 * Copy công khai không nhắc tên đối thủ.
 */
import { siteConfig } from "@/lib/site";

export type KeywordDraft = {
  slug: string;
  title: string;
  h1: string;
  description: string;
  eyebrow: string;
  intro: string;
  sections: { heading: string; body: string }[];
  faqs: { q: string; a: string }[];
  tags: string[];
  priority: number;
  kind: "keyword";
};

/** Hub từ khóa thương mại / informational — trang “logs” SEO. */
export const KEYWORD_HUBS: KeywordDraft[] = [
  // —— CV miễn phí / cung cấp CV ——
  {
    slug: "cv-mien-phi-cho-nha-tuyen-dung",
    kind: "keyword",
    eyebrow: "CV miễn phí",
    title: "CV miễn phí cho nhà tuyển dụng — xem & lọc hồ sơ",
    h1: "CV miễn phí cho nhà tuyển dụng",
    description: `Cách NTD xem CV miễn phí, hạn mức gói Free và khi nào nên nâng hạn mức mở liên hệ trên ${siteConfig.name}.`,
    intro: `Nhiều nhà tuyển dụng tìm “CV miễn phí” để bắt đầu tuyển mà không đổ ngân sách lớn. Trên ${siteConfig.name}, bạn có thể đăng ký và dùng hạn mức trải nghiệm để lọc hồ sơ trước khi mở liên hệ.`,
    sections: [
      {
        heading: "CV miễn phí khác gì mua database?",
        body: "Miễn phí thường nghĩa là được xem thông tin công khai / dùng hạn mức ngày. Mở SĐT–email đầy đủ thường theo gói. Hiểu rõ giới hạn giúp tránh kỳ vọng sai và lập kế hoạch tuyển thực tế.",
      },
      {
        heading: "Cách dùng hạn mức Free hiệu quả",
        body: "Lọc chặt theo ngành–địa bàn–kinh nghiệm trước, lưu danh sách ngắn, rồi mới mở liên hệ những hồ sơ khớp nhất trong ngày.",
      },
      {
        heading: "Khi nào nên nâng gói?",
        body: "Khi bạn cần mở nhiều CV/tuần, chạy song song nhiều vị trí, hoặc muốn ổn định pipeline không phụ thuộc hạn mức ngày.",
      },
    ],
    faqs: [
      {
        q: "Có tải được toàn bộ kho CV miễn phí không?",
        a: "Không. Nền tảng cung cấp tìm/lọc và mở liên hệ theo hạn mức để bảo vệ dữ liệu ứng viên và chất lượng tiếp cận.",
      },
      {
        q: "Ứng viên có trả phí không?",
        a: "Kho hồ sơ phục vụ NTD. Ứng viên được cập nhật qua quy trình vận hành của nền tảng.",
      },
    ],
    tags: ["cv miễn phí", "ntd", "free"],
    priority: 0.9,
  },
  {
    slug: "cung-cap-cv-ung-vien",
    kind: "keyword",
    eyebrow: "Cung cấp CV",
    title: "Cung cấp CV ứng viên cho doanh nghiệp — kho hồ sơ headhunt",
    h1: "Cung cấp CV ứng viên cho doanh nghiệp",
    description: `Giải pháp cung cấp CV / kho hồ sơ ứng viên cho NTD: lọc ngành, địa bàn, mở liên hệ có kiểm soát trên ${siteConfig.name}.`,
    intro: `“Cung cấp CV” là nhu cầu phổ biến của HR và chủ doanh nghiệp khi cần nguồn ứng viên sẵn sàng tiếp cận. Thay vì mua file Excel rời, kho hồ sơ số giúp lọc, lưu và mở liên hệ có kiểm soát.`,
    sections: [
      {
        heading: "Cung cấp CV theo dạng kho số",
        body: "NTD tìm theo tiêu chí, xem tóm tắt hồ sơ, rồi quyết định mở liên hệ. Tránh nhận hàng nghìn dòng không lọc được theo ngành/địa bàn.",
      },
      {
        heading: "Kiểm soát chi phí tiếp cận",
        body: "Bạn chỉ “trả” hạn mức khi mở liên hệ hồ sơ đã khớp — phù hợp SME và team HR cần đo ROI từng chiến dịch.",
      },
      {
        heading: "Phù hợp vị trí nào?",
        body: "Sales, kế toán, marketing, IT, vận hành, CSKH và nhiều ngành phổ biến — đặc biệt khi cần tuyển nhanh theo địa bàn.",
      },
    ],
    faqs: [
      {
        q: "Có giao CV theo lô không?",
        a: `Trên ${siteConfig.name} bạn tự lọc và mở theo nhu cầu trong tài khoản NTD, thay vì nhận file tĩnh một lần.`,
      },
    ],
    tags: ["cung cấp cv", "kho hồ sơ", "database cv"],
    priority: 0.9,
  },
  {
    slug: "kho-cv-ung-vien",
    kind: "keyword",
    eyebrow: "Kho CV",
    title: "Kho CV ứng viên — tìm hồ sơ headhunt online",
    h1: "Kho CV ứng viên online",
    description: `Kho CV / database ứng viên giúp NTD chủ động tìm hồ sơ theo ngành và tỉnh thành trên ${siteConfig.name}.`,
    intro:
      "Kho CV là cách gọi phổ biến của database ứng viên. NTD dùng bộ lọc để thu hẹp, lưu danh sách và liên hệ khi sẵn sàng.",
    sections: [
      {
        heading: "Ưu điểm so với chỉ đăng tin",
        body: "Bạn chủ động pipeline thay vì chờ apply. Hữu ích khi tin đăng ít CV hoặc cần ứng viên đang mở cơ hội.",
      },
      {
        heading: "Bộ lọc nên dùng trước",
        body: "Ngành → địa bàn → kinh nghiệm → kỹ năng. Lưu shortlist trước khi mở liên hệ hàng loạt.",
      },
    ],
    faqs: [
      {
        q: "Kho CV có cập nhật không?",
        a: "Hồ sơ được quản trị và cập nhật theo quy trình nền tảng; NTD nên ưu tiên hồ sơ mới/active khi liên hệ.",
      },
    ],
    tags: ["kho cv", "database", "headhunt"],
    priority: 0.85,
  },
  {
    slug: "database-cv-ung-vien",
    kind: "keyword",
    eyebrow: "Database CV",
    title: "Database CV ứng viên — nguồn hồ sơ cho nhà tuyển dụng",
    h1: "Database CV ứng viên",
    description: `Database CV giúp doanh nghiệp tìm ứng viên nhanh: lọc, lưu, mở liên hệ theo gói trên ${siteConfig.name}.`,
    intro:
      "Database CV (kho dữ liệu hồ sơ) là công cụ sourcing cho NTD. Khác Excel tĩnh, database online cho phép tìm kiếm lặp lại theo nhiều chiến dịch.",
    sections: [
      {
        heading: "Khi nào cần database CV?",
        body: "Tuyển thường xuyên, mở chi nhánh nhiều tỉnh, hoặc vị trí cạnh tranh cần chủ động tiếp cận.",
      },
      {
        heading: "Lưu ý tuân thủ & chất lượng",
        body: "Chỉ dùng liên hệ cho mục đích tuyển dụng hợp lệ. Ưu tiên hồ sơ khớp JD để tăng tỉ lệ phản hồi.",
      },
    ],
    faqs: [
      {
        q: "Database CV có phải mua một lần?",
        a: "Thường là truy cập theo gói/hạn mức mở liên hệ — linh hoạt hơn mua file một lần rồi lỗi thời.",
      },
    ],
    tags: ["database cv", "cung cấp cv"],
    priority: 0.85,
  },
  {
    slug: "tim-ho-so-ung-vien",
    kind: "keyword",
    eyebrow: "Tìm hồ sơ",
    title: "Tìm hồ sơ ứng viên online — hướng dẫn cho NTD",
    h1: "Tìm hồ sơ ứng viên online",
    description: `Cách tìm hồ sơ ứng viên theo ngành, địa bàn và kinh nghiệm trên kho headhunt ${siteConfig.name}.`,
    intro:
      "Tìm hồ sơ ứng viên hiệu quả bắt đầu từ tiêu chí cứng rõ ràng. Sau đó mới mở rộng shortlist và liên hệ.",
    sections: [
      {
        heading: "Quy trình 4 bước",
        body: "Chốt JD rút gọn → lọc kho → lưu 10–30 hồ sơ → mở liên hệ theo độ khớp.",
      },
      {
        heading: "Sai lầm thường gặp",
        body: "Mở liên hệ quá sớm, tiêu chí quá rộng, hoặc nhắn tin chung chung khiến tỉ lệ phản hồi thấp.",
      },
    ],
    faqs: [
      {
        q: "Có tìm theo kỹ năng không?",
        a: "Có thể kết hợp ngành và từ khóa kỹ năng khi lọc để thu hẹp đúng nhóm ứng viên.",
      },
    ],
    tags: ["tìm hồ sơ", "ứng viên", "cv"],
    priority: 0.85,
  },

  // —— Ứng viên miễn phí / tìm ứng viên ——
  {
    slug: "tim-ung-vien-mien-phi",
    kind: "keyword",
    eyebrow: "Ứng viên miễn phí",
    title: "Tìm ứng viên miễn phí — bắt đầu tuyển với chi phí thấp",
    h1: "Tìm ứng viên miễn phí",
    description: `Hướng dẫn NTD tìm ứng viên miễn phí: dùng gói Free, lọc CV và tối ưu hạn mức trên ${siteConfig.name}.`,
    intro: `“Tìm ứng viên miễn phí” là truy vấn phổ biến của SME và startup. Bạn có thể bắt đầu với hạn mức trải nghiệm, đo tỉ lệ phản hồi, rồi quyết định nâng gói.`,
    sections: [
      {
        heading: "Miễn phí đến đâu?",
        body: "Thường gồm đăng ký, tìm/lọc hồ sơ công khai và một hạn mức mở liên hệ theo ngày. Chi tiết theo gói hiện hành trên bảng giá.",
      },
      {
        heading: "Mẹo tăng hiệu quả khi hạn mức thấp",
        body: "Siết bộ lọc, ưu tiên ứng viên đang tìm việc / địa bàn đúng, soạn kịch bản liên hệ ngắn trước khi mở CV.",
      },
    ],
    faqs: [
      {
        q: "Có trang tìm ứng viên miễn phí 100% không giới hạn?",
        a: "Hầu hết nền tảng uy tín đều giới hạn mở liên hệ để bảo vệ ứng viên. Hãy dùng Free để validate quy trình rồi scale.",
      },
    ],
    tags: ["ứng viên miễn phí", "tìm ứng viên", "free"],
    priority: 0.9,
  },
  {
    slug: "ung-vien-mien-phi",
    kind: "keyword",
    eyebrow: "Ứng viên miễn phí",
    title: "Ứng viên miễn phí cho doanh nghiệp — cách tiếp cận đúng",
    h1: "Ứng viên miễn phí cho doanh nghiệp",
    description: `Cách doanh nghiệp tiếp cận ứng viên miễn phí hợp lý: lọc kho CV, hạn mức Free, nâng cấp khi cần trên ${siteConfig.name}.`,
    intro:
      "Ứng viên miễn phí không có nghĩa là “lấy danh sách không kiểm soát”. Cách bền vững là dùng hạn mức hợp lệ để liên hệ đúng người đúng việc.",
    sections: [
      {
        heading: "Đối tượng phù hợp",
        body: "SME mới bắt đầu headhunt, HR làm nhiều vị trí junior/mid, hoặc team cần thử kênh sourcing mới.",
      },
      {
        heading: "Chỉ số nên theo dõi",
        body: "Số hồ sơ mở / ngày, tỉ lệ nghe máy–reply, số phỏng vấn / tuần. Điều chỉnh bộ lọc theo số liệu.",
      },
    ],
    faqs: [
      {
        q: "Ứng viên miễn phí có chất lượng không?",
        a: "Chất lượng phụ thuộc tiêu chí lọc và cách liên hệ nhiều hơn là “miễn phí hay trả phí”.",
      },
    ],
    tags: ["ứng viên miễn phí", "tuyển dụng"],
    priority: 0.88,
  },
  {
    slug: "tim-ung-vien",
    kind: "keyword",
    eyebrow: "Tìm ứng viên",
    title: "Tìm ứng viên online — kênh headhunt cho nhà tuyển dụng",
    h1: "Tìm ứng viên online",
    description: `Tìm ứng viên online bằng kho hồ sơ: lọc ngành, tỉnh thành, lưu danh sách và mở liên hệ trên ${siteConfig.name}.`,
    intro:
      "Tìm ứng viên online giúp NTD rút ngắn thời gian sourcing. Kết hợp bộ lọc và shortlist trước khi gọi/email.",
    sections: [
      {
        heading: "Kênh tìm ứng viên phổ biến",
        body: "Đăng tin tuyển dụng, kho CV/headhunt, referral, social sourcing. Kho CV mạnh khi cần chủ động và lặp lại theo địa bàn.",
      },
      {
        heading: "Quy trình trên nền tảng kho hồ sơ",
        body: "Đăng ký NTD → tìm/lọc → lưu → mở liên hệ → theo dõi phản hồi trong danh sách đã mở/đã lưu.",
      },
    ],
    faqs: [
      {
        q: "Tìm ứng viên online có thay thế đăng tin không?",
        a: "Có thể bổ sung hoặc thay thế một phần — nhiều team dùng song song để tăng nguồn.",
      },
    ],
    tags: ["tìm ứng viên", "tuyển dụng", "headhunt"],
    priority: 0.9,
  },

  // —— Ứng viên tìm việc ——
  {
    slug: "ung-vien-tim-viec",
    kind: "keyword",
    eyebrow: "Ứng viên tìm việc",
    title: "Ứng viên tìm việc — cách NTD tiếp cận đúng thời điểm",
    h1: "Ứng viên đang tìm việc",
    description: `Cách nhận diện và liên hệ ứng viên tìm việc / mở cơ hội để tăng tỉ lệ phản hồi trên ${siteConfig.name}.`,
    intro:
      "Ứng viên đang tìm việc thường phản hồi nhanh hơn ứng viên passive. NTD nên ưu tiên nhóm này khi hạn mức mở liên hệ có giới hạn.",
    sections: [
      {
        heading: "Dấu hiệu ứng viên đang mở cơ hội",
        body: "Hồ sơ cập nhật gần đây, vị trí mong muốn rõ, sẵn sàng địa bàn/hình thức làm việc khớp JD.",
      },
      {
        heading: "Cách liên hệ tăng tỉ lệ trả lời",
        body: "Nêu lý do chọn hồ sơ, mô tả ngắn vị trí–mức đãi ngộ khung, và CTA rõ (gọi lại / xem JD).",
      },
    ],
    faqs: [
      {
        q: "Có lọc đúng “đang tìm việc” không?",
        a: "Tùy dữ liệu hồ sơ. Kết hợp độ mới của CV và mức khớp tiêu chí vẫn là cách thực dụng nhất.",
      },
    ],
    tags: ["ứng viên tìm việc", "sourcing"],
    priority: 0.88,
  },
  {
    slug: "ung-vien-dang-tim-viec",
    kind: "keyword",
    eyebrow: "Ứng viên tìm việc",
    title: "Nguồn ứng viên đang tìm việc cho chiến dịch tuyển nhanh",
    h1: "Nguồn ứng viên đang tìm việc",
    description: `Gợi ý sourcing ứng viên đang tìm việc để đẩy nhanh vòng phỏng vấn — phù hợp NTD trên ${siteConfig.name}.`,
    intro:
      "Khi deadline tuyển gấp, ưu tiên ứng viên đang tìm việc giúp rút ngắn vòng phản hồi và lịch phỏng vấn.",
    sections: [
      {
        heading: "Ưu tiên shortlist thế nào?",
        body: "Sắp xếp theo độ khớp JD + khả năng onboard sớm. Tránh mở quá nhiều hồ sơ lệch địa bàn.",
      },
      {
        heading: "Song song với đăng tin",
        body: "Đăng tin thu inbound; headhunt chủ động outbound. Hai kênh cùng đo conversion để phân bổ ngân sách.",
      },
    ],
    faqs: [
      {
        q: "Ứng viên tìm việc có nhảy việc nhiều không?",
        a: "Không mặc định. Đánh giá lịch sử công việc và lý do chuyển việc trong buổi trao đổi đầu.",
      },
    ],
    tags: ["ứng viên đang tìm việc", "tuyển nhanh"],
    priority: 0.82,
  },

  // —— Tuyển dụng ——
  {
    slug: "tuyen-dung-hieu-qua",
    kind: "keyword",
    eyebrow: "Tuyển dụng",
    title: "Tuyển dụng hiệu quả — kết hợp đăng tin và headhunt CV",
    h1: "Tuyển dụng hiệu quả cho doanh nghiệp",
    description: `Bí quyết tuyển dụng hiệu quả: tiêu chí rõ, đa kênh sourcing, dùng kho CV để chủ động trên ${siteConfig.name}.`,
    intro:
      "Tuyển dụng hiệu quả = đúng người + đúng thời điểm + chi phí kiểm soát. Headhunt từ kho CV bổ sung điểm yếu của chỉ đăng tin.",
    sections: [
      {
        heading: "Thiết kế quy trình gọn",
        body: "JD → sourcing → sàng CV → phỏng vấn → offer. Đo thời gian từng bước để tìm nút thắt.",
      },
      {
        heading: "Giảm chi phí tuyển sai",
        body: "Siết tiêu chí cứng trước khi mở liên hệ; dùng scorecard phỏng vấn thống nhất giữa hiring manager và HR.",
      },
    ],
    faqs: [
      {
        q: "SME có cần quy trình phức tạp không?",
        a: "Không. 5–7 bước rõ ràng và checklist ngắn thường đủ cho hầu hết vị trí mid.",
      },
    ],
    tags: ["tuyển dụng", "hr"],
    priority: 0.88,
  },
  {
    slug: "quy-trinh-tuyen-dung",
    kind: "keyword",
    eyebrow: "Tuyển dụng",
    title: "Quy trình tuyển dụng chuẩn cho HR và chủ doanh nghiệp",
    h1: "Quy trình tuyển dụng chuẩn",
    description:
      "Quy trình tuyển dụng từ xác định nhu cầu, tìm CV, phỏng vấn đến onboard — áp dụng được với headhunt.",
    intro:
      "Quy trình tuyển dụng rõ giúp team đồng bộ và giảm thời gian “treo” vị trí. Có thể gắn headhunt vào bước sourcing.",
    sections: [
      {
        heading: "Các bước cốt lõi",
        body: "Nhu cầu nhân sự → JD → ngân sách kênh → sourcing (tin + kho CV) → sàng lọc → phỏng vấn → offer → onboard.",
      },
      {
        heading: "Chỗ gắn kho hồ sơ",
        body: "Ngay sau khi có JD rút gọn: lọc ứng viên, lưu list, mở liên hệ theo hạn mức tuần.",
      },
    ],
    faqs: [
      {
        q: "Quy trình nên dài bao lâu?",
        a: "Junior/mid thường 1–3 tuần; senior có thể lâu hơn. Headhunt giúp rút phần sourcing.",
      },
    ],
    tags: ["quy trình tuyển dụng", "hr"],
    priority: 0.8,
  },
  {
    slug: "dang-tin-tuyen-dung-mien-phi",
    kind: "keyword",
    eyebrow: "Tuyển dụng",
    title: "Đăng tin tuyển dụng miễn phí vs tìm CV chủ động",
    h1: "Đăng tin tuyển dụng miễn phí và khi nào nên headhunt",
    description: `So sánh đăng tin tuyển dụng miễn phí với tìm CV chủ động trên kho hồ sơ ${siteConfig.name}.`,
    intro:
      "Đăng tin miễn phí tốt để thử JD và nhận inbound. Khi tin ít CV hoặc cần đúng địa bàn/ngành, hãy bổ sung headhunt.",
    sections: [
      {
        heading: "Ưu điểm đăng tin miễn phí",
        body: "Chi phí thấp, dễ triển khai, phù hợp vị trí hấp dẫn thị trường.",
      },
      {
        heading: "Khi đăng tin không đủ",
        body: "Ít ứng tuyển, CV lệch, hoặc cần tuyển nhiều tỉnh — lúc đó kho CV giúp chủ động.",
      },
    ],
    faqs: [
      {
        q: `${siteConfig.name} có phải trang đăng tin không?`,
        a: "Tập trung kho hồ sơ/headhunt cho NTD. Có thể dùng song song với kênh đăng tin khác.",
      },
    ],
    tags: ["đăng tin tuyển dụng", "miễn phí", "tuyển dụng"],
    priority: 0.85,
  },
  {
    slug: "tuyen-nhan-su",
    kind: "keyword",
    eyebrow: "Tuyển dụng",
    title: "Tuyển nhân sự — hướng dẫn tìm người cho doanh nghiệp",
    h1: "Tuyển nhân sự cho doanh nghiệp",
    description: `Hướng dẫn tuyển nhân sự: xác định nhu cầu, tìm ứng viên, dùng kho CV để rút ngắn sourcing trên ${siteConfig.name}.`,
    intro:
      "Tuyển nhân sự thành công khi nhu cầu rõ và kênh sourcing phù hợp quy mô. Kho CV hỗ trợ đặc biệt khi cần tốc độ.",
    sections: [
      {
        heading: "Xác định nhu cầu trước khi tìm người",
        body: "Phân biệt vị trí mới vs thay thế, full-time vs part-time, ngân sách lương và địa bàn.",
      },
      {
        heading: "Chọn kênh theo cấp bậc",
        body: "Junior: tin + kho CV rộng. Mid: kho CV + referral. Senior: headhunt chuyên sâu + network.",
      },
    ],
    faqs: [
      {
        q: "Nên outsource agency không?",
        a: "Vị trí khó/hiếm có thể dùng agency; vị trí phổ biến SME thường tự headhunt bằng kho CV tiết kiệm hơn.",
      },
    ],
    tags: ["tuyển nhân sự", "tuyển dụng"],
    priority: 0.8,
  },

  // —— Việc làm (góc NTD + informational bridge) ——
  {
    slug: "viec-lam-va-tuyen-dung",
    kind: "keyword",
    eyebrow: "Việc làm",
    title: "Việc làm & tuyển dụng — cầu nối NTD và ứng viên",
    h1: "Việc làm và tuyển dụng trên nền tảng số",
    description: `Hiểu thị trường việc làm và cách NTD dùng kho CV để lấp vị trí nhanh trên ${siteConfig.name}.`,
    intro:
      "Thị trường việc làm thay đổi nhanh. NTD cần kênh vừa thu hút ứng viên chủ động, vừa tiếp cận ứng viên đang mở cơ hội.",
    sections: [
      {
        heading: "Xu hướng tìm kiếm việc làm",
        body: "Người dùng thường tìm nền tảng tuyển dụng, mẫu CV, rồi mới tới vị trí/ngành cụ thể. NTD nên có mặt ở cả nội dung giáo dục và công cụ sourcing.",
      },
      {
        heading: "Vai trò kho hồ sơ",
        body: "Khi ứng viên đã có CV trên hệ sinh thái, NTD có thể tìm lại theo tiêu chí thay vì chờ họ apply đúng tin.",
      },
    ],
    faqs: [
      {
        q: "Ứng viên có đăng việc trên đây không?",
        a: `${siteConfig.name} hướng tới NTD dùng kho hồ sơ. Ứng viên được quản trị theo quy trình nền tảng.`,
      },
    ],
    tags: ["việc làm", "tuyển dụng"],
    priority: 0.85,
  },
  {
    slug: "tim-viec-lam",
    kind: "keyword",
    eyebrow: "Việc làm",
    title: "Tìm việc làm vs tìm ứng viên — hai chiều của một thị trường",
    h1: "Tìm việc làm và tìm ứng viên",
    description:
      "Giải thích hai chiều tìm việc / tìm ứng viên và cách doanh nghiệp tận dụng kho CV để tuyển đúng người.",
    intro:
      "Ứng viên tìm việc làm; NTD tìm ứng viên. Nền tảng headhunt tối ưu phía NTD bằng kho hồ sơ có thể lọc và liên hệ.",
    sections: [
      {
        heading: "Vì sao NTD vẫn cần chủ động?",
        body: "Không phải ứng viên phù hợp nào cũng đang lướt tin đăng của bạn đúng lúc. Headhunt rút ngắn khoảng trống đó.",
      },
      {
        heading: "Thông điệp liên hệ nên thế nào?",
        body: "Nói rõ cơ hội việc làm, địa điểm, và lý do hồ sơ được chọn — gần với ngôn ngữ “tin việc làm” mà ứng viên quen.",
      },
    ],
    faqs: [
      {
        q: "Có đăng tin việc làm trên blog không?",
        a: "Blog mang tính kiến thức/SEO. Để tuyển, NTD dùng tài khoản và kho hồ sơ hoặc kênh đăng tin riêng.",
      },
    ],
    tags: ["tìm việc làm", "việc làm", "ứng viên"],
    priority: 0.8,
  },
  {
    slug: "viec-lam-ha-noi-cho-ntd",
    kind: "keyword",
    eyebrow: "Việc làm",
    title: "Việc làm Hà Nội — góc nhà tuyển dụng tìm ứng viên",
    h1: "Tuyển dụng việc làm tại Hà Nội",
    description: `Góc NTD khi tuyển việc làm Hà Nội: lọc ứng viên địa bàn, ngành và mở liên hệ trên ${siteConfig.name}.`,
    intro:
      "Hà Nội là thị trường việc làm lớn. NTD nên ưu tiên ứng viên sẵn sàng làm việc tại địa bàn để giảm no-show phỏng vấn.",
    sections: [
      {
        heading: "Lọc địa bàn trước",
        body: "Chọn Hà Nội (và vành đai nếu chấp nhận commute) trước khi xem chi tiết CV.",
      },
      {
        heading: "Ngành cạnh tranh tại Hà Nội",
        body: "IT, sales, marketing, kế toán… nên soạn đãi ngộ và lý do chuyển việc rõ trong tin nhắn đầu.",
      },
    ],
    faqs: [
      {
        q: "Có bài theo ngành tại Hà Nội không?",
        a: "Có — xem các bài ngành × địa bàn trong mục Blog (ví dụ ứng viên IT / sales tại Hà Nội).",
      },
    ],
    tags: ["việc làm hà nội", "tuyển dụng", "hà nội"],
    priority: 0.78,
  },
  {
    slug: "viec-lam-tp-hcm-cho-ntd",
    kind: "keyword",
    eyebrow: "Việc làm",
    title: "Việc làm TP.HCM — góc nhà tuyển dụng tìm ứng viên",
    h1: "Tuyển dụng việc làm tại TP.HCM",
    description: `Góc NTD tuyển tại TP.HCM: lọc hồ sơ, tối ưu hạn mức CV trên ${siteConfig.name}.`,
    intro:
      "TP.HCM có nguồn ứng viên lớn nhưng cạnh tranh cao. Headhunt giúp chủ động với vị trí khó fill bằng tin đăng.",
    sections: [
      {
        heading: "Lưu ý địa bàn & di chuyển",
        body: "Ghi rõ quận/huyện hoặc hybrid để ứng viên tự đánh giá trước khi nhận lời mời.",
      },
      {
        heading: "Tối ưu liên hệ",
        body: "Gọi trong giờ hành chính, nêu nhanh quyền lợi nổi bật (lương khung, tăng ca, remote partial…).",
      },
    ],
    faqs: [
      {
        q: "Nên mở bao nhiêu CV/tuần tại HCM?",
        a: "Tuỳ vị trí; bắt đầu 20–40 hồ sơ đã lọc/tuần rồi điều chỉnh theo tỉ lệ phỏng vấn.",
      },
    ],
    tags: ["việc làm tphcm", "tuyển dụng", "hồ chí minh"],
    priority: 0.78,
  },

  // —— Mẫu / đọc CV (bridge traffic cao) ——
  {
    slug: "mau-cv-xin-viec-cho-ntd",
    kind: "keyword",
    eyebrow: "CV xin việc",
    title: "Mẫu CV xin việc — góc nhà tuyển dụng đánh giá hồ sơ",
    h1: "NTD nhìn mẫu CV xin việc thế nào?",
    description:
      "Từ khóa mẫu CV xin việc rất được tìm: góc NTD để nhận diện CV tốt và lọc nhanh khi headhunt.",
    intro:
      "Ứng viên tìm “mẫu CV xin việc” rất nhiều. NTD có thể dùng cùng khung đó để chấm điểm hồ sơ khi duyệt kho CV.",
    sections: [
      {
        heading: "Cấu trúc CV NTD kỳ vọng",
        body: "Thông tin liên hệ, mục tiêu/vị trí, kinh nghiệm theo thời gian, kỹ năng, học vấn. Thiếu mục quan trọng → rủi ro khi mở liên hệ.",
      },
      {
        heading: "Red flag thường gặp",
        body: "Khoảng trống không giải thích, job-hopping không rõ lý do, kỹ năng liệt kê chung chung không chứng minh.",
      },
    ],
    faqs: [
      {
        q: "CV đẹp mắt có quan trọng?",
        a: "Rõ ràng và đúng nội dung quan trọng hơn template cầu kỳ — nhất là khi sàng số lượng lớn.",
      },
    ],
    tags: ["mẫu cv", "cv xin việc", "ntd"],
    priority: 0.82,
  },
  {
    slug: "tao-cv-online-mien-phi-goc-ntd",
    kind: "keyword",
    eyebrow: "CV miễn phí",
    title: "Tạo CV online miễn phí — ý nghĩa với nhà tuyển dụng",
    h1: "Tạo CV online miễn phí và chất lượng hồ sơ",
    description:
      "Ứng viên tạo CV online miễn phí ngày càng nhiều; NTD nên biết cách đọc và chọn hồ sơ chuẩn từ kho CV.",
    intro:
      "Công cụ tạo CV online miễn phí làm tăng số lượng hồ sơ trên thị trường. NTD cần khung đánh giá để tách tín hiệu khỏi nhiễu.",
    sections: [
      {
        heading: "Hồ sơ tạo online thường có gì?",
        body: "Layout chuẩn, đủ mục, nhưng nội dung có thể giống nhau. Hãy đào sâu thành tích đo được và kinh nghiệm thật.",
      },
      {
        heading: "Cách NTD tận dụng",
        body: "Dùng bộ lọc ngành/địa bàn trên kho hồ sơ, rồi phỏng vấn hành vi để xác minh — đừng chỉ dựa vào template đẹp.",
      },
    ],
    faqs: [
      {
        q: `${siteConfig.name} có phải tool tạo CV không?`,
        a: "Không — đây là nền tảng kho hồ sơ cho NTD. Blog giải thích từ khóa này vì liên quan hành trình tuyển dụng.",
      },
    ],
    tags: ["tạo cv online", "cv miễn phí"],
    priority: 0.75,
  },
  {
    slug: "xem-cv-ung-vien",
    kind: "keyword",
    eyebrow: "Xem CV",
    title: "Xem CV ứng viên online — quy trình cho nhà tuyển dụng",
    h1: "Xem CV ứng viên online",
    description: `Hướng dẫn xem CV ứng viên: từ tìm kiếm, shortlist đến mở liên hệ trên ${siteConfig.name}.`,
    intro:
      "Xem CV online giúp NTD so sánh nhiều hồ sơ nhanh. Hãy có rubric ngắn trước khi quyết định mở liên hệ.",
    sections: [
      {
        heading: "Rubric xem CV 60 giây",
        body: "Khớp vị trí? Đủ năm kinh nghiệm? Đúng địa bàn? Có kỹ năng bắt buộc? Nếu 3/4 “có” → vào shortlist.",
      },
      {
        heading: "Sau khi xem CV",
        body: "Lưu hồ sơ, gắn vào danh sách chiến dịch, sắp xếp thứ tự gọi theo độ ưu tiên.",
      },
    ],
    faqs: [
      {
        q: "Xem CV có mất hạn mức không?",
        a: "Tuỳ gói: xem tóm tắt thường miễn phí trong tài khoản; mở SĐT/email mới tính hạn mức.",
      },
    ],
    tags: ["xem cv", "ứng viên", "ntd"],
    priority: 0.85,
  },
  {
    slug: "mo-lien-he-ung-vien",
    kind: "keyword",
    eyebrow: "Mở liên hệ",
    title: "Mở liên hệ ứng viên — dùng hạn mức CV đúng cách",
    h1: "Mở liên hệ ứng viên từ kho CV",
    description: `Cách mở liên hệ (SĐT/email) ứng viên hiệu quả, tiết kiệm hạn mức gói trên ${siteConfig.name}.`,
    intro:
      "Mở liên hệ là bước tốn hạn mức. Chỉ mở khi hồ sơ đã qua lọc cứng và bạn sẵn sàng gọi/nhắn trong ngày.",
    sections: [
      {
        heading: "Trước khi mở",
        body: "Đọc kỹ title, địa bàn, kinh nghiệm. Chuẩn bị 2–3 câu mở đầu cá nhân hoá.",
      },
      {
        heading: "Sau khi mở",
        body: "Gọi hoặc nhắn trong 24h. Ghi chú kết quả để tái sử dụng danh sách đã mở.",
      },
    ],
    faqs: [
      {
        q: "Hết hạn mức thì sao?",
        a: "Chờ reset theo ngày (gói Free) hoặc nâng gói trên bảng giá để tiếp tục chiến dịch.",
      },
    ],
    tags: ["mở liên hệ", "cv", "hạn mức"],
    priority: 0.8,
  },
  {
    slug: "chi-phi-tuyen-dung",
    kind: "keyword",
    eyebrow: "Tuyển dụng",
    title: "Chi phí tuyển dụng — tối ưu bằng kho CV và hạn mức mở liên hệ",
    h1: "Tối ưu chi phí tuyển dụng",
    description: `Cách tính và giảm chi phí tuyển dụng khi dùng kho hồ sơ headhunt trên ${siteConfig.name}.`,
    intro:
      "Chi phí tuyển dụng gồm thời gian HR, kênh đăng tin, agency và công cụ. Kho CV giúp kiểm soát phần sourcing theo hạn mức.",
    sections: [
      {
        heading: "Các khoản chi phổ biến",
        body: "Job board, ads, agency fee, công cụ ATS/CRM, và chi phí cơ hội khi vị trí trống lâu.",
      },
      {
        heading: "Đo ROI headhunt",
        body: "Theo dõi chi phí gói / số offer nhận việc. So với agency % lương năm để quyết định kênh.",
      },
    ],
    faqs: [
      {
        q: "SME nên bắt đầu ngân sách thế nào?",
        a: "Bắt đầu Free để đo conversion, rồi chọn gói đủ hạn mức cho 1–2 vị trí ưu tiên.",
      },
    ],
    tags: ["chi phí tuyển dụng", "roi"],
    priority: 0.78,
  },

  // —— Bổ sung cụm high-intent ——
  {
    slug: "dich-vu-cung-cap-ung-vien",
    kind: "keyword",
    eyebrow: "Cung cấp ứng viên",
    title: "Dịch vụ cung cấp ứng viên cho doanh nghiệp",
    h1: "Dịch vụ cung cấp ứng viên",
    description: `Dịch vụ cung cấp ứng viên / CV cho doanh nghiệp: lọc kho hồ sơ, mở liên hệ theo nhu cầu trên ${siteConfig.name}.`,
    intro: `Doanh nghiệp tìm “cung cấp ứng viên” khi cần nguồn nhân sự nhanh mà không muốn phụ thuộc hoàn toàn agency. Kho hồ sơ số giúp tự sourcing có kiểm soát.`,
    sections: [
      {
        heading: "Cung cấp ứng viên khác agency thế nào?",
        body: "Bạn tự lọc và quyết định mở liên hệ theo hạn mức, thay vì trả % lương cho từng vị trí. Phù hợp vị trí phổ biến và tuyển lặp lại.",
      },
      {
        heading: "Quy trình làm việc",
        body: "Chốt JD → lọc kho → shortlist → mở liên hệ → phỏng vấn. Đo conversion từng bước để tối ưu.",
      },
    ],
    faqs: [
      {
        q: "Có cam kết số lượng ứng viên không?",
        a: "Phụ thuộc kho và tiêu chí. Nên bắt đầu với bộ lọc rộng vừa phải rồi siết dần theo phản hồi thực tế.",
      },
    ],
    tags: ["cung cấp ứng viên", "cung cấp cv", "dịch vụ"],
    priority: 0.88,
  },
  {
    slug: "mua-cv-ung-vien",
    kind: "keyword",
    eyebrow: "Mua CV",
    title: "Mua CV ứng viên — nên chọn kho số thay vì file tĩnh",
    h1: "Mua CV ứng viên đúng cách",
    description: `Thay vì mua file CV tĩnh, dùng kho hồ sơ online để lọc và mở liên hệ có kiểm soát trên ${siteConfig.name}.`,
    intro:
      "Nhiều NTD tìm “mua CV” dưới dạng danh sách. File Excel dễ lỗi thời và khó lọc. Kho số cập nhật và mở liên hệ theo nhu cầu thường hiệu quả hơn.",
    sections: [
      {
        heading: "Rủi ro mua CV file",
        body: "Trùng số, sai ngành, không còn tìm việc, và rủi ro tuân thủ nếu nguồn không rõ.",
      },
      {
        heading: "Mô hình kho hồ sơ",
        body: "Trả theo gói/hạn mức mở liên hệ; chỉ tiếp cận hồ sơ đã khớp tiêu chí.",
      },
    ],
    faqs: [
      {
        q: "Có bán CV theo lô không?",
        a: `${siteConfig.name} tập trung truy cập kho và mở liên hệ trong tài khoản NTD, không bán file CV tĩnh.`,
      },
    ],
    tags: ["mua cv", "cung cấp cv", "database"],
    priority: 0.8,
  },
  {
    slug: "tim-cv-ung-vien",
    kind: "keyword",
    eyebrow: "Tìm CV",
    title: "Tìm CV ứng viên — công cụ cho nhà tuyển dụng",
    h1: "Tìm CV ứng viên",
    description: `Cách tìm CV ứng viên theo ngành, tỉnh thành và kinh nghiệm trên ${siteConfig.name}.`,
    intro:
      "Tìm CV là bước sourcing cốt lõi. Bộ lọc tốt giúp giảm thời gian và hạn mức mở liên hệ lãng phí.",
    sections: [
      {
        heading: "Từ khóa tìm CV hiệu quả",
        body: "Kết hợp chức danh + ngành + địa bàn. Tránh chỉ gõ một từ quá rộng như “nhân viên”.",
      },
      {
        heading: "Sau khi tìm thấy CV",
        body: "Lưu shortlist, xếp ưu tiên, rồi mở liên hệ theo lịch gọi trong ngày.",
      },
    ],
    faqs: [
      {
        q: "Tìm CV có mất phí không?",
        a: "Tìm/lọc thường nằm trong tài khoản; mở SĐT/email theo hạn mức gói.",
      },
    ],
    tags: ["tìm cv", "cv ứng viên", "ntd"],
    priority: 0.88,
  },
  {
    slug: "ho-so-ung-vien-mien-phi",
    kind: "keyword",
    eyebrow: "Hồ sơ miễn phí",
    title: "Hồ sơ ứng viên miễn phí — trải nghiệm trước khi nâng gói",
    h1: "Hồ sơ ứng viên miễn phí",
    description: `Cách dùng hồ sơ ứng viên miễn phí trên gói Free: lọc, lưu và mở liên hệ có hạn mức tại ${siteConfig.name}.`,
    intro:
      "Hồ sơ miễn phí giúp NTD thử quy trình headhunt. Hãy dùng hạn mức để validate kênh trước khi scale.",
    sections: [
      {
        heading: "Nên làm gì với hạn mức Free?",
        body: "Chọn 1 vị trí, lọc chặt, mở 5–15 hồ sơ chất lượng nhất trong ngày và đo tỉ lệ phản hồi.",
      },
      {
        heading: "Dấu hiệu nên nâng gói",
        body: "Conversion tốt nhưng thiếu hạn mức, hoặc cần chạy song song nhiều vị trí.",
      },
    ],
    faqs: [
      {
        q: "Free có đủ tuyển không?",
        a: "Đủ để thử và tuyển nhẹ. Chiến dịch lớn nên dùng gói có hạn mức cao hơn.",
      },
    ],
    tags: ["hồ sơ miễn phí", "cv miễn phí", "free"],
    priority: 0.86,
  },
  {
    slug: "ung-vien-moi-tot-nghiep",
    kind: "keyword",
    eyebrow: "Ứng viên",
    title: "Tuyển ứng viên mới tốt nghiệp / fresher",
    h1: "Tuyển ứng viên mới tốt nghiệp",
    description: `Gợi ý tuyển fresher / mới tốt nghiệp: tiêu chí, cách đọc CV và liên hệ trên ${siteConfig.name}.`,
    intro:
      "Fresher thường sẵn sàng tìm việc. NTD cần JD rõ về đào tạo và lộ trình để tăng tỉ lệ nhận lời.",
    sections: [
      {
        heading: "Tiêu chí fresher thực tế",
        body: "Chuyên ngành, kỹ năng nền, thái độ học hỏi, địa bàn. Kinh nghiệm thực tập là điểm cộng.",
      },
      {
        heading: "Liên hệ thế nào?",
        body: "Nêu rõ chế độ trial/đào tạo, lịch onboard và yêu cầu cơ bản — tránh JD senior cho fresher.",
      },
    ],
    faqs: [
      {
        q: "Fresher có trong kho không?",
        a: "Có thể lọc theo kinh nghiệm thấp / thực tập sinh. Kết hợp từ khóa ngành học liên quan.",
      },
    ],
    tags: ["fresher", "mới tốt nghiệp", "thực tập sinh"],
    priority: 0.75,
  },
  {
    slug: "ung-vien-co-kinh-nghiem",
    kind: "keyword",
    eyebrow: "Ứng viên",
    title: "Tìm ứng viên có kinh nghiệm cho vị trí mid–senior",
    h1: "Tìm ứng viên có kinh nghiệm",
    description: `Cách headhunt ứng viên có kinh nghiệm: lọc năm KN, đọc CV và mở liên hệ trên ${siteConfig.name}.`,
    intro:
      "Ứng viên có kinh nghiệm phản hồi chọn lọc hơn. Tin nhắn cần nêu giá trị vị trí và lý do tiếp cận rõ.",
    sections: [
      {
        heading: "Lọc theo năm kinh nghiệm",
        body: "Đặt khoảng KN khớp JD. Tránh shortlist quá rộng khiến lãng phí hạn mức.",
      },
      {
        heading: "Nội dung outreach",
        body: "Nhắc thành tựu/kinh nghiệm nổi bật trên CV, mô tả scope công việc và khung đãi ngộ.",
      },
    ],
    faqs: [
      {
        q: "Senior có khó tiếp cận không?",
        a: "Thường chậm hơn fresher. Ưu tiên cá nhân hoá và gọi đúng khung giờ hành chính.",
      },
    ],
    tags: ["ứng viên kinh nghiệm", "mid", "senior"],
    priority: 0.75,
  },
  {
    slug: "tuyen-dung-online",
    kind: "keyword",
    eyebrow: "Tuyển dụng",
    title: "Tuyển dụng online — kênh số cho nhà tuyển dụng",
    h1: "Tuyển dụng online hiệu quả",
    description: `Tuyển dụng online bằng kho CV và công cụ số: tìm, lưu, mở liên hệ ứng viên trên ${siteConfig.name}.`,
    intro:
      "Tuyển dụng online giúp HR làm việc từ xa và đo được số liệu. Kho hồ sơ là một trụ cột sourcing số.",
    sections: [
      {
        heading: "Stack tuyển dụng online cơ bản",
        body: "Kênh tin + kho CV + lịch phỏng vấn + scorecard. Đồng bộ ghi chú ứng viên đã mở/đã lưu.",
      },
      {
        heading: "Ưu điểm đo lường",
        body: "Biết số hồ sơ mở, tỉ lệ phản hồi, thời gian fill — dễ tối ưu ngân sách.",
      },
    ],
    faqs: [
      {
        q: "Tuyển online có cần gặp mặt không?",
        a: "Tuỳ vị trí. Nhiều team phỏng vấn online vòng 1, onsite vòng sau.",
      },
    ],
    tags: ["tuyển dụng online", "hr tech"],
    priority: 0.82,
  },
  {
    slug: "phan-mem-tuyen-dung",
    kind: "keyword",
    eyebrow: "Tuyển dụng",
    title: "Phần mềm tuyển dụng & kho hồ sơ ứng viên",
    h1: "Phần mềm / nền tảng tuyển dụng với kho CV",
    description: `Nền tảng tuyển dụng giúp NTD tìm CV, quản lý shortlist và mở liên hệ — ${siteConfig.name}.`,
    intro:
      "Phần mềm tuyển dụng không chỉ là ATS. Với SME, kho hồ sơ + hạn mức mở liên hệ đã giải quyết phần lớn bài toán sourcing.",
    sections: [
      {
        heading: "Nhóm tính năng cần có",
        body: "Tìm/lọc CV, lưu danh sách, mở liên hệ, theo dõi đã xem/đã mở, quản lý gói.",
      },
      {
        heading: "Khi nào cần ATS đầy đủ?",
        body: "Khi tuyển khối lượng lớn, nhiều hiring manager và cần pipeline phức tạp. SME có thể bắt đầu với kho CV trước.",
      },
    ],
    faqs: [
      {
        q: `${siteConfig.name} có phải ATS không?`,
        a: "Tập trung headhunt/kho hồ sơ cho NTD. Có thể dùng song song công cụ ATS nội bộ nếu cần.",
      },
    ],
    tags: ["phần mềm tuyển dụng", "ats", "hr tech"],
    priority: 0.78,
  },
  {
    slug: "headhunter-viet-nam",
    kind: "keyword",
    eyebrow: "Headhunter",
    title: "Headhunter Việt Nam — tự headhunt bằng kho CV số",
    h1: "Headhunter Việt Nam cho doanh nghiệp",
    description: `Cách doanh nghiệp tự headhunt tại Việt Nam bằng kho hồ sơ ứng viên trên ${siteConfig.name}.`,
    intro:
      "Headhunter truyền thống phù hợp vị trí hiếm. Với vị trí phổ biến, NTD có thể tự headhunt qua nền tảng số để tiết kiệm chi phí.",
    sections: [
      {
        heading: "Tự headhunt vs thuê headhunter",
        body: "Tự làm: kiểm soát chi phí, phù hợp volume. Thuê: vị trí executive/hiếm. Nhiều team kết hợp cả hai.",
      },
      {
        heading: "Bắt đầu tự headhunt",
        body: `Đăng ký ${siteConfig.name}, chốt tiêu chí, lọc kho, mở liên hệ theo tuần.`,
      },
    ],
    faqs: [
      {
        q: "Có phục vụ toàn quốc không?",
        a: "Kho hồ sơ theo nhiều tỉnh/thành. Lọc địa bàn trước khi liên hệ.",
      },
    ],
    tags: ["headhunter", "headhunt", "việt nam"],
    priority: 0.85,
  },
  {
    slug: "nguon-ung-vien",
    kind: "keyword",
    eyebrow: "Sourcing",
    title: "Nguồn ứng viên cho nhà tuyển dụng — đa dạng kênh",
    h1: "Nguồn ứng viên hiệu quả",
    description: `Các nguồn ứng viên phổ biến và khi nào dùng kho CV headhunt trên ${siteConfig.name}.`,
    intro:
      "Nguồn ứng viên đa dạng giúp giảm rủi ro phụ thuộc một kênh. Kho CV bổ sung inbound từ tin đăng.",
    sections: [
      {
        heading: "Các nguồn phổ biến",
        body: "Job board, referral, social, campus, kho CV/database, agency.",
      },
      {
        heading: "Phân bổ gợi ý cho SME",
        body: "40% tin đăng, 40% kho CV, 20% referral — điều chỉnh theo ngành và cấp bậc.",
      },
    ],
    faqs: [
      {
        q: "Nguồn nào rẻ nhất?",
        a: "Referral và Free trial kho CV thường rẻ nhất để khởi động; scale bằng gói phù hợp.",
      },
    ],
    tags: ["nguồn ứng viên", "sourcing", "tuyển dụng"],
    priority: 0.8,
  },
  {
    slug: "sang-loc-ho-so-ung-vien",
    kind: "keyword",
    eyebrow: "Sàng lọc",
    title: "Sàng lọc hồ sơ ứng viên nhanh và chính xác",
    h1: "Sàng lọc hồ sơ ứng viên",
    description:
      "Checklist sàng lọc CV: tiêu chí cứng, red flag, khi nào mở liên hệ — dành cho NTD và HR.",
    intro:
      "Sàng lọc tốt giúp tiết kiệm thời gian phỏng vấn và hạn mức mở liên hệ. Dùng rubric ngắn, thống nhất trong team.",
    sections: [
      {
        heading: "Tiêu chí cứng vs mềm",
        body: "Cứng: ngành, KN, địa bàn, bằng cấp bắt buộc. Mềm: văn hoá, tiềm năng — đánh giá ở vòng phỏng vấn.",
      },
      {
        heading: "Tránh bias",
        body: "Chấm theo scorecard, không loại sớm vì template CV hay trường học nếu không liên quan JD.",
      },
    ],
    faqs: [
      {
        q: "Nên sàng bao nhiêu CV cho một vị trí?",
        a: "Thường shortlist 15–40 hồ sơ đã lọc trước khi mở liên hệ hàng loạt.",
      },
    ],
    tags: ["sàng lọc hồ sơ", "cv", "hr"],
    priority: 0.78,
  },
  {
    slug: "viec-lam-da-nang-cho-ntd",
    kind: "keyword",
    eyebrow: "Việc làm",
    title: "Việc làm Đà Nẵng — góc nhà tuyển dụng",
    h1: "Tuyển dụng việc làm tại Đà Nẵng",
    description: `NTD tuyển tại Đà Nẵng: lọc ứng viên địa bàn và mở liên hệ trên ${siteConfig.name}.`,
    intro:
      "Đà Nẵng là thị trường việc làm tăng trưởng. Lọc giúp giảm ứng viên không sẵn sàng chuyển vùng.",
    sections: [
      {
        heading: "Ngành thường tuyển",
        body: "Du lịch–dịch vụ, IT, sales, hành chính. Điều chỉnh đãi ngộ theo mặt bằng địa phương.",
      },
      {
        heading: "Mẹo liên hệ",
        body: "Nêu rõ onsite/hybrid và địa điểm văn phòng trong tin nhắn đầu.",
      },
    ],
    faqs: [
      {
        q: "Có bài vị trí × Đà Nẵng không?",
        a: "Có trong mục Blog — tuyển theo vị trí tại Đà Nẵng.",
      },
    ],
    tags: ["việc làm đà nẵng", "tuyển dụng"],
    priority: 0.72,
  },
  {
    slug: "viec-lam-binh-duong-cho-ntd",
    kind: "keyword",
    eyebrow: "Việc làm",
    title: "Việc làm Bình Dương — góc nhà tuyển dụng",
    h1: "Tuyển dụng việc làm tại Bình Dương",
    description: `Tuyển ứng viên tại Bình Dương từ kho hồ sơ trên ${siteConfig.name}.`,
    intro:
      "Bình Dương có nhu cầu sản xuất–kho–sales cao. Ưu tiên ứng viên sẵn sàng ca làm và di chuyển khu công nghiệp.",
    sections: [
      {
        heading: "Lưu ý địa bàn",
        body: "Hỏi rõ khu vực đang ở và khả năng đi lại tới nhà máy/kho.",
      },
      {
        heading: "Shortlist nhanh",
        body: "Lọc tỉnh Bình Dương + ngành liên quan, mở liên hệ theo ca làm việc phù hợp.",
      },
    ],
    faqs: [
      {
        q: "Ứng viên HCM có nhận việc Bình Dương không?",
        a: "Một phần có nếu hỗ trợ xe đưa đón/ca hợp lý — nên hỏi sớm khi liên hệ.",
      },
    ],
    tags: ["việc làm bình dương", "tuyển dụng"],
    priority: 0.7,
  },
  {
    slug: "ket-noi-nha-tuyen-dung-ung-vien",
    kind: "keyword",
    eyebrow: "Kết nối",
    title: "Kết nối nhà tuyển dụng và ứng viên qua kho hồ sơ",
    h1: "Kết nối NTD và ứng viên",
    description: `Cách ${siteConfig.name} giúp nhà tuyển dụng kết nối ứng viên qua tìm CV và mở liên hệ.`,
    intro:
      "Kết nối đúng người đúng lúc là mục tiêu của nền tảng headhunt. NTD chủ động tiếp cận thay vì chỉ chờ apply.",
    sections: [
      {
        heading: "Luồng kết nối",
        body: "NTD tìm hồ sơ → đánh giá → mở liên hệ → trao đổi cơ hội việc làm.",
      },
      {
        heading: "Trách nhiệm khi liên hệ",
        body: "Chỉ dùng thông tin cho mục đích tuyển dụng hợp lệ và tôn trọng thời gian ứng viên.",
      },
    ],
    faqs: [
      {
        q: "Ứng viên có chủ động chat không?",
        a: "Mô hình hiện tại ưu tiên NTD chủ động headhunt từ kho hồ sơ.",
      },
    ],
    tags: ["kết nối", "tuyển dụng", "ứng viên"],
    priority: 0.72,
  },
];

/** Vị trí phổ biến — long-tail “tuyển [role]” / “ứng viên [role]”. */
export const POPULAR_ROLES: { slugPart: string; name: string; aliases: string[] }[] = [
  { slugPart: "nhan-vien-kinh-doanh", name: "Nhân viên kinh doanh", aliases: ["sales", "nhân viên sales"] },
  { slugPart: "ke-toan", name: "Kế toán", aliases: ["nhân viên kế toán"] },
  { slugPart: "nhan-vien-marketing", name: "Nhân viên marketing", aliases: ["marketing"] },
  { slugPart: "lap-trinh-vien", name: "Lập trình viên", aliases: ["developer", "kỹ sư phần mềm"] },
  { slugPart: "nhan-vien-hanh-chinh", name: "Nhân viên hành chính", aliases: ["hành chính nhân sự"] },
  { slugPart: "nhan-vien-cskh", name: "Nhân viên CSKH", aliases: ["chăm sóc khách hàng"] },
  { slugPart: "nhan-su-hr", name: "Nhân sự (HR)", aliases: ["chuyên viên nhân sự"] },
  { slugPart: "nhan-vien-kho", name: "Nhân viên kho", aliases: ["thủ kho"] },
  { slugPart: "tai-xe", name: "Tài xế", aliases: ["lái xe"] },
  { slugPart: "thuc-tap-sinh", name: "Thực tập sinh", aliases: ["fresher", "intern"] },
  { slugPart: "tro-ly-giam-doc", name: "Trợ lý giám đốc", aliases: ["PA", "trợ lý"] },
  { slugPart: "content-creator", name: "Content Creator", aliases: ["content marketing"] },
  { slugPart: "nhan-vien-ban-hang", name: "Nhân viên bán hàng", aliases: ["seller"] },
  { slugPart: "ky-su", name: "Kỹ sư", aliases: ["engineer"] },
  { slugPart: "nhan-vien-van-phong", name: "Nhân viên văn phòng", aliases: ["office staff"] },
  { slugPart: "nhan-vien-digital-marketing", name: "Nhân viên Digital Marketing", aliases: ["digital marketing"] },
  { slugPart: "nhan-vien-seo", name: "Nhân viên SEO", aliases: ["chuyên viên seo"] },
  { slugPart: "nhan-vien-telesales", name: "Nhân viên telesales", aliases: ["telesale"] },
  { slugPart: "nhan-vien-xuat-nhap-khau", name: "Nhân viên xuất nhập khẩu", aliases: ["xnk", "logistics"] },
  { slugPart: "nhan-vien-mua-hang", name: "Nhân viên mua hàng", aliases: ["purchasing"] },
  { slugPart: "bao-ve", name: "Bảo vệ", aliases: ["security"] },
  { slugPart: "nhan-vien-ky-thuat", name: "Nhân viên kỹ thuật", aliases: ["kỹ thuật"] },
  { slugPart: "quan-ly-cua-hang", name: "Quản lý cửa hàng", aliases: ["store manager"] },
  { slugPart: "nhan-vien-thiet-ke", name: "Nhân viên thiết kế", aliases: ["designer", "đồ họa"] },
];

export const ROLE_CITIES: { slugPart: string; name: string }[] = [
  { slugPart: "ha-noi", name: "Hà Nội" },
  { slugPart: "tp-hcm", name: "TP.HCM" },
  { slugPart: "da-nang", name: "Đà Nẵng" },
  { slugPart: "hai-phong", name: "Hải Phòng" },
  { slugPart: "can-tho", name: "Cần Thơ" },
  { slugPart: "binh-duong", name: "Bình Dương" },
  { slugPart: "dong-nai", name: "Đồng Nai" },
  { slugPart: "khanh-hoa", name: "Khánh Hòa" },
  { slugPart: "lam-dong", name: "Lâm Đồng" },
];

export function buildRolePost(role: (typeof POPULAR_ROLES)[number]): KeywordDraft {
  return {
    slug: `tuyen-${role.slugPart}`,
    kind: "keyword",
    eyebrow: "Tuyển theo vị trí",
    title: `Tuyển ${role.name} — tìm ứng viên & CV`,
    h1: `Tuyển ${role.name}`,
    description: `Cách nhà tuyển dụng tìm ứng viên ${role.name}: tiêu chí lọc CV, shortlist, kịch bản liên hệ và đo hiệu quả trên ${siteConfig.name}.`,
    intro: `Nhu cầu tuyển ${role.name} xuất hiện thường xuyên trên thị trường việc làm. Headhunt từ kho hồ sơ giúp NTD chủ động hơn so với chỉ chờ ứng tuyển.`,
    sections: [
      {
        heading: `Tiêu chí khi tuyển ${role.name}`,
        body: `Chốt kinh nghiệm, kỹ năng then chốt${role.aliases[0] ? ` (ví dụ liên quan ${role.aliases[0]})` : ""}, địa bàn và mức lương khung trước khi lọc CV.`,
      },
      {
        heading: "Gợi ý liên hệ",
        body: `Nêu rõ vị trí ${role.name}, lý do hồ sơ được chọn và bước tiếp theo (gọi/phỏng vấn). Tránh tin nhắn mẫu gửi hàng loạt.`,
      },
      {
        heading: "Đo hiệu quả",
        body: "Theo dõi tỉ lệ phản hồi và số ứng viên vào vòng phỏng vấn mỗi 10 hồ sơ đã mở.",
      },
      {
        heading: "Khi nào mở rộng bộ lọc?",
        body: `Nếu shortlist ${role.name} quá mỏng, nới nhẹ năm kinh nghiệm hoặc bán kính địa bàn trước khi hạ tiêu chí kỹ năng cốt lõi.`,
      },
    ],
    faqs: [
      {
        q: `Ở đâu tìm CV ${role.name}?`,
        a: `Đăng ký NTD trên ${siteConfig.name}, tìm theo ngành/từ khóa liên quan ${role.name}, lưu và mở liên hệ theo gói.`,
      },
    ],
    tags: [role.name, "tuyển dụng", ...role.aliases],
    priority: 0.72,
  };
}

export function buildRoleCityPost(
  role: (typeof POPULAR_ROLES)[number],
  city: (typeof ROLE_CITIES)[number]
): KeywordDraft {
  return {
    slug: `tuyen-${role.slugPart}-tai-${city.slugPart}`,
    kind: "keyword",
    eyebrow: "Vị trí × địa bàn",
    title: `Tuyển ${role.name} tại ${city.name}`,
    h1: `Tuyển ${role.name} tại ${city.name}`,
    description: `Tìm ứng viên ${role.name} tại ${city.name}: lọc địa bàn, đọc CV, shortlist và mở liên hệ có kiểm soát trên ${siteConfig.name}.`,
    intro: `Tuyển ${role.name} tại ${city.name} cần khớp cả chuyên môn và địa bàn. Kho hồ sơ giúp NTD lọc trước khi mở liên hệ.`,
    sections: [
      {
        heading: "Bộ lọc đề xuất",
        body: `Kết hợp từ khóa/ngành của ${role.name} + địa bàn ${city.name}. Lưu 15–25 hồ sơ khớp nhất rồi mới mở liên hệ.`,
      },
      {
        heading: "Điểm cần xác nhận",
        body: `Khả năng làm việc tại ${city.name}, thời gian onboard, và mức kỳ vọng lương phù hợp thị trường địa phương.`,
      },
      {
        heading: "Kịch bản liên hệ ngắn",
        body: `Mở đầu bằng vị trí ${role.name} tại ${city.name}, 1 lý do chọn hồ sơ, và CTA rõ (khung giờ gọi lại).`,
      },
    ],
    faqs: [
      {
        q: `Có nhiều ứng viên ${role.name} tại ${city.name}?`,
        a: `Tuỳ thời điểm kho. Hãy lọc trên ${siteConfig.name} và điều chỉnh bán kính địa bàn nếu shortlist mỏng.`,
      },
    ],
    tags: [role.name, city.name, "việc làm"],
    priority: 0.58,
  };
}

/** Long-tail “ứng viên [role]” — intent tìm hồ sơ. */
export function buildCandidateRolePost(role: (typeof POPULAR_ROLES)[number]): KeywordDraft {
  return {
    slug: `ung-vien-${role.slugPart}`,
    kind: "keyword",
    eyebrow: "Ứng viên theo vị trí",
    title: `Ứng viên ${role.name} — tìm CV & liên hệ`,
    h1: `Ứng viên ${role.name}`,
    description: `Tìm ứng viên ${role.name} trong kho hồ sơ: tiêu chí đọc CV, shortlist, mở liên hệ và mẹo tăng phản hồi trên ${siteConfig.name}.`,
    intro: `Nhà tuyển dụng thường tìm “ứng viên ${role.name}” khi cần nguồn sẵn sàng tiếp cận. Headhunt giúp chủ động hơn đăng tin một chiều.`,
    sections: [
      {
        heading: `Nhận diện CV ${role.name} tốt`,
        body: `Ưu tiên kinh nghiệm đúng vai trò, kỹ năng then chốt${role.aliases[0] ? ` (liên quan ${role.aliases[0]})` : ""} và địa bàn khớp JD.`,
      },
      {
        heading: "Quy trình tiếp cận",
        body: "Lọc → lưu 10–30 hồ sơ → mở liên hệ theo độ khớp → ghi chú phản hồi để tinh chỉnh bộ lọc.",
      },
      {
        heading: "Tránh lãng phí hạn mức",
        body: `Chỉ mở hồ sơ ${role.name} đã qua tiêu chí cứng. Đo conversion theo tuần trước khi mở rộng volume.`,
      },
    ],
    faqs: [
      {
        q: `Ứng viên ${role.name} có miễn phí không?`,
        a: `Có thể bắt đầu với hạn mức Free trên ${siteConfig.name}; mở liên hệ theo gói khi cần scale.`,
      },
    ],
    tags: [`ứng viên ${role.name}`, role.name, "cv"],
    priority: 0.7,
  };
}
