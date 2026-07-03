import type { ConsentPreferences } from "@/framework/types";

export const CONSENT_STORAGE_KEY = "cookie-consent-preferences";
const CONSENT_VERSION = 1;

export function getDefaultPreferences(): ConsentPreferences {
  return { necessary: true, analytics: false, advertising: false, timestamp: Date.now() };
}

export function loadConsentPreferences(): ConsentPreferences | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as ConsentPreferences & { version?: number };
    if (parsed.version !== CONSENT_VERSION) return null;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      advertising: Boolean(parsed.advertising),
      timestamp: parsed.timestamp,
    };
  } catch {
    return null;
  }
}

export function saveConsentPreferences(
  prefs: Omit<ConsentPreferences, "timestamp" | "necessary">,
): ConsentPreferences {
  const full: ConsentPreferences & { version: number } = {
    necessary: true,
    analytics: prefs.analytics,
    advertising: prefs.advertising,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };
  localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(full));
  return full;
}

export function hasConsentChoice(): boolean {
  return loadConsentPreferences() !== null;
}
