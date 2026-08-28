/**
 * Tạo lại src/data/vietnam-wards.json từ scripts/sapnhap2025-vn.json
 * (nguồn: https://github.com/ngankt2/vn-location — sapnhap2025-vn.json)
 *
 * Usage: node scripts/generate-vietnam-wards.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const src = path.join(__dirname, "sapnhap2025-vn.json");
const out = path.join(root, "src", "data", "vietnam-wards.json");

if (!fs.existsSync(src)) {
  console.error("Missing scripts/sapnhap2025-vn.json — download sapnhap2025-vn.json first.");
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(src, "utf8"));
const wardsRaw = raw.filter((x) => String(x.magoc) !== "0");
const by = {};

for (const w of wardsRaw) {
  const pc = String(w.magoc).padStart(2, "0");
  if (!by[pc]) by[pc] = [];
  by[pc].push({ code: String(w.ma), name: String(w.ten).trim() });
}

for (const k of Object.keys(by)) {
  by[k].sort((a, b) => a.name.localeCompare(b.name, "vi"));
}

fs.writeFileSync(out, JSON.stringify(by));
const total = Object.values(by).reduce((n, a) => n + a.length, 0);
console.log(`Wrote ${out} — ${Object.keys(by).length} provinces, ${total} wards`);
