"use client";

import { useEffect, useRef } from "react";
import type { AdPosition } from "@/framework/types";
import { useConsent, useSite } from "@/framework/SiteProvider";

export function AdSlot({ position }: { position: AdPosition }) {
  const { ads, analytics } = useSite();
  const { preferences, status } = useConsent();
  const pushed = useRef(false);
  const slot = ads.slots[position];

  useEffect(() => {
    if (!slot?.enabled || !analytics.googleAdsenseClientId || !slot.adSlot) return;
    if (status === "pending" || !preferences.advertising) return;
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch { /* ignore */ }
  }, [slot, analytics.googleAdsenseClientId, status, preferences.advertising]);

  if (!slot?.enabled || !analytics.googleAdsenseClientId || !slot.adSlot) return null;
  if (status === "pending" || !preferences.advertising) return null;

  return (
    <aside className="my-4 flex justify-center" aria-label="Publicité" data-ad-position={position}>
      <ins
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={analytics.googleAdsenseClientId}
        data-ad-slot={slot.adSlot}
        data-ad-format={slot.format ?? "auto"}
        data-full-width-responsive="true"
      />
    </aside>
  );
}
