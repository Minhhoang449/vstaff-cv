/**
 * Đơn vị hành chính 2 cấp sau 1/7/2025 (Quyết định 19/2025/QĐ-TTg):
 * 34 tỉnh/thành phố + 3.321 phường/xã/đặc khu.
 * Không còn cấp quận/huyện.
 *
 * Nguồn: open-admin-data/vietnam-administrative-divisions
 */

import adminUnits from "@/data/vn-admin-units.json";

export type Province = {
  code: string;
  name: string;
  type: "thanh-pho" | "tinh";
};

export type District = {
  code: string;
  name: string;
};

/** @deprecated Alias — cấp dưới tỉnh giờ là phường/xã, không còn quận/huyện. */
export type Ward = District;

export const PROVINCES = adminUnits.provinces as Province[];

const WARDS_BY_PROVINCE = adminUnits.wardsByProvince as Record<string, District[]>;

export const ADMIN_META = adminUnits.meta;

export function getWards(provinceCode: string | null | undefined): District[] {
  if (!provinceCode) return [];
  return WARDS_BY_PROVINCE[provinceCode] ?? [];
}

/** @deprecated Dùng getWards — sau 1/7/2025 không còn quận/huyện. */
export function getDistricts(provinceCode: string | null | undefined): District[] {
  return getWards(provinceCode);
}

export function getProvinceByCode(code: string | null | undefined) {
  if (!code) return null;
  return PROVINCES.find((p) => p.code === code) ?? null;
}

export function shortProvinceName(name: string) {
  return name.replace(/^Thành phố\s+/u, "");
}

export function countWards(provinceCode: string | null | undefined) {
  return getWards(provinceCode).length;
}
