import { NextResponse } from "next/server";
import { auth } from "@/auth";
import type { EmployerPlan } from "@/data/employer-plans";
import { listServicePlans, saveServicePlans } from "@/lib/service-plans";

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
  const plans = await listServicePlans();
  return NextResponse.json({ plans });
}

export async function PUT(req: Request) {
  const gate = await requireAdmin();
  if ("error" in gate && gate.error) return gate.error;

  const body = (await req.json().catch(() => null)) as { plans?: EmployerPlan[] } | null;
  if (!body?.plans?.length) {
    return NextResponse.json({ error: "Thiếu danh sách gói" }, { status: 400 });
  }

  for (const p of body.plans) {
    if (!p.id || !p.name?.trim() || !p.durationLabel?.trim() || !p.cvLimitLabel?.trim()) {
      return NextResponse.json({ error: "Mỗi gói cần id, tên, nhãn thời hạn và hạn mức" }, { status: 400 });
    }
  }

  const plans = await saveServicePlans(body.plans);
  return NextResponse.json({ plans });
}
