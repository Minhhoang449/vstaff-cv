import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

export function EmployerCvDownloadButton({
  slug,
  fullName,
  fullWidth,
  variant = "primary",
}: {
  slug: string;
  fullName: string;
  fullWidth?: boolean;
  variant?: "primary" | "outline";
}) {
  const href = `/api/candidates/${encodeURIComponent(slug)}/cv`;

  return (
    <a
      href={href}
      download
      className={cn(
        "inline-flex h-10 items-center justify-center gap-1.5 rounded-lg px-4 text-sm font-semibold transition",
        fullWidth && "w-full",
        variant === "primary"
          ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-92"
          : "border border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300 hover:bg-zinc-50"
      )}
      aria-label={`Tải PDF CV của ${fullName}`}
    >
      <Download className="h-4 w-4" aria-hidden />
      Tải PDF
    </a>
  );
}
