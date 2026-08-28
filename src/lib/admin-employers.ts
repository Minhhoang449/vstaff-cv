import "server-only";

import { hashSync } from "bcryptjs";
import type { AdminEmployerRow, AdminEmployerStatus } from "@/lib/admin/business-types";
import type { EmployerSubscription } from "@/data/employer-subscription";
import { getPrisma, isDatabaseReady } from "@/lib/db";
import {
  applyPaidPlanToSubscription,
  getEmployerSubscriptionState,
} from "@/lib/employer-unlocks";
import { getServicePlanById, listServicePlans } from "@/lib/service-plans";
import type { AppUser } from "@/lib/users-auth";

type UserDoc = AppUser & {
  accountStatus?: "active" | "suspended";
  companyProfile?: { companyName?: string; phone?: string };
  phone?: string;
};

async function requirePrisma() {
  if (!(await isDatabaseReady())) throw new Error("DATABASE_UNAVAILABLE");
  const prisma = getPrisma();
  if (!prisma) throw new Error("DATABASE_UNAVAILABLE");
  return prisma;
}

function deriveStatus(
  user: UserDoc,
  sub: EmployerSubscription | null
): AdminEmployerStatus {
  if (user.accountStatus === "suspended") return "suspended";
  if (!sub) return "active";
  if (sub.planId === "free") return "active";
  const expired = new Date(sub.expiresAt).getTime() < Date.now();
  if (expired) return "expired";
  if (sub.planId === "trial") return "trial";
  return "active";
}

function companyOf(user: UserDoc) {
  const profile =
    user.companyProfile && typeof user.companyProfile === "object"
      ? (user.companyProfile as { companyName?: string; phone?: string })
      : null;
  return (
    profile?.companyName?.trim() ||
    user.company?.trim() ||
    user.name?.trim() ||
    user.email
  );
}

function rowToUserDoc(row: {
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
}): UserDoc {
  return {
    uid: row.id,
    email: row.email,
    name: row.name || row.email,
    role: row.role as AppUser["role"],
    company: row.company || undefined,
    passwordHash: row.passwordHash || undefined,
    accountStatus: row.accountStatus === "suspended" ? "suspended" : "active",
    companyProfile: row.companyProfile as UserDoc["companyProfile"],
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function listAdminEmployers(): Promise<AdminEmployerRow[]> {
  const prisma = await requirePrisma();
  const users = await prisma.user.findMany({
    where: { role: "EMPLOYER" },
    take: 500,
    orderBy: { createdAt: "desc" },
  });

  const rows: AdminEmployerRow[] = await Promise.all(
    users.map(async (row) => {
      const user = rowToUserDoc(row);
      const sub = await getEmployerSubscriptionState(row.id);
      const profile =
        user.companyProfile && typeof user.companyProfile === "object"
          ? (user.companyProfile as { phone?: string })
          : null;
      return {
        id: row.id,
        company: companyOf(user),
        email: user.email,
        planId: sub?.planId || "free",
        planName: sub?.planName || "Free",
        status: deriveStatus(user, sub),
        cvUsed: sub?.cvUsed ?? 0,
        cvLimit: sub?.cvLimit ?? null,
        activatedAt: sub?.activatedAt || user.createdAt,
        phone: profile?.phone || "",
      };
    })
  );

  return rows.sort((a, b) => a.company.localeCompare(b.company, "vi"));
}

export type UpdateEmployerInput = {
  company: string;
  email: string;
  phone?: string;
  accountStatus: "active" | "suspended";
  planId: string;
  /** Optional — set new password */
  password?: string;
};

export async function updateAdminEmployer(
  id: string,
  input: UpdateEmployerInput
): Promise<AdminEmployerRow> {
  const prisma = await requirePrisma();
  const prev = await prisma.user.findUnique({ where: { id } });
  if (!prev || prev.role !== "EMPLOYER") throw new Error("NOT_FOUND");

  const company = input.company.trim();
  const email = input.email.trim().toLowerCase();
  const phone = (input.phone || "").trim();
  if (!company || !email) throw new Error("INVALID");

  if (email !== prev.email) {
    const dup = await prisma.user.findUnique({ where: { email } });
    if (dup && dup.id !== id) throw new Error("EMAIL_EXISTS");
  }

  const prevProfile =
    prev.companyProfile && typeof prev.companyProfile === "object"
      ? (prev.companyProfile as Record<string, unknown>)
      : {};

  const companyProfile = {
    ...prevProfile,
    companyName: company,
    phone,
    email,
  };

  await prisma.user.update({
    where: { id },
    data: {
      email,
      company,
      name: company,
      accountStatus: input.accountStatus,
      companyProfile,
      ...(input.password && input.password.length >= 6
        ? { passwordHash: hashSync(input.password, 10) }
        : {}),
    },
  });

  await prisma.employerProfile.upsert({
    where: { userId: id },
    create: {
      id: `ep_${id.slice(0, 12)}`,
      userId: id,
      company,
    },
    update: { company },
  });

  const plan = await getServicePlanById(input.planId);
  const plans = plan ? [plan] : await listServicePlans();
  const chosen = plan || plans.find((p) => p.id === input.planId) || plans[0];
  if (chosen) {
    const prevSub = await getEmployerSubscriptionState(id);
    const now = Date.now();
    const durationDays = chosen.durationDays || 30;
    const keepExpiry =
      prevSub?.planId === chosen.id && prevSub.expiresAt
        ? Math.max(0, Math.ceil((new Date(prevSub.expiresAt).getTime() - now) / (24 * 60 * 60 * 1000)))
        : durationDays;

    await applyPaidPlanToSubscription(id, {
      planId: chosen.id,
      planName: chosen.name,
      cvLimit: chosen.cvLimit,
      durationDays: chosen.id === "free" ? 3650 : keepExpiry || durationDays,
    });

    // Preserve cvUsed when same plan kept
    if (prevSub && prevSub.planId === chosen.id) {
      await prisma.employerSubscription.update({
        where: { employerId: id },
        data: {
          cvUsed: prevSub.cvUsed,
          cvUsedToday: prevSub.cvUsedToday ?? 0,
          cvUsageDay: prevSub.cvUsageDay ?? null,
          expiresAt:
            chosen.id === "free"
              ? new Date(now + 3650 * 24 * 60 * 60 * 1000)
              : new Date(prevSub.expiresAt),
          activatedAt: new Date(prevSub.activatedAt),
        },
      });
    }
  }

  const list = await listAdminEmployers();
  const row = list.find((r) => r.id === id);
  if (!row) throw new Error("NOT_FOUND");
  return row;
}

export async function deleteAdminEmployer(id: string): Promise<void> {
  const prisma = await requirePrisma();
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user || user.role !== "EMPLOYER") throw new Error("NOT_FOUND");

  await prisma.$transaction([
    prisma.contactUnlock.deleteMany({ where: { employerId: id } }),
    prisma.savedCandidate.deleteMany({ where: { employerId: id } }),
    prisma.employerSubscription.deleteMany({ where: { employerId: id } }),
    prisma.paymentOrder.deleteMany({ where: { employerId: id } }),
    prisma.employerProfile.deleteMany({ where: { userId: id } }),
    prisma.user.delete({ where: { id } }),
  ]);
}
