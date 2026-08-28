"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Building2, Check, Eye, Globe, Loader2 } from "lucide-react";
import { ProDropdown } from "@/components/ui/pro-dropdown";
import { INDUSTRIES } from "@/data/industries";
import { PROVINCES, shortProvinceName } from "@/data/vietnam-locations";
import type { EmployerCompanyProfile } from "@/lib/employer-company-types";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1.5 flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20";

const SIZE_OPTIONS = [
  { value: "1-10", label: "1 – 10 nhân sự" },
  { value: "11-50", label: "11 – 50 nhân sự" },
  { value: "51-200", label: "51 – 200 nhân sự" },
  { value: "201-500", label: "201 – 500 nhân sự" },
  { value: "500+", label: "Trên 500 nhân sự" },
];

const EMPTY: EmployerCompanyProfile = {
  companyName: "",
  slug: "",
  logoText: "",
  industry: "",
  province: "",
  address: "",
  companySize: "11-50",
  website: "",
  phone: "",
  email: "",
  about: "",
  isPublic: true,
};

type Props = {
  initialProfile?: EmployerCompanyProfile | null;
};

export function EmployerCompanySettingsForm({ initialProfile }: Props) {
  const seed = initialProfile ?? EMPTY;
  const [companyName, setCompanyName] = useState(seed.companyName);
  const [slug, setSlug] = useState(seed.slug);
  const [logoText, setLogoText] = useState(seed.logoText);
  const [industry, setIndustry] = useState(seed.industry);
  const [province, setProvince] = useState(seed.province);
  const [address, setAddress] = useState(seed.address);
  const [companySize, setCompanySize] = useState(seed.companySize || "11-50");
  const [website, setWebsite] = useState(seed.website);
  const [phone, setPhone] = useState(seed.phone);
  const [email, setEmail] = useState(seed.email);
  const [about, setAbout] = useState(seed.about);
  const [isPublic, setIsPublic] = useState(seed.isPublic !== false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(!initialProfile);

  useEffect(() => {
    if (initialProfile) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/employer/company");
        const data = (await res.json().catch(() => null)) as {
          profile?: EmployerCompanyProfile;
        } | null;
        if (!res.ok || !data?.profile || cancelled) return;
        const p = data.profile;
        setCompanyName(p.companyName || "");
        setSlug(p.slug || "");
        setLogoText(p.logoText || "");
        setIndustry(p.industry || "");
        setProvince(p.province || "");
        setAddress(p.address || "");
        setCompanySize(p.companySize || "11-50");
        setWebsite(p.website || "");
        setPhone(p.phone || "");
        setEmail(p.email || "");
        setAbout(p.about || "");
        setIsPublic(p.isPublic !== false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [initialProfile]);

  const industryOptions = useMemo(
    () => [
      { value: "", label: "Chọn ngành nghề" },
      ...INDUSTRIES.map((i) => ({ value: i.id, label: i.name })),
    ],
    []
  );

  const provinceOptions = useMemo(
    () => [
      { value: "", label: "Chọn tỉnh / thành phố" },
      ...PROVINCES.map((p) => ({ value: p.code, label: shortProvinceName(p.name) })),
    ],
    []
  );

  const industryLabel =
    INDUSTRIES.find((i) => i.id === industry)?.name ?? "Chưa chọn ngành";
  const locationLabel =
    PROVINCES.find((p) => p.code === province)?.name.replace(/^Thành phố |^Tỉnh /, "") ??
    "Chưa chọn địa điểm";

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!companyName.trim() || !slug.trim() || !industry || !province) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch("/api/employer/company", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          slug,
          logoText,
          industry,
          province,
          address,
          companySize,
          website,
          phone,
          email,
          about,
          isPublic,
        } satisfies EmployerCompanyProfile),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setError(data?.error || "Không lưu được cài đặt.");
        return;
      }
      setSaved(true);
      window.setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Không kết nối được máy chủ.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-white px-5 py-10 text-sm text-zinc-500">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        Đang tải hồ sơ công ty…
      </div>
    );
  }

  return (
    <form onSubmit={(e) => void onSubmit(e)} className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-5 rounded-xl border border-[var(--border)] bg-white p-5 sm:p-6">
          <div>
            <h2 className="text-sm font-semibold text-zinc-900">Thông tin công ty</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Hiển thị trên trang công ty công khai khi bạn bật công khai hồ sơ.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="co-name" className="text-sm font-medium text-zinc-800">
                Tên công ty <span className="text-red-500">*</span>
              </label>
              <input
                id="co-name"
                required
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="VD: TechNova Solutions"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="co-slug" className="text-sm font-medium text-zinc-800">
                Đường dẫn trang <span className="text-red-500">*</span>
              </label>
              <div className="mt-1.5 flex h-10 overflow-hidden rounded-lg border border-zinc-200 bg-white focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/20">
                <span className="flex items-center bg-zinc-50 px-3 text-xs text-zinc-500">
                  /cong-ty/
                </span>
                <input
                  id="co-slug"
                  required
                  value={slug}
                  onChange={(e) =>
                    setSlug(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9-]/g, "-")
                        .replace(/-+/g, "-")
                    )
                  }
                  placeholder="ten-cong-ty"
                  className="min-w-0 flex-1 border-0 bg-transparent px-3 text-sm text-zinc-800 outline-none placeholder:text-zinc-400"
                />
              </div>
            </div>

            <div>
              <label htmlFor="co-logo" className="text-sm font-medium text-zinc-800">
                Chữ trên logo
              </label>
              <input
                id="co-logo"
                value={logoText}
                maxLength={3}
                onChange={(e) => setLogoText(e.target.value.toUpperCase().slice(0, 3))}
                placeholder="VD: TN"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-800">
                Ngành nghề <span className="text-red-500">*</span>
              </label>
              <div className="mt-1.5">
                <ProDropdown
                  value={industry}
                  onChange={setIndustry}
                  options={industryOptions}
                  placeholder="Chọn ngành nghề"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-800">
                Tỉnh / Thành phố <span className="text-red-500">*</span>
              </label>
              <div className="mt-1.5">
                <ProDropdown
                  value={province}
                  onChange={setProvince}
                  options={provinceOptions}
                  placeholder="Chọn tỉnh / thành phố"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="co-address" className="text-sm font-medium text-zinc-800">
                Địa chỉ
              </label>
              <input
                id="co-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Số nhà, đường, quận/huyện…"
                className={inputClass}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-800">Quy mô</label>
              <div className="mt-1.5">
                <ProDropdown
                  value={companySize}
                  onChange={setCompanySize}
                  options={SIZE_OPTIONS}
                />
              </div>
            </div>

            <div>
              <label htmlFor="co-website" className="text-sm font-medium text-zinc-800">
                Website
              </label>
              <input
                id="co-website"
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="co-phone" className="text-sm font-medium text-zinc-800">
                Điện thoại liên hệ
              </label>
              <input
                id="co-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="VD: 028 1234 5678"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="co-email" className="text-sm font-medium text-zinc-800">
                Email liên hệ
              </label>
              <input
                id="co-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hr@congty.vn"
                className={inputClass}
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="co-about" className="text-sm font-medium text-zinc-800">
                Giới thiệu công ty
              </label>
              <textarea
                id="co-about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                rows={5}
                placeholder="Mô tả ngắn về công ty, văn hóa, sản phẩm…"
                className="mt-1.5 w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm leading-relaxed text-zinc-800 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-zinc-300 text-[var(--primary)] focus:ring-[var(--primary)]"
              />
              <span>
                <span className="block text-sm font-medium text-zinc-800">
                  Hiển thị trang công ty công khai
                </span>
                <span className="mt-0.5 block text-xs text-zinc-500">
                  Ứng viên có thể xem trang tại /cong-ty/{slug || "…"}
                </span>
              </span>
            </label>

            <div className="flex flex-col items-end gap-2">
              {error ? <p className="text-sm text-red-600">{error}</p> : null}
              <div className="flex items-center gap-3">
                {saved ? (
                  <p className="flex items-center gap-1.5 text-sm font-medium text-emerald-700">
                    <Check className="h-4 w-4" aria-hidden />
                    Đã lưu
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-10 items-center gap-1.5 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-92 disabled:opacity-60"
                >
                  {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                  Lưu cài đặt
                </button>
              </div>
            </div>
          </div>
        </div>

        <aside className="h-fit rounded-xl border border-[var(--border)] bg-white p-5">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-zinc-500">
            <Eye className="h-3.5 w-3.5" aria-hidden />
            Xem trước
          </p>
          <div className="mt-4 rounded-lg border border-zinc-200 bg-zinc-50/80 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[var(--primary)] text-sm font-bold text-[var(--primary-foreground)]">
                {(logoText || companyName.slice(0, 2) || "??").slice(0, 3)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-zinc-900">
                  {companyName || "Tên công ty"}
                </p>
                <p className="mt-1 flex items-center gap-1 text-xs text-zinc-500">
                  <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  <span className="truncate">{industryLabel}</span>
                </p>
                <p className="mt-0.5 text-xs text-zinc-500">{locationLabel}</p>
              </div>
            </div>
            {about ? (
              <p className="mt-3 line-clamp-4 text-xs leading-relaxed text-zinc-600">{about}</p>
            ) : null}
            {website ? (
              <p className="mt-3 flex items-center gap-1 truncate text-xs text-[var(--primary)]">
                <Globe className="h-3.5 w-3.5 shrink-0" aria-hidden />
                {website.replace(/^https?:\/\//, "")}
              </p>
            ) : null}
            <p
              className={cn(
                "mt-4 text-[11px] font-semibold",
                isPublic ? "text-emerald-700" : "text-zinc-400"
              )}
            >
              {isPublic ? "Trạng thái: Công khai" : "Trạng thái: Riêng tư"}
            </p>
          </div>
        </aside>
      </div>
    </form>
  );
}
