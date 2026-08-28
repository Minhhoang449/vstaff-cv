import fs from "node:fs";
import https from "node:https";
import os from "node:os";
import path from "node:path";

const out = path.join(os.tmpdir(), "or-models.json");

function fetchModels() {
  return new Promise((resolve, reject) => {
    https
      .get("https://openrouter.ai/api/v1/models", (res) => {
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

const raw = await fetchModels();
fs.writeFileSync(out, JSON.stringify(raw));
const models = raw.data || [];

function row(m) {
  const p = m.pricing || {};
  const inp = Number(p.prompt ?? Infinity);
  const outp = Number(p.completion ?? Infinity);
  const modalities = m.architecture?.input_modalities || [];
  const image = Array.isArray(modalities) && modalities.includes("image");
  return {
    id: m.id,
    inpM: inp * 1e6,
    outM: outp * 1e6,
    image,
  };
}

const all = models.map(row).filter((m) => Number.isFinite(m.inpM));

const deep = all.filter((m) => /deepseek/i.test(m.id)).sort((a, b) => a.inpM - b.inpM);
console.log("=== DeepSeek ===");
for (const m of deep) {
  console.log(
    `${m.image ? "[IMG]" : "[TXT]"} ${m.id}  $${m.inpM.toFixed(4)} / $${m.outM.toFixed(4)} per 1M`
  );
}

const visionPaid = all
  .filter((m) => m.image && m.inpM > 0)
  .sort((a, b) => a.inpM - b.inpM || a.outM - b.outM)
  .slice(0, 20);
console.log("\n=== Cheapest VISION (paid) ===");
for (const m of visionPaid) {
  console.log(`${m.id}  $${m.inpM.toFixed(4)} / $${m.outM.toFixed(4)}`);
}

const visionFree = all.filter((m) => m.image && m.inpM === 0).slice(0, 15);
console.log("\n=== Free VISION ===");
for (const m of visionFree) console.log(m.id);

const textCheap = all
  .filter((m) => !m.image && m.inpM > 0 && m.inpM < 0.5)
  .sort((a, b) => a.inpM - b.inpM)
  .slice(0, 15);
console.log("\n=== Cheapest TEXT (<$0.5/M in) ===");
for (const m of textCheap) {
  console.log(`${m.id}  $${m.inpM.toFixed(4)} / $${m.outM.toFixed(4)}`);
}
