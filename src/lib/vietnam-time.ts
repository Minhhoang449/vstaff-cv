/** Lịch ngày theo Asia/Ho_Chi_Minh (YYYY-MM-DD). */
export function vietnamCalendarDate(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const y = parts.find((p) => p.type === "year")?.value ?? "1970";
  const m = parts.find((p) => p.type === "month")?.value ?? "01";
  const d = parts.find((p) => p.type === "day")?.value ?? "01";
  return `${y}-${m}-${d}`;
}

/** 00:00 hôm nay (VN) dạng ISO có offset +07:00. */
export function startOfTodayVietnamIso(now = new Date()): string {
  return `${vietnamCalendarDate(now)}T00:00:00+07:00`;
}
