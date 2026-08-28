import "server-only";

import { randomBytes } from "node:crypto";
import { compareSync, hashSync } from "bcryptjs";
import type { UserRole } from "@/lib/candidates-shared";
import { getPrisma, isDatabaseReady } from "@/lib/db";

export type AppUser = {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  company?: string;
  passwordHash?: string;
  accountStatus?: "active" | "suspended";
  companyProfile?: unknown;
  createdAt: string;
  updatedAt: string;
};

function toAppUser(row: {
  id: string;
  email: string;
  name: string | null;
  role: string;
  company: string | null;
  passwordHash: string | null;
  accountStatus: string;
  companyProfile: unknown;
  createdAt: Date;
  updatedAt: Date;
}): AppUser {
  return {
    uid: row.id,
    email: row.email,
    name: row.name || row.email,
    role: row.role as UserRole,
    company: row.company || undefined,
    passwordHash: row.passwordHash || undefined,
    accountStatus: row.accountStatus === "suspended" ? "suspended" : "active",
    companyProfile: row.companyProfile ?? undefined,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function requirePrisma() {
  if (!(await isDatabaseReady())) throw new Error("DATABASE_UNAVAILABLE");
  const prisma = getPrisma();
  if (!prisma) throw new Error("DATABASE_UNAVAILABLE");
  return prisma;
}

export async function findAppUserByEmail(email: string): Promise<AppUser | null> {
  const normalized = email.toLowerCase().trim();
  if (!normalized) return null;
  const prisma = await requirePrisma();
  const row = await prisma.user.findUnique({ where: { email: normalized } });
  return row ? toAppUser(row) : null;
}

export async function upsertAppUser(input: {
  email: string;
  password: string;
  name: string;
  role: UserRole;
  company?: string;
}): Promise<AppUser> {
  const email = input.email.toLowerCase().trim();
  const prisma = await requirePrisma();
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
      ...(input.company !== undefined ? { company: input.company || null } : {}),
    },
  });

  if (input.role === "EMPLOYER" && (input.company || existing?.company)) {
    const company = input.company || existing?.company || input.name;
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

  return toAppUser(row);
}

/** Xác thực email/password qua Postgres + bcrypt. */
export async function verifyUserCredentials(
  email: string,
  password: string
): Promise<AppUser | null> {
  const normalized = email.toLowerCase().trim();
  if (!normalized || !password) return null;
  try {
    const prisma = await requirePrisma();
    const row = await prisma.user.findUnique({ where: { email: normalized } });
    if (!row?.passwordHash) {
      console.warn("[auth] user missing or no passwordHash", {
        email: normalized,
        found: Boolean(row),
      });
      return null;
    }
    if (!compareSync(password, row.passwordHash)) {
      console.warn("[auth] password mismatch", { email: normalized });
      return null;
    }
    return toAppUser(row);
  } catch (err) {
    console.error("[auth] verifyUserCredentials failed", err);
    return null;
  }
}

export async function getAppUserById(uid: string): Promise<AppUser | null> {
  if (!uid) return null;
  try {
    const prisma = await requirePrisma();
    const row = await prisma.user.findUnique({ where: { id: uid } });
    return row ? toAppUser(row) : null;
  } catch {
    return null;
  }
}

export async function seedDefaultUsers(password = "demo123") {
  await upsertAppUser({
    email: "admin@demo.local",
    password,
    name: "Admin Vstaff",
    role: "ADMIN",
  });
  await upsertAppUser({
    email: "employer@demo.local",
    password,
    name: "NTD Demo",
    role: "EMPLOYER",
    company: "Vstaff Demo Co.",
  });
}
