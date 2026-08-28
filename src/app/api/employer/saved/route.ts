import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCandidateBySlug } from "@/lib/candidates";
import {
  isCandidateSaved,
  saveCandidateForEmployer,
  unsaveCandidateForEmployer,
} from "@/lib/saved-candidates";

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

export async function POST(req: Request) {
  const gate = await requireEmployer();
  if ("error" in gate && gate.error) return gate.error;
  const employerId = gate.session!.user!.id!;

  const body = (await req.json().catch(() => null)) as {
    slug?: string;
    candidateId?: string;
  } | null;

  const slug = body?.slug?.trim();
  if (!slug) {
    return NextResponse.json({ error: "Thiếu slug ứng viên." }, { status: 400 });
  }

  const candidate = await getCandidateBySlug(slug, { employerId });
  if (!candidate) {
    return NextResponse.json({ error: "Không tìm thấy ứng viên." }, { status: 404 });
  }

  const saved = await saveCandidateForEmployer(employerId, candidate);
  return NextResponse.json({ ok: true, saved });
}

export async function DELETE(req: Request) {
  const gate = await requireEmployer();
  if ("error" in gate && gate.error) return gate.error;
  const employerId = gate.session!.user!.id!;

  const url = new URL(req.url);
  let candidateId = url.searchParams.get("candidateId")?.trim() || "";
  const slug = url.searchParams.get("slug")?.trim() || "";

  if (!candidateId && slug) {
    const candidate = await getCandidateBySlug(slug, { employerId });
    if (!candidate) {
      return NextResponse.json({ error: "Không tìm thấy ứng viên." }, { status: 404 });
    }
    candidateId = candidate.id;
  }

  if (!candidateId) {
    return NextResponse.json({ error: "Thiếu candidateId hoặc slug." }, { status: 400 });
  }

  await unsaveCandidateForEmployer(employerId, candidateId);
  return NextResponse.json({ ok: true });
}

export async function GET(req: Request) {
  const gate = await requireEmployer();
  if ("error" in gate && gate.error) return gate.error;
  const employerId = gate.session!.user!.id!;
  const slug = new URL(req.url).searchParams.get("slug")?.trim();
  if (!slug) {
    return NextResponse.json({ error: "Thiếu slug." }, { status: 400 });
  }
  const candidate = await getCandidateBySlug(slug, { employerId });
  if (!candidate) {
    return NextResponse.json({ saved: false });
  }
  const saved = await isCandidateSaved(employerId, candidate.id);
  return NextResponse.json({ saved });
}
