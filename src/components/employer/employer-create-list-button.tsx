"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { AlertTriangle, Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProDropdown } from "@/components/ui/pro-dropdown";
import { INDUSTRIES } from "@/data/industries";
import { PROVINCES, getWards, shortProvinceName } from "@/data/vietnam-locations";
import { GENDERS, LANGUAGE_FILTER_OPTIONS } from "@/lib/candidates-shared";
import { DELIVERY_DAILY_CV_LIMIT, deliverySlotLabel } from "@/lib/delivery-job-types";

const inputClass =
  "mt-1.5 flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20";

const DELIVERY_OPTIONS = [
  { value: "morning", label: "Mỗi sáng (08:00 – 09:00)" },
  { value: "noon", label: "Giữa ngày (11:30 – 12:30)" },
  { value: "afternoon", label: "Chiều (16:00 – 17:00)" },
  { value: "custom", label: "Khung giờ khác (ghi ở ghi chú)" },
];

const AGE_OPTIONS = [
  { value: "", label: "Tất cả độ tuổi" },
  { value: "18-25", label: "18 – 25 tuổi" },
  { value: "26-30", label: "26 – 30 tuổi" },
  { value: "31-35", label: "31 – 35 tuổi" },
  { value: "36-40", label: "36 – 40 tuổi" },
  { value: "41-50", label: "41 – 50 tuổi" },
  { value: "50+", label: "Trên 50 tuổi" },
];

type Props = {
  /** Số CV còn lại trong hạn mức gửi hôm nay */
  dailyRemaining?: number;
};

