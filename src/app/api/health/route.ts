import { NextResponse } from "next/server";

/** Runtime env check (no secret values exposed). Remove after production is stable. */
export async function GET() {
  return NextResponse.json({
    ok: true,
    authSecret: Boolean(process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET),
    databaseUrl: Boolean(process.env.DATABASE_URL),
    authUrl: process.env.AUTH_URL ?? null,
  });
}
