import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createDeliveryJob,
  DELIVERY_DAILY_CV_LIMIT,
  listDeliveryJobsForEmployer,
  type DeliverySlot,
} from "@/lib/delivery-jobs";

export const runtime = "nodejs";

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

export async function GET() {
  const gate = await requireEmployer();
  if ("error" in gate && gate.error) return gate.error;
  const jobs = await listDeliveryJobsForEmployer(gate.session!.user!.id!);
  return NextResponse.json({ jobs });
}

export async function POST(req: Request) {
  const gate = await requireEmployer();
  if ("error" in gate && gate.error) return gate.error;

  const body = (await req.json().catch(() => null)) as {
    position?: string;
    industryId?: string;
    provinceCode?: string;
    wardCode?: string;
    gender?: string;
    language?: string;
    ageRange?: string;
    delivery?: DeliverySlot;
    notes?: string;
  } | null;

  if (!body?.position?.trim() || !body.provinceCode || !body.delivery) {
    return NextResponse.json(
      { error: "Thiếu vị trí, địa điểm hoặc lịch nhận CV." },
      { status: 400 }
    );
  }

  try {
    const job = await createDeliveryJob({
      employerId: gate.session!.user!.id!,
      position: body.position,
      industryId: body.industryId,
      provinceCode: body.provinceCode,
      wardCode: body.wardCode,
      gender: body.gender,
      language: body.language,
      ageRange: body.ageRange,
      delivery: body.delivery,
      notes: body.notes,
    });
    return NextResponse.json({ job });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    if (message === "DAILY_LIMIT") {
      return NextResponse.json(
        {
          error: `Đã đạt giới hạn ${DELIVERY_DAILY_CV_LIMIT} CV/ngày cho danh sách gửi. Thử lại vào ngày mai.`,
        },
        { status: 429 }
      );
    }
    if (message === "QUOTA") {
      return NextResponse.json(
        { error: "Hết hạn mức CV của gói. Nâng gói hoặc đợi chu kỳ mới." },
        { status: 403 }
      );
    }
    if (message === "INVALID") {
      return NextResponse.json(
        { error: "Thiếu vị trí, địa điểm hoặc lịch nhận CV." },
        { status: 400 }
      );
    }
    console.error("[delivery job]", err);
    return NextResponse.json({ error: "Không tạo được lệnh lọc." }, { status: 500 });
  }
}
