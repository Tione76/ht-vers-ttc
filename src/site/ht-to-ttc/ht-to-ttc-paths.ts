/**
 * Helpers d'URL pour la série HT vers TTC.
 * Format machine (slug) : sans séparateur de milliers.
 * Format éditorial : formatHtEditorial() ailleurs.
 */

import { htToTtcSlugFromAmount } from "./ht-to-ttc-amounts";
import { getPublishedHtToTtcAmounts } from "./ht-to-ttc-publish";

export function htToTtcPath(amountEu: number) {
  return `/${htToTtcSlugFromAmount(amountEu)}`;
}

/** Alias historique : montants réellement publiés (indexables). */
export function htToTtcPublicAmounts(): number[] {
  return getPublishedHtToTtcAmounts();
}

/**
 * Montants proches publiés uniquement (jamais les drafts).
 * Jusqu'à `limit` voisins, triés par proximité puis montant croissant.
 */
export function getNearbyHtToTtcAmounts(amountEu: number, limit = 6): number[] {
  const published = getPublishedHtToTtcAmounts().filter((value) => value !== amountEu);
  if (published.length === 0) return [];

  return [...published]
    .sort((a, b) => {
      const da = Math.abs(a - amountEu);
      const db = Math.abs(b - amountEu);
      if (da !== db) return da - db;
      return a - b;
    })
    .slice(0, limit);
}
