import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Logo mặc định dùng làm avatar hồ sơ trên dashboard NTD. */
export const EMPLOYER_CANDIDATE_AVATAR_SRC = "/brand/vstaff-logo.png";

const SIZE = {
  sm: { box: "h-9 w-9", px: 28 },
  md: { box: "h-11 w-11 sm:h-12 sm:w-12", px: 40 },
  lg: { box: "h-14 w-14 sm:h-16 sm:w-16", px: 52 },
} as const;

type Props = {
  /** Link tới trang chi tiết ứng viên (tuỳ chọn). */
  href?: string;
  size?: keyof typeof SIZE;
  className?: string;
  /** Tên ứng viên — chỉ dùng cho aria-label. */
  name?: string;
};

export function EmployerCandidateAvatar({
  href,
  size = "sm",
  className,
  name,
}: Props) {
  const dim = SIZE[size];
  const inner = (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-200/80 bg-white p-1.5",
        dim.box,
        className
      )}
      aria-hidden={!href && !name}
    >
      <Image
        src={EMPLOYER_CANDIDATE_AVATAR_SRC}
        alt=""
        width={dim.px}
        height={dim.px}
        className="h-full w-full object-contain"
        unoptimized
      />
    </span>
  );

  if (!href) return inner;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-0.5 shrink-0"
      aria-label={name ? `Xem hồ sơ ${name}` : "Xem hồ sơ ứng viên"}
    >
      {inner}
    </Link>
  );
}
