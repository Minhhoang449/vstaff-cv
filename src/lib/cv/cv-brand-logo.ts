import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * Logo PDF-safe (JPEG, nền trắng) — PNG alpha thường không hiện trong @react-pdf.
 * Nhúng base64 để không phụ thuộc cwd lúc render.
 */
let cached: string | null = null;

export function getCvBrandLogoSrc(): string {
  if (cached) return cached;
  const path = join(process.cwd(), "public", "brand", "vstaff-mark-pdf.jpg");
  const buf = readFileSync(path);
  cached = `data:image/jpeg;base64,${buf.toString("base64")}`;
  return cached;
}
