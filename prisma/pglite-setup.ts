/**
 * Bootstrap embedded Postgres (PGlite) when Docker/Postgres is unavailable.
 * Usage: npm run db:local:setup
 */
import "dotenv/config";
import { createPglitePrisma, ensurePgliteSchema, PGLITE_DATA_DIR } from "./pglite";

async function main() {
  console.log(`PGlite data dir: ${PGLITE_DATA_DIR}`);
  const { prisma, pglite, close } = await createPglitePrisma();
  try {
    await ensurePgliteSchema(pglite);
    const tables = await pglite.query<{ table_name: string }>(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name`
    );
    console.log(
      "Schema ready. Tables:",
      tables.rows.map((t) => t.table_name).join(", ")
    );
    console.log("Next: npm run db:local:seed");
  } finally {
    await close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
