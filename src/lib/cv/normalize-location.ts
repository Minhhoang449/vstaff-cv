import "server-only";

import resolveData from "@/data/vn-location-resolve.json";
import {
  getProvinceByCode,
  shortProvinceName,
} from "@/data/vietnam-locations";

type ResolveData = {
  provinceAliases: Record<string, string>;
  wards: { c: string; p: string; n: string; a: string[] }[];
};

const data = resolveData as ResolveData;

export type ResolvedVnLocation = {
  location: string;
  address?: string;
  provinceCode: string;
  wardCode?: string;
  wardName?: string;
};

function stripDiacritics(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function norm(s: string) {
  return stripDiacritics(s.toLowerCase())
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Bỏ quận/huyện/thị xã cũ — hệ thống chỉ còn tỉnh + phường/xã. */
function stripOldDistrictTokens(text: string) {
  return text
    .replace(
      /(?:^|[,;\s])(?:quận|huyện|thị xã|thị trấn)\s+[^,;]+/giu,
      " "
    )
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s,;]+|[\s,;]+$/g, "")
    .trim();
}

function resolveProvinceCode(blob: string): string | null {
  const n = norm(blob);
  if (!n) return null;

  let best: { code: string; len: number } | null = null;
  for (const [alias, code] of Object.entries(data.provinceAliases)) {
    if (alias.length < 3) continue;
    if (n === alias || n.includes(` ${alias} `) || n.startsWith(`${alias} `) || n.endsWith(` ${alias}`) || n.includes(alias)) {
      if (!best || alias.length > best.len) best = { code, len: alias.length };
    }
  }
  return best?.code ?? null;
}

function resolveWard(
  provinceCode: string,
  blob: string
): { wardCode: string; wardName: string } | null {
  const n = norm(blob);
  if (!n) return null;

  let best: { wardCode: string; wardName: string; len: number } | null = null;
  for (const w of data.wards) {
    if (w.p !== provinceCode) continue;
    for (const alias of w.a) {
      if (alias.length < 3) continue;
      if (
        n === alias ||
        n.includes(` ${alias} `) ||
        n.startsWith(`${alias} `) ||
        n.endsWith(` ${alias}`) ||
        n.includes(alias)
      ) {
        if (!best || alias.length > best.len) {
          best = { wardCode: w.c, wardName: w.n, len: alias.length };
        }
      }
    }
  }
  return best ? { wardCode: best.wardCode, wardName: best.wardName } : null;
}

function buildDisplayAddress(opts: {
  rawAddress?: string;
  wardName?: string;
  provinceLabel: string;
}) {
  const parts: string[] = [];
  const cleaned = stripOldDistrictTokens(opts.rawAddress || "");
  // bỏ phần tỉnh/thành phố trùng ở cuối nếu có
  let street = cleaned
    .replace(
      new RegExp(
        `(?:,\\s*)?(?:tỉnh|thành phố|tp\\.?|tphcm)?\\s*${opts.provinceLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`,
        "iu"
      ),
      ""
    )
    .replace(/,\s*$/g, "")
    .trim();

  if (opts.wardName) {
    const wardNorm = norm(opts.wardName);
    const streetNorm = norm(street);
    if (street && !streetNorm.includes(wardNorm.replace(/^(phuong|xa|thi tran|dac khu)\s+/, ""))) {
      // giữ phần số nhà / đường nếu còn
      const withoutWardish = street
        .replace(
          /(?:^|[,;\s])(?:phường|xã|thị trấn|đặc khu)\s+[^,;]+/giu,
          " "
        )
        .replace(/\s{2,}/g, " ")
        .replace(/^[\s,;]+|[\s,;]+$/g, "")
        .trim();
      if (withoutWardish && withoutWardish.length >= 3) parts.push(withoutWardish);
    } else if (street && streetNorm.length > wardNorm.length + 2) {
      parts.push(street);
    }
    parts.push(opts.wardName);
  } else if (street) {
    parts.push(street);
  }
  parts.push(opts.provinceLabel);
  return [...new Set(parts.filter(Boolean))].join(", ");
}

/**
 * Chuẩn hóa địa chỉ CV (thường còn quận/huyện hoặc tỉnh cũ đã sáp nhập)
 * sang tỉnh + phường/xã theo đơn vị hành chính 2 cấp sau 1/7/2025.
 */
export function resolveVnLocation(
  rawLocation?: string | null,
  rawAddress?: string | null
): ResolvedVnLocation {
  const blob = [rawLocation, rawAddress].filter(Boolean).join(" | ");
  const provinceCode = resolveProvinceCode(blob) || "79";
  const province = getProvinceByCode(provinceCode);
  const provinceLabel = province
    ? shortProvinceName(province.name)
    : "TP. Hồ Chí Minh";

  const ward = resolveWard(provinceCode, blob);
  const address = buildDisplayAddress({
    rawAddress: rawAddress || rawLocation || undefined,
    wardName: ward?.wardName,
    provinceLabel,
  });

  return {
    location: provinceLabel,
    address: address || provinceLabel,
    provinceCode,
    wardCode: ward?.wardCode,
    wardName: ward?.wardName,
  };
}
