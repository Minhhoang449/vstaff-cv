import { NextResponse } from "next/server";
import { runScheduledDeliveryJobs } from "@/lib/delivery-jobs";

export const runtime = "nodejs";

function authorized(req: Request) {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return process.env.NODE_ENV !== "production";
  const header = req.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

/** Cron: khớp & gửi CV cho lệnh lọc đang active trong khung giờ VN. */
export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runScheduledDeliveryJobs();
    return NextResponse.json(result);
  } catch (err) {
    console.error("[cron delivery-jobs]", err);
    return NextResponse.json({ error: "Cron failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  return GET(req);
}
