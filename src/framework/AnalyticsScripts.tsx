"use client";

import Script from "next/script";
import { useConsent, useSite } from "@/framework/SiteProvider";

export function AnalyticsScripts() {
  const { analytics } = useSite();
  const { preferences, status } = useConsent();
  const gaId = analytics.googleAnalyticsId;

  if (!gaId || status === "pending" || !preferences.analytics) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="lazyOnload" />
      <Script id="google-analytics" strategy="lazyOnload">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
        gtag('js',new Date());gtag('config','${gaId}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}

export function AdSenseLoader() {
  const { analytics } = useSite();
  const { preferences, status } = useConsent();
  const clientId = analytics.googleAdsenseClientId;

  if (!clientId || status === "pending" || !preferences.advertising) return null;

  return (
    <Script
      id="google-adsense"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${clientId}`}
      strategy="lazyOnload"
      crossOrigin="anonymous"
    />
  );
}
