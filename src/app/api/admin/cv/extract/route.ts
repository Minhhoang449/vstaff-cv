import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isOpenAiConfigured } from "@/lib/cv/config";
import { extractCandidatesFromUpload } from "@/lib/cv/extract";
import { fetchCvFromUrl, parseCvUrlList } from "@/lib/cv/fetch-url";
import { isSupportedCvFilename } from "@/lib/cv/ingest";
import { importCandidateUploads } from "@/lib/candidates-import";
import type { CandidateUploadItem } from "@/data/candidate-upload-schema";

export const runtime = "nodejs";
export const maxDuration = 300;

const MAX_FILES = 40;
const MAX_BYTES = 15 * 1024 * 1024;
const CONCURRENCY = 3;

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  worker: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let next = 0;

  async function run() {
    while (next < items.length) {
      const i = next++;
      results[i] = await worker(items[i]!, i);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => run())
  );
  return results;
}

type JobResult =
  | { ok: true; candidates: CandidateUploadItem[]; file: string }
  | { ok: false; file: string; error: string };

function friendlyExtractError(message: string) {
  if (message === "OPENAI_NOT_CONFIGURED") return "Thiếu API key";
  if (message === "OPENAI_EMPTY_RESPONSE" || message === "OPENAI_INVALID_JSON") {
    return "Model không trả JSON hợp lệ";
  }
  if (message === "UNSUPPORTED_TYPE") return "Định dạng không hỗ trợ";
  if (message === "EMPTY_DOCUMENT") return "File trống / không đọc được";
  if (message === "INVALID_URL") return "URL không hợp lệ";
  if (message === "FILE_TOO_LARGE") return "File quá lớn (max 15MB)";
  if (message.startsWith("HTTP_")) return `Không tải được link (${message})`;
  if (message === "AbortError") return "Hết thời gian tải link";
  if (message.includes("fake worker") || message.includes("pdf.worker")) {
    return "Lỗi đọc PDF (worker). Thử restart server hoặc dùng ảnh PNG/JPG.";
  }
  return "Không trích xuất được";
}

async function extractFromBuffer(buffer: Buffer, sourceFile: string): Promise<JobResult> {
  try {
    if (buffer.byteLength > MAX_BYTES) {
      return { ok: false, file: sourceFile, error: "File quá lớn (max 15MB)." };
    }
    if (!isSupportedCvFilename(sourceFile)) {
      return {
        ok: false,
        file: sourceFile,
        error: "Định dạng không hỗ trợ. Dùng PNG/JPG/PDF/DOC/DOCX/ZIP.",
      };
    }
    const { candidates } = await extractCandidatesFromUpload({
      buffer,
      sourceFile,
    });
    if (!candidates.length) {
      return { ok: false, file: sourceFile, error: "Không trích xuất được hồ sơ." };
    }
    return { ok: true, candidates, file: sourceFile };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Extract failed";
    console.error("[cv/extract]", sourceFile, err);
    return { ok: false, file: sourceFile, error: friendlyExtractError(message) };
  }
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!isOpenAiConfigured()) {
    return NextResponse.json(
      {
        error:
          "Chưa cấu hình OPENROUTER_API_KEY (hoặc OPENAI_API_KEY) trong .env.local. Restart npm run dev sau khi thêm.",
      },
      { status: 503 }
    );
  }

  const contentType = req.headers.get("content-type") || "";
  let files: File[] = [];
  let urls: string[] = [];

  if (contentType.includes("application/json")) {
    const body = (await req.json().catch(() => null)) as {
      urls?: string | string[];
    } | null;
    urls = parseCvUrlList(body?.urls ?? []);
  } else {
    const form = await req.formData().catch(() => null);
    if (!form) {
      return NextResponse.json({ error: "Form data không hợp lệ." }, { status: 400 });
    }
    files = form
      .getAll("files")
      .filter((f): f is File => typeof File !== "undefined" && f instanceof File);
    const urlFields = form
      .getAll("urls")
      .map((v) => String(v))
      .filter(Boolean);
    urls = parseCvUrlList(urlFields.length ? urlFields : String(form.get("urls") || ""));
  }

  if (files.length === 0 && urls.length === 0) {
    return NextResponse.json(
      { error: "Chưa chọn file CV hoặc dán link ảnh/PDF." },
      { status: 400 }
    );
  }
  if (files.length + urls.length > MAX_FILES) {
    return NextResponse.json(
      { error: `Tối đa ${MAX_FILES} CV mỗi lần (file + link).` },
      { status: 400 }
    );
  }

  const fileJobs = await mapPool(files, CONCURRENCY, async (file) => {
    const name = file.name || "cv.bin";
    if (file.size > MAX_BYTES) {
      return { ok: false as const, file: name, error: "File quá lớn (max 15MB)." };
    }
    if (!isSupportedCvFilename(name) && !(file.type || "").startsWith("image/")) {
      return {
        ok: false as const,
        file: name,
        error: "Định dạng không hỗ trợ. Dùng PNG/JPG/PDF/DOC/DOCX/ZIP.",
      };
    }
    const buf = Buffer.from(await file.arrayBuffer());
    return extractFromBuffer(buf, name);
  });

  const urlJobs = await mapPool(urls, CONCURRENCY, async (url) => {
    const label = url.length > 80 ? `${url.slice(0, 77)}…` : url;
    try {
      const fetched = await fetchCvFromUrl(url);
      return extractFromBuffer(fetched.buffer, fetched.sourceFile);
    } catch (err) {
      const message = err instanceof Error ? err.message : "FETCH_FAILED";
      console.error("[cv/extract/url]", url, err);
      return {
        ok: false as const,
        file: label,
        error: friendlyExtractError(message === "AbortError" ? "AbortError" : message),
      };
    }
  });

  const candidates: CandidateUploadItem[] = [];
  const errors: { file: string; error: string }[] = [];

  for (const job of [...fileJobs, ...urlJobs] as JobResult[]) {
    if (job.ok) candidates.push(...job.candidates);
    else errors.push({ file: job.file, error: job.error });
  }

  let imported = 0;
  let importSource: string | null = null;
  if (candidates.length > 0) {
    const result = await importCandidateUploads(candidates);
    imported = result.imported;
    importSource = result.source;
  }

  return NextResponse.json({
    candidates,
    errors,
    imported,
    importSource,
    payload: { candidates },
  });
}
