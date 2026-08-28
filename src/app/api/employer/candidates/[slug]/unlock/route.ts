import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCandidateBySlug } from "@/lib/candidates";
import { unlockCandidateContact } from "@/lib/employer-unlocks";

export const runtime = "nodejs";

type Params = Promise<{ slug: string }>;

/** NTD mở liên hệ hồ sơ — trừ 1 CV trong hạn mức gói. */
export async function POST(_req: Request, { params }: { params: Params }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "EMPLOYER" && session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { slug } = await params;
  const candidate = await getCandidateBySlug(slug);
  if (!candidate) {
    return NextResponse.json({ error: "Không tìm thấy ứng viên." }, { status: 404 });
  }

  // ADMIN xem không trừ điểm
  if (session.user.role === "ADMIN") {
    return NextResponse.json({
      unlocked: true,
      alreadyUnlocked: true,
      deducted: false,
      subscription: null,
    });
  }

  const result = await unlockCandidateContact(session.user.id, candidate.id);
  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, code: result.code },
      { status: result.code === "NO_QUOTA" ? 402 : 400 }
    );
  }

  return NextResponse.json({
    unlocked: true,
    alreadyUnlocked: result.alreadyUnlocked,
    deducted: !result.alreadyUnlocked,
    phone: candidate.phone,
    email: candidate.email,
    subscription: result.subscription,
  });
}
