import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  deleteDeliveryJob,
  setDeliveryJobStatus,
  type DeliveryJobStatus,
} from "@/lib/delivery-jobs";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

async function requireEmployer() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN") {
    return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { session };
}

export async function PATCH(req: Request, ctx: Ctx) {
  const gate = await requireEmployer();
  if ("error" in gate && gate.error) return gate.error;
  const { id } = await ctx.params;
  const body = (await req.json().catch(() => null)) as { status?: DeliveryJobStatus } | null;
  if (!body?.status || !["active", "paused", "ended"].includes(body.status)) {
    return NextResponse.json({ error: "Trạng thái không hợp lệ." }, { status: 400 });
  }
  try {
    const job = await setDeliveryJobStatus(gate.session!.user!.id!, id, body.status);
    return NextResponse.json({ job });
  } catch {
    return NextResponse.json({ error: "Không tìm thấy lệnh lọc." }, { status: 404 });
  }
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const gate = await requireEmployer();
  if ("error" in gate && gate.error) return gate.error;
  const { id } = await ctx.params;
  try {
    await deleteDeliveryJob(gate.session!.user!.id!, id);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Không tìm thấy lệnh lọc." }, { status: 404 });
  }
}
