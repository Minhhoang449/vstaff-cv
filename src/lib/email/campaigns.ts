import "server-only";

import { randomUUID } from "node:crypto";
import { listCandidates, type CandidateProfile } from "@/lib/candidates";
import { canSendEmail } from "@/lib/email/config";
import { sendTransactionalEmail } from "@/lib/email/mailer";
import { saveEmailCampaign, listEmailCampaigns } from "@/lib/email/store";
import { applyEmailTemplate } from "@/lib/email/templates";
import type {
  EmailAudience,
  EmailCampaign,
  EmailCampaignStatus,
  EmailSendResult,
} from "@/lib/email/types";

export const MAX_RECIPIENTS_PER_CAMPAIGN = 50;

export type OpenedWithin = "today" | "3d" | "7d" | "14d" | "30d";

export type CreateCampaignInput = {
  employerId: string;
  employerEmail: string;
  companyName?: string;
  subject: string;
  body: string;
  fromName: string;
  audience: EmailAudience;
  openedWithin?: OpenedWithin | string;
  /** Gửi thử tới email session NTD, không gửi UV. */
  testMode?: boolean;
  /** Override địa chỉ nhận khi gửi thử. */
  testToEmail?: string;
};

type Recipient = {
  email: string;
  candidateId?: string;
  fullName: string;
  title: string;
  desiredPosition: string;
};

function openedWithinMs(within: string): number | null {
  const now = Date.now();
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  switch (within) {
    case "today":
      return now - startOfToday.getTime();
    case "3d":
      return 3 * 24 * 60 * 60 * 1000;
    case "7d":
      return 7 * 24 * 60 * 60 * 1000;
    case "14d":
      return 14 * 24 * 60 * 60 * 1000;
    case "30d":
      return 30 * 24 * 60 * 60 * 1000;
    default:
      return null;
  }
}

function candidateToRecipient(c: CandidateProfile): Recipient | null {
  const email = c.email?.trim();
  if (!email || email.endsWith("@demo.local")) return null;
  return {
    email,
    candidateId: c.id,
    fullName: c.fullName,
    title: c.title,
    desiredPosition: c.desiredPosition,
  };
}

async function listOpenedRecipients(
  employerId: string,
  openedWithin: string
): Promise<Recipient[]> {
  const windowMs = openedWithinMs(openedWithin);
  const since = windowMs != null ? new Date(Date.now() - windowMs) : null;

  // Ưu tiên unlocks trên Postgres
  try {
    const { listUnlockedCandidatesForEmployer } = await import("@/lib/employer-unlocks");
    const pool = await listUnlockedCandidatesForEmployer(employerId, {
      page: 1,
      sort: "updated",
    });
    const items = [...pool.data];
    for (let p = 2; p <= Math.min(pool.totalPages, 5); p += 1) {
      const more = await listUnlockedCandidatesForEmployer(employerId, {
        page: p,
        sort: "updated",
      });
      items.push(...more.data);
    }
    const out: Recipient[] = [];
    const seen = new Set<string>();
    for (const c of items) {
      if (since && new Date(c.updatedAt).getTime() < since.getTime()) continue;
      const r = candidateToRecipient(c);
      if (!r) continue;
      const key = r.email.toLowerCase();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(r);
      if (out.length >= MAX_RECIPIENTS_PER_CAMPAIGN) break;
    }
    return out;
  } catch (err) {
    console.warn("[email] opened recipients failed", err);
    return [];
  }
}

