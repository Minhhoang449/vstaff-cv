/** Read auth secret at Lambda cold start (bracket access avoids build-time inlining). */
export function readAuthSecret(): string | undefined {
  const secret =
    process.env["AUTH_SECRET"]?.trim() ||
    process.env["NEXTAUTH_SECRET"]?.trim();
  return secret || undefined;
}
