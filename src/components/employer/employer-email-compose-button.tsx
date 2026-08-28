"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FileText, Loader2, Mail, Plus, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProDropdown } from "@/components/ui/pro-dropdown";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1.5 flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20";

const AUDIENCE_OPTIONS = [
  { value: "opened", label: "Ứng viên đã mở" },
];

/** Lọc UV đã mở theo khoảng thời gian — tránh gửi lại hồ sơ cũ. */
const OPENED_WITHIN_OPTIONS = [
  { value: "today", label: "Hôm nay" },
  { value: "3d", label: "3 ngày gần đây" },
  { value: "7d", label: "7 ngày gần đây" },
  { value: "14d", label: "14 ngày gần đây" },
  { value: "30d", label: "30 ngày gần đây" },
];

type EmailTemplate = {
  id: string;
  name: string;
  description: string;
  subject: string;
  body: string;
};

const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: "invite-talk",
    name: "Mời trao đổi",
    description: "Chủ động tiếp cận hồ sơ phù hợp",
    subject: "Mời trao đổi cơ hội {{chuc_danh}} tại {{ten_cong_ty}}",
    body: `Xin chào {{ten_ung_vien}},

Chúng tôi là bộ phận Nhân sự của {{ten_cong_ty}}. Sau khi xem hồ sơ của bạn cho vị trí {{chuc_danh}}, chúng tôi đánh giá cao kinh nghiệm và mong muốn trao đổi thêm về cơ hội hợp tác.

Nếu bạn còn quan tâm, vui lòng phản hồi email này hoặc để lại khung giờ thuận tiện trong tuần này. Chúng tôi sẽ sắp xếp cuộc gọi ngắn 15–20 phút.

Trân trọng,
{{ten_nguoi_gui}}
{{ten_cong_ty}}`,
  },
  {
    id: "interview",
    name: "Mời phỏng vấn",
    description: "Xác nhận lịch PV chuyên nghiệp",
    subject: "Thư mời phỏng vấn vị trí {{chuc_danh}} — {{ten_cong_ty}}",
    body: `Xin chào {{ten_ung_vien}},

Cảm ơn bạn đã quan tâm đến vị trí {{chuc_danh}} tại {{ten_cong_ty}}.

Chúng tôi trân trọng mời bạn tham gia vòng phỏng vấn theo thông tin sau:
• Hình thức: Online / Tại văn phòng (sẽ xác nhận khi bạn phản hồi)
• Thời lượng dự kiến: 30–45 phút
• Nội dung: Trao đổi kinh nghiệm và định hướng công việc

Vui lòng phản hồi email này để xác nhận khung giờ phù hợp, hoặc đề xuất thời gian khác trong tuần.

Rất mong được gặp bạn sớm.
Trân trọng,
{{ten_nguoi_gui}}
{{ten_cong_ty}}`,
  },
  {
    id: "follow-up",
    name: "Follow-up",
    description: "Nhắc nhẹ sau lần liên hệ đầu",
    subject: "Theo dõi hồ sơ {{chuc_danh}} — {{ten_cong_ty}}",
    body: `Xin chào {{ten_ung_vien}},

Chúng tôi đã gửi thư trao đổi về vị trí {{chuc_danh}} vài ngày trước và vẫn rất quan tâm đến hồ sơ của bạn.

Nếu bạn đang cân nhắc cơ hội mới hoặc cần thêm thông tin về vị trí / đãi ngộ, đừng ngần ngại phản hồi. Chúng tôi sẵn sàng giải đáp nhanh.

Cảm ơn bạn đã dành thời gian.
Trân trọng,
{{ten_nguoi_gui}}
{{ten_cong_ty}}`,
  },
  {
    id: "thanks-reject",
    name: "Cảm ơn & cập nhật",
    description: "Từ chối lịch sự, giữ thiện cảm",
    subject: "Cập nhật kết quả ứng tuyển — {{ten_cong_ty}}",
    body: `Xin chào {{ten_ung_vien}},

Cảm ơn bạn đã quan tâm và dành thời gian cho quá trình tuyển dụng vị trí {{chuc_danh}} tại {{ten_cong_ty}}.

Sau khi cân nhắc kỹ, hiện chúng tôi quyết định tiếp tục với các ứng viên phù hợp hơn với yêu cầu giai đoạn này. Quyết định không phản ánh toàn bộ năng lực của bạn.

Chúng tôi sẽ lưu hồ sơ và liên hệ lại khi có vị trí phù hợp hơn trong tương lai.

Chúc bạn nhiều thuận lợi trên hành trình sự nghiệp.
Trân trọng,
{{ten_nguoi_gui}}
{{ten_cong_ty}}`,
  },
  {
    id: "offer",
    name: "Thư mời nhận việc",
    description: "Gửi offer ngắn gọn, rõ ràng",
    subject: "Thư mời nhận việc — {{chuc_danh}} tại {{ten_cong_ty}}",
    body: `Xin chào {{ten_ung_vien}},

Chúng tôi rất vui thông báo: {{ten_cong_ty}} chính thức mời bạn nhận vị trí {{chuc_danh}}.

Chi tiết sẽ được gửi kèm / trao đổi riêng (mức lương, ngày bắt đầu, phúc lợi). Vui lòng phản hồi trước [ngày/tháng] để chúng tôi hoàn tất thủ tục.

Nếu bạn có câu hỏi, hãy trả lời email này — chúng tôi sẵn sàng hỗ trợ.

Chào mừng bạn đến với đội ngũ!
Trân trọng,
{{ten_nguoi_gui}}
{{ten_cong_ty}}`,
  },
  {
    id: "blank",
    name: "Tự soạn",
    description: "Bắt đầu từ nội dung trống",
    subject: "",
    body: "",
  },
];

