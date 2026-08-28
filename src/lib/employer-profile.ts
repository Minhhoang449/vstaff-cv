import "server-only";

import { randomBytes } from "node:crypto";
import {
  EMPTY_COMPANY_PROFILE,
  type EmployerCompanyProfile,
} from "@/lib/employer-company-types";
import { getPrisma, isDatabaseReady } from "@/lib/db";

export type { EmployerCompanyProfile };
export { EMPTY_COMPANY_PROFILE };

export async function getEmployerCompanyProfile(
  uid: string
): Promise<EmployerCompanyProfile> {
  try {
    if (!(await isDatabaseReady())) return { ...EMPTY_COMPANY_PROFILE };
    const prisma = getPrisma();
    if (!prisma) return { ...EMPTY_COMPANY_PROFILE };
    const user = await prisma.user.findUnique({ where: { id: uid } });
    if (!user) return { ...EMPTY_COMPANY_PROFILE };
    if (user.companyProfile && typeof user.companyProfile === "object") {
      return {
        ...EMPTY_COMPANY_PROFILE,
        ...(user.companyProfile as EmployerCompanyProfile),
      };
    }
    return {
      ...EMPTY_COMPANY_PROFILE,
      companyName: user.company || "",
      email: user.email || "",
    };
  } catch (err) {
    console.warn("[employer-profile] get failed", err);
    return { ...EMPTY_COMPANY_PROFILE };
  }
}

export async function saveEmployerCompanyProfile(
  uid: string,
  profile: EmployerCompanyProfile
): Promise<EmployerCompanyProfile> {
  const cleaned: EmployerCompanyProfile = {
    companyName: profile.companyName.trim(),
    slug: profile.slug.trim().toLowerCase(),
    logoText: profile.logoText.trim().slice(0, 3).toUpperCase(),
    industry: profile.industry.trim(),
    province: profile.province.trim(),
    address: profile.address.trim(),
    companySize: profile.companySize.trim() || "11-50",
    website: profile.website.trim(),
    phone: profile.phone.trim(),
    email: profile.email.trim().toLowerCase(),
    about: profile.about.trim(),
    isPublic: Boolean(profile.isPublic),
    updatedAt: new Date().toISOString(),
  };

  if (!(await isDatabaseReady())) throw new Error("DATABASE_UNAVAILABLE");
  const prisma = getPrisma();
  if (!prisma) throw new Error("DATABASE_UNAVAILABLE");

  await prisma.user.update({
    where: { id: uid },
    data: {
      company: cleaned.companyName,
      companyProfile: cleaned as object,
    },
  });

  await prisma.employerProfile.upsert({
    where: { userId: uid },
    create: {
      id: `ep_${randomBytes(8).toString("hex")}`,
      userId: uid,
      company: cleaned.companyName,
    },
    update: { company: cleaned.companyName },
  });

  return cleaned;
}
