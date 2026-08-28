import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getPublicOrderView } from "@/lib/payments/orders";
import { getOrderByCode } from "@/lib/payments/store";

type Params = Promise<{ code: string }>;

export async function GET(_req: Request, ctx: { params: Params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { code } = await ctx.params;
  const order = await getOrderByCode(code.toUpperCase());
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (order.employerId !== session.user.id && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ order: getPublicOrderView(order) });
}