export function EmployerCreateListButton({
  dailyRemaining = DELIVERY_DAILY_CV_LIMIT,
}: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState("");
  const [province, setProvince] = useState("");
  const [ward, setWard] = useState("");
  const [industry, setIndustry] = useState("");
  const [gender, setGender] = useState("");
  const [language, setLanguage] = useState("");
  const [ageRange, setAgeRange] = useState("");
  const [delivery, setDelivery] = useState("morning");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [okMsg, setOkMsg] = useState<string | null>(null);

  const wards = useMemo(() => getWards(province), [province]);

  const provinceOptions = [
    { value: "", label: "Chọn tỉnh / thành phố" },
    ...PROVINCES.map((p) => ({ value: p.code, label: shortProvinceName(p.name) })),
  ];

  const wardOptions = [
    {
      value: "",
      label: province ? "Quận / huyện (phường/xã)" : "Chọn tỉnh trước",
    },
    ...wards.map((w) => ({ value: w.code, label: w.name })),
  ];

  const industryOptions = [
    { value: "", label: "Chọn ngành nghề" },
    ...INDUSTRIES.map((i) => ({ value: i.id, label: i.name })),
  ];

  const genderOptions = GENDERS.map((g) =>
    g.id === "" ? { value: "", label: "Tất cả giới tính" } : { value: g.id, label: g.label }
  );

  const languageOptions = [
    { value: "", label: "Tất cả ngôn ngữ" },
    ...LANGUAGE_FILTER_OPTIONS,
  ];

  function reset() {
    setPosition("");
    setProvince("");
    setWard("");
    setIndustry("");
    setGender("");
    setLanguage("");
    setAgeRange("");
    setDelivery("morning");
    setNotes("");
    setError(null);
    setOkMsg(null);
    setSaving(false);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!position.trim() || !province || !delivery) return;
    setSaving(true);
    setError(null);
    setOkMsg(null);
    try {
      const res = await fetch("/api/employer/delivery-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          position,
          industryId: industry,
          provinceCode: province,
          wardCode: ward,
          gender,
          language,
          ageRange,
          delivery,
          notes,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        job?: { matchedCount?: number; id?: string; lastRunAt?: string | null };
        error?: string;
      } | null;
      if (!res.ok || !data?.job) {
        setError(data?.error || "Không tạo được lệnh lọc.");
        return;
      }
      const matched = data.job.matchedCount ?? 0;
      const scheduled = !data.job.lastRunAt;
      setOkMsg(
        scheduled
          ? `Đã lên lịch — hệ thống sẽ khớp hồ sơ trong khung ${deliverySlotLabel(delivery as "morning" | "noon" | "afternoon" | "custom")}.`
          : `Đã tạo lệnh lọc — khớp ${matched} hồ sơ trong khung giờ hiện tại.`
      );
      router.refresh();
      window.setTimeout(() => {
        setOpen(false);
        reset();
        if (data.job?.id) {
          router.push(`/dashboard/employer/danh-sach?job=${data.job.id}`);
        }
      }, 900);
    } catch {
      setError("Không kết nối được máy chủ.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          disabled={dailyRemaining <= 0}
          title={
            dailyRemaining <= 0
              ? `Đã đạt ${DELIVERY_DAILY_CV_LIMIT} CV/ngày`
              : undefined
          }
          className="inline-flex h-10 items-center gap-1.5 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" aria-hidden />
          {dailyRemaining <= 0 ? "Hết hạn mức ngày" : "Tạo lệnh lọc"}
        </button>
      </DialogTrigger>

      <DialogContent size="lg" className="gap-0 overflow-visible p-0 sm:max-h-[90vh]">
        <div className="max-h-[min(85vh,40rem)] overflow-y-auto p-5">
          <DialogHeader>
            <DialogTitle>Tạo lệnh lọc & gửi CV theo lịch</DialogTitle>
            <DialogDescription>
              Không cần đúng từng chữ vị trí. Hệ thống ưu tiên hồ sơ có vị trí ứng tuyển / kinh
              nghiệm liên quan; nếu thiếu mới lấy ngành gần (vd. Kinh doanh → bán hàng, tư vấn,
              CSKH). Tối đa {DELIVERY_DAILY_CV_LIMIT} CV/ngày (còn {dailyRemaining} hôm nay).
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4 flex gap-2.5 rounded-lg border border-amber-200/80 bg-amber-50 px-3 py-2.5 text-sm text-amber-950">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" aria-hidden />
            <p className="leading-relaxed">
              <span className="font-semibold">Lưu ý:</span> Tiêu chí cứng (địa điểm, giới tính…) vẫn
              lọc chặt. Vị trí & ngành được khớp mềm để đủ hồ sơ chất lượng trong hạn{" "}
              {DELIVERY_DAILY_CV_LIMIT} CV/ngày.
            </p>
          </div>

          <form onSubmit={onSubmit} className="mt-5 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="list-position" className="text-sm font-medium text-zinc-800">
                  Vị trí tuyển dụng <span className="text-red-500">*</span>
                </label>
                <input
                  id="list-position"
                  required
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  placeholder="VD: Frontend Developer, Kế toán tổng hợp…"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800">Ngành nghề</label>
                <div className="mt-1.5">
                  <ProDropdown
                    value={industry}
                    onChange={setIndustry}
                    options={industryOptions}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-zinc-800">
                  Địa điểm <span className="text-red-500">*</span>
                </label>
                <div className="mt-1.5">
                  <ProDropdown
                    value={province}
                    onChange={(code) => {
                      setProvince(code);
                      setWard("");
                    }}
                    options={provinceOptions}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800">Quận / huyện</label>
                <div className="mt-1.5">
                  <ProDropdown
                    value={ward}
                    onChange={setWard}
                    options={wardOptions}
                    disabled={!province}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <label className="text-sm font-medium text-zinc-800">Giới tính</label>
                <div className="mt-1.5">
                  <ProDropdown value={gender} onChange={setGender} options={genderOptions} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800">Ngôn ngữ</label>
                <div className="mt-1.5">
                  <ProDropdown value={language} onChange={setLanguage} options={languageOptions} />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800">Độ tuổi</label>
                <div className="mt-1.5">
                  <ProDropdown value={ageRange} onChange={setAgeRange} options={AGE_OPTIONS} />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-zinc-800">
                Thời gian nhận CV mỗi ngày <span className="text-red-500">*</span>
              </label>
              <div className="mt-1.5">
                <ProDropdown
                  value={delivery}
                  onChange={setDelivery}
                  options={DELIVERY_OPTIONS}
                />
              </div>
            </div>

            <div>
              <label htmlFor="list-notes" className="text-sm font-medium text-zinc-800">
                Yêu cầu thêm (không bắt buộc)
              </label>
              <textarea
                id="list-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="VD: 3+ năm React, tiếng Anh giao tiếp…"
                className="mt-1.5 w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              />
            </div>

            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            ) : null}
            {okMsg ? (
              <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
                {okMsg}
              </p>
            ) : null}

            <div className="flex flex-wrap justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 items-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={saving || !position.trim() || !province}
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                Lưu lệnh lọc
              </button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
