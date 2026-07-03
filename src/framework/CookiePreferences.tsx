"use client";

import { useState } from "react";
import { useConsent } from "@/framework/SiteProvider";
import { Button } from "@/framework/ui/Button";

export function CookiePreferences() {
  const { preferences, savePreferences, acceptAll, rejectAll, closePreferences } = useConsent();
  const [analytics, setAnalytics] = useState(preferences.analytics);
  const [advertising, setAdvertising] = useState(preferences.advertising);

  const categories = [
    { id: "necessary", name: "Cookies strictement nécessaires", description: "Indispensables au fonctionnement du site.", required: true },
    { id: "analytics", name: "Cookies analytiques", description: "Mesure d'audience pour améliorer le service.", required: false },
    { id: "advertising", name: "Cookies publicitaires", description: "Affichage de publicités pertinentes.", required: false },
  ] as const;

  return (
    <div role="dialog" aria-labelledby="cookie-prefs-title" aria-modal="true" className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-text/40" onClick={closePreferences} aria-hidden="true" />
      <div className="relative w-full max-w-lg bg-background border border-border m-4 max-h-[90vh] overflow-y-auto">
        <div className="border-b border-border px-4 py-3">
          <h2 id="cookie-prefs-title" className="text-sm font-semibold text-text">Préférences de cookies</h2>
        </div>
        <div className="p-4 space-y-4">
          {categories.map((cat) => {
            const isAnalytics = cat.id === "analytics";
            const isAdvertising = cat.id === "advertising";
            const checked = cat.required ? true : isAnalytics ? analytics : isAdvertising ? advertising : false;
            return (
              <div key={cat.id} className="flex gap-3 items-start border-b border-border pb-4 last:border-0 last:pb-0">
                <input
                  type="checkbox"
                  id={`cookie-${cat.id}`}
                  checked={checked}
                  disabled={cat.required}
                  onChange={(e) => {
                    if (isAnalytics) setAnalytics(e.target.checked);
                    if (isAdvertising) setAdvertising(e.target.checked);
                  }}
                  className="mt-0.5 h-4 w-4 accent-primary"
                />
                <div className="flex-1">
                  <label htmlFor={`cookie-${cat.id}`} className="text-sm font-medium text-text">
                    {cat.name}
                    {cat.required && <span className="ml-1 text-xs text-text-muted font-normal">(obligatoire)</span>}
                  </label>
                  <p className="mt-0.5 text-xs text-text-muted leading-relaxed">{cat.description}</p>
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t border-border px-4 py-3 flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={() => savePreferences({ analytics, advertising })}>Enregistrer</Button>
          <Button type="button" size="sm" variant="secondary" onClick={acceptAll}>Tout accepter</Button>
          <Button type="button" size="sm" variant="ghost" onClick={rejectAll}>Tout refuser</Button>
        </div>
      </div>
    </div>
  );
}
