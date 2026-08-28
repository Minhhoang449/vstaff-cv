export type EmailAudience = "opened" | "list" | "saved";

export type EmailCampaignStatus = "sent" | "partial" | "failed" | "draft";

export type EmailSendResult = {
  email: string;
  candidateId?: string;
  ok: boolean;
  error?: string;
  previewUrl?: string;
};

export type EmailCampaign = {
  id: string;
  employerId: string;
  employerEmail: string;
  subject: string;
  body: string;
  fromName: string;
  audience: EmailAudience;
  openedWithin: string | null;
  status: EmailCampaignStatus;
  recipientCount: number;
  sentCount: number;
  failedCount: number;
  testMode: boolean;
  sentAt: string;
  results: EmailSendResult[];
};
