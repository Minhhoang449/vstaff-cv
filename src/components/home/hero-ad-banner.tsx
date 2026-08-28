"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type EmployerAd = {
  id: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
};

const DEMO_ADS: EmployerAd[] = [
  {
    id: "ad-slot-1",
    href: "/dang-nhap",
    imageSrc: "/brand/hero-employer-ad.jpg",
    imageAlt: "Banner quảng cáo tuyển dụng",
  },
  {
    id: "ad-slot-2",
    href: "/dang-nhap",
    imageSrc: "/brand/hero-employer-ad.jpg",
    imageAlt: "Banner quảng cáo tuyển dụng",
  },
];

type Props = {
  ads?: EmployerAd[];
  className?: string;
};

/** Banner carousel — cột phải hero (chỉ ảnh + điều hướng). */
export function HeroAdBanner({ ads = DEMO_ADS, className }: Props) {
  const [index, setIndex] = useState(0);
  const total = ads.length;

  useEffect(() => {
    if (total <= 1) return;
    const timer = window.setInterval(() => {
      setIndex((i) => (i + 1) % total);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [total]);

  if (total === 0) {
    return (
      <div
        className={cn(
          "flex min-h-[16rem] flex-col items-center justify-center rounded-xl bg-white/95 px-6 text-center shadow-md",
          className
        )}
      >
        <p className="text-sm text-[var(--muted-foreground)]">Chưa có banner quảng cáo</p>
      </div>
    );
  }

  const ad = ads[index] ?? ads[0];

  return (
    <div className={cn("relative min-h-[16rem] overflow-hidden rounded-xl bg-zinc-900 shadow-md", className)}>
      <Link href={ad.href} className="absolute inset-0 block" aria-label={ad.imageAlt}>
        <Image
          src={ad.imageSrc}
          alt={ad.imageAlt}
          fill
          priority
          className="object-cover transition duration-500"
          sizes="(max-width: 1024px) 100vw, 70vw"
        />
      </Link>

      {total > 1 && (
        <>
          <button
            type="button"
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white backdrop-blur-sm hover:bg-black/50"
            onClick={() => setIndex((i) => (i - 1 + total) % total)}
            aria-label="Banner trước"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/35 p-2 text-white backdrop-blur-sm hover:bg-black/50"
            onClick={() => setIndex((i) => (i + 1) % total)}
            aria-label="Banner sau"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
            {ads.map((item, i) => (
              <button
                key={item.id}
                type="button"
                aria-label={`Chuyển banner ${i + 1}`}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition",
                  i === index ? "bg-white" : "bg-white/45"
                )}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
