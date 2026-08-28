import type { Metadata } from "next";
import Link from "next/link";
import { MarketingContentPage } from "@/components/marketing/marketing-content-page";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Giới thiệu",
  description: `Tìm hiểu ${siteConfig.name} — nền tảng headhunter số và kho hồ sơ ứng viên dành cho nhà tuyển dụng.`,
  alternates: { canonical: "/gioi-thieu" },
  openGraph: {
    title: `Giới thiệu | ${siteConfig.name}`,
    description: siteConfig.description,
    url: "/gioi-thieu",
  },
};

const PILLARS = [
  {
    title: "Kho CV tập trung",
    body: "Hồ sơ ứng viên được chuẩn hoá để NTD tìm kiếm, lọc và headhunt nhanh — không phụ thuộc đăng tin rồi chờ ứng tuyển.",
  },
  {
    title: "Công cụ cho NTD",
    body: "Lưu hồ sơ, mở liên hệ, lập danh sách gửi và email đồng loạt — quy trình headhunt gọn trong một dashboard.",
  },
  {
    title: "Vận hành bởi admin",
    body: "Dữ liệu ứng viên được cập nhật qua quy trình quản trị (upload JSON), bảo đảm chất lượng kho hồ sơ theo hướng sản phẩm.",
  },
] as const;

export default function AboutPage() {
  return (
    <MarketingContentPage
      eyebrow="Về chúng tôi"
      title="Giới thiệu Vstaff"
      description="Headhunter số giúp nhà tuyển dụng tiếp cận kho hồ sơ chất lượng và kết nối ứng viên phù hợp."
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:gap-12">
        <div className="space-y-6 rounded-2xl border border-[var(--border)] bg-white p-6 sm:p-8">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
            Sứ mệnh
          </p>
          <h2 className="font-display text-2xl font-medium tracking-tight text-zinc-900 sm:text-3xl">
            Kết nối NTD với đúng người — nhanh hơn
          </h2>
          <p className="text-sm leading-relaxed text-zinc-600 sm:text-[0.95rem]">
            {siteConfig.name} xây dựng nền tảng headhunter số: tập trung vào kho hồ sơ ứng viên và
            công cụ tìm kiếm / quản lý dành cho nhà tuyển dụng. Thay vì chỉ là sàn đăng tin việc làm,
            chúng tôi giúp NTD chủ động tiếp cận ứng viên phù hợp.
          </p>
          <p className="text-sm leading-relaxed text-zinc-600 sm:text-[0.95rem]">
            Sản phẩm đang phát triển theo hướng dữ liệu gọn: admin cập nhật ứng viên, danh sách hiển
            thị thông tin cốt lõi; chi tiết hồ sơ và CV mẫu website được bổ sung khi cần — xuất PDF sẽ
            theo sau.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/dang-ky"
              className="inline-flex h-11 items-center rounded-md bg-[var(--primary)] px-5 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-92"
            >
              Đăng ký NTD
            </Link>
            <Link
              href="/lien-he"
              className="inline-flex h-11 items-center rounded-md border border-[var(--primary)]/80 px-5 text-sm font-semibold text-[var(--primary)] transition hover:bg-[var(--primary)]/5"
            >
              Liên hệ tư vấn
            </Link>
          </div>
        </div>

        <aside className="space-y-4">
          {PILLARS.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-[var(--border)] bg-white p-5 sm:p-6"
            >
              <h3 className="text-sm font-semibold text-zinc-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">{item.body}</p>
            </div>
          ))}
        </aside>
      </div>

      <section className="mt-10 rounded-2xl border border-[var(--border)] bg-white p-6 sm:p-8">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
          Dành cho ai
        </p>
        <div className="mt-5 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-display text-xl font-medium text-zinc-900">Nhà tuyển dụng</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Headhunt từ kho CV, lưu và quản lý ứng viên, dùng gói dịch vụ phù hợp nhu cầu tuyển
              dụng.
            </p>
            <Link
              href="/blog"
              className="mt-3 inline-block text-sm font-semibold text-[var(--primary)] hover:underline"
            >
              Đọc blog tuyển dụng →
            </Link>
          </div>
          <div>
            <h3 className="font-display text-xl font-medium text-zinc-900">Đối tác & vận hành</h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Admin quản trị kho hồ sơ, gói dịch vụ, khuyến mãi và hoạt động nền tảng.
            </p>
            <Link
              href="/lien-he"
              className="mt-3 inline-block text-sm font-semibold text-[var(--primary)] hover:underline"
            >
              Trao đổi hợp tác →
            </Link>
          </div>
        </div>
      </section>
    </MarketingContentPage>
  );
}
