import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  EMPTY_COMPANY_PROFILE,
  getEmployerCompanyProfile,
  saveEmployerCompanyProfile,
  type EmployerCompanyProfile,
} from "@/lib/employer-profile";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const profile = await getEmployerCompanyProfile(session.user.id);
  const withEmail =
    profile.email || session.user.email
      ? { ...profile, email: profile.email || session.user.email || "" }
      : profile;

  return NextResponse.json({ profile: withEmail });
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await req.json().catch(() => null)) as EmployerCompanyProfile | null;
  if (!body) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  if (!body.companyName?.trim() || !body.slug?.trim() || !body.industry || !body.province) {
    return NextResponse.json(
      { error: "Thiếu tên công ty, đường dẫn, ngành hoặc tỉnh/thành." },
      { status: 400 }
    );
  }

  const saved = await saveEmployerCompanyProfile(session.user.id, {
    ...EMPTY_COMPANY_PROFILE,
    ...body,
  });

  return NextResponse.json({ profile: saved });
}
