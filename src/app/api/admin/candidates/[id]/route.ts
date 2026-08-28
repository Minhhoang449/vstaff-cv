import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteCandidate } from "@/lib/candidates";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function DELETE(_req: Request, ctx: Ctx) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await ctx.params;
  const candidateId = id?.trim();
  if (!candidateId) {
    return NextResponse.json({ error: "Thiếu id ứng viên." }, { status: 400 });
  }

  try {
    const ok = await deleteCandidate(candidateId);
    if (!ok) {
      return NextResponse.json({ error: "Không tìm thấy hồ sơ." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[admin/candidates DELETE]", err);
    return NextResponse.json({ error: "Không xóa được hồ sơ." }, { status: 500 });
  }
}
