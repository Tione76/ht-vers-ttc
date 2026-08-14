/**
 * Source unique draft / published pour la série TTC → HT.
 *
 * - Tous les montants valides (10 → 10 000, pas de 10) existent techniquement.
 * - Par défaut : draft (noindex).
 * - Seuls les montants listés ici sont published (indexables, sitemap, Hub, nearby).
 *
 * Série industrialisée : 1 000 montants (10 → 10 000, pas de 10).
 * Registre vide = 1 000 drafts, 0 published.
 */

import {
  getAllTtcToHtAmounts,
  TTC_TO_HT_HUB_PATH,
  TTC_TO_HT_STEP,
  ttcToHtSlugFromAmount,
  isValidTtcToHtAmount,
} from "./ttc-to-ht-amounts";
import { formatHtEditorial } from "../ht-to-ttc/ht-to-ttc-calc";

export type TtcToHtPublishRecord = {
  amount: number;
  /** Date ISO YYYY-MM-DD de première publication publique. */
  datePublished: string;
  /** Date ISO YYYY-MM-DD de dernière mise à jour (optionnelle). */
  dateModified?: string;
};

function buildTtcToHtPublishRecords(
  min: number,
  max: number,
  datePublished: string,
): TtcToHtPublishRecord[] {
  const records: TtcToHtPublishRecord[] = [];
  for (let amount = min; amount <= max; amount += TTC_TO_HT_STEP) {
    if (!isValidTtcToHtAmount(amount)) {
      throw new Error(`Invalid TTC→HT publish amount: ${amount}`);
    }
    records.push({ amount, datePublished });
  }
  return records;
}

/** Montants published uniquement (vide : 1 000 fiches en draft). */
export const TTC_TO_HT_PUBLISHED: readonly TtcToHtPublishRecord[] = [];

/** Taille standard d'un lot de publication. */
export const TTC_TO_HT_PUBLISH_LOT_SIZE = 50;

export function isTtcToHtPublished(amount: number): boolean {
  return TTC_TO_HT_PUBLISHED.some((record) => record.amount === amount);
}

export function getTtcToHtPublishRecord(amount: number): TtcToHtPublishRecord | null {
  return TTC_TO_HT_PUBLISHED.find((record) => record.amount === amount) ?? null;
}

export function getPublishedTtcToHtAmounts(): number[] {
  return TTC_TO_HT_PUBLISHED.map((record) => record.amount).sort((a, b) => a - b);
}

export function getDraftTtcToHtAmounts(): number[] {
  const published = new Set(getPublishedTtcToHtAmounts());
  return getAllTtcToHtAmounts().filter((amount) => !published.has(amount));
}

export function getTtcToHtStatus(amount: number): "published" | "draft" | "invalid" {
  if (!isValidTtcToHtAmount(amount)) return "invalid";
  return isTtcToHtPublished(amount) ? "published" : "draft";
}

export function getTtcToHtRobots(amount: number): { index: boolean; follow: boolean } {
  const published = isTtcToHtPublished(amount);
  return { index: published, follow: published };
}

/** Hub publié dès qu'au moins une fiche est published. */
export function isTtcToHtHubPublished(): boolean {
  return getPublishedTtcToHtAmounts().length > 0;
}

export function getTtcToHtHubRobots(): { index: boolean; follow: boolean } {
  const published = isTtcToHtHubPublished();
  return { index: published, follow: published };
}

export function getTtcToHtHubMeta() {
  return {
    path: TTC_TO_HT_HUB_PATH,
    /** Title SEO (balise title / Open Graph). */
    title: "Liste des montants TTC en HT : toutes les conversions",
    /** H1 du Hub. */
    h1: "Liste des montants TTC en HT",
    description:
      "Retrouvez les conversions TTC en HT par montant et accédez aux fiches détaillées selon les taux de TVA de 20 %, 10 %, 5,5 % et 2,1 %.",
  };
}

/** Prochains montants draft à publier (les plus petits d'abord). */
export function getNextTtcToHtPublishLot(size = TTC_TO_HT_PUBLISH_LOT_SIZE): number[] {
  return getDraftTtcToHtAmounts().slice(0, size);
}

export function countTtcToHtPublished(): number {
  return TTC_TO_HT_PUBLISHED.length;
}

export function countTtcToHtDrafts(): number {
  return getAllTtcToHtAmounts().length - countTtcToHtPublished();
}

/** Entrées indexables pour public-pages / sitemap (published uniquement). */
export function getPublishedTtcToHtPublicPages() {
  return getPublishedTtcToHtAmounts().map((amount) => ({
    path: `/${ttcToHtSlugFromAmount(amount)}`,
    title: `${formatHtEditorial(amount)} TTC en HT`,
    category: "utility" as const,
    changefreq: "monthly" as const,
    priority: 0.55,
    indexable: true,
  }));
}

/** Helper interne pour futures publications par lots (non utilisé tant que registre vide). */
export { buildTtcToHtPublishRecords, TTC_TO_HT_HUB_PATH };
