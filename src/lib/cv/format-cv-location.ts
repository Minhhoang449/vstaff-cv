function stripDiacritics(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function normLoc(s: string) {
  return stripDiacritics(s.toLowerCase())
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Bỏ quận/huyện/thị xã cũ — hệ thống chỉ còn tỉnh + phường/xã. */
export function stripOldDistrictTokens(text: string) {
  return text
    .replace(/(?:^|[,;\s])(?:quận|huyện|thị xã|thị trấn)\s+[^,;]+/giu, " ")
    .replace(/\s{2,}/g, " ")
    .replace(/^[\s,;]+|[\s,;]+$/g, "")
    .trim();
}

function wardCore(name: string) {
  return normLoc(name).replace(/^(phuong|xa|thi tran|dac khu|p)\s+/, "");
}

function normalizeWardLabel(seg: string): string {
  const t = seg.trim();
  if (/^phường|^xã|^thị trấn|^đặc khu/i.test(t)) return t;
  if (/^p\.?\s*/i.test(t)) return `Phường ${t.replace(/^p\.?\s*/i, "").trim()}`;
  return t;
}

function isWardSegment(seg: string): boolean {
  const n = normLoc(seg);
  return /^(phuong|xa|thi tran|dac khu)\b/.test(n) || /^p [a-z]/.test(n);
}

function isProvinceSegment(seg: string, locationHint?: string): boolean {
  const n = normLoc(seg);
  if (!n) return false;
  if (locationHint) {
    const lh = normLoc(locationHint);
    if (n === lh || n.includes(lh) || lh.includes(n)) return true;
  }
  if (/^(tp|tinh|thanh pho)\s/.test(n)) return true;
  if (
    /^(ho chi minh|ha noi|da nang|hai phong|can tho|hue|ba ria vung tau|binh duong|dong nai|khanh hoa|lam dong)$/.test(
      n
    )
  ) {
    return true;
  }
  return false;
}

function uniqueParts(parts: string[]): string[] {
  const seen = new Set<string>();
  return parts.filter((p) => {
    const key = normLoc(p);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/** Ghép địa chỉ CV: số nhà → phường/xã → tỉnh/thành — không lặp, đúng thứ tự VN. */
export function formatCvLocationLine(opts: {
  address?: string;
  wardName?: string;
  location?: string;
}): string {
  const segments = (opts.address || "")
    .split(/[,;]/)
    .map((s) => stripOldDistrictTokens(s.trim()))
    .filter(Boolean);

  const streetParts: string[] = [];
  let ward = opts.wardName?.trim() || "";
  let province = opts.location?.trim() || "";

  for (const seg of segments) {
    if (isWardSegment(seg)) {
      if (!ward) ward = normalizeWardLabel(seg);
      continue;
    }
    if (isProvinceSegment(seg, province || opts.location)) {
      if (!province) province = seg;
      continue;
    }
    if (opts.location && normLoc(seg) === normLoc(opts.location)) {
      if (!province) province = opts.location.trim();
      continue;
    }
    streetParts.push(seg);
  }

  if (!ward && opts.wardName?.trim()) ward = opts.wardName.trim();
  if (!province && opts.location?.trim()) province = opts.location.trim();

  const parts: string[] = [];
  const street = streetParts.join(", ").trim();
  if (street) parts.push(street);

  if (ward) {
    const core = wardCore(ward);
    const dup = parts.some((p) => core.length > 2 && normLoc(p).includes(core));
    if (!dup) parts.push(ward);
  }

  if (province) {
    const ln = normLoc(province);
    const dup = parts.some((p) => {
      const pn = normLoc(p);
      return pn.includes(ln) || ln.includes(pn);
    });
    if (!dup) parts.push(province);
  }

  return uniqueParts(parts).join(", ") || province || "Việt Nam";
}

/** Ngày sinh hiển thị trên CV (dd/mm/yyyy). */
export function formatCvBirthDate(dateOfBirth?: string | null): string {
  return dateOfBirth?.trim() || "";
}
