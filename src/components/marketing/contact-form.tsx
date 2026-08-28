"use client";

import { useState, type FormEvent } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1.5 flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3.5 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20";

export function ContactForm() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    window.setTimeout(() => {
      setPending(false);
      setDone(true);
    }, 600);
  }

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
          <Check className="h-4 w-4" aria-hidden />
          Đã nhận tin nhắn (demo)
        </p>
        <p className="mt-2 text-sm leading-relaxed text-emerald-800/90">
          Cảm ơn bạn đã liên hệ. Đội ngũ Vstaff sẽ phản hồi qua email sớm nhất khi hệ thống được nối
          API.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-name" className="text-sm font-medium text-zinc-800">
            Họ và tên
          </label>
          <input
            id="contact-name"
            name="name"
            required
            autoComplete="name"
            placeholder="Nguyễn Văn A"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-company" className="text-sm font-medium text-zinc-800">
            Công ty <span className="font-normal text-zinc-400">(tuỳ chọn)</span>
          </label>
          <input
            id="contact-company"
            name="company"
            autoComplete="organization"
            placeholder="Tên công ty"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="contact-email" className="text-sm font-medium text-zinc-800">
            Email
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="contact-phone" className="text-sm font-medium text-zinc-800">
            Số điện thoại <span className="font-normal text-zinc-400">(tuỳ chọn)</span>
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="09…"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="contact-subject" className="text-sm font-medium text-zinc-800">
          Chủ đề
        </label>
        <input
          id="contact-subject"
          name="subject"
          required
          placeholder="VD: Tư vấn gói dịch vụ NTD"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="text-sm font-medium text-zinc-800">
          Nội dung
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={5}
          placeholder="Mô tả nhu cầu của bạn…"
          className={cn(inputClass, "h-auto min-h-[8rem] resize-y py-2.5")}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "inline-flex h-11 items-center justify-center rounded-md bg-[var(--primary)] px-6 text-sm font-semibold tracking-wide text-[var(--primary-foreground)] transition hover:opacity-92",
          pending && "cursor-not-allowed opacity-70"
        )}
      >
        {pending ? "Đang gửi..." : "Gửi liên hệ"}
      </button>
    </form>
  );
}
