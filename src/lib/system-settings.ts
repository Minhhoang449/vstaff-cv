import "server-only";

import {
  DEFAULT_SYSTEM_SETTINGS,
  type SystemSettings,
} from "@/lib/system-settings-types";
import { getPrisma, isDatabaseReady } from "@/lib/db";

export type { SystemSettings };
export { DEFAULT_SYSTEM_SETTINGS };

const DOC_ID = "main";

function normalize(raw: Partial<SystemSettings> | undefined): SystemSettings {
  const phoneRaw = (raw?.supportPhone || "").trim();
  const phone =
    !phoneRaw || phoneRaw === "1900 1234" || phoneRaw === "19001234"
      ? DEFAULT_SYSTEM_SETTINGS.supportPhone
      : phoneRaw;

  return {
    siteName:
      (raw?.siteName || DEFAULT_SYSTEM_SETTINGS.siteName).trim() ||
      DEFAULT_SYSTEM_SETTINGS.siteName,
    supportEmail:
      (raw?.supportEmail || DEFAULT_SYSTEM_SETTINGS.supportEmail).trim().toLowerCase() ||
      DEFAULT_SYSTEM_SETTINGS.supportEmail,
    supportPhone: phone,
    allowEmployerSignup:
      raw?.allowEmployerSignup == null
        ? DEFAULT_SYSTEM_SETTINGS.allowEmployerSignup
        : Boolean(raw.allowEmployerSignup),
    maintenance: Boolean(raw?.maintenance),
    updatedAt: raw?.updatedAt,
  };
}

function rowToSettings(row: {
  siteName: string;
  supportEmail: string;
  supportPhone: string;
  allowEmployerSignup: boolean;
  maintenance: boolean;
  updatedAt: Date;
}): SystemSettings {
  return normalize({
    siteName: row.siteName,
    supportEmail: row.supportEmail,
    supportPhone: row.supportPhone,
    allowEmployerSignup: row.allowEmployerSignup,
    maintenance: row.maintenance,
    updatedAt: row.updatedAt.toISOString(),
  });
}

export async function getSystemSettings(): Promise<SystemSettings> {
  try {
    if (!(await isDatabaseReady())) {
      return { ...DEFAULT_SYSTEM_SETTINGS };
    }
    const prisma = getPrisma();
    if (!prisma) return { ...DEFAULT_SYSTEM_SETTINGS };

    const row = await prisma.systemSetting.findUnique({ where: { id: DOC_ID } });
    if (!row) {
      const seed = normalize({
        ...DEFAULT_SYSTEM_SETTINGS,
        updatedAt: new Date().toISOString(),
      });
      try {
        await prisma.systemSetting.create({
          data: {
            id: DOC_ID,
            siteName: seed.siteName,
            supportEmail: seed.supportEmail,
            supportPhone: seed.supportPhone,
            allowEmployerSignup: seed.allowEmployerSignup,
            maintenance: seed.maintenance,
          },
        });
      } catch {
        // Race / đã có sẵn
        const again = await prisma.systemSetting.findUnique({ where: { id: DOC_ID } });
        if (again) return rowToSettings(again);
      }
      return seed;
    }
    return rowToSettings(row);
  } catch (err) {
    console.warn("[system-settings] read failed — using defaults", err);
    return { ...DEFAULT_SYSTEM_SETTINGS };
  }
}

export async function saveSystemSettings(
  input: SystemSettings
): Promise<SystemSettings> {
  const cleaned = normalize({
    ...input,
    updatedAt: new Date().toISOString(),
  });

  if (!(await isDatabaseReady())) throw new Error("DATABASE_UNAVAILABLE");
  const prisma = getPrisma();
  if (!prisma) throw new Error("DATABASE_UNAVAILABLE");

  await prisma.systemSetting.upsert({
    where: { id: DOC_ID },
    create: {
      id: DOC_ID,
      siteName: cleaned.siteName,
      supportEmail: cleaned.supportEmail,
      supportPhone: cleaned.supportPhone,
      allowEmployerSignup: cleaned.allowEmployerSignup,
      maintenance: cleaned.maintenance,
    },
    update: {
      siteName: cleaned.siteName,
      supportEmail: cleaned.supportEmail,
      supportPhone: cleaned.supportPhone,
      allowEmployerSignup: cleaned.allowEmployerSignup,
      maintenance: cleaned.maintenance,
    },
  });

  return cleaned;
}
