import "server-only";

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";

export type PhotoBox = {
  /** Percent 0–100 of image width/height */
  x: number;
  y: number;
  w: number;
  h: number;
};

const AVATAR_DIR = join(process.cwd(), "public", "uploads", "avatars");

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Crop avatar from CV image. Prefer model photoBox; else top-left template (Timviec365-style). */
export async function cropCandidateAvatar(
  imageBuffer: Buffer,
  photoBox?: PhotoBox | null
): Promise<{ buffer: Buffer; avatarUrl: string } | null> {
  const meta = await sharp(imageBuffer).metadata();
  const width = meta.width ?? 0;
  const height = meta.height ?? 0;
  if (width < 40 || height < 40) return null;

  let left: number;
  let top: number;
  let size: number;

  if (
    photoBox &&
    photoBox.w > 2 &&
    photoBox.h > 2 &&
    photoBox.x >= 0 &&
    photoBox.y >= 0
  ) {
    left = Math.round((clamp(photoBox.x, 0, 100) / 100) * width);
    top = Math.round((clamp(photoBox.y, 0, 100) / 100) * height);
    const boxW = Math.round((clamp(photoBox.w, 1, 100) / 100) * width);
    const boxH = Math.round((clamp(photoBox.h, 1, 100) / 100) * height);
    size = Math.max(boxW, boxH);
    const pad = Math.round(size * 0.12);
    left = clamp(left - pad, 0, width - 1);
    top = clamp(top - pad, 0, height - 1);
    size = clamp(size + pad * 2, 24, Math.min(width - left, height - top));
  } else {
    size = Math.round(Math.min(width, height) * 0.18);
    left = Math.round(width * 0.04);
    top = Math.round(height * 0.035);
    size = clamp(size, 48, Math.min(width - left, height - top));
  }

  const cropped = await sharp(imageBuffer)
    .extract({ left, top, width: size, height: size })
    .resize(400, 400, { fit: "cover" })
    .webp({ quality: 85 })
    .toBuffer();

  mkdirSync(AVATAR_DIR, { recursive: true });
  const filename = `${randomUUID()}.webp`;
  writeFileSync(join(AVATAR_DIR, filename), cropped);

  return {
    buffer: cropped,
    avatarUrl: `/uploads/avatars/${filename}`,
  };
}

/** Downscale CV for Vision to cut tokens. */
export async function prepareCvImageForVision(imageBuffer: Buffer) {
  return sharp(imageBuffer)
    .rotate()
    .resize({
      width: 1600,
      height: 1600,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: 82 })
    .toBuffer();
}