export async function resolveCampaignRecipients(input: {
  employerId: string;
  employerEmail: string;
  audience: EmailAudience;
  openedWithin?: string;
  testMode?: boolean;
  testToEmail?: string;
}): Promise<{ recipients: Recipient[]; error?: string }> {
  if (input.testMode) {
    const email = (input.testToEmail?.trim() || input.employerEmail?.trim() || "").toLowerCase();
    if (!email || !email.includes("@")) {
      return { recipients: [], error: "Nhập email nhận thử hợp lệ." };
    }
    if (email.endsWith("@demo.local")) {
      return {
        recipients: [],
        error: "Email nhận thử không hợp lệ. Dùng địa chỉ inbox thật.",
      };
    }
    return {
      recipients: [
        {
          email,
          fullName: "Bạn (gửi thử)",
          title: "Test",
          desiredPosition: "Test",
        },
      ],
    };
  }

  if (input.audience === "list" || input.audience === "saved") {
    return {
      recipients: [],
      error: "Đối tượng này chưa hỗ trợ. Chọn «Ứng viên đã mở» hoặc dùng Gửi thử.",
    };
  }

  const within = input.openedWithin || "7d";
  if (openedWithinMs(within) == null) {
    return { recipients: [], error: "Khoảng thời gian «đã mở» không hợp lệ." };
  }

  const recipients = await listOpenedRecipients(input.employerId, within);
  if (recipients.length === 0) {
    return {
      recipients: [],
      error:
        "Không có ứng viên đã mở (có email thật) trong khoảng thời gian chọn. Hãy mở hồ sơ hoặc dùng Gửi thử.",
    };
  }
  return { recipients };
}

function campaignStatus(sent: number, failed: number, total: number): EmailCampaignStatus {
  if (total === 0) return "failed";
  if (failed === 0) return "sent";
  if (sent === 0) return "failed";
  return "partial";
}

export async function getCampaignsForEmployer(employerId: string) {
  return listEmailCampaigns(employerId);
}

export async function createAndSendCampaign(input: CreateCampaignInput): Promise<EmailCampaign> {
  if (!canSendEmail()) {
    throw new Error("SMTP_NOT_CONFIGURED");
  }

  const subject = input.subject.trim();
  const body = input.body.trim();
  if (!subject || !body) {
    throw new Error("SUBJECT_BODY_REQUIRED");
  }

  const resolved = await resolveCampaignRecipients({
    employerId: input.employerId,
    employerEmail: input.employerEmail,
    audience: input.audience,
    openedWithin: input.openedWithin,
    testMode: input.testMode,
    testToEmail: input.testToEmail,
  });

  if (resolved.error) {
    throw new Error(resolved.error);
  }

  const fromName = input.fromName.trim();
  const company = input.companyName?.trim() || "Công ty";
  const results: EmailSendResult[] = [];
  let sentCount = 0;
  let failedCount = 0;

  for (const r of resolved.recipients) {
    const vars = {
      ten_ung_vien: r.fullName,
      chuc_danh: r.desiredPosition || r.title,
      ten_cong_ty: company,
      ten_nguoi_gui: fromName || "HR",
    };
    try {
      const sent = await sendTransactionalEmail({
        to: r.email,
        subject: applyEmailTemplate(subject, vars),
        text: applyEmailTemplate(body, vars),
        fromName: fromName || undefined,
      });
      sentCount += 1;
      results.push({
        email: r.email,
        candidateId: r.candidateId,
        ok: true,
        previewUrl: sent.previewUrl,
      });
    } catch (err) {
      failedCount += 1;
      results.push({
        email: r.email,
        candidateId: r.candidateId,
        ok: false,
        error: err instanceof Error ? err.message : "Send failed",
      });
    }
  }

  const campaign: EmailCampaign = {
    id: randomUUID(),
    employerId: input.employerId,
    employerEmail: input.employerEmail,
    subject,
    body,
    fromName,
    audience: input.testMode ? "opened" : input.audience,
    openedWithin: input.testMode ? null : input.openedWithin || "7d",
    status: campaignStatus(sentCount, failedCount, resolved.recipients.length),
    recipientCount: resolved.recipients.length,
    sentCount,
    failedCount,
    testMode: Boolean(input.testMode),
    sentAt: new Date().toISOString(),
    results,
  };

  return saveEmailCampaign(campaign);
}

export function toPublicCampaign(c: EmailCampaign) {
  return {
    id: c.id,
    subject: c.subject,
    fromName: c.fromName,
    audience: c.audience,
    status: c.status,
    recipientCount: c.recipientCount,
    sentCount: c.sentCount,
    failedCount: c.failedCount,
    testMode: c.testMode,
    sentAt: c.sentAt,
    previewUrls: c.results.filter((r) => r.previewUrl).map((r) => r.previewUrl as string),
  };
}
