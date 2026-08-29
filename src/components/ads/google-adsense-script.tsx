import Script from "next/script";
import { getAdSenseClientId, isAdSenseEnabled } from "@/lib/ads/adsense-config";

/** Loader AdSense — bật Auto ads từ AdSense dashboard. Chỉ trang marketing. */
export function GoogleAdSenseScript() {
  const client = getAdSenseClientId();
  if (!isAdSenseEnabled() || !client) return null;

  return (
    <Script
      id="google-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
