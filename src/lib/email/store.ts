import "server-only";

import type { EmailCampaign } from "@/lib/email/types";
import { getPrisma, isDatabaseReady } from "@/lib/db";

function bySentAtDesc(a: EmailCampaign, b: EmailCampaign) {
  return (b.sentAt || "").localeCompare(a.sentAt || "");
}

function rowToCampaign(row: {
  id: string;
  employerId: string;
  employerEmail: string;
  subject: string;
  body: string;
  fromName: string;
  audience: string;
  openedWithin: string | null;
  status: string;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  testMode: boolean;
  sentAt: Date;
  results: unknown;
}): EmailCampaign {
  return {
    id: row.id,
    employerId: row.employerId,
    employerEmail: row.employerEmail,
    subject: row.subject,
    body: row.body,
    fromName: row.fromName,
    audience: row.audience as EmailCampaign["audience"],
    openedWithin: row.openedWithin,
    status: row.status as EmailCampaign["status"],
    recipientCount: row.recipientCount,
    sentCount: row.sentCount,
    failedCount: row.failedCount,
    testMode: row.testMode,
    sentAt: row.sentAt.toISOString(),
    results: Array.isArray(row.results) ? (row.results as EmailCampaign["results"]) : [],
  };
}

export async function listEmailCampaigns(employerId?: string): Promise<EmailCampaign[]> {
  try {
    if (!(await isDatabaseReady())) return [];
    const prisma = getPrisma();
    if (!prisma) return [];
    const rows = await prisma.emailCampaign.findMany({
      where: employerId ? { employerId } : undefined,
      orderBy: { sentAt: "desc" },
      take: employerId ? 100 : 200,
    });
    return rows.map(rowToCampaign).sort(bySentAtDesc);
  } catch (err) {
    console.warn("[email] listEmailCampaigns failed", err);
    return [];
  }
}

export async function getEmailCampaignById(id: string): Promise<EmailCampaign | null> {
  try {
    if (!(await isDatabaseReady())) return null;
    const prisma = getPrisma();
    if (!prisma) return null;
    const row = await prisma.emailCampaign.findUnique({ where: { id } });
    return row ? rowToCampaign(row) : null;
  } catch (err) {
    console.warn("[email] getEmailCampaignById failed", err);
    return null;
  }
}

export async function saveEmailCampaign(campaign: EmailCampaign): Promise<EmailCampaign> {
  if (!(await isDatabaseReady())) throw new Error("DATABASE_UNAVAILABLE");
  const prisma = getPrisma();
  if (!prisma) throw new Error("DATABASE_UNAVAILABLE");

  await prisma.emailCampaign.upsert({
    where: { id: campaign.id },
    create: {
      id: campaign.id,
      employerId: campaign.employerId,
      employerEmail: campaign.employerEmail,
      subject: campaign.subject,
      body: campaign.body,
      fromName: campaign.fromName,
      audience: campaign.audience,
      openedWithin: campaign.openedWithin,
      status: campaign.status,
      recipientCount: campaign.recipientCount,
      sentCount: campaign.sentCount,
      failedCount: campaign.failedCount,
      testMode: campaign.testMode,
      sentAt: new Date(campaign.sentAt),
      results: campaign.results,
    },
    update: {
      employerId: campaign.employerId,
      employerEmail: campaign.employerEmail,
      subject: campaign.subject,
      body: campaign.body,
      fromName: campaign.fromName,
      audience: campaign.audience,
      openedWithin: campaign.openedWithin,
      status: campaign.status,
      recipientCount: campaign.recipientCount,
      sentCount: campaign.sentCount,
      failedCount: campaign.failedCount,
      testMode: campaign.testMode,
      sentAt: new Date(campaign.sentAt),
      results: campaign.results,
    },
  });
  return campaign;
}

export async function deleteEmailCampaign(id: string, employerId?: string): Promise<boolean> {
  try {
    if (!(await isDatabaseReady())) return false;
    const prisma = getPrisma();
    if (!prisma) return false;
    const row = await prisma.emailCampaign.findUnique({ where: { id } });
    if (!row) return false;
    if (employerId && row.employerId !== employerId) return false;
    await prisma.emailCampaign.delete({ where: { id } });
    return true;
  } catch (err) {
    console.warn("[email] deleteEmailCampaign failed", err);
    return false;
  }
}
