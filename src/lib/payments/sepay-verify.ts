import { createHmac, timingSafeEqual } from "node:crypto";
import { getSePayConfig } from "@/lib/payments/config";

/** Xác thực webhook SePay: HMAC-SHA256 (khuyến nghị) hoặc API Key. */
export function verifySePayRequest(opts: {
  rawBody: string;
  signatureHeader: string | null;
  timestampHeader: string | null;
  authorizationHeader: string | null;
}): { ok: true } | { ok: false; status: number; message: string } {
  const { webhookSecret, apiKey } = getSePayConfig();

  // API Key mode
  if (apiKey) {
    const auth = opts.authorizationHeader || "";
    const expected = `Apikey ${apiKey}`;
    if (auth === expected || auth === `Bearer ${apiKey}`) {
      return { ok: true };
    }
    // If only API key configured and HMAC headers missing, reject
    if (!webhookSecret) {
      return { ok: false, status: 401, message: "Invalid API key" };
    }
  }

  // HMAC mode
  if (!webhookSecret) {
    // Dev fallback: allow unsigned only when explicitly enabled
    if (process.env.SEPAY_ALLOW_INSECURE_WEBHOOK === "1") {
      return { ok: true };
    }
    return { ok: false, status: 500, message: "SEPAY_WEBHOOK_SECRET is not configured" };
  }

  const signature = opts.signatureHeader || "";
  const timestamp = Number(opts.timestampHeader || 0);
  if (!signature || !timestamp) {
    return { ok: false, status: 401, message: "Missing signature headers" };
  }

  if (Math.abs(Date.now() / 1000 - timestamp) > 300) {
    return { ok: false, status: 401, message: "Request expired" };
  }

  const expected =
    "sha256=" +
    createHmac("sha256", webhookSecret).update(`${timestamp}.${opts.rawBody}`).digest("hex");

  try {
    const a = Buffer.from(signature);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return { ok: false, status: 401, message: "Invalid signature" };
    }
  } catch {
    return { ok: false, status: 401, message: "Invalid signature" };
  }

  return { ok: true };
}
