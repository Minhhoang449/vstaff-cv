import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { parseCandidateUploadJson } from "@/data/candidate-upload-schema";
import { importCandidateUploads } from "@/lib/candidates-import";

export const runtime = "nodejs";

/** Import thủ công từ JSON đã chỉnh (khi không qua upload CV). */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  const raw =
    typeof body?.raw === "string"
      ? body.raw
      : body?.candidates
        ? JSON.stringify(body)
        : null;

  if (!raw) {
    return NextResponse.json({ error: "Thiếu JSON candidates." }, { status: 400 });
  }

  const parsed = parseCandidateUploadJson(raw);
  if (!parsed.ok || parsed.items.length === 0) {
    return NextResponse.json(
      { error: "JSON không hợp lệ.", errors: parsed.errors },
      { status: 400 }
    );
  }

  const result = await importCandidateUploads(parsed.items);
  return NextResponse.json({
    imported: result.imported,
    source: result.source,
    slugs: result.profiles.map((p) => p.slug),
  });
}
