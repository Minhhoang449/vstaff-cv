import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  deleteAdminEmployer,
  updateAdminEmployer,
  type UpdateEmployerInput,
} from "@/lib/admin-employers";

export const runtime = "nodejs";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (session.user.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session };
}

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, ctx: Ctx) {
  const gate = await requireAdmin();
  if ("error" in gate && gate.error) return gate.error;
  const { id } = await ctx.params;

  const body = (await req.json().catch(() => null)) as UpdateEmployerInput | null;
  if (!body?.company?.trim() || !body?.email?.trim() || !body?.planId) {
    return NextResponse.json(
      { error: "Thiếu công ty, email hoặc gói." },
      { status: 400 }
    );
  }
  if (body.password && body.password.length < 6) {
    return NextResponse.json(
      { error: "Mật khẩu mới tối thiểu 6 ký tự." },
      { status: 400 }
    );
  }

  try {
    const employer = await updateAdminEmployer(id, {
      company: body.company,
      email: body.email,
      phone: body.phone,
      accountStatus: body.accountStatus === "suspended" ? "suspended" : "active",
      planId: body.planId,
      password: body.password,
    });
    return NextResponse.json({ employer });
  } catch (err) {
    const code = err instanceof Error ? err.message : "";
    if (code === "NOT_FOUND") {
      return NextResponse.json({ error: "Không tìm thấy NTD." }, { status: 404 });
    }
    if (code === "EMAIL_EXISTS") {
      return NextResponse.json({ error: "Email đã được sử dụng." }, { status: 409 });
    }
    console.error("[admin employer put]", err);
    return NextResponse.json({ error: "Không cập nhật được." }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const gate = await requireAdmin();
  if ("error" in gate && gate.error) return gate.error;
  const { id } = await ctx.params;

  try {
    await deleteAdminEmployer(id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const code = err instanceof Error ? err.message : "";
    if (code === "NOT_FOUND") {
      return NextResponse.json({ error: "Không tìm thấy NTD." }, { status: 404 });
    }
    console.error("[admin employer delete]", err);
    return NextResponse.json({ error: "Không xóa được." }, { status: 500 });
  }
}
