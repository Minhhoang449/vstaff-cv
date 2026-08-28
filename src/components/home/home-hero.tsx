import Link from "next/link";
import Image from "next/image";
import { VstaffLogo } from "@/components/home/vstaff-logo";
import { siteConfig } from "@/lib/site";

export function HomeHero() {
  return (
    <section className="relative isolate min-h-[min(92vh,46rem)] overflow-hidden">
      <Image
        src="/brand/hero-employer-ad.jpg"
        alt={`Nhà tuyển dụng dùng ${siteConfig.name} để tìm ứng viên từ kho hồ sơ`}
        fill
        priority
        className="home-animate-fade-in -z-20 object-cover object-[center_30%]"
        sizes="100vw"
      />
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(105deg, rgba(6,32,40,0.94) 0%, rgba(10,52,62,0.88) 42%, rgba(12,68,82,0.55) 72%, rgba(12,68,82,0.35) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.55) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.55) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "linear-gradient(180deg, black 20%, transparent 88%)",
        }}
      />

      <div className="mx-auto flex min-h-[min(92vh,46rem)] max-w-6xl flex-col justify-center px-4 py-20 sm:py-24">
        <div className="max-w-2xl">
          <p
            className="home-animate-fade-up text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[#9be8c0]"
            style={{ animationDelay: "0.05s" }}
          >
            Headhunter số
          </p>

          <div
            className="home-animate-fade-up mt-5"
            style={{ animationDelay: "0.12s" }}
          >
            <VstaffLogo href={null} light size="xl" className="gap-3 sm:gap-4" />
          </div>
          <div
            className="home-animate-line mt-4 h-px w-24 bg-gradient-to-r from-[#b8954a] to-transparent"
            aria-hidden
          />

          <h1
            className="home-animate-fade-up mt-7 font-display text-3xl font-medium leading-[1.15] tracking-tight text-white sm:text-4xl lg:text-[2.85rem]"
            style={{ animationDelay: "0.22s" }}
          >
            Kho hồ sơ chất lượng
            <span className="mt-1 block italic text-[#c8e6d4]">cho nhà tuyển dụng</span>
          </h1>

          <p
            className="home-animate-fade-up mt-5 max-w-lg text-base leading-relaxed text-zinc-300 sm:text-lg"
            style={{ animationDelay: "0.32s" }}
          >
            Chủ động tìm hồ sơ, lọc theo tiêu chí và mở liên hệ đúng người.
          </p>

          <div
            className="home-animate-fade-up mt-10 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "0.42s" }}
          >
            <Link
              href="/dang-ky"
              className="inline-flex h-12 items-center justify-center rounded-md bg-[#7dffb3] px-7 text-sm font-semibold tracking-wide text-[#063540] transition duration-300 hover:bg-[#a6ffcb]"
            >
              Đăng ký tìm ứng viên
            </Link>
            <Link
              href="/blog"
              className="inline-flex h-12 items-center justify-center rounded-md border border-white/30 bg-transparent px-7 text-sm font-semibold tracking-wide text-white transition duration-300 hover:border-white/55 hover:bg-white/8"
            >
              Đọc blog tuyển dụng
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
