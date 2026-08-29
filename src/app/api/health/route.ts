import { NextResponse } from "next/server";
import { readAuthSecret } from "@/lib/auth-secret";

/** Runtime env check (no secret values exposed). */
export async function GET() {
  const secret = readAuthSecret();
  return NextResponse.json({
    ok: true,
    authSecret: Boolean(secret),
    authSecretLength: secret?.length ?? 0,
    databaseUrl: Boolean(process.env["DATABASE_URL"]),
    authUrl: process.env["AUTH_URL"] ?? null,
    nodeEnv: process.env["NODE_ENV"] ?? null,
  });
}
