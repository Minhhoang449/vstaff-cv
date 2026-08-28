import type { Metadata } from "next";
import Link from "next/link";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { RegisterForm } from "@/components/auth/register-form";
import { getSystemSettings } from "@/lib/system-settings";

export const metadata: Metadata = {
  title: "Đăng ký nhà tuyển dụng",
  robots: { index: false, follow: false },
};

export default async function RegisterPage() {
  const settings = await getSystemSettings();

  if (settings.maintenance) {
    return (
      <AuthPageShell
        title="Đang bảo trì"
        description={`${settings.siteName} tạm dừng đăng ký. Vui lòng quay lại sau.`}
        highlights={[
          `Email: ${settings.supportEmail}`,
          settings.supportPhone ? `Hotline: ${settings.supportPhone}` : "Hỗ trợ qua email",
        ]}
      >
        <Link
          href="/dang-nhap"
          className="inline-flex h-11 w-full items-center justify-center rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)]"
        >
          Đăng nhập nội bộ
        </Link>
      </AuthPageShell>
    );
  }

  if (!settings.allowEmployerSignup) {
    return (
      <AuthPageShell
        title="Đăng ký tạm đóng"
        description="Hiện chưa mở đăng ký nhà tuyển dụng tự phục vụ. Liên hệ hỗ trợ để được kích hoạt tài khoản."
        highlights={[
          `Email: ${settings.supportEmail}`,
          settings.supportPhone ? `Hotline: ${settings.supportPhone}` : "Hỗ trợ qua email",
        ]}
      >
        <div className="space-y-3">
          <a
            href={`mailto:${settings.supportEmail}`}
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)]"
          >
            Liên hệ hỗ trợ
          </a>
          <Link
            href="/dang-nhap"
            className="inline-flex h-11 w-full items-center justify-center rounded-md border border-zinc-200 px-4 text-sm font-semibold text-zinc-800"
          >
            Đăng nhập
          </Link>
        </div>
      </AuthPageShell>
    );
  }

  return (
    <AuthPageShell
      title="Tạo tài khoản NTD"
      description={`Mở tài khoản nhà tuyển dụng trên ${settings.siteName} để tìm và kết nối ứng viên.`}
      highlights={[
        "Truy cập kho hồ sơ đã sẵn sàng",
        "Lưu & quản lý danh sách ứng viên",
        "Gói Free bắt đầu — nâng cấp khi cần",
      ]}
    >
      <RegisterForm />
    </AuthPageShell>
  );
}
