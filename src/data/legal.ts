import type { LegalSection } from "@/components/legal/legal-document";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const LEGAL_UPDATED_AT = "2026-08-01";

export const legalPaths = {
  terms: "/dieu-khoan-su-dung",
  privacy: "/chinh-sach-bao-mat",
  rules: "/quy-che-hoat-dong",
} as const;

export const termsOfUse = {
  title: "Điều khoản sử dụng",
  description:
    "Quy định quyền và nghĩa vụ khi truy cập, đăng ký và sử dụng nền tảng việc làm Vstaff dành cho ứng viên và nhà tuyển dụng.",
  keywords: [
    "điều khoản sử dụng",
    "điều khoản Vstaff",
    "quy định sử dụng nền tảng việc làm",
    "thỏa thuận người dùng",
  ],
  sections: [
    {
      heading: "1. Chấp nhận điều khoản",
      paragraphs: [
        `Khi truy cập hoặc sử dụng website và dịch vụ của ${siteConfig.name} (“Vstaff”, “chúng tôi”), bạn xác nhận đã đọc, hiểu và đồng ý bị ràng buộc bởi Điều khoản sử dụng này cùng Chính sách bảo mật và Quy chế hoạt động liên quan.`,
        "Nếu bạn không đồng ý với bất kỳ nội dung nào, vui lòng ngừng sử dụng dịch vụ ngay lập tức.",
      ],
    },
    {
      heading: "2. Định nghĩa",
      bullets: [
        "Ứng viên: cá nhân tạo hồ sơ, tìm việc hoặc tương tác với tin tuyển dụng trên Vstaff.",
        "Nhà tuyển dụng (NTD): tổ chức hoặc cá nhân đăng tin tuyển dụng, tìm kiếm và liên hệ ứng viên.",
        "Tài khoản: thông tin đăng ký dùng để truy cập khu vực dành riêng trên nền tảng.",
        "Nội dung người dùng: thông tin, hồ sơ, tin tuyển dụng, tệp đính kèm do bạn tải lên hoặc công bố.",
      ],
    },
    {
      heading: "3. Điều kiện sử dụng dịch vụ",
      paragraphs: [
        "Bạn cần đủ 16 tuổi trở lên (hoặc độ tuổi hợp pháp tại nơi cư trú) để đăng ký tài khoản. NTD phải cung cấp thông tin pháp lý trung thực về doanh nghiệp/đơn vị tuyển dụng.",
        "Bạn chịu trách nhiệm bảo mật thông tin đăng nhập và mọi hoạt động phát sinh từ tài khoản của mình. Thông báo ngay cho Vstaff nếu phát hiện truy cập trái phép.",
      ],
      bullets: [
        "Không giả mạo danh tính, tổ chức hoặc quyền đại diện.",
        "Không đăng nội dung sai sự thật, phân biệt đối xử, xúc phạm hoặc vi phạm pháp luật.",
        "Không thu thập dữ liệu hàng loạt, spam, hoặc can thiệp hệ thống bằng công cụ tự động trái phép.",
        "Không sử dụng nền tảng cho mục đích gian lận tuyển dụng hoặc lừa đảo ứng viên/NTD.",
      ],
    },
    {
      heading: "4. Quyền và nghĩa vụ của Vstaff",
      paragraphs: [
        "Vstaff cung cấp nền tảng kết nối ứng viên và nhà tuyển dụng. Chúng tôi không đảm bảo bạn sẽ nhận được việc làm hoặc tuyển được ứng viên phù hợp trong mọi trường hợp.",
        "Chúng tôi có quyền tạm khóa, hạn chế hoặc xóa tài khoản/nội dung khi có dấu hiệu vi phạm điều khoản, yêu cầu của cơ quan nhà nước, hoặc để bảo vệ người dùng khác.",
      ],
    },
    {
      heading: "5. Sở hữu trí tuệ",
      paragraphs: [
        "Thương hiệu, giao diện, mã nguồn, thiết kế và nội dung do Vstaff tạo ra thuộc quyền sở hữu của Vstaff hoặc bên cấp phép. Bạn không được sao chép, chỉnh sửa hoặc khai thác thương mại khi chưa có sự đồng ý bằng văn bản.",
        "Bạn giữ quyền đối với nội dung tự tạo nhưng cấp cho Vstaff quyền không độc quyền để lưu trữ, hiển thị và phân phối nội dung đó nhằm vận hành dịch vụ.",
      ],
    },
    {
      heading: "6. Phí dịch vụ và thanh toán",
      paragraphs: [
        "Một số tính năng có thể miễn phí; các gói dịch vụ trả phí (nếu có) sẽ được công bố rõ ràng trước khi bạn mua. Phí đã thanh toán chỉ được hoàn trong phạm vi chính sách hoàn tiền công bố tại thời điểm giao dịch, trừ khi pháp luật bắt buộc khác.",
      ],
    },
    {
      heading: "7. Giới hạn trách nhiệm",
      paragraphs: [
        "Trong phạm vi pháp luật cho phép, Vstaff không chịu trách nhiệm đối với thiệt hại gián tiếp, mất dữ liệu, mất lợi nhuận phát sinh từ việc sử dụng hoặc không thể sử dụng dịch vụ, trừ trường hợp do lỗi cố ý hoặc sơ suất nghiêm trọng của chúng tôi.",
        "Quan hệ lao động/tuyển dụng giữa ứng viên và NTD là thỏa thuận độc lập; Vstaff không phải bên ký kết hợp đồng lao động trừ khi có thỏa thuận riêng bằng văn bản.",
      ],
    },
    {
      heading: "8. Thay đổi điều khoản",
      paragraphs: [
        "Chúng tôi có thể cập nhật Điều khoản sử dụng theo thời gian. Phiên bản mới có hiệu lực khi được đăng tải trên website, trừ khi nêu rõ ngày hiệu lực khác. Việc tiếp tục sử dụng dịch vụ sau khi cập nhật đồng nghĩa với việc bạn chấp nhận điều khoản mới.",
      ],
    },
    {
      heading: "9. Luật áp dụng và liên hệ",
      paragraphs: [
        "Điều khoản này được điều chỉnh bởi pháp luật Việt Nam. Mọi tranh chấp ưu tiên giải quyết bằng thương lượng; nếu không đạt được thỏa thuận, vụ việc được giải quyết tại cơ quan có thẩm quyền tại Việt Nam.",
        `Liên hệ hỗ trợ: ${siteConfig.email} | Điện thoại: ${siteConfig.phone} | Địa chỉ: ${siteConfig.address}`,
      ],
    },
  ] satisfies LegalSection[],
};

