import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { VstaffLogo } from "@/components/home/vstaff-logo";
import { siteConfig } from "@/lib/site";

const FOOTER_COLUMNS = [
  {
    title: "Về Vstaff",
    links: [
      { href: "/gioi-thieu", label: "Giới thiệu" },
      { href: "/lien-he", label: "Liên hệ" },
      { href: "/dieu-khoan-su-dung", label: "Điều khoản" },
    ],
  },
  {
    title: "Nhà tuyển dụng",
    links: [
      { href: "/blog", label: "Blog tuyển dụng" },
      { href: "/dang-nhap", label: "Đăng nhập NTD" },
      { href: "/dang-ky", label: "Đăng ký NTD" },
      { href: "/lien-he", label: "Liên hệ" },
    ],
  },
  {
    title: "Pháp lý",
    links: [
      { href: "/dieu-khoan-su-dung", label: "Điều khoản sử dụng" },
      { href: "/chinh-sach-bao-mat", label: "Chính sách bảo mật" },
      { href: "/quy-che-hoat-dong", label: "Quy chế hoạt động" },
    ],
  },
] as const;

export function HomeFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-zinc-200 bg-[#0a3a46] text-zinc-200">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
          <div className="max-w-sm">
            <div>
              <VstaffLogo light />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-300">{siteConfig.description}</p>
            <ul className="mt-5 space-y-2.5 text-sm text-zinc-300">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#7dffb3]" />
                <span>{siteConfig.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-[#7dffb3]" />
                <a href={`tel:${siteConfig.phoneTel}`} className="hover:text-white">
                  {siteConfig.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-[#7dffb3]" />
                <a href={`mailto:${siteConfig.email}`} className="hover:text-white">
                  {siteConfig.email}
                </a>
              </li>
            </ul>
          </div>

          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="text-sm font-semibold tracking-wide text-white">{column.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-zinc-300 transition hover:text-[#7dffb3]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-5 text-xs text-zinc-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            <Link href="/dieu-khoan-su-dung" className="hover:text-white">
              Điều khoản sử dụng
            </Link>
            <Link href="/chinh-sach-bao-mat" className="hover:text-white">
              Chính sách bảo mật
            </Link>
            <Link href="/quy-che-hoat-dong" className="hover:text-white">
              Quy chế hoạt động
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
