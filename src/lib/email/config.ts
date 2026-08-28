import "server-only";

export function getMailConfig() {
  const port = Number(process.env.SMTP_PORT || "587");
  return {
    host: process.env.SMTP_HOST?.trim() || "",
    port: Number.isFinite(port) && port > 0 ? port : 587,
    secure: process.env.SMTP_SECURE === "1" || process.env.SMTP_SECURE === "true",
    user: process.env.SMTP_USER?.trim() || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.MAIL_FROM?.trim() || "noreply@vstaff.io.vn",
    fromName: process.env.MAIL_FROM_NAME?.trim() || "Vstaff",
    /** Chưa có SMTP thật: dùng Ethereal (xem mail tại ethereal.email). */
    emailDevMode:
      process.env.EMAIL_DEV_MODE === "1" || process.env.EMAIL_DEV_MODE === "true",
  };
}

export function isSmtpConfigured() {
  const c = getMailConfig();
  return Boolean(c.host && c.user && c.pass && c.from);
}

/** Có thể gửi: SMTP thật hoặc chế độ dev Ethereal. */
export function canSendEmail() {
  const c = getMailConfig();
  return isSmtpConfigured() || c.emailDevMode;
}

export function getMailPublicStatus() {
  const c = getMailConfig();
  const smtp = isSmtpConfigured();
  return {
    configured: canSendEmail(),
    mode: smtp ? ("smtp" as const) : c.emailDevMode ? ("dev" as const) : ("off" as const),
    from: c.from,
    fromName: c.fromName,
  };
}
