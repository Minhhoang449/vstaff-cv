import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Dummy URL đủ cho `prisma generate`; runtime dùng adapter (pg / PGlite)
    url: process.env.DATABASE_URL || "postgresql://postgres:postgres@localhost:5432/vstaff",
  },
});
