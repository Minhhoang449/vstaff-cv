import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { SystemSettings } from "@/lib/system-settings-types";

type Props = {
  settings: SystemSettings;
};

export function MaintenanceScreen({ settings }: Props) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800">
        <AlertTriangle className="h-6 w-6" aria-hidden />
      </span>
      <h1 className="mt-5 font-display text-3xl font-medium tracking-tight text-zinc-900">
        {settings.siteName} đang bảo trì
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-600">
        Hệ thống tạm dừng phục vụ để nâng cấp. Vui lòng quay lại sau. Liên hệ hỗ trợ nếu cần gấp.
      </p>
      <dl className="mt-6 space-y-1 text-sm text-zinc-700">
        <div>
          <dt className="inline text-zinc-500">Email: </dt>
          <dd className="inline">
            <a
              href={`mailto:${settings.supportEmail}`}
              className="font-medium text-[var(--primary)] hover:underline"
            >
              {settings.supportEmail}
            </a>
          </dd>
        </div>
        {settings.supportPhone ? (
          <div>
            <dt className="inline text-zinc-500">Hotline: </dt>
            <dd className="inline font-medium">{settings.supportPhone}</dd>
          </div>
        ) : null}
      </dl>
      <Link
        href="/dang-nhap"
        className="mt-8 inline-flex h-10 items-center rounded-md border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-800 transition hover:border-[var(--primary)]/40 hover:text-[var(--primary)]"
      >
        Đăng nhập nội bộ
      </Link>
    </div>
  );
}
