import "server-only";

import { isSupportedCvFilename } from "@/lib/cv/ingest";

const MAX_BYTES = 15 * 1024 * 1024;
const FETCH_TIMEOUT_MS = 45_000;

const EXT_FROM_MIME: Record<string, string> = {
  "image/png": ".png",
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/webp": ".webp",
  "application/pdf": ".pdf",
  "application/msword": ".doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/zip": ".zip",
};

function filenameFromUrl(url: string): string {
  try {
    const u = new URL(url);
    const base = decodeURIComponent(u.pathname.split("/").filter(Boolean).pop() || "cv");
    return base.split("?")[0] || "cv";
  } catch {
    return "cv";
  }
}

function ensureExt(name: string, contentType: string): string {
  if (isSupportedCvFilename(name)) return name;
  const mime = contentType.split(";")[0]?.trim().toLowerCase() || "";
  const ext = EXT_FROM_MIME[mime];
  if (ext) {
    const stem = name.replace(/\.[^.]+$/, "") || "cv";
    return `${stem}${ext}`;
  }
  if (!/\.[a-z0-9]+$/i.test(name)) return `${name}.png`;
  return name;
}

/** Server tải CV từ URL công khai (vd. Timviec365) — admin chỉ dán link. */
export async function fetchCvFromUrl(rawUrl: string): Promise<{
  buffer: Buffer;
  sourceFile: string;
}> {
  const url = rawUrl.trim();
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error("INVALID_URL");
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("INVALID_URL");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: {
        Accept: "image/*,application/pdf,*/*",
        "User-Agent": "VstaffCV-AdminExtract/1.0",
      },
    });
    if (!res.ok) throw new Error(`HTTP_${res.status}`);

    const contentType = res.headers.get("content-type") || "";
    const arr = await res.arrayBuffer();
    if (arr.byteLength === 0) throw new Error("EMPTY_DOCUMENT");
    if (arr.byteLength > MAX_BYTES) throw new Error("FILE_TOO_LARGE");

    const sourceFile = ensureExt(filenameFromUrl(url), contentType);
    if (!isSupportedCvFilename(sourceFile) && !contentType.startsWith("image/")) {
      throw new Error("UNSUPPORTED_TYPE");
    }

    return { buffer: Buffer.from(arr), sourceFile };
  } finally {
    clearTimeout(timer);
  }
}

export function parseCvUrlList(input: string | string[]): string[] {
  const lines = Array.isArray(input)
    ? input
    : input.split(/[\n,;]+/).map((s) => s.trim());
  const out: string[] = [];
  const seen = new Set<string>();
  for (const line of lines) {
    const u = line.trim();
    if (!u || u.startsWith("#")) continue;
    if (!/^https?:\/\//i.test(u)) continue;
    if (seen.has(u)) continue;
    seen.add(u);
    out.push(u);
  }
  return out;
}
