import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createPaymentOrder,
  activateFreePlan,
  getPublicOrderView,
} from "@/lib/payments/orders";
import { isSePayCheckoutConfigured } from "@/lib/payments/config";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as {
    planId?: string;
    promoCode?: string;
  } | null;
  const planId = body?.planId;
  if (!planId) {
    return NextResponse.json({ error: "planId is required" }, { status: 400 });
  }

  try {
    if (planId === "free") {
      const order = await activateFreePlan({
        employerId: session.user.id,
        employerEmail: session.user.email ?? "",
      });
      return NextResponse.json({ order: getPublicOrderView(order) });
    }

    if (!isSePayCheckoutConfigured()) {
      return NextResponse.json(
        {
          error:
            "Chưa cấu hình SePay (SEPAY_BANK_ACCOUNT, SEPAY_BANK_BIN). Xem .env.example.",
        },
        { status: 503 }
      );
    }

    const result = await createPaymentOrder({
      employerId: session.user.id,
      employerEmail: session.user.email ?? "",
      planId,
      promoCode: body?.promoCode,
    });

    return NextResponse.json({
      order: getPublicOrderView(result.order),
      qrImageUrl: result.qrImageUrl,
      bank: result.bank,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "INVALID_PLAN") {
      return NextResponse.json({ error: "Gói không hợp lệ" }, { status: 400 });
    }
    if (message === "FREE_DAILY_LIMIT") {
      return NextResponse.json(
        {
          error:
            "Gói Free chỉ được kích hoạt 1 lần mỗi ngày. Vui lòng thử lại vào ngày mai hoặc chọn gói trả phí.",
        },
        { status: 429 }
      );
    }
    if (message === "INVALID_PROMO") {
      return NextResponse.json(
        { error: "Mã khuyến mãi không hợp lệ hoặc đã hết hạn" },
        { status: 400 }
      );
    }
    if (message === "PROMO_PLAN_MISMATCH") {
      return NextResponse.json(
        { error: "Mã khuyến mãi không áp dụng cho gói này" },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
