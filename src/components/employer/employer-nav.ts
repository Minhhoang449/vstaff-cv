import {
  BadgePercent,
  Bookmark,
  CreditCard,
  Eye,
  History,
  LayoutDashboard,
  ListChecks,
  Mail,
  Search,
  Settings,
} from "lucide-react";
import type { DashboardNavGroup } from "@/components/dashboard/dashboard-nav-types";

export const EMPLOYER_NAV_GROUPS: readonly DashboardNavGroup[] = [
  {
    title: "Làm việc",
    items: [
      { href: "/dashboard/employer", label: "Tổng quan", icon: LayoutDashboard, exact: true },
      { href: "/dashboard/employer/tim-ung-vien", label: "Tìm ứng viên", icon: Search },
      { href: "/dashboard/employer/da-luu", label: "Ứng viên đã lưu", icon: Bookmark },
      { href: "/dashboard/employer/da-mo", label: "Ứng viên đã mở", icon: Eye },
    ],
  },
  {
    title: "Tự động hóa",
    items: [
      { href: "/dashboard/employer/danh-sach", label: "Danh sách ứng viên", icon: ListChecks },
      { href: "/dashboard/employer/email", label: "Email tự động", icon: Mail },
    ],
  },
  {
    title: "Tài khoản",
    items: [
      { href: "/dashboard/employer/bang-gia", label: "Bảng giá", icon: CreditCard },
      { href: "/dashboard/employer/khuyen-mai", label: "Khuyến mãi", icon: BadgePercent },
      { href: "/dashboard/employer/lich-su-kich-hoat", label: "Lịch sử kích hoạt", icon: History },
      { href: "/dashboard/employer/cai-dat", label: "Cài đặt", icon: Settings },
    ],
  },
] as const;
