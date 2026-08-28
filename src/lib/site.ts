export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

export const siteConfig = {
  name: "Vstaff",
  description:
    "Nền tảng headhunter số — kho hồ sơ ứng viên cho nhà tuyển dụng: tìm CV, cung cấp ứng viên, headhunt theo ngành và địa bàn.",
  locale: "vi_VN",
  address:
    "Tòa nhà Viettel Lâm Đồng, số 39 đường Hùng Vương, thành phố Đà Lạt, tỉnh Lâm Đồng.",
  phone: "0877.007.445",
  /** Dùng cho tel: — bỏ dấu chấm */
  phoneTel: "0877007445",
  email: "hello@vstaff.io.vn",
  keywords: [
    "headhunter",
    "kho hồ sơ ứng viên",
    "cung cấp CV",
    "CV miễn phí",
    "tìm ứng viên",
    "ứng viên miễn phí",
    "ứng viên tìm việc",
    "tuyển dụng",
    "việc làm",
    "database CV",
    "tìm CV ứng viên",
    "headhunt",
    "Vstaff",
  ],
};
