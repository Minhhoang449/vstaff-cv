"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1.5 flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3.5 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20";

export function RegisterForm() {
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = new FormData(e.currentTarget);
    const company = String(form.get("company") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const password = String(form.get("password") ?? "");
    const confirm = String(form.get("confirm") ?? "");

    if (!company || !email || password.length < 6) {
      setError("Vui lòng điền đủ thông tin (mật khẩu tối thiểu 6 ký tự).");
      return;
    }
    if (password !== confirm) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setPending(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ company, email, password }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) {
        setError(data?.error || "Không tạo được tài khoản.");
        return;
      }
      setDone(true);
    } catch {
      setError("Không kết nối được máy chủ.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-5">
          <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
            <Check className="h-4 w-4" aria-hidden />
            Tài khoản NTD đã tạo
          </p>
          <p className="mt-2 text-sm leading-relaxed text-emerald-800/90">
            Đăng nhập bằng email và mật khẩu vừa đăng ký để vào dashboard nhà tuyển dụng.
          </p>
        </div>
        <Link
          href="/dang-nhap"
          className="inline-flex h-11 w-full items-center justify-center rounded-md bg-[var(--primary)] px-4 text-sm font-semibold tracking-wide text-[var(--primary-foreground)] transition hover:opacity-92"
        >
          Đến trang đăng nhập
        </Link>
      </div>
    );
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div>
        <label htmlFor="company" className="text-sm font-medium text-zinc-800">
          Tên công ty
        </label>
        <input
          id="company"
          name="company"
          required
          autoComplete="organization"
          placeholder="VD: TechNova Solutions"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="reg-email" className="text-sm font-medium text-zinc-800">
          Email công việc
        </label>
        <input
          id="reg-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="hr@company.com"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="reg-phone" className="text-sm font-medium text-zinc-800">
          Số điện thoại <span className="font-normal text-zinc-400">(tuỳ chọn)</span>
        </label>
        <input
          id="reg-phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="09…"
          className={inputClass}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="reg-password" className="text-sm font-medium text-zinc-800">
            Mật khẩu
          </label>
          <input
            id="reg-password"
            name="password"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Tối thiểu 6 ký tự"
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="reg-confirm" className="text-sm font-medium text-zinc-800">
            Xác nhận
          </label>
          <input
            id="reg-confirm"
            name="confirm"
            type="password"
            required
            minLength={6}
            autoComplete="new-password"
            placeholder="Nhập lại mật khẩu"
            className={inputClass}
          />
        </div>
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
        >
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-semibold tracking-wide text-[var(--primary-foreground)] transition hover:opacity-92",
          pending && "cursor-not-allowed opacity-70"
        )}
      >
        {pending ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
        {pending ? "Đang tạo..." : "Tạo tài khoản NTD"}
      </button>

      <p className="text-center text-sm text-zinc-600">
        Đã có tài khoản?{" "}
        <Link href="/dang-nhap" className="font-semibold text-[var(--primary)] hover:underline">
          Đăng nhập
        </Link>
      </p>
    </form>
  );
}
