/**
 * Source unique draft / published pour la série HT → TTC.
 *
 * - Tous les montants valides (10 → 10 000, pas de 10) existent techniquement.
 * - Par défaut : draft (noindex).
 * - Seuls les montants listés ici sont published (indexables, sitemap, Hub, nearby).
 *
 * Publication par lots : étendre le registre (ou le prochain lot via getNextHtToTtcPublishLot).
 */

import {
  getAllHtToTtcAmounts,
  HT_TO_TTC_HUB_PATH,
  HT_TO_TTC_STEP,
  htToTtcSlugFromAmount,
  isValidHtToTtcAmount,
} from "./ht-to-ttc-amounts";
import { formatHtEditorial } from "./ht-to-ttc-calc";

export type HtToTtcPublishRecord = {
  amount: number;
  /** Date ISO YYYY-MM-DD de première publication publique. */
  datePublished: string;
  /** Date ISO YYYY-MM-DD de dernière mise à jour (optionnelle). */
  dateModified?: string;
};

/** Premier lot public : 10 € → 500 € (pas de 10). */
export const HT_TO_TTC_FIRST_LOT_MIN = 10;
export const HT_TO_TTC_FIRST_LOT_MAX = 500;
export const HT_TO_TTC_FIRST_LOT_DATE = "2026-08-11";

/** Lot 2 : 510 € → 1 000 € (pas de 10). */
export const HT_TO_TTC_SECOND_LOT_MIN = 510;
export const HT_TO_TTC_SECOND_LOT_MAX = 1000;
export const HT_TO_TTC_SECOND_LOT_DATE = "2026-08-14";

function buildHtToTtcPublishRecords(
  min: number,
  max: number,
  datePublished: string,
): HtToTtcPublishRecord[] {
  const records: HtToTtcPublishRecord[] = [];
  for (let amount = min; amount <= max; amount += HT_TO_TTC_STEP) {
    if (!isValidHtToTtcAmount(amount)) {
      throw new Error(`Invalid HT→TTC publish amount: ${amount}`);
    }
    records.push({ amount, datePublished });
  }
  return records;
}

/**
 * Montants published uniquement.
 * Lot 1 : 10 → 500 (€), datePublished 2026-08-11.
 * Lot 2 : 510 → 1 000 (€), datePublished 2026-08-14.
 */
export const HT_TO_TTC_PUBLISHED: readonly HtToTtcPublishRecord[] = [
  ...buildHtToTtcPublishRecords(
    HT_TO_TTC_FIRST_LOT_MIN,
    HT_TO_TTC_FIRST_LOT_MAX,
    HT_TO_TTC_FIRST_LOT_DATE,
  ),
  ...buildHtToTtcPublishRecords(
    HT_TO_TTC_SECOND_LOT_MIN,
    HT_TO_TTC_SECOND_LOT_MAX,
    HT_TO_TTC_SECOND_LOT_DATE,
  ),
];

/** Taille standard d'un lot de publication (lots suivants). */
export const HT_TO_TTC_PUBLISH_LOT_SIZE = 50;

export function isHtToTtcPublished(amount: number): boolean {
  return HT_TO_TTC_PUBLISHED.some((record) => record.amount === amount);
}

export function getHtToTtcPublishRecord(amount: number): HtToTtcPublishRecord | null {
  return HT_TO_TTC_PUBLISHED.find((record) => record.amount === amount) ?? null;
}

export function getPublishedHtToTtcAmounts(): number[] {
  return HT_TO_TTC_PUBLISHED.map((record) => record.amount).sort((a, b) => a - b);
}

export function getDraftHtToTtcAmounts(): number[] {
  const published = new Set(getPublishedHtToTtcAmounts());
  return getAllHtToTtcAmounts().filter((amount) => !published.has(amount));
}

export function getHtToTtcStatus(amount: number): "published" | "draft" | "invalid" {
  if (!isValidHtToTtcAmount(amount)) return "invalid";
  return isHtToTtcPublished(amount) ? "published" : "draft";
}

export function getHtToTtcRobots(amount: number): { index: boolean; follow: boolean } {
  const published = isHtToTtcPublished(amount);
  return { index: published, follow: published };
}

/** Hub publié dès qu'au moins une fiche est published. */
export function isHtToTtcHubPublished(): boolean {
  return getPublishedHtToTtcAmounts().length > 0;
}

export function getHtToTtcHubRobots(): { index: boolean; follow: boolean } {
  const published = isHtToTtcHubPublished();
  return { index: published, follow: published };
}

export function getHtToTtcHubMeta() {
  return {
    path: HT_TO_TTC_HUB_PATH,
    /** Title SEO (balise title / Open Graph). */
    title: "Liste des montants HT en TTC : toutes les conversions",
    /** H1 du Hub. */
    h1: "Liste des montants HT en TTC",
    description:
      "Retrouvez les conversions HT en TTC par montant et accédez aux fiches détaillées selon les taux de TVA de 20 %, 10 %, 5,5 % et 2,1 %.",
  };
}

/**
 * Prochains montants draft à publier (les plus petits d'abord).
 * Gère aussi le dernier lot partiel (< taille demandée).
 */
export function getNextHtToTtcPublishLot(size = HT_TO_TTC_PUBLISH_LOT_SIZE): number[] {
  return getDraftHtToTtcAmounts().slice(0, size);
}

export function countHtToTtcPublished(): number {
  return HT_TO_TTC_PUBLISHED.length;
}

export function countHtToTtcDrafts(): number {
  return getAllHtToTtcAmounts().length - countHtToTtcPublished();
}

/** Entrées indexables pour public-pages / sitemap (published uniquement). */
export function getPublishedHtToTtcPublicPages() {
  return getPublishedHtToTtcAmounts().map((amount) => ({
    path: `/${htToTtcSlugFromAmount(amount)}`,
    title: `${formatHtEditorial(amount)} HT en TTC`,
    category: "utility" as const,
    changefreq: "monthly" as const,
    priority: 0.55,
    indexable: true,
  }));
}
