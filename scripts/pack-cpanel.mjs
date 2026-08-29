import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const distDir = ".next";
const distPath = path.join(root, distDir);
const deployVersion = process.env.DEPLOY_VERSION || "v4";
const outTar = path.join(root, `next-cpanel-${deployVersion}.tar.gz`);

console.log("[pack-cpanel] Building with NEXT_DIST_DIR=.next ...");
execSync("npm run build", {
  cwd: root,
  stdio: "inherit",
  env: { ...process.env, NEXT_DIST_DIR: distDir },
});

const buildId = fs.readFileSync(path.join(distPath, "BUILD_ID"), "utf8").trim();
const manifestDir = path.join(distPath, "static", buildId);
if (!fs.existsSync(manifestDir)) {
  throw new Error(`Missing ${manifestDir}`);
}

const chunkDir = path.join(distPath, "static/chunks");
const chunkFiles = fs.readdirSync(chunkDir).filter((f) => /^4921-[a-f0-9]+\.js$/.test(f));
if (chunkFiles.length === 0) {
  throw new Error("No 4921-* chunk in static/chunks");
}

const chunkName = chunkFiles[0];
if (chunkName.includes("a0abe56278b25fe7")) {
  throw new Error(`Old chunk still in build: ${chunkName}`);
}

const chunkPath = path.join(chunkDir, chunkName);
fs.writeFileSync(
  path.join(distPath, "DEPLOY_VERSION"),
  `${deployVersion}\n`,
  "utf8",
);
const rsfPath = path.join(distPath, "required-server-files.json");
const rsf = JSON.parse(fs.readFileSync(rsfPath, "utf8"));
rsf.config.distDir = distDir;
fs.writeFileSync(rsfPath, JSON.stringify(rsf));

console.log(`[pack-cpanel] DEPLOY_VERSION=${deployVersion}`);
console.log(`[pack-cpanel] BUILD_ID=${buildId}`);
console.log(`[pack-cpanel] chunk=${chunkName} (${fs.statSync(chunkPath).size} bytes)`);

if (fs.existsSync(outTar)) fs.unlinkSync(outTar);
execSync(`tar -czf "${outTar}" -C "${distPath}" .`, { cwd: root, stdio: "inherit" });

console.log(`[pack-cpanel] Created ${outTar}`);
console.log(
  `[pack-cpanel] Deploy: delete server .next/ → extract ${path.basename(outTar)} INSIDE new .next/ → restart Node`,
);
