import "server-only";

import JSZip from "jszip";
import mammoth from "mammoth";
import { extractText, getDocumentProxy, renderPageAsImage } from "unpdf";

export type IngestedCv =
  | { kind: "image"; buffer: Buffer; sourceFile: string }
  | { kind: "text"; text: string; sourceFile: string };

const IMAGE_RE = /\.(png|jpe?g|webp)$/i;
const PDF_RE = /\.pdf$/i;
const DOCX_RE = /\.docx$/i;
const DOC_RE = /\.doc$/i;
const ZIP_RE = /\.zip$/i;

export function isSupportedCvFilename(name: string) {
  return (
    IMAGE_RE.test(name) ||
    PDF_RE.test(name) ||
    DOCX_RE.test(name) ||
    DOC_RE.test(name) ||
    ZIP_RE.test(name)
  );
}

function baseName(sourceFile: string) {
  return sourceFile.includes(":")
    ? sourceFile.slice(sourceFile.lastIndexOf(":") + 1)
    : sourceFile;
}

async function ingestPdf(buffer: Buffer, sourceFile: string): Promise<IngestedCv> {
  // Dùng PDF.js serverless build kèm theo unpdf (worker đã inline) —
  // tránh lỗi Next.js không resolve được pdf.worker.mjs từ pdfjs-dist.
  const data = new Uint8Array(buffer);
  const pdf = await getDocumentProxy(data);
  const { text, totalPages } = await extractText(pdf, { mergePages: true });
  const plain = (Array.isArray(text) ? text.join("\n") : String(text || "")).trim();

  if (plain.replace(/\s+/g, " ").length >= 180) {
    return { kind: "text", text: plain.slice(0, 40000), sourceFile };
  }

  // Scan PDF: render trang đầu để Vision đọc
  const rendered = await renderPageAsImage(data, 1, {
    canvasImport: () => import("@napi-rs/canvas"),
    scale: 2,
  });
  return { kind: "image", buffer: Buffer.from(rendered as ArrayBuffer), sourceFile };
}

async function ingestDocx(buffer: Buffer, sourceFile: string): Promise<IngestedCv> {
  const textResult = await mammoth.extractRawText({ buffer });
  const plain = (textResult.value || "").trim();
  if (!plain) throw new Error("EMPTY_DOCUMENT");
  return { kind: "text", text: plain.slice(0, 40000), sourceFile };
}

async function ingestDoc(buffer: Buffer, sourceFile: string): Promise<IngestedCv> {
  const { createRequire } = await import("node:module");
  const require = createRequire(import.meta.url);
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const WordExtractor = require("word-extractor") as new () => {
    extract: (input: Buffer | string) => Promise<{ getBody: () => string }>;
  };
  const extractor = new WordExtractor();
  const doc = await extractor.extract(buffer);
  const plain = (doc.getBody() || "").trim();
  if (!plain) throw new Error("EMPTY_DOCUMENT");
  return { kind: "text", text: plain.slice(0, 40000), sourceFile };
}

async function expandZip(buffer: Buffer, zipName: string): Promise<IngestedCv[]> {
  const zip = await JSZip.loadAsync(buffer);
  const out: IngestedCv[] = [];
  const entries = Object.values(zip.files).filter((f) => {
    if (f.dir) return false;
    const leaf = f.name.split("/").pop() || f.name;
    if (f.name.startsWith("__MACOSX") || leaf.startsWith(".")) return false;
    return isSupportedCvFilename(leaf) && !ZIP_RE.test(leaf);
  });

  for (const entry of entries) {
    const leaf = entry.name.split("/").pop() || entry.name;
    const buf = Buffer.from(await entry.async("uint8array"));
    const nested = await ingestSingleFile(buf, `${zipName}:${leaf}`);
    out.push(...nested);
  }
  return out;
}

async function ingestSingleFile(buffer: Buffer, sourceFile: string): Promise<IngestedCv[]> {
  const name = baseName(sourceFile);

  if (ZIP_RE.test(name)) return expandZip(buffer, name);
  if (IMAGE_RE.test(name)) return [{ kind: "image", buffer, sourceFile }];
  if (PDF_RE.test(name)) return [await ingestPdf(buffer, sourceFile)];
  if (DOCX_RE.test(name)) return [await ingestDocx(buffer, sourceFile)];
  if (DOC_RE.test(name)) return [await ingestDoc(buffer, sourceFile)];
  throw new Error("UNSUPPORTED_TYPE");
}

export async function ingestCvUpload(
  buffer: Buffer,
  sourceFile: string
): Promise<IngestedCv[]> {
  return ingestSingleFile(buffer, sourceFile);
}
