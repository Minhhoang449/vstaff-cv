import { NextResponse } from "next/server";
import { findAppUserByEmail, upsertAppUser } from "@/lib/users-auth";
import { getSystemSettings } from "@/lib/system-settings";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const settings = await getSystemSettings();
  if (!settings.allowEmployerSignup) {
    return NextResponse.json(
      { error: "Đăng ký nhà tuyển dụng đang tạm đóng." },
      { status: 403 }
    );
  }
  if (settings.maintenance) {
    return NextResponse.json(
      { error: "Hệ thống đang bảo trì. Vui lòng thử lại sau." },
      { status: 503 }
    );
  }

  const body = (await req.json().catch(() => null)) as {
    company?: string;
    email?: string;
    password?: string;
  } | null;

  const company = body?.company?.trim() || "";
  const email = body?.email?.trim().toLowerCase() || "";
  const password = body?.password || "";

  if (!company || !email || password.length < 6) {
    return NextResponse.json(
      { error: "Vui lòng điền đủ thông tin (mật khẩu tối thiểu 6 ký tự)." },
      { status: 400 }
    );
  }

  try {
    const existing = await findAppUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: "Email đã được sử dụng." }, { status: 409 });
    }

    const user = await upsertAppUser({
      email,
      password,
      name: company,
      role: "EMPLOYER",
      company,
    });
    return NextResponse.json({
      ok: true,
      user: { id: user.uid, email: user.email, role: user.role },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes("email-already-exists") || msg.includes("EMAIL_EXISTS")) {
      return NextResponse.json({ error: "Email đã được sử dụng." }, { status: 409 });
    }
    console.error("[register]", err);
    return NextResponse.json({ error: "Không tạo được tài khoản." }, { status: 500 });
  }
}