export const privacyPolicy = {
  title: "Chính sách bảo mật",
  description:
    "Cách Vstaff thu thập, sử dụng, lưu trữ và bảo vệ dữ liệu cá nhân của ứng viên và nhà tuyển dụng theo quy định pháp luật Việt Nam.",
  keywords: [
    "chính sách bảo mật",
    "bảo vệ dữ liệu cá nhân",
    "quyền riêng tư Vstaff",
    "xử lý dữ liệu ứng viên",
  ],
  sections: [
    {
      heading: "1. Phạm vi áp dụng",
      paragraphs: [
        `Chính sách bảo mật này giải thích cách ${siteConfig.name} xử lý dữ liệu cá nhân khi bạn truy cập website, tạo tài khoản, nộp hồ sơ hoặc sử dụng các tính năng tuyển dụng trên nền tảng.`,
        "Chính sách được xây dựng phù hợp với pháp luật Việt Nam về bảo vệ dữ liệu cá nhân và các quy định liên quan đến thương mại điện tử/dịch vụ trực tuyến.",
      ],
    },
    {
      heading: "2. Dữ liệu chúng tôi thu thập",
      bullets: [
        "Thông tin định danh: họ tên, email, số điện thoại, ảnh đại diện (nếu có).",
        "Thông tin hồ sơ nghề nghiệp: kinh nghiệm, kỹ năng, học vấn, mong muốn việc làm, địa bàn làm việc.",
        "Thông tin NTD: tên đơn vị, mã số thuế/đăng ký (khi cung cấp), người liên hệ, tin tuyển dụng.",
        "Dữ liệu kỹ thuật: địa chỉ IP, loại thiết bị/trình duyệt, nhật ký truy cập, cookie và mã định danh tương tự.",
        "Dữ liệu giao dịch: lịch sử mua gói dịch vụ, hóa đơn (nếu áp dụng).",
      ],
    },
    {
      heading: "3. Mục đích xử lý",
      paragraphs: [
        "Chúng tôi xử lý dữ liệu để vận hành nền tảng, kết nối ứng viên – NTD, cải thiện trải nghiệm, hỗ trợ khách hàng, phòng chống gian lận và tuân thủ nghĩa vụ pháp lý.",
      ],
      bullets: [
        "Tạo và quản lý tài khoản; xác thực đăng nhập.",
        "Hiển thị hồ sơ/tin tuyển dụng theo cài đặt công khai của bạn.",
        "Gửi thông báo liên quan dịch vụ (email/SMS/in-app) khi bạn đồng ý hoặc khi cần thiết về mặt vận hành.",
        "Phân tích thống kê dạng tổng hợp để nâng cao chất lượng sản phẩm.",
        "Đáp ứng yêu cầu của cơ quan nhà nước có thẩm quyền theo luật.",
      ],
    },
    {
      heading: "4. Chia sẻ dữ liệu",
      paragraphs: [
        "Vstaff không bán dữ liệu cá nhân. Dữ liệu có thể được chia sẻ trong các trường hợp sau:",
      ],
      bullets: [
        "Với NTD hoặc ứng viên khi bạn chủ động ứng tuyển, mở hồ sơ công khai, hoặc chấp nhận kết nối.",
        "Với nhà cung cấp dịch vụ kỹ thuật (hosting, email, thanh toán, phân tích) theo hợp đồng bảo mật.",
        "Khi có yêu cầu hợp pháp từ cơ quan nhà nước hoặc để bảo vệ quyền lợi hợp pháp của Vstaff và người dùng.",
      ],
    },
    {
      heading: "5. Cookie và công nghệ tương tự",
      paragraphs: [
        "Chúng tôi dùng cookie cần thiết để duy trì phiên đăng nhập và bảo mật, cùng cookie phân tích (nếu được bật) nhằm hiểu hành vi sử dụng ở mức tổng hợp. Bạn có thể cấu hình trình duyệt để từ chối cookie không bắt buộc; một số tính năng có thể bị hạn chế.",
      ],
    },
    {
      heading: "6. Lưu trữ và bảo mật",
      paragraphs: [
        "Dữ liệu được lưu trong thời gian cần thiết cho mục đích đã nêu hoặc theo thời hạn pháp luật yêu cầu. Chúng tôi áp dụng biện pháp kỹ thuật và tổ chức phù hợp (kiểm soát truy cập, mã hóa đường truyền, sao lưu) để giảm rủi ro truy cập trái phép.",
        "Không hệ thống nào an toàn tuyệt đối; bạn nên bảo vệ mật khẩu và thiết bị cá nhân.",
      ],
    },
    {
      heading: "7. Quyền của chủ thể dữ liệu",
      paragraphs: [
        "Trong phạm vi pháp luật cho phép, bạn có quyền yêu cầu truy cập, chỉnh sửa, bổ sung, xóa hoặc hạn chế xử lý dữ liệu cá nhân; rút lại sự đồng ý (không ảnh hưởng tính hợp pháp của xử lý trước đó); và khiếu nại theo quy định.",
        "Gửi yêu cầu tới hello@vstaff.vn. Chúng tôi sẽ phản hồi trong thời hạn hợp lý theo quy định áp dụng.",
      ],
    },
    {
      heading: "8. Dữ liệu của trẻ em",
      paragraphs: [
        "Dịch vụ không hướng tới trẻ em dưới độ tuổi được phép sử dụng theo điều khoản. Nếu phát hiện dữ liệu được thu thập không phù hợp, chúng tôi sẽ xóa hoặc xử lý theo luật.",
      ],
    },
    {
      heading: "9. Cập nhật chính sách",
      paragraphs: [
        "Chính sách có thể được điều chỉnh khi thay đổi dịch vụ hoặc quy định pháp luật. Phiên bản cập nhật sẽ được đăng trên trang này kèm ngày hiệu lực.",
      ],
    },
  ] satisfies LegalSection[],
};

