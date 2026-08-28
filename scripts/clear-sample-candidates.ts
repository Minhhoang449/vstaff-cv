/**
 * Xóa hồ sơ ứng viên mẫu (seed bench) khỏi Postgres/PGlite.
 * Usage: npx tsx scripts/clear-sample-candidates.ts
 */
import "dotenv/config";
import { createPglitePrisma, ensurePgliteSchema, shouldUsePglite } from "../prisma/pglite";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";

async function openPrisma(): Promise<{ prisma: PrismaClient; close: () => Promise<void> }> {
  if (shouldUsePglite()) {
    const { prisma, pglite, close } = await createPglitePrisma();
    await ensurePgliteSchema(pglite);
    return { prisma, close };
  }
  const url = process.env.DATABASE_URL;
  if (!url) {
    const { prisma, pglite, close } = await createPglitePrisma();
    await ensurePgliteSchema(pglite);
    return { prisma, close };
  }
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  return {
    prisma,
    close: async () => {
      await prisma.$disconnect();
    },
  };
}

/** Hồ sơ do prisma/seed hoặc bench tạo — không phải import admin. */
function isSampleRow(row: {
  fullName: string;
  email: string;
  slug: string;
  id: string;
}) {
  if (row.fullName.startsWith("Ứng viên mẫu")) return true;
  if (row.email.endsWith("@demo.local")) return true;
  if (/^ung-vien-\d+$/.test(row.slug)) return true;
  if (/^cand-\d+$/.test(row.id)) return true;
  return false;
}

async function main() {
  const { prisma, close } = await openPrisma();
  try {
    const all = await prisma.candidateProfile.findMany({
      select: { id: true, fullName: true, email: true, slug: true },
    });
    const sampleIds = all.filter(isSampleRow).map((r) => r.id);
    if (!sampleIds.length) {
      console.log("Không có hồ sơ mẫu cần xóa.");
      return;
    }

    await prisma.contactUnlock.deleteMany({ where: { candidateId: { in: sampleIds } } });
    await prisma.savedCandidate.deleteMany({ where: { candidateId: { in: sampleIds } } });
    await prisma.employerCandidateView.deleteMany({ where: { candidateId: { in: sampleIds } } });
    const deleted = await prisma.candidateProfile.deleteMany({
      where: { id: { in: sampleIds } },
    });

    const remaining = await prisma.candidateProfile.count();
    console.log(
      `Đã xóa ${deleted.count.toLocaleString("vi-VN")} hồ sơ mẫu. Còn lại ${remaining.toLocaleString("vi-VN")} hồ sơ.`
    );
  } finally {
    await close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
