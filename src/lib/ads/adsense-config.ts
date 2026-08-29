/** Google AdSense publisher client (ca-pub-…). Set NEXT_PUBLIC_ADSENSE_CLIENT on Vercel. */
export function getAdSenseClientId(): string | undefined {
  const id = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  return id || undefined;
}

export function isAdSenseEnabled(): boolean {
  if (!getAdSenseClientId()) return false;
  if (process.env.NEXT_PUBLIC_ADSENSE_DISABLED === "1") return false;
  return process.env.NODE_ENV === "production";
}
