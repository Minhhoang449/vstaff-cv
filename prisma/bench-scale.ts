/**
 * Scale sanity check without requiring a live Postgres.
 * 1) Times naive in-memory filter over N rows (anti-pattern)
 * 2) Times page-sized slice after filter (what DB pagination should return)
 * 3) If Postgres is reachable, also runs prisma/bench-list queries
 *
 * Usage: npx tsx prisma/bench-scale.ts
 * Optional: SCALE_COUNT=100000
 */
import "dotenv/config";
import { buildMemoryCandidates, PAGE_SIZE } from "../src/lib/candidates-shared";

const SCALE = Math.max(1_000, Number(process.env.SCALE_COUNT ?? "100000") || 100_000);

function timed(label: string, fn: () => void) {
  const t0 = performance.now();
  fn();
  const ms = performance.now() - t0;
  console.log(`${label.padEnd(48)} ${ms.toFixed(1).padStart(8)} ms`);
  return ms;
}

async function main() {
  console.log(`Building ${SCALE.toLocaleString("vi-VN")} in-memory candidates...`);
  const tBuild0 = performance.now();
  const all = buildMemoryCandidates(SCALE);
  console.log(`Build done in ${(performance.now() - tBuild0).toFixed(1)} ms\n`);

  const naiveMs = timed("Naive: filter+sort entire corpus", () => {
    const q = "react";
    let items = all.filter((c) => c.isPublic);
    items = items.filter(
      (c) =>
        c.fullName.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q))
    );
    items.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    void items.slice(0, PAGE_SIZE);
  });

  const pageMs = timed("Target: materialize only 1 page worth", () => {
    // Simulate repository returning already-paginated rows from DB
    const page = all.slice(0, PAGE_SIZE).map((c) => ({
      id: c.id,
      slug: c.slug,
      fullName: c.fullName,
      summary: c.summary,
    }));
    void page.length;
  });

  console.log(
    `\nSpeedup vs naive (this machine): ${(naiveMs / Math.max(pageMs, 0.01)).toFixed(0)}x`
  );
  console.log(
    "With Postgres, listCandidates only SELECT … LIMIT/OFFSET + indexes — never loads 100k rows into Node.\n"
  );

  // Optional live DB bench
  try {
    const { PrismaPg } = await import("@prisma/adapter-pg");
    const { PrismaClient } = await import("../src/generated/prisma");
    const url = process.env.DATABASE_URL;
    if (!url) {
      console.log("Skip DB bench: DATABASE_URL not set");
      return;
    }
    const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch {
      console.log("Skip DB bench: Postgres not reachable at DATABASE_URL");
      console.log("Start DB (docker compose up -d) then: npm run db:push && SEED_COUNT=100000 npm run db:seed && npm run db:bench");
      await prisma.$disconnect();
      return;
    }

    const count = await prisma.candidateProfile.count({ where: { isPublic: true } });
    console.log(`Postgres public candidates: ${count.toLocaleString("vi-VN")}`);
    const t0 = performance.now();
    const [total, rows] = await Promise.all([
      prisma.candidateProfile.count({ where: { isPublic: true } }),
      prisma.candidateProfile.findMany({
        where: { isPublic: true },
        orderBy: { updatedAt: "desc" },
        take: PAGE_SIZE,
        select: { id: true, slug: true, fullName: true, updatedAt: true },
      }),
    ]);
    console.log(
      `DB list page1: ${(performance.now() - t0).toFixed(1)} ms (total=${total}, rows=${rows.length})`
    );
    await prisma.$disconnect();
  } catch (err) {
    console.log("Skip DB bench:", err);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
