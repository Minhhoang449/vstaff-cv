/** Cấu hình SePay từ biến môi trường — không hardcode secret. */
export function getSePayConfig() {
  const prefix = (process.env.SEPAY_PAYMENT_PREFIX || "VSTAFF").toUpperCase().replace(/[^A-Z0-9]/g, "");
  return {
    webhookSecret: process.env.SEPAY_WEBHOOK_SECRET || "",
    apiKey: process.env.SEPAY_API_KEY || "",
    bankAccount: process.env.SEPAY_BANK_ACCOUNT || "",
    bankBin: process.env.SEPAY_BANK_BIN || "",
    accountName: process.env.SEPAY_ACCOUNT_NAME || "VSTAFF",
    paymentPrefix: prefix || "VSTAFF",
  };
}

export function isSePayCheckoutConfigured() {
  const c = getSePayConfig();
  return Boolean(c.bankAccount && c.bankBin);
}