type SmtpStatus = {
  configured: boolean;
  mode?: "smtp" | "dev" | "off";
  from: string;
  fromName: string;
};

type Props = {
  onCreated?: () => void;
  initialSmtp?: SmtpStatus | null;
};

export function EmployerEmailComposeButton({ onCreated, initialSmtp }: Props) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [templateId, setTemplateId] = useState("invite-talk");
  const [fromName, setFromName] = useState("");
  const [audience, setAudience] = useState("opened");
  const [openedWithin, setOpenedWithin] = useState("7d");
  const [subject, setSubject] = useState(EMAIL_TEMPLATES[0].subject);
  const [body, setBody] = useState(EMAIL_TEMPLATES[0].body);
  const [smtp, setSmtp] = useState<SmtpStatus | null>(initialSmtp ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch("/api/emails/status")
      .then(async (res) => {
        const data = (await res.json().catch(() => null)) as { smtp?: SmtpStatus } | null;
        if (!cancelled && data?.smtp) setSmtp(data.smtp);
      })
      .catch(() => {
        /* keep initial */
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  function applyTemplate(id: string) {
    const tpl = EMAIL_TEMPLATES.find((t) => t.id === id) ?? EMAIL_TEMPLATES[0];
    setTemplateId(tpl.id);
    setSubject(tpl.subject);
    setBody(tpl.body);
  }

  function reset() {
    setTemplateId("invite-talk");
    setFromName("");
    setAudience("opened");
    setOpenedWithin("7d");
    setSubject(EMAIL_TEMPLATES[0].subject);
    setBody(EMAIL_TEMPLATES[0].body);
    setSubmitting(false);
    setError(null);
    setSuccess(null);
    setPreviewUrl(null);
  }

  async function sendCampaign() {
    if (!subject.trim() || !body.trim() || submitting) return;
    if (audience === "opened" && !openedWithin) return;

    setSubmitting(true);
    setError(null);
    setSuccess(null);
    setPreviewUrl(null);

    try {
      const res = await fetch("/api/emails/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          body,
          fromName,
          audience,
          openedWithin: audience === "opened" ? openedWithin : undefined,
          companyName: fromName || undefined,
        }),
      });
      const data = (await res.json().catch(() => null)) as {
        error?: string;
        campaign?: {
          sentCount?: number;
          failedCount?: number;
          recipientCount?: number;
          previewUrls?: string[];
        };
        smtp?: SmtpStatus;
      } | null;

      if (data?.smtp) setSmtp(data.smtp);

      if (!res.ok) {
        setError(data?.error || "Không gửi được email.");
        return;
      }

      const sent = data?.campaign?.sentCount ?? 0;
      const failed = data?.campaign?.failedCount ?? 0;
      const preview = data?.campaign?.previewUrls?.[0] ?? null;
      setPreviewUrl(preview);
      setSuccess(
        `Đã gửi ${sent}/${data?.campaign?.recipientCount ?? sent} thư${failed ? `, lỗi ${failed}` : ""}.`
      );
      onCreated?.();
      router.refresh();
      window.setTimeout(() => {
        setOpen(false);
        reset();
      }, preview ? 8000 : 1200);
    } catch {
      setError("Không kết nối được máy chủ.");
    } finally {
      setSubmitting(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void sendCampaign();
  }

  const smtpReady = Boolean(smtp?.configured);

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
          className="inline-flex h-10 items-center gap-1.5 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-92"
        >
          <Plus className="h-4 w-4" aria-hidden />
          Soạn email
        </button>
      </DialogTrigger>

      <DialogContent
        size="lg"
        className="flex max-h-[min(90vh,46rem)] flex-col gap-0 overflow-hidden p-0"
      >
        <form onSubmit={onSubmit} className="flex min-h-0 flex-1 flex-col">
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5 pb-4">
            <DialogHeader>
              <DialogTitle>Soạn email tự động</DialogTitle>
              <DialogDescription>
                Chọn mẫu chuyên nghiệp rồi chỉnh sửa cho phù hợp trước khi gửi.
              </DialogDescription>
            </DialogHeader>

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-medium text-zinc-800">
                <FileText className="h-4 w-4 text-[var(--primary)]" aria-hidden />
                Mẫu email
              </p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {EMAIL_TEMPLATES.map((tpl) => {
                  const active = templateId === tpl.id;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => applyTemplate(tpl.id)}
                      className={cn(
                        "rounded-lg border px-3 py-2.5 text-left transition",
                        active
                          ? "border-[var(--primary)] bg-[var(--primary)]/5 ring-1 ring-[var(--primary)]/30"
                          : "border-zinc-200 bg-white hover:border-zinc-300 hover:bg-zinc-50"
                      )}
                    >
                      <span
                        className={cn(
                          "block text-sm font-semibold",
                          active ? "text-[var(--primary)]" : "text-zinc-900"
                        )}
                      >
                        {tpl.name}
                      </span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-zinc-500">
                        {tpl.description}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="email-from" className="text-sm font-medium text-zinc-800">
                  Tên người gửi
                </label>
                <input
                  id="email-from"
                  value={fromName}
                  onChange={(e) => setFromName(e.target.value)}
                  placeholder="VD: HR · Công ty ABC"
                  className={inputClass}
                />
                {smtp?.from ? (
                  <p className="mt-1.5 text-xs text-zinc-500">
                    Địa chỉ From: <span className="font-mono">{smtp.from}</span>
                  </p>
                ) : null}
              </div>
              <div>
                <label htmlFor="email-subject" className="text-sm font-medium text-zinc-800">
                  Tiêu đề email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email-subject"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Mời trao đổi cơ hội nghề nghiệp"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-zinc-800">
                  Đối tượng nhận <span className="text-red-500">*</span>
                </label>
                <div className="mt-1.5">
                  <ProDropdown
                    value={audience}
                    onChange={setAudience}
                    options={AUDIENCE_OPTIONS}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-zinc-800">
                  Đã mở trong <span className="text-red-500">*</span>
                </label>
                <div className="mt-1.5">
                  <ProDropdown
                    value={openedWithin}
                    onChange={setOpenedWithin}
                    options={OPENED_WITHIN_OPTIONS}
                    disabled={audience !== "opened"}
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="email-body" className="text-sm font-medium text-zinc-800">
                Nội dung <span className="text-red-500">*</span>
              </label>
              <textarea
                id="email-body"
                required
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={9}
                placeholder={
                  "Xin chào {{ten_ung_vien}},\n\nChúng tôi quan tâm đến hồ sơ của bạn..."
                }
                className="mt-1.5 w-full resize-y rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm leading-relaxed text-zinc-800 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20"
              />
              <p className="mt-1.5 text-xs text-zinc-500">
                Placeholder: {"{{ten_ung_vien}}"}, {"{{chuc_danh}}"}, {"{{ten_cong_ty}}"},{" "}
                {"{{ten_nguoi_gui}}"}
              </p>
            </div>

            {error ? (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-800">
                {error}
              </p>
            ) : null}
            {success ? (
              <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-800">
                <p>{success}</p>
                {previewUrl ? (
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-block text-emerald-900 underline underline-offset-2"
                  >
                    Xem bản gửi
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-zinc-100 bg-white px-5 py-4">
            <p className="flex max-w-md items-center gap-1.5 text-xs text-zinc-500">
              <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden />
              {smtpReady
                ? `Gửi từ ${smtp?.from ?? "nền tảng"}`
                : "Hệ thống chưa sẵn sàng gửi email"}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="inline-flex h-10 items-center rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={
                  submitting ||
                  !subject.trim() ||
                  !body.trim() ||
                  !smtpReady ||
                  audience !== "opened"
                }
                className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--primary-foreground)] transition hover:opacity-92 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <Send className="h-4 w-4" aria-hidden />
                )}
                Gửi
              </button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
