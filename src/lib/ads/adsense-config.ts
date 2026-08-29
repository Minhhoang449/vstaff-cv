/** Google AdSense publisher client (ca-pub-…). Server env — injected in HTML, not bundled to client JS. */
export function getAdSenseClientId(): string | undefined {
  const id = process.env.ADSENSE_CLIENT?.trim();
  return id || undefined;
}

export function isAdSenseEnabled(): boolean {
  if (!getAdSenseClientId()) return false;
  if (process.env.ADSENSE_DISABLED === "1") return false;
  return process.env.NODE_ENV === "production";
}
