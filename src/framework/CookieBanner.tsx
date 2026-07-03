"use client";

import { useConsent, useSite } from "@/framework/SiteProvider";
import { Button } from "@/framework/ui/Button";
import { CookiePreferences } from "@/framework/CookiePreferences";

export function CookieBanner() {
  const { analytics } = useSite();
  const { showBanner, showPreferences, acceptAll, rejectAll, openPreferences } = useConsent();

  if (!showBanner && !showPreferences) return null;
  if (showPreferences) return <CookiePreferences />;

  return (
    <div role="dialog" aria-labelledby="cookie-banner-title" className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background p-4">
      <div className="mx-auto max-w-3xl">
        <h2 id="cookie-banner-title" className="text-sm font-semibold text-text">Gestion des cookies</h2>
        <p className="mt-1 text-sm text-text-muted leading-relaxed">
          Ce site utilise des cookies nécessaires à son fonctionnement.
          {analytics.googleAnalyticsId && " Des cookies analytiques peuvent être utilisés avec votre accord."}
          {analytics.googleAdsenseClientId && " Des cookies publicitaires peuvent être utilisés avec votre accord."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={acceptAll}>Tout accepter</Button>
          <Button type="button" size="sm" variant="secondary" onClick={rejectAll}>Tout refuser</Button>
          <Button type="button" size="sm" variant="ghost" onClick={openPreferences}>Personnaliser</Button>
        </div>
      </div>
    </div>
  );
}
