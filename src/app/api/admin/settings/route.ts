import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getSystemSettings,
  saveSystemSettings,
} from "@/lib/system-settings";
import type { SystemSettings } from "@/lib/system-settings-types";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const settings = await getSystemSettings();
  return NextResponse.json({ settings });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as SystemSettings | null;
  if (!body?.siteName?.trim() || !body.supportEmail?.trim()) {
    return NextResponse.json(
      { error: "Thiếu tên nền tảng hoặc email hỗ trợ." },
      { status: 400 }
    );
  }

  const settings = await saveSystemSettings({
    siteName: body.siteName,
    supportEmail: body.supportEmail,
    supportPhone: body.supportPhone || "",
    allowEmployerSignup: Boolean(body.allowEmployerSignup),
    maintenance: Boolean(body.maintenance),
  });

  return NextResponse.json({ settings });
}
