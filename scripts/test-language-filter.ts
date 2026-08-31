/**
 * Kiểm tra lọc ngôn ngữ: unit + truy vấn DB qua listCandidatesPg.
 */
import { config } from "dotenv";
import assert from "node:assert/strict";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";
import {
  languageFilterVariants,
  canonicalLanguageFilter,
  LANGUAGE_FILTER_OPTIONS,
} from "../src/lib/language-filter";

config({ path: ".env" });

function testUnit() {
  console.log("=== Unit tests ===");

  assert.deepEqual(languageFilterVariants("Tiếng Anh"), [
    "Tiếng Anh",
    "English",
    "Tieng Anh",
    "Anh văn",
  ]);
  assert.deepEqual(languageFilterVariants("English"), [
    "Tiếng Anh",
    "English",
    "Tieng Anh",
    "Anh văn",
  ]);
  assert.deepEqual(languageFilterVariants("日本語"), [
    "Tiếng Nhật",
    "日本語",
    "Japanese",
    "Tieng Nhat",
  ]);
  assert.deepEqual(languageFilterVariants("Tiếng Việt"), [
    "Tiếng Việt",
    "Vietnamese",
    "Tieng Viet",
  ]);
  assert.equal(canonicalLanguageFilter("Français"), "Tiếng Pháp");
  assert.deepEqual(languageFilterVariants(""), []);
  assert.deepEqual(languageFilterVariants(undefined), []);

  console.log("Unit tests: OK\n");
}

async function openPrisma(): Promise<{ prisma: PrismaClient; close: () => Promise<void> }> {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) throw new Error("DATABASE_URL is not set");
  const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });
  return {
    prisma,
    close: () => prisma.$disconnect(),
  };
}

async function testDb() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    console.log("=== DB tests: skipped (no DATABASE_URL) ===");
    return;
  }

  console.log("=== DB tests (listCandidatesPg) ===");
  const { prisma, close } = await openPrisma();

  try {
    const total = await prisma.candidateProfile.count({ where: { isPublic: true } });
    console.log(`Public candidates: ${total}`);

    const distinct = await prisma.$queryRaw<Array<{ lang: string; cnt: number }>>`
      SELECT unnest(languages) AS lang, COUNT(*)::int AS cnt
      FROM "CandidateProfile"
      WHERE "isPublic" = true
      GROUP BY lang
      ORDER BY cnt DESC
      LIMIT 20
    `;
    console.log("Top language values in DB:");
    for (const row of distinct) {
      console.log(`  ${row.lang}: ${row.cnt}`);
    }

    for (const opt of LANGUAGE_FILTER_OPTIONS) {
      const variants = languageFilterVariants(opt.value);
      const countNew = await prisma.candidateProfile.count({
        where: { isPublic: true, languages: { hasSome: variants } },
      });
      const countExact = await prisma.candidateProfile.count({
        where: { isPublic: true, languages: { has: opt.value } },
      });
      const ok = countNew >= countExact;
      console.log(
        `[${ok ? "OK" : "FAIL"}] ${opt.value}: hasSome=${countNew}, exact-only=${countExact}, variants=${variants.length}`
      );
      assert.ok(ok, `${opt.value}: hasSome must match at least exact count`);
    }

    const english = await prisma.candidateProfile.count({
      where: {
        isPublic: true,
        languages: { hasSome: languageFilterVariants("English") },
      },
    });
    const tiengAnh = await prisma.candidateProfile.count({
      where: {
        isPublic: true,
        languages: { hasSome: languageFilterVariants("Tiếng Anh") },
      },
    });
    assert.equal(english, tiengAnh, "Legacy English param must match Tiếng Anh");
    console.log(`Legacy ?language=English: ${english} candidates`);

    const nhat = await prisma.candidateProfile.count({
      where: {
        isPublic: true,
        languages: { hasSome: languageFilterVariants("Tiếng Nhật") },
      },
    });
    console.log(`Tiếng Nhật: ${nhat} candidates`);

    console.log("DB tests: OK\n");
  } finally {
    await close();
  }
}

async function main() {
  testUnit();
  await testDb();
  console.log("All language filter tests passed.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
