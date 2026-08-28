export type DeliverySlot = "morning" | "noon" | "afternoon" | "custom";

export type DeliveryJobStatus = "active" | "paused" | "ended";

/** Trần số CV hệ thống gửi NTD mỗi ngày (mọi lệnh lọc cộng dồn). */
export const DELIVERY_DAILY_CV_LIMIT = 50;

/** Hồ sơ cập nhật trong N ngày được coi là CV mới (ưu tiên gửi trước). */
export const DELIVERY_NEW_CV_DAYS = 14;

export type CandidateDeliveryJob = {
  id: string;
  employerId: string;
  position: string;
  industryId: string;
  provinceCode: string;
  wardCode: string;
  gender: string;
  language: string;
  ageRange: string;
  delivery: DeliverySlot;
  notes: string;
  status: DeliveryJobStatus;
  matchedCandidateIds: string[];
  matchedCount: number;
  createdAt: string;
  updatedAt: string;
  lastRunAt: string | null;
};

const DELIVERY_LABELS: Record<DeliverySlot, string> = {
  morning: "Mỗi sáng (08:00 – 09:00)",
  noon: "Giữa ngày (11:30 – 12:30)",
  afternoon: "Chiều (16:00 – 17:00)",
  custom: "Khung giờ khác",
};

export function deliverySlotLabel(slot: DeliverySlot) {
  return DELIVERY_LABELS[slot] || slot;
}
