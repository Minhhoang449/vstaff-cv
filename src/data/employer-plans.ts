export type EmployerPlan = {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  durationLabel: string;
  cvLimit: number | null;
  cvLimitLabel: string;
  /** CV tặng mỗi ngày (gói Free). */
  cvPerDay?: number;
  highlight?: boolean;
  features: string[];
};

/** Gói dịch vụ headhunter / Tool AI & Bot CV. */
export const EMPLOYER_PLANS: EmployerPlan[] = [
  {
    id: "free",
    name: "Free",
    price: 0,
    durationDays: 0,
    durationLabel: "Không thời hạn",
    cvLimit: null,
    cvLimitLabel: "2 CV / ngày",
    cvPerDay: 2,
    features: [
      "Tặng 2 CV mỗi ngày",
      "Reset hạn mức hàng ngày",
      "Tìm & xem hồ sơ cơ bản",
      "Không cần thanh toán",
    ],
  },
  {
    id: "trial",
    name: "Trải nghiệm",
    price: 399_000,
    durationDays: 5,
    durationLabel: "5 ngày",
    cvLimit: 200,
    cvLimitLabel: "200 CV",
    features: [
      "Hạn mức 200 CV",
      "Thời hạn 5 ngày",
      "Tìm & lưu ứng viên",
      "Phù hợp dùng thử",
    ],
  },
  {
    id: "standard",
    name: "Phổ biến",
    price: 990_000,
    durationDays: 30,
    durationLabel: "30 ngày",
    cvLimit: null,
    cvLimitLabel: "Không giới hạn",
    highlight: true,
    features: [
      "Không giới hạn số CV",
      "Thời hạn 30 ngày",
      "Tìm, lưu & danh sách gửi",
      "Email tự động cơ bản",
    ],
  },
  {
    id: "pro",
    name: "Chuyên nghiệp",
    price: 2_490_000,
    durationDays: 120,
    durationLabel: "120 ngày",
    cvLimit: null,
    cvLimitLabel: "Không giới hạn",
    features: [
      "Không giới hạn số CV",
      "Thời hạn 120 ngày",
      "Danh sách ứng viên & gửi hàng ngày",
      "Email tự động đồng loạt",
    ],
  },
];

export function formatVnd(amount: number) {
  if (amount === 0) return "Miễn phí";
  return new Intl.NumberFormat("vi-VN").format(amount) + "₫";
}
