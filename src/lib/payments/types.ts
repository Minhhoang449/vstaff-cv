export type PaymentOrderStatus = "pending" | "paid" | "cancelled" | "expired";

export type PaymentOrder = {
  id: string;
  code: string;
  employerId: string;
  employerEmail: string;
  planId: string;
  planName: string;
  amount: number;
  /** Giá gốc trước KM (nếu có) */
  originalAmount?: number | null;
  promoCode?: string | null;
  durationDays: number;
  cvLimit: number | null;
  status: PaymentOrderStatus;
  createdAt: string;
  paidAt: string | null;
  expiresAt: string;
  sepayTxnId: string | null;
  transferAmount: number | null;
  gateway: string | null;
};

export type SePayWebhookPayload = {
  id?: number | string;
  gateway?: string;
  transactionDate?: string;
  accountNumber?: string;
  code?: string | null;
  content?: string;
  transferType?: string;
  transferAmount?: number;
  referenceCode?: string;
  description?: string;
};
