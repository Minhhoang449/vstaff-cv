import "dotenv/config";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, type CandidateGender, type JobSeekingStatus } from "../src/generated/prisma";
import {
  DESIRED_POSITIONS,
  EDUCATION_LEVELS,
  LANGUAGES,
  WORK_TYPES,
  CANDIDATE_SEED_HELPERS,
} from "../src/lib/candidates-shared";
import { createPglitePrisma, ensurePgliteSchema, shouldUsePglite } from "./pglite";

const { INDUSTRY_IDS, PROVINCE_SEED, WARD_SEED, shortProvince } = CANDIDATE_SEED_HELPERS;

function resolveSeedCount() {
  const arg = process.argv.find((a) => a.startsWith("--count="));
  if (arg) return Math.max(0, Number(arg.split("=")[1]) || 0);
  return Math.max(0, Number(process.env.SEED_COUNT ?? "0") || 0);
}

const SEED_COUNT = resolveSeedCount();
const BATCH = 500;

function buildCandidate(i: number) {
  const n = i + 1;
  const skillsPool = [
    "React",
    "TypeScript",
    "Node.js",
    "PostgreSQL",
    "Next.js",
    "Python",
    "Java",
    "AWS",
    "Docker",
    "Figma",
  ];
  const province = PROVINCE_SEED[i % PROVINCE_SEED.length];
  const wards = WARD_SEED[province.code];
  const ward = wards[i % wards.length];
  const gender: CandidateGender = i % 3 === 0 ? "female" : i % 7 === 0 ? "other" : "male";
  const langA = LANGUAGES[i % LANGUAGES.length];
  const langB = LANGUAGES[(i + 1) % LANGUAGES.length];
  const desiredPosition = DESIRED_POSITIONS[i % DESIRED_POSITIONS.length];
  const experienceYears = (i % 10) + 1;
  const statuses: JobSeekingStatus[] = ["active", "open", "passive"];

  return {
    slug: `ung-vien-${n}`,
    fullName: `Ứng viên mẫu ${n}`,
    title: desiredPosition,
    desiredPosition,
    location: shortProvince(province.name),
    provinceCode: province.code,
    wardCode: ward.code,
    wardName: ward.name,
    industryId: INDUSTRY_IDS[i % INDUSTRY_IDS.length],
    gender,
    languages: langA === langB ? [langA] : [langA, langB],
    education: EDUCATION_LEVELS[i % EDUCATION_LEVELS.length],
    experienceYears,
    skills: skillsPool.slice(0, 3 + (i % 4)),
    summary: `Đang tìm cơ hội ${desiredPosition}. ${experienceYears}+ năm kinh nghiệm, sẵn sàng kết nối NTD.`,
    age: 22 + (i % 18),
    salaryExpect: 8 + (i % 25),
    workType: WORK_TYPES[i % WORK_TYPES.length],
    jobSeekingStatus: statuses[i % statuses.length],
    interestCount: 12 + ((i * 17) % 500),
    phone: `09${String(10000000 + n).slice(-8)}`,
    email: `ungvien${n}@demo.local`,
    isPublic: true,
    updatedAt: new Date(Date.now() - (i % 720) * 60 * 60 * 1000),
  };
}

async function applyIndexes(prisma: PrismaClient) {
  const sqlPath = join(process.cwd(), "prisma", "sql", "indexes.sql");
  const sql = readFileSync(sqlPath, "utf8");
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  for (const statement of statements) {
    try {
      await prisma.$executeRawUnsafe(statement);
    } catch {
      // pg_trgm may be unavailable (e.g. PGlite) — skip
    }
  }
}

async function openPrisma(): Promise<{
  prisma: PrismaClient;
  mode: "postgres" | "pglite";
  close: () => Promise<void>;
}> {
  if (shouldUsePglite()) {
    const { prisma, pglite, close } = await createPglitePrisma();
    await ensurePgliteSchema(pglite);
    return { prisma, mode: "pglite", close };
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.warn("DATABASE_URL missing — falling back to embedded PGlite (.data/pglite)");
    const { prisma, pglite, close } = await createPglitePrisma();
    await ensurePgliteSchema(pglite);
    return { prisma, mode: "pglite", close };
  }

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
    console.warn("Postgres unreachable — falling back to embedded PGlite (.data/pglite)");
    await prisma.$disconnect().catch(() => undefined);
    const local = await createPglitePrisma();
    await ensurePgliteSchema(local.pglite);
    return { prisma: local.prisma, mode: "pglite", close: local.close };
  }
}

async function main() {
  const { prisma, mode, close } = await openPrisma();

  try {
    if (SEED_COUNT <= 0) {
      console.log(`Skip candidate seed (count=0). Chỉ giữ schema — dùng import admin cho dữ liệu thật.`);
      console.log(`DB mode: ${mode}. Tip: npm run db:clear:sample nếu còn hồ sơ mẫu cũ.`);
      return;
    }

    console.log(`Seeding ${SEED_COUNT.toLocaleString("vi-VN")} sample candidates via ${mode}...`);
    await prisma.user.upsert({
      where: { email: "employer@demo.local" },
      create: {
        id: "emp-1",
        email: "employer@demo.local",
        name: "NTD Demo",
        role: "EMPLOYER",
        employerProfile: { create: { company: "Vstaff Demo Co." } },
      },
      update: {
        name: "NTD Demo",
        role: "EMPLOYER",
      },
    });

    await prisma.employerCandidateView.deleteMany();
    await prisma.candidateProfile.deleteMany();

    for (let start = 0; start < SEED_COUNT; start += BATCH) {
      const end = Math.min(start + BATCH, SEED_COUNT);
      const batch = [];
      for (let i = start; i < end; i++) batch.push(buildCandidate(i));
      await prisma.candidateProfile.createMany({ data: batch });
      console.log(`  inserted ${end.toLocaleString("vi-VN")} / ${SEED_COUNT.toLocaleString("vi-VN")}`);
    }

    await applyIndexes(prisma);

    const total = await prisma.candidateProfile.count();
    console.log(`Done (${mode}). CandidateProfile count = ${total.toLocaleString("vi-VN")}`);
    if (mode === "pglite") {
      console.log("Tip: set USE_PGLITE=1 in .env so Next.js uses the same embedded DB.");
    }
  } finally {
    await close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
