import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { ContactForm } from "@/components/marketing/contact-form";
import { MarketingContentPage } from "@/components/marketing/marketing-content-page";
import { getSystemSettings } from "@/lib/system-settings";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Liên hệ",
  description: `Liên hệ ${siteConfig.name} — hỗ trợ nhà tuyển dụng, tư vấn gói dịch vụ và hợp tác.`,
  alternates: { canonical: "/lien-he" },
  openGraph: {
    title: `Liên hệ | ${siteConfig.name}`,
    description: `Gửi yêu cầu hỗ trợ hoặc tư vấn tới đội ngũ ${siteConfig.name}.`,
    url: "/lien-he",
  },
};

export default async function ContactPage() {
  const settings = await getSystemSettings();
  const phoneDisplay = settings.supportPhone || siteConfig.phone;
  const phoneTel = phoneDisplay.replace(/[.\s]/g, "") || siteConfig.phoneTel;
  const contacts = [
    {
      icon: Mail,
      label: "Email",
      value: settings.supportEmail || siteConfig.email,
      href: `mailto:${settings.supportEmail || siteConfig.email}`,
    },
    {
      icon: Phone,
      label: "Số điện thoại",
      value: phoneDisplay,
      href: phoneTel ? `tel:${phoneTel}` : null,
    },
    {
      icon: MapPin,
      label: "Địa chỉ",
      value: siteConfig.address,
      href: null as string | null,
    },
  ];
  return (
    <MarketingContentPage
      eyebrow="Kết nối"
      title="Liên hệ"
      description="Gửi câu hỏi về gói dịch vụ, hợp tác hoặc hỗ trợ tài khoản nhà tuyển dụng. Chúng tôi phản hồi trong giờ làm việc."
    >
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-10">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-6 sm:p-8">
          <h2 className="font-display text-xl font-medium tracking-tight text-zinc-900 sm:text-2xl">
            Gửi tin nhắn
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Form demo — sẽ nối API gửi email / CRM sau.
          </p>
          <div className="mt-6">
            <ContactForm />
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-[var(--border)] bg-white p-6">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Thông tin
            </p>
            <ul className="mt-5 space-y-5">
              {contacts.map((item) => (
                <li key={item.label} className="flex gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[var(--secondary)] text-[var(--primary)]">
                    <item.icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span>
                    <span className="block text-xs font-medium text-zinc-500">{item.label}</span>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="mt-0.5 block text-sm font-semibold text-zinc-900 hover:text-[var(--primary)]"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <span className="mt-0.5 block text-sm font-semibold text-zinc-900">
                        {item.value}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
            className="rounded-2xl border p-6"
            style={{
              backgroundColor: "#063540",
              borderColor: "#0a4552",
              color: "#f3f1ec",
            }}
          >
            <p
              className="text-[0.7rem] font-semibold uppercase tracking-[0.16em]"
              style={{ color: "#9be8c0" }}
            >
              Giờ hỗ trợ
            </p>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "#e4e4e7" }}>
              Thứ 2 – Thứ 6: 8:30 – 17:30
              <br />
              Thứ 7, Chủ nhật: nghỉ
            </p>
            <p className="mt-4 text-sm leading-relaxed" style={{ color: "#a1a1aa" }}>
              Với yêu cầu gấp về tài khoản NTD, vui lòng ghi rõ email đăng ký trong tin nhắn.
            </p>
          </div>
        </aside>
      </div>
    </MarketingContentPage>
  );
}
