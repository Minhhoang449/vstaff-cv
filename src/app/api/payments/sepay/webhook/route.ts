import { NextResponse } from "next/server";
import { fulfillSePayWebhook } from "@/lib/payments/orders";
import { verifySePayRequest } from "@/lib/payments/sepay-verify";
import type { SePayWebhookPayload } from "@/lib/payments/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const rawBody = await req.text();
  if (!rawBody) {
    return NextResponse.json({ success: false, message: "Empty body" }, { status: 400 });
  }

  const verified = verifySePayRequest({
    rawBody,
    signatureHeader: req.headers.get("x-sepay-signature"),
    timestampHeader: req.headers.get("x-sepay-timestamp"),
    authorizationHeader: req.headers.get("authorization"),
  });

  if (!verified.ok) {
    return NextResponse.json(
      { success: false, message: verified.message },
      { status: verified.status }
    );
  }

  let payload: SePayWebhookPayload;
  try {
    payload = JSON.parse(rawBody) as SePayWebhookPayload;
  } catch {
    return NextResponse.json({ success: false, message: "Invalid JSON" }, { status: 400 });
  }

  const result = await fulfillSePayWebhook(payload);
  if (!result.ok) {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: result.status }
    );
  }

  // SePay yêu cầu đúng contract này
  return NextResponse.json({ success: true });
}
