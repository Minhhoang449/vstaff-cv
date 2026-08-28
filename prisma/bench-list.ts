/**
 * Bench common list filters.
 * Usage (PowerShell):
 *   npm run db:bench
 *   npm run db:local:seed -- --count=100000
 *   npm run db:bench
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type Prisma } from "../src/generated/prisma";
import { PAGE_SIZE } from "../src/lib/candidates-shared";
import { createPglitePrisma, ensurePgliteSchema, shouldUsePglite } from "./pglite";

async function openPrisma(): Promise<{
  prisma: PrismaClient;
  mode: string;
  close: () => Promise<void>;
}> {
  if (shouldUsePglite()) {
    const { prisma, pglite, close } = await createPglitePrisma();
    await ensurePgliteSchema(pglite);
    return { prisma, mode: "pglite", close };
  }

  const connectionString = process.env.DATABASE_URL;
  if (connectionString) {
    const adapter = new PrismaPg({ connectionString });
    const prisma = new PrismaClient({ adapter });
    try {
      await prisma.$queryRaw`SELECT 1`;
      return {
        prisma,
        mode: "postgres",
        close: async () => {
          await prisma.$disconnect();
        },
      };
    } catch {
      await prisma.$disconnect().catch(() => undefined);
    }
  }

  console.warn("Using embedded PGlite (.data/pglite)");
  const local = await createPglitePrisma();
  await ensurePgliteSchema(local.pglite);
  return { prisma: local.prisma, mode: "pglite", close: local.close };
}

async function timed<T>(label: string, fn: () => Promise<T>) {
  const t0 = performance.now();
  const result = await fn();
  const ms = performance.now() - t0;
  console.log(`${label.padEnd(42)} ${ms.toFixed(1).padStart(8)} ms`);
  return { result, ms };
}

async function main() {
  const { prisma, mode, close } = await openPrisma();
  try {
    const count = await prisma.candidateProfile.count({ where: { isPublic: true } });
    console.log(`Mode: ${mode}`);
    console.log(`Public candidates: ${count.toLocaleString("vi-VN")}\n`);

    if (count < 1000) {
      console.warn("Tip: npm run db:local:seed -- --count=100000\n");
    }

    const cases: { label: string; where: Prisma.CandidateProfileWhereInput }[] = [
      { label: "list page1 (no filter)", where: { isPublic: true } },
      {
        label: "filter province=79",
        where: { isPublic: true, provinceCode: "79" },
      },
      {
        label: "filter province+industry",
        where: { isPublic: true, provinceCode: "01", industryId: "it-software" },
      },
      {
        label: "keyword React (OR contains)",
        where: {
          isPublic: true,
          OR: [
            { fullName: { contains: "React", mode: "insensitive" } },
            { title: { contains: "React", mode: "insensitive" } },
            { desiredPosition: { contains: "React", mode: "insensitive" } },
            { summary: { contains: "React", mode: "insensitive" } },
            { skills: { has: "React" } },
          ],
        },
      },
      {
        label: "unviewed for emp-1",
        where: { isPublic: true, views: { none: { employerId: "emp-1" } } },
      },
    ];

    const samples: number[] = [];

    for (const c of cases) {
      const { ms } = await timed(c.label, async () => {
        const [total, rows] = await Promise.all([
          prisma.candidateProfile.count({ where: c.where }),
          prisma.candidateProfile.findMany({
            where: c.where,
            orderBy: [{ updatedAt: "desc" }],
            skip: 0,
            take: PAGE_SIZE,
            select: {
              id: true,
              slug: true,
              fullName: true,
              title: true,
              summary: true,
              updatedAt: true,
              interestCount: true,
            },
          }),
        ]);
        return { total, n: rows.length };
      });
      samples.push(ms);
    }

    samples.sort((a, b) => a - b);
    const p95 = samples[Math.min(samples.length - 1, Math.floor(samples.length * 0.95))];
    console.log(`\np95 (among cases): ${p95.toFixed(1)} ms  (target < 300ms)`);
  } finally {
    await close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
