import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteEmailCampaign, getEmailCampaignById } from "@/lib/email/store";
import { toPublicCampaign } from "@/lib/email/campaigns";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const campaign = await getEmailCampaignById(id);
  if (!campaign) {
    return NextResponse.json({ error: "Không tìm thấy chiến dịch." }, { status: 404 });
  }
  if (session.user.role === "EMPLOYER" && campaign.employerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({
    campaign: {
      ...toPublicCampaign(campaign),
      body: campaign.body,
    },
  });
}

export async function DELETE(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const employerId = session.user.role === "ADMIN" ? undefined : (session.user.id as string);
  const ok = await deleteEmailCampaign(id, employerId);
  if (!ok) {
    return NextResponse.json({ error: "Không tìm thấy chiến dịch." }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
