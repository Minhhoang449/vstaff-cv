import type { ReactNode } from "react";

/** Padding chuẩn cho trang Admin. */
export function AdminPageShell({ children }: { children: ReactNode }) {
  return <div className="h-full w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 xl:px-10">{children}</div>;
}
