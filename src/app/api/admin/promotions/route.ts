import { NextResponse } from "next/server";
import { auth } from "@/auth";
import type { AdminPromoRow } from "@/lib/admin/business-types";
import { listAdminPromotions, upsertPromotion } from "@/lib/promotions";

export const runtime = "nodejs";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  if (session.user.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session };
}

export async function GET() {
  const gate = await requireAdmin();
  if ("error" in gate && gate.error) return gate.error;
  const promotions = await listAdminPromotions();
  return NextResponse.json({ promotions });
}

export async function PUT(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate && gate.error) return gate.error;

  const body = (await req.json().catch(() => null)) as AdminPromoRow | null;
  if (!body?.code?.trim() || !body.title?.trim() || !body.discountLabel?.trim() || !body.expiresAt) {
    return NextResponse.json({ error: "Thiếu mã, tiêu đề, ưu đãi hoặc ngày hết hạn" }, { status: 400 });
  }

  const promotion = await upsertPromotion(body);
  return NextResponse.json({ promotion });
}
