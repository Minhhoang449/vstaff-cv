/**
 * Seed tài khoản demo trên Postgres (admin / employer).
 * Usage: npx tsx scripts/seed-demo-users.ts
 */
import "dotenv/config";
import { randomBytes } from "node:crypto";
import { hashSync } from "bcryptjs";
import { getPrisma, isDatabaseReady } from "../src/lib/db";

async function upsertDemoUser(input: {
  email: string;
  password: string;
  name: string;
  role: "ADMIN" | "EMPLOYER" | "CANDIDATE";
  company?: string;
}) {
  const prisma = getPrisma();
  if (!prisma) throw new Error("DATABASE_UNAVAILABLE");
  const email = input.email.toLowerCase().trim();
  const existing = await prisma.user.findUnique({ where: { email } });
  const id = existing?.id || `usr_${randomBytes(12).toString("hex")}`;
  const passwordHash = hashSync(input.password, 10);
  const row = await prisma.user.upsert({
    where: { email },
    create: {
      id,
      email,
      name: input.name,
      role: input.role,
      passwordHash,
      company: input.company || null,
      accountStatus: "active",
    },
    update: {
      name: input.name,
      role: input.role,
      passwordHash,
      company: input.company || null,
    },
  });
  if (input.role === "EMPLOYER") {
    const company = input.company || input.name;
    await prisma.employerProfile.upsert({
      where: { userId: row.id },
      create: {
        id: `ep_${randomBytes(8).toString("hex")}`,
        userId: row.id,
        company,
      },
      update: { company },
    });
  }
  return row;
}

async function main() {
  if (!(await isDatabaseReady())) {
    throw new Error("Database not ready — run npm run db:local:setup first");
  }
  const password = process.env.SEED_USER_PASSWORD || "demo123";
  await upsertDemoUser({
    email: "admin@demo.local",
    password,
    name: "Admin Vstaff",
    role: "ADMIN",
  });
  await upsertDemoUser({
    email: "employer@demo.local",
    password,
    name: "NTD Demo",
    role: "EMPLOYER",
    company: "Vstaff Demo Co.",
  });
  console.log("Seeded admin@demo.local and employer@demo.local (Postgres)");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
