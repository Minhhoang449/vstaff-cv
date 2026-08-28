"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Check, Copy, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatVnd, type EmployerPlan } from "@/data/employer-plans";
import { cn } from "@/lib/utils";

type PublicOrder = {
  id: string;
  code: string;
  planId: string;
  planName: string;
  amount: number;
  originalAmount?: number | null;
  promoCode?: string | null;
  status: "pending" | "paid" | "cancelled" | "expired";
  createdAt: string;
  paidAt: string | null;
  expiresAt: string;
  qrImageUrl: string | null;
  bank: {
    bankAccount: string;
    bankBin: string;
    accountName: string;
    bankName?: string;
    bankShortName?: string;
    configured: boolean;
  };
};

type Props = {
  plan: EmployerPlan;
  className?: string;
  highlight?: boolean;
  /** Mã KM đang áp dụng từ trang Bảng giá */
  promoCode?: string;
  /** Giá hiển thị trên nút (sau KM), nếu khác plan.price */
  displayAmount?: number;
  /** Free đã kích hoạt trong ngày — khóa nút */
  freeLockedToday?: boolean;
};

export function EmployerPlanCheckoutButton({
  plan,
  className,
  highlight,
  promoCode,
  displayAmount,
  freeLockedToday = false,
}: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [order, setOrder] = useState<PublicOrder | null>(null);
  const [copied, setCopied] = useState(false);

  const freeBlocked = plan.id === "free" && freeLockedToday;

  async function startCheckout() {
    if (freeBlocked) {
      setError(
        "Gói Free chỉ được kích hoạt 1 lần mỗi ngày. Vui lòng thử lại vào ngày mai hoặc chọn gói trả phí."
      );
      setOpen(true);
      return;
    }
    setPending(true);
    setError(null);
    setOrder(null);
    try {
      const res = await fetch("/api/payments/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: plan.id,
          ...(promoCode ? { promoCode } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Không tạo được đơn thanh toán");
        setOpen(true);
        return;
      }
      setOrder(data.order as PublicOrder);
      setOpen(true);
    } catch {
      setError("Lỗi mạng — thử lại.");
      setOpen(true);
    } finally {
      setPending(false);
    }
  }

  useEffect(() => {
    if (!open || !order || order.status !== "pending" || order.amount <= 0) return;

    const timer = window.setInterval(async () => {
      try {
        const res = await fetch(`/api/payments/orders/${order.code}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.order) setOrder(data.order as PublicOrder);
      } catch {
        // ignore poll errors
      }
    }, 3000);

    return () => window.clearInterval(timer);
  }, [open, order?.code, order?.status, order?.amount]);

  async function copyCode() {
    if (!order) return;
    await navigator.clipboard.writeText(order.code);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <>
      <button
        type="button"
        disabled={pending || freeBlocked}
        onClick={() => void startCheckout()}
        className={cn(
          "mt-8 inline-flex h-11 w-full items-center justify-center rounded-md text-sm font-semibold transition disabled:opacity-60",
          highlight
            ? "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-92"
            : "border border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)]/5",
          className
        )}
      >
        {pending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
            Đang tạo đơn…
          </>
        ) : freeBlocked ? (
          "Đã kích hoạt Free hôm nay"
        ) : plan.price === 0 ? (
          "Dùng Free"
        ) : promoCode && displayAmount != null && displayAmount !== plan.price ? (
          `Chọn gói · ${formatVnd(displayAmount)}`
        ) : (
          `Chọn gói ${plan.name}`
        )}
      </button>
      {freeBlocked ? (
        <p className="mt-2 text-center text-xs text-zinc-500">
          Free chỉ kích hoạt 1 lần/ngày. Quay lại vào ngày mai hoặc chọn gói trả phí.
        </p>
      ) : null}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent size="lg" className="overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {order?.status === "paid"
                ? "Thanh toán thành công"
                : plan.price === 0
                  ? "Kích hoạt gói Free"
                  : `Thanh toán gói ${plan.name}`}
            </DialogTitle>
            <DialogDescription>
              {order?.status === "paid"
                ? "Gói đã được ghi nhận. Bạn có thể dùng ngay các hạn mức tương ứng."
                : plan.price === 0
                  ? "Gói Free không cần thanh toán."
                  : order?.promoCode
                    ? `Đã áp dụng mã ${order.promoCode}. Quét VietQR hoặc chuyển khoản đúng số tiền và nội dung bên dưới.`
                    : "Quét VietQR hoặc chuyển khoản đúng số tiền và nội dung bên dưới. Hệ thống tự kích hoạt khi SePay nhận tiền."}
            </DialogDescription>
          </DialogHeader>

          {error ? (
            <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          {order && order.status === "paid" ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
                <Check className="h-4 w-4" aria-hidden />
                Đã kích hoạt · {order.planName}
              </p>
              <p className="mt-2 text-sm text-emerald-800/90">
                Mã đơn: <span className="font-mono font-semibold">{order.code}</span>
                {order.paidAt ? (
                  <>
                    {" "}
                    · {new Date(order.paidAt).toLocaleString("vi-VN")}
                  </>
                ) : null}
              </p>
            </div>
          ) : null}

          {order && order.status === "pending" && order.amount > 0 ? (
            <div className="grid gap-6 sm:grid-cols-[14rem_minmax(0,1fr)]">
              <div className="mx-auto w-full max-w-[14rem]">
                {order.qrImageUrl ? (
                  <Image
                    src={order.qrImageUrl}
                    alt="VietQR thanh toán"
                    width={224}
                    height={224}
                    unoptimized
                    className="h-auto w-full rounded-lg border border-zinc-200 bg-white"
                  />
                ) : (
                  <div className="flex aspect-square items-center justify-center rounded-lg border border-dashed border-zinc-300 text-center text-xs text-zinc-500">
                    Thiếu cấu hình ngân hàng để tạo QR
                  </div>
                )}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-2 rounded-lg bg-zinc-50 px-3 py-2">
                  <span className="text-zinc-500">Số tiền</span>
                  <span className="text-right">
                    {order.originalAmount != null &&
                    order.originalAmount > order.amount ? (
                      <span className="mr-2 text-xs text-zinc-400 line-through tabular-nums">
                        {formatVnd(order.originalAmount)}
                      </span>
                    ) : null}
                    <span className="font-semibold tabular-nums text-zinc-900">
                      {formatVnd(order.amount)}
                    </span>
                  </span>
                </div>
                {order.promoCode ? (
                  <div className="flex items-center justify-between gap-2 rounded-lg bg-[var(--accent)]/10 px-3 py-2 text-sm">
                    <span className="text-zinc-500">Mã KM</span>
                    <span className="font-mono font-semibold tracking-wide text-zinc-900">
                      {order.promoCode}
                    </span>
                  </div>
                ) : null}                <div className="rounded-lg bg-zinc-50 px-3 py-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-zinc-500">Nội dung CK</span>
                    <button
                      type="button"
                      onClick={() => void copyCode()}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--primary)]"
                    >
                      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Đã chép" : "Copy"}
                    </button>
                  </div>
                  <p className="mt-1 font-mono text-base font-semibold tracking-wide text-zinc-900">
                    {order.code}
                  </p>
                </div>
                {order.bank.configured ? (
                  <div className="space-y-1 rounded-lg border border-zinc-100 px-3 py-2 text-zinc-600">
                    <p>
                      Ngân hàng:{" "}
                      <span className="font-semibold text-zinc-900">
                        {order.bank.bankShortName || order.bank.bankName || "—"}
                      </span>
                    </p>
                    <p>
                      STK:{" "}
                      <span className="font-semibold text-zinc-900">{order.bank.bankAccount}</span>
                    </p>
                    <p>
                      Chủ TK:{" "}
                      <span className="font-semibold text-zinc-900">{order.bank.accountName}</span>
                    </p>
                    <p className="text-xs text-zinc-500">
                      BIN: {order.bank.bankBin}
                      {order.bank.bankName ? ` · ${order.bank.bankName}` : ""}
                    </p>
                  </div>
                ) : null}
                <p className="flex items-center gap-2 text-xs text-zinc-500">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                  Đang chờ SePay xác nhận thanh toán…
                </p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
