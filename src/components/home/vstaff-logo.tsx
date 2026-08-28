import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Mark trong suốt — không qua optimizer để giữ alpha. */
const LOGO_SRC = "/brand/vstaff-logo.png";

type Props = {
  className?: string;
  /** Icon-only for compact header slots */
  markOnly?: boolean;
  href?: string | null;
  /** Chữ trắng — dùng trên nền tối (hero). */
  light?: boolean;
  /** Kích thước mark (px CSS). */
  size?: "sm" | "md" | "lg" | "brand" | "xl";
};

const SIZE = {
  sm: { px: 24, className: "h-6 w-6" },
  md: { px: 32, className: "h-8 w-8" },
  lg: { px: 48, className: "h-12 w-12" },
  brand: { px: 64, className: "h-14 w-14 sm:h-16 sm:w-16" },
  xl: { px: 80, className: "h-14 w-14 sm:h-16 sm:w-16 lg:h-20 lg:w-20" },
} as const;

export function VstaffLogo({
  className,
  markOnly = false,
  href = "/",
  light = false,
  size = "md",
}: Props) {
  const dim = SIZE[size];

  const content = (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Image
        src={LOGO_SRC}
        alt=""
        width={dim.px}
        height={dim.px}
        className={cn(dim.className, "bg-transparent object-contain")}
        priority
        unoptimized
      />
      {!markOnly && (
        <span
          className={cn(
            "font-semibold tracking-tight",
            size === "xl"
              ? "font-display text-5xl font-medium sm:text-6xl lg:text-7xl"
              : size === "brand"
                ? "text-2xl font-semibold sm:text-3xl"
                : size === "lg"
                  ? "text-3xl sm:text-4xl"
                  : size === "sm"
                    ? "text-base"
                    : "text-xl",
            light ? "text-white" : "text-[var(--primary)]"
          )}
          aria-hidden
        >
          Vstaff
        </span>
      )}
    </span>
  );

  if (!href) return content;
  return (
    <Link href={href} className="inline-flex shrink-0 items-center" aria-label="Vstaff trang chủ">
      {content}
    </Link>
  );
}
