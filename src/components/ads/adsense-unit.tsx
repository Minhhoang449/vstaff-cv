"use client";

import { useEffect } from "react";

type Props = {
  slot: string;
  client: string;
  className?: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
};

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

/** Khối quảng cáo thủ công — cần ad slot từ AdSense → Ad units. */
export function AdSenseUnit({ slot, client, className, format = "auto" }: Props) {
  useEffect(() => {
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      /* adblock / script chưa load */
    }
  }, [slot]);

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
