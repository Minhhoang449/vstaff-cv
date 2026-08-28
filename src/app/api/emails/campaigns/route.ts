import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createAndSendCampaign,
  getCampaignsForEmployer,
  toPublicCampaign,
} from "@/lib/email/campaigns";
import { getMailPublicStatus, canSendEmail } from "@/lib/email/config";
import type { EmailAudience } from "@/lib/email/types";

function requireEmployer() {
  return auth().then((session) => {
    if (!session?.user?.id) {
      return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
    }
    if (session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN") {
      return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }
    return { session };
  });
}

export async function GET() {
  const gate = await requireEmployer();
  if ("error" in gate && gate.error) return gate.error;
  const session = gate.session!;
  const employerId = session.user.id as string;

  const campaigns = (await getCampaignsForEmployer(employerId)).map(toPublicCampaign);
  return NextResponse.json({
    smtp: getMailPublicStatus(),
    campaigns,
  });
}

export async function POST(req: Request) {
  const gate = await requireEmployer();
  if ("error" in gate && gate.error) return gate.error;
  const session = gate.session!;
  const employerId = session.user.id as string;

  if (!canSendEmail()) {
    return NextResponse.json(
      {
        error:
          "Chưa cấu hình SMTP. Tạm dùng EMAIL_DEV_MODE=1 trong .env.local để test (Ethereal), hoặc điền SMTP_*.",
      },
      { status: 503 }
    );
  }

  const body = (await req.json().catch(() => null)) as {
    subject?: string;
    body?: string;
    fromName?: string;
    audience?: EmailAudience;
    openedWithin?: string;
    testMode?: boolean;
    testToEmail?: string;
    companyName?: string;
  } | null;

  if (!body?.subject?.trim() || !body?.body?.trim()) {
    return NextResponse.json({ error: "Tiêu đề và nội dung là bắt buộc." }, { status: 400 });
  }

  const audience = (body.audience || "opened") as EmailAudience;
  if (audience !== "opened" && audience !== "list" && audience !== "saved") {
    return NextResponse.json({ error: "Đối tượng nhận không hợp lệ." }, { status: 400 });
  }

  try {
    const campaign = await createAndSendCampaign({
      employerId,
      employerEmail: session.user.email ?? "",
      companyName: body.companyName,
      subject: body.subject,
      body: body.body,
      fromName: body.fromName ?? "",
      audience,
      openedWithin: body.openedWithin,
      testMode: Boolean(body.testMode),
      testToEmail: body.testToEmail,
    });

    return NextResponse.json({
      campaign: toPublicCampaign(campaign),
      smtp: getMailPublicStatus(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    if (message === "SMTP_NOT_CONFIGURED") {
      return NextResponse.json(
        { error: "Chưa cấu hình SMTP. Xem .env.example." },
        { status: 503 }
      );
    }
    if (message === "SUBJECT_BODY_REQUIRED") {
      return NextResponse.json({ error: "Tiêu đề và nội dung là bắt buộc." }, { status: 400 });
    }
    // User-facing resolve errors
    if (
      message.includes("chưa hỗ trợ") ||
      message.includes("Không có") ||
      message.includes("không hợp lệ")
    ) {
      return NextResponse.json({ error: message }, { status: 400 });
    }
    console.error("[email] campaign send failed", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
