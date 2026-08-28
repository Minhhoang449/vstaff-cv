import "dotenv/config";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { PrismaPg } from "@prisma/adapter-pg";
import { PGlite } from "@electric-sql/pglite";
import { PrismaPGlite } from "pglite-prisma-adapter";
import { PrismaClient } from "@/generated/prisma";
import { ensureDemoUsers } from "@/lib/ensure-demo-users";

const PGLITE_DATA_DIR = resolve(String(process.cwd()), ".data", "pglite");

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pglite: PGlite | undefined;
  dbReadyAt: number | undefined;
  dbReady: boolean | undefined;
  schemaReady: boolean | undefined;
};

function usePglite(): boolean {
  if (process.env.USE_PGLITE === "0" || process.env.USE_PGLITE === "false") return false;
  if (
    process.env.USE_PGLITE === "1" ||
    process.env.USE_PGLITE === "true" ||
    Boolean(process.env.DATABASE_URL?.startsWith("pglite:"))
  ) {
    return true;
  }
  const url = process.env.DATABASE_URL || "";
  if (!url || /localhost|127\.0\.0\.1/.test(url)) return true;
  return false;
}

async function ensurePgliteSchema(pglite: PGlite) {
  if (globalForPrisma.schemaReady) return;
  const check = await pglite.query<{ exists: boolean }>(
    `SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'CandidateProfile'
    ) AS exists`
  );
  const schemaPath = resolve(String(process.cwd()), "prisma", "sql", "schema.sql");
  if (!existsSync(schemaPath)) {
    throw new Error(`Missing ${schemaPath}`);
  }
  await pglite.exec(readFileSync(schemaPath, "utf8"));
  if (!check.rows[0]?.exists) {
    console.info("[db] PGlite schema initialized");
  }
  globalForPrisma.schemaReady = true;
}

function createPgClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");
  const adapter = new PrismaPg({ connectionString: String(connectionString) });
  return new PrismaClient({ adapter });
}

function createPgliteClient() {
  mkdirSync(PGLITE_DATA_DIR, { recursive: true });
  if (!globalForPrisma.pglite) {
    // Không fallback in-memory — sẽ mất user seed và login báo sai mật khẩu.
    globalForPrisma.pglite = new PGlite(PGLITE_DATA_DIR);
  }
  const factory = new PrismaPGlite(globalForPrisma.pglite);
  return new PrismaClient({ adapter: factory as never });
}

export function getPrisma(): PrismaClient | null {
  if (usePglite()) {
    try {
      return (globalForPrisma.prisma ??= createPgliteClient());
    } catch {
      return null;
    }
  }

  if (!process.env.DATABASE_URL) return null;
  try {
    return (globalForPrisma.prisma ??= createPgClient());
  } catch {
    return null;
  }
}

const READY_TTL_MS = 30_000;
const FAIL_TTL_MS = 3_000;

export async function isDatabaseReady(): Promise<boolean> {
  const now = Date.now();
  if (
    globalForPrisma.dbReady !== undefined &&
    globalForPrisma.dbReadyAt !== undefined
  ) {
    const ttl = globalForPrisma.dbReady ? READY_TTL_MS : FAIL_TTL_MS;
    if (now - globalForPrisma.dbReadyAt < ttl) {
      return globalForPrisma.dbReady;
    }
  }

  const mark = (ready: boolean) => {
    globalForPrisma.dbReady = ready;
    globalForPrisma.dbReadyAt = now;
    return ready;
  };

  if (usePglite()) {
    try {
      const prisma = getPrisma();
      if (!prisma || !globalForPrisma.pglite) {
        console.warn("[db] PGlite client missing");
        return mark(false);
      }
      await ensurePgliteSchema(globalForPrisma.pglite);
      await prisma.$queryRaw`SELECT 1`;
      try {
        await ensureDemoUsers(prisma);
      } catch (seedErr) {
        console.warn("[db] ensureDemoUsers failed", seedErr);
      }
      return mark(true);
    } catch (err) {
      console.error("[db] PGlite not ready", err);
      return mark(false);
    }
  }

  const prisma = getPrisma();
  if (!prisma) return mark(false);

  try {
    await prisma.$queryRaw`SELECT 1`;
    return mark(true);
  } catch (err) {
    console.warn("[db] Postgres unreachable, falling back to PGlite", err);
    try {
      globalForPrisma.prisma = createPgliteClient();
      if (!globalForPrisma.pglite) return mark(false);
      await ensurePgliteSchema(globalForPrisma.pglite);
      await globalForPrisma.prisma.$queryRaw`SELECT 1`;
      try {
        await ensureDemoUsers(globalForPrisma.prisma);
      } catch (seedErr) {
        console.warn("[db] ensureDemoUsers failed", seedErr);
      }
      return mark(true);
    } catch (err2) {
      console.error("[db] PGlite fallback failed", err2);
      return mark(false);
    }
  }
}
