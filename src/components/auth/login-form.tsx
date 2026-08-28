"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";

const inputClass =
  "mt-1.5 flex h-11 w-full rounded-lg border border-zinc-200 bg-white px-3.5 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 hover:border-zinc-300 focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/20";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setPending(false);

    if (result?.error) {
      setError("Email hoặc mật khẩu không đúng.");
      return;
    }

    const resultSession = await fetch("/api/auth/session").then((r) => r.json()).catch(() => null);
    const role = resultSession?.user?.role as string | undefined;
    const roleTarget =
      role === "ADMIN"
        ? "/dashboard/admin"
        : role === "EMPLOYER"
          ? "/dashboard/employer"
          : callbackUrl;

    router.push(roleTarget);
    router.refresh();
  }

  return (
    <form className="space-y-5" onSubmit={onSubmit}>
      <div>
        <label htmlFor="email" className="text-sm font-medium text-zinc-800">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@company.com"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium text-zinc-800">
          Mật khẩu
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className={inputClass}
        />
      </div>

      {error ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className={cn(
          "inline-flex h-11 w-full items-center justify-center rounded-md bg-[var(--primary)] px-4 text-sm font-semibold tracking-wide text-[var(--primary-foreground)] transition hover:opacity-92",
          pending && "cursor-not-allowed opacity-70"
        )}
      >
        {pending ? "Đang đăng nhập..." : "Đăng nhập"}
      </button>

      <p className="text-center text-sm text-zinc-600">
        Chưa có tài khoản?{" "}
        <Link href="/dang-ky" className="font-semibold text-[var(--primary)] hover:underline">
          Đăng ký NTD
        </Link>
      </p>
    </form>
  );
}
