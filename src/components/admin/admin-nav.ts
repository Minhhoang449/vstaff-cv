import {
  BadgePercent,
  Building2,
  CreditCard,
  LayoutDashboard,
  Mail,
  Settings,
  Upload,
  Users,
  Wallet,
} from "lucide-react";
import type { DashboardNavGroup } from "@/components/dashboard/dashboard-nav-types";

export const ADMIN_NAV_GROUPS: readonly DashboardNavGroup[] = [
  {
    title: "Tổng quan",
    items: [{ href: "/dashboard/admin", label: "Tổng quan", icon: LayoutDashboard, exact: true }],
  },
  {
    title: "Quản lý",
    items: [
      { href: "/dashboard/admin/ung-vien", label: "Ứng viên", icon: Users },
      { href: "/dashboard/admin/upload-ung-vien", label: "Upload ứng viên", icon: Upload },
      { href: "/dashboard/admin/nha-tuyen-dung", label: "Nhà tuyển dụng", icon: Building2 },
    ],
  },
  {
    title: "Kinh doanh",
    items: [
      { href: "/dashboard/admin/doanh-thu", label: "Doanh thu", icon: Wallet },
      { href: "/dashboard/admin/goi-dich-vu", label: "Gói & kích hoạt", icon: CreditCard },
      { href: "/dashboard/admin/khuyen-mai", label: "Khuyến mãi", icon: BadgePercent },
      { href: "/dashboard/admin/email", label: "Email", icon: Mail },
    ],
  },
  {
    title: "Hệ thống",
    items: [{ href: "/dashboard/admin/cai-dat", label: "Cài đặt", icon: Settings }],
  },
] as const;
