import { NextResponse } from "next/server";
import { renderToBuffer, type DocumentProps } from "@react-pdf/renderer";
import { createElement, type ReactElement } from "react";
import { auth } from "@/auth";
import { VstaffCvPdf } from "@/components/cv/vstaff-cv-templates-pdf";
import { getCandidateBySlug } from "@/lib/candidates";
import { cvPdfFilename, toVstaffCvDocumentData } from "@/lib/cv/cv-document-data";
import { registerCvPdfFonts } from "@/lib/cv/register-cv-fonts";
import { isCandidateContactUnlocked, maskContactOnCvData } from "@/lib/employer-unlocks";

export const runtime = "nodejs";

type Params = Promise<{ slug: string }>;

export async function GET(_req: Request, { params }: { params: Params }) {
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

  const reveal =
    session.user.role === "ADMIN" ||
    (await isCandidateContactUnlocked(session.user.id, candidate.id));

  registerCvPdfFonts();
  const data = maskContactOnCvData(toVstaffCvDocumentData(candidate), reveal);
  const doc = createElement(VstaffCvPdf, {
    data,
  }) as unknown as ReactElement<DocumentProps>;
  const buffer = await renderToBuffer(doc);
  const filename = cvPdfFilename(candidate.fullName);

  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
