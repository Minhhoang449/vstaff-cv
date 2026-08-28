import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getMailPublicStatus } from "@/lib/email/config";

/** Trạng thái SMTP công khai cho UI soạn email. */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return NextResponse.json({ smtp: getMailPublicStatus() });
}
