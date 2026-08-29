import type { DeliverySlot } from "@/lib/delivery-job-types";
import { deliverySlotLabel } from "@/lib/delivery-job-types";

type WindowDef = { startH: number; startM: number; endH: number; endM: number };

const SLOT_WINDOWS: Record<Exclude<DeliverySlot, "custom">, WindowDef> = {
  morning: { startH: 8, startM: 0, endH: 9, endM: 0 },
  noon: { startH: 11, startM: 30, endH: 12, endM: 30 },
  afternoon: { startH: 16, startM: 0, endH: 17, endM: 0 },
};

export function getVietnamDateTimeParts(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }).formatToParts(now);

  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "0";
  const hour = Number(get("hour"));
  const minute = Number(get("minute"));

  return {
    hour,
    minute,
    dateKey: `${get("year")}-${get("month")}-${get("day")}`,
    minutesOfDay: hour * 60 + minute,
  };
}

/** Có đang trong khung giờ nhận CV (giờ VN) không. */
export function isInDeliveryWindow(slot: DeliverySlot, now = new Date()): boolean {
  const { minutesOfDay } = getVietnamDateTimeParts(now);
  if (slot === "custom") {
    return minutesOfDay >= 8 * 60 && minutesOfDay < 18 * 60;
  }
  const w = SLOT_WINDOWS[slot];
  const start = w.startH * 60 + w.startM;
  const end = w.endH * 60 + w.endM;
  return minutesOfDay >= start && minutesOfDay < end;
}

export function vietnamDateKeyFromIso(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (!Number.isFinite(d.getTime())) return null;
  return getVietnamDateTimeParts(d).dateKey;
}

/** Lệnh đã chạy khớp/gửi trong ngày hôm nay (VN) chưa. */
export function hasDeliveryRunToday(lastRunAt: string | null, now = new Date()): boolean {
  if (!lastRunAt) return false;
  return vietnamDateKeyFromIso(lastRunAt) === getVietnamDateTimeParts(now).dateKey;
}

export function formatDeliveryDateTimeVi(iso: string) {
  return new Date(iso).toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function scheduledDeliveryHint(slot: DeliverySlot) {
  return deliverySlotLabel(slot);
}