export const operatingRules = {
  title: "Quy chế hoạt động",
  description:
    "Quy chế vận hành sàn kết nối việc làm Vstaff: nguyên tắc đăng tin, kiểm duyệt nội dung, xử lý khiếu nại và trách nhiệm các bên.",
  keywords: [
    "quy chế hoạt động",
    "quy chế sàn việc làm",
    "quy định đăng tin tuyển dụng",
    "khiếu nại Vstaff",
  ],
  sections: [
    {
      heading: "1. Giới thiệu chung",
      paragraphs: [
        `${siteConfig.name} là nền tảng trực tuyến hỗ trợ kết nối nhu cầu tuyển dụng giữa nhà tuyển dụng và ứng viên. Quy chế này quy định nguyên tắc hoạt động, quyền và nghĩa vụ của các bên tham gia.`,
        "Quy chế được công bố công khai trên website và có hiệu lực kể từ ngày đăng tải hoặc ngày nêu rõ trong thông báo cập nhật.",
      ],
    },
    {
      heading: "2. Nguyên tắc hoạt động",
      bullets: [
        "Minh bạch thông tin tin tuyển dụng và hồ sơ theo mức độ công khai người dùng lựa chọn.",
        "Tôn trọng pháp luật lao động, chống phân biệt đối xử trái pháp luật trong đăng tin.",
        "Bảo vệ dữ liệu cá nhân theo Chính sách bảo mật.",
        "Ưu tiên trải nghiệm an toàn, chống spam và gian lận tuyển dụng.",
      ],
    },
    {
      heading: "3. Quy định đối với nhà tuyển dụng",
      paragraphs: [
        "NTD chịu trách nhiệm về tính chính xác của tin tuyển dụng, điều kiện làm việc và thông tin liên hệ. Tin phải mô tả rõ vị trí, địa điểm (theo đơn vị hành chính đang áp dụng), mức lương/khoảng lương hoặc thỏa thuận, và yêu cầu công việc.",
      ],
      bullets: [
        "Không đăng tin ảo, tin trùng lặp gây nhiễu, hoặc thu phí trái phép từ ứng viên.",
        "Không yêu cầu ứng viên cung cấp thông tin nhạy cảm vượt mức cần thiết cho tuyển dụng.",
        "Tuân thủ pháp luật về lao động, bảo hiểm và chống phân biệt đối xử.",
      ],
    },
    {
      heading: "4. Quy định đối với ứng viên",
      bullets: [
        "Cung cấp thông tin hồ sơ trung thực; không làm giả bằng cấp, kinh nghiệm hoặc danh tính.",
        "Không sử dụng hồ sơ để quấy rối NTD hoặc phát tán nội dung không liên quan tuyển dụng.",
        "Tự chịu trách nhiệm khi chia sẻ thông tin liên hệ qua kênh ngoài nền tảng.",
      ],
    },
    {
      heading: "5. Kiểm duyệt và xử lý vi phạm",
      paragraphs: [
        "Vstaff có thể kiểm duyệt trước/sau đăng đối với tin tuyển dụng và hồ sơ công khai. Nội dung vi phạm có thể bị ẩn, chỉnh sửa yêu cầu, hoặc gỡ bỏ; tài khoản tái phạm có thể bị hạn chế hoặc khóa.",
      ],
      bullets: [
        "Vi phạm nhẹ: cảnh báo và yêu cầu chỉnh sửa.",
        "Vi phạm nghiêm trọng hoặc tái phạm: tạm khóa/khóa vĩnh viễn, báo cáo cơ quan chức năng khi cần.",
      ],
    },
    {
      heading: "6. Khiếu nại và giải quyết tranh chấp",
      paragraphs: [
        `Người dùng gửi khiếu nại qua email ${siteConfig.email} hoặc điện thoại ${siteConfig.phone}, nêu rõ thông tin liên hệ, mô tả sự việc và bằng chứng liên quan. Vstaff tiếp nhận và phản hồi trong thời gian hợp lý.`,
        "Tranh chấp phát sinh từ quan hệ tuyển dụng giữa ứng viên và NTD do các bên tự thỏa thuận giải quyết; Vstaff hỗ trợ cung cấp thông tin nhật ký giao dịch trong phạm vi kỹ thuật và pháp lý cho phép.",
      ],
    },
    {
      heading: "7. Sửa đổi quy chế",
      paragraphs: [
        "Vstaff có quyền sửa đổi Quy chế hoạt động để phù hợp với thay đổi sản phẩm hoặc quy định pháp luật. Bản cập nhật được đăng tải trên website và có hiệu lực theo ngày công bố.",
      ],
    },
    {
      heading: "8. Thông tin đơn vị vận hành",
      paragraphs: [
        `Đơn vị vận hành nền tảng: ${siteConfig.name}.`,
        `Địa chỉ liên hệ: ${siteConfig.address}`,
        `Email: ${siteConfig.email} — Điện thoại: ${siteConfig.phone}.`,
      ],
    },
  ] satisfies LegalSection[],
};

export function buildLegalJsonLd(input: {
  title: string;
  description: string;
  path: string;
  updatedAt: string;
}) {
  const siteUrl = getSiteUrl();
  const url = `${siteUrl}${input.path}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: input.title,
        description: input.description,
        inLanguage: "vi-VN",
        isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteUrl },
        dateModified: input.updatedAt,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Trang chủ", item: siteUrl },
          { "@type": "ListItem", position: 2, name: input.title, item: url },
        ],
      },
    ],
  };
}
