/**
 * Tạo src/data/vn-location-resolve.json từ scripts/sapnhap2025-vn.json
 * để map địa chỉ CV cũ → tỉnh/phường-xã sau 1/7/2025.
 *
 * Usage: node scripts/generate-vn-location-resolve.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const src = path.join(__dirname, "sapnhap2025-vn.json");
const out = path.join(root, "src", "data", "vn-location-resolve.json");

if (!fs.existsSync(src)) {
  console.error("Missing scripts/sapnhap2025-vn.json");
  process.exit(1);
}

function stripDiacritics(s) {
  return s
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function norm(s) {
  return stripDiacritics(String(s).toLowerCase())
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function splitAliases(truoc) {
  if (!truoc || /giữ nguyên/i.test(truoc)) return [];
  return String(truoc)
    .split(/,| và |;|\./)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => x.replace(/\(.*?\)/g, "").trim())
    .filter((x) => x.length > 2);
}

const raw = JSON.parse(fs.readFileSync(src, "utf8"));
const provinceAliases = {};

for (const p of raw.filter((x) => String(x.magoc) === "0")) {
  const code = String(p.ma).padStart(2, "0");
  for (const a of [p.ten, ...splitAliases(p.truocsapnhap)]) {
    const n = norm(
      a.replace(/^(thành phố|thủ đô|tỉnh|tp\.?|tphcm)\s*/i, "")
    );
    if (n.length >= 3) provinceAliases[n] = code;
  }
}

Object.assign(provinceAliases, {
  "ho chi minh": "79",
  "sai gon": "79",
  hcm: "79",
  tphcm: "79",
  "tp hcm": "79",
  "ba ria vung tau": "79",
  "vung tau": "79",
  "binh duong": "79",
  "ha noi": "01",
  hn: "01",
  "da nang": "48",
  "quang nam": "48",
  "hai phong": "31",
  "hai duong": "31",
  "can tho": "92",
  "soc trang": "92",
  "hau giang": "92",
});

const wards = [];
for (const w of raw.filter((x) => String(x.magoc) !== "0")) {
  const code = String(w.ma);
  const p = String(w.magoc).padStart(2, "0");
  const name = String(w.ten).trim();
  const aliases = new Set();
  const base = norm(name.replace(/^(phường|xã|thị trấn|đặc khu)\s+/iu, ""));
  if (base) aliases.add(base);
  aliases.add(norm(name));
  for (const a of splitAliases(w.truocsapnhap)) {
    const na = norm(
      a.replace(/^(phường|xã|thị trấn|thị xã|quận|huyện)\s+/iu, "")
    );
    if (na.length >= 3) aliases.add(na);
  }
  wards.push({ c: code, p, n: name, a: [...aliases] });
}

fs.writeFileSync(out, JSON.stringify({ provinceAliases, wards }));
console.log(
  `Wrote ${out} — ${Object.keys(provinceAliases).length} province aliases, ${wards.length} wards`
);
