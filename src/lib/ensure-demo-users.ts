import { randomBytes } from "node:crypto";
import { hashSync } from "bcryptjs";
import type { PrismaClient } from "@/generated/prisma";

const globalEnsure = globalThis as unknown as { demoUsersEnsured?: boolean };

/**
 * Đảm bảo tài khoản demo tồn tại trên DB mà process đang mở (PGlite).
 * Tránh trường hợp seed CLI ghi một data dir còn Next mở DB trống.
 */
export async function ensureDemoUsers(prisma: PrismaClient): Promise<void> {
  if (globalEnsure.demoUsersEnsured) return;
  if (process.env.SKIP_DEMO_USERS === "1") {
    globalEnsure.demoUsersEnsured = true;
    return;
  }

  const password = process.env.SEED_USER_PASSWORD || "demo123";
  const passwordHash = hashSync(password, 10);

  const demos = [
    {
      email: "admin@demo.local",
      name: "Admin Vstaff",
      role: "ADMIN" as const,
      company: null as string | null,
    },
    {
      email: "employer@demo.local",
      name: "NTD Demo",
      role: "EMPLOYER" as const,
      company: "Vstaff Demo Co.",
    },
  ];

  for (const demo of demos) {
    const existing = await prisma.user.findUnique({ where: { email: demo.email } });
    const id = existing?.id || `usr_${randomBytes(12).toString("hex")}`;
    const row = await prisma.user.upsert({
      where: { email: demo.email },
      create: {
        id,
        email: demo.email,
        name: demo.name,
        role: demo.role,
        passwordHash,
        company: demo.company,
        accountStatus: "active",
      },
      update: {
        passwordHash,
        name: demo.name,
        role: demo.role,
        accountStatus: "active",
        ...(demo.company ? { company: demo.company } : {}),
      },
    });

    if (demo.role === "EMPLOYER" && demo.company) {
      await prisma.employerProfile.upsert({
        where: { userId: row.id },
        create: {
          id: `ep_${randomBytes(8).toString("hex")}`,
          userId: row.id,
          company: demo.company,
        },
        update: { company: demo.company },
      });

      const expiresAt = new Date();
      expiresAt.setUTCDate(expiresAt.getUTCDate() + 30);
      await prisma.employerSubscription.upsert({
        where: { employerId: row.id },
        create: {
          employerId: row.id,
          planId: "standard",
          planName: "Phổ biến",
          cvUsed: 0,
          cvLimit: null,
          cvUsedToday: 0,
          activatedAt: new Date(),
          expiresAt,
          activationVerified: true,
        },
        update: {
          planId: "standard",
          planName: "Phổ biến",
          cvLimit: null,
          expiresAt,
          activationVerified: true,
        },
      });
    }
  }

  globalEnsure.demoUsersEnsured = true;
  console.info("[db] Demo users ready (admin@demo.local / employer@demo.local)");
}
