import { Suspense } from "react";
import type { Metadata } from "next";
import { AuthPageShell } from "@/components/auth/auth-page-shell";
import { LoginForm } from "@/components/auth/login-form";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <AuthPageShell
      title="Đăng nhập"
      description="Truy cập kho hồ sơ ứng viên và công cụ headhunt của Vstaff."
    >
      <Suspense fallback={<p className="text-sm text-zinc-500">Đang tải form đăng nhập…</p>}>
        <LoginForm />
      </Suspense>
    </AuthPageShell>
  );
}
