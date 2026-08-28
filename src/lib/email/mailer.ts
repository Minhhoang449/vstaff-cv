import "server-only";

import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import { getMailConfig, isSmtpConfigured } from "@/lib/email/config";

let transporter: nodemailer.Transporter | null = null;
let etherealUser: string | null = null;

async function getTransporter() {
  const c = getMailConfig();

  if (isSmtpConfigured()) {
    if (transporter) return transporter;
    transporter = nodemailer.createTransport({
      host: c.host,
      port: c.port,
      secure: c.secure,
      auth: {
        user: c.user,
        pass: c.pass,
      },
    });
    return transporter;
  }

  if (c.emailDevMode) {
    if (transporter) return transporter;
    const testAccount = await nodemailer.createTestAccount();
    etherealUser = testAccount.user;
    transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.info(
      `[email] EMAIL_DEV_MODE: Ethereal account ${testAccount.user} (mails at https://ethereal.email)`
    );
    return transporter;
  }

  throw new Error("SMTP_NOT_CONFIGURED");
}

export async function sendTransactionalEmail(opts: {
  to: string;
  subject: string;
  text: string;
  fromName?: string;
}) {
  const c = getMailConfig();
  const displayName = (opts.fromName?.trim() || c.fromName).trim();
  const from = displayName ? `"${displayName.replace(/"/g, "")}" <${c.from}>` : c.from;

  const transport = await getTransporter();
  const info = (await transport.sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
  })) as SMTPTransport.SentMessageInfo;

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.info(`[email] Preview: ${previewUrl}`);
  } else if (etherealUser) {
    console.info(`[email] Sent via Ethereal ${etherealUser} — check https://ethereal.email`);
  }

  return {
    messageId: info.messageId as string | undefined,
    previewUrl: typeof previewUrl === "string" ? previewUrl : undefined,
  };
}
