import { ttcToHtSlugFromAmount } from "./ttc-to-ht-amounts";
import { getPublishedTtcToHtAmounts } from "./ttc-to-ht-publish";

export function ttcToHtPath(amountTtc: number) {
  return `/${ttcToHtSlugFromAmount(amountTtc)}`;
}

/**
 * Montants proches publiés uniquement (jamais les drafts).
 * Retourne [] tant qu'aucune fiche TTC → HT n'est published.
 */
export function getNearbyTtcToHtAmounts(amountTtc: number, limit = 6): number[] {
  const published = getPublishedTtcToHtAmounts().filter((value) => value !== amountTtc);
  if (published.length === 0) return [];

  return [...published]
    .sort((a, b) => {
      const da = Math.abs(a - amountTtc);
      const db = Math.abs(b - amountTtc);
      if (da !== db) return da - db;
      return a - b;
    })
    .slice(0, limit);
}
