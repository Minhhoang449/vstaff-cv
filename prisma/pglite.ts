import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { PGlite } from "@electric-sql/pglite";
import { PrismaPGlite } from "pglite-prisma-adapter";
import { PrismaClient } from "../src/generated/prisma";

export const PGLITE_DATA_DIR = join(process.cwd(), ".data", "pglite");

export async function createPglitePrisma(): Promise<{
  prisma: PrismaClient;
  pglite: PGlite;
  close: () => Promise<void>;
}> {
  mkdirSync(PGLITE_DATA_DIR, { recursive: true });
  const pglite = new PGlite(PGLITE_DATA_DIR);
  const factory = new PrismaPGlite(pglite);
  const prisma = new PrismaClient({ adapter: factory as never });
  return {
    prisma,
    pglite,
    close: async () => {
      await prisma.$disconnect();
      await pglite.close();
    },
  };
}

export async function ensurePgliteSchema(pglite: PGlite) {
  const schemaPath = join(process.cwd(), "prisma", "sql", "schema.sql");
  if (!existsSync(schemaPath)) {
    throw new Error(
      `Missing ${schemaPath}. Run: npx prisma migrate diff --from-empty --to-schema prisma/schema.prisma --script -o prisma/sql/schema.sql`
    );
  }

  // Luôn chạy (IF NOT EXISTS) để thêm bảng mới như EmployerSubscription
  await pglite.exec(readFileSync(schemaPath, "utf8"));

  const indexesPath = join(process.cwd(), "prisma", "sql", "indexes.sql");
  if (existsSync(indexesPath)) {
    try {
      await pglite.exec(readFileSync(indexesPath, "utf8"));
    } catch {
      // pg_trgm may be unavailable in PGlite
    }
  }
}

export function shouldUsePglite(): boolean {
  if (process.env.USE_PGLITE === "1" || process.env.USE_PGLITE === "true") return true;
  if (process.env.DATABASE_URL?.startsWith("pglite:")) return true;
  return false;
}
