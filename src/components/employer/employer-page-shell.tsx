import type { ReactNode } from "react";

/** Padding chuẩn cho trang NTD (trừ trang full-bleed như tìm ứng viên). */
export function EmployerPageShell({ children }: { children: ReactNode }) {
  return (
    <div className="h-full w-full px-3 py-4 sm:px-6 sm:py-8 lg:px-8 xl:px-10">
      {children}
    </div>
  );
}
