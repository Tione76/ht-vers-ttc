/**
 * Ensemble des montants de la série « X € HT en TTC ».
 * Source unique pour validation, slugs et inventaire (1 000 montants).
 */

export const HT_TO_TTC_MIN_AMOUNT = 10;
export const HT_TO_TTC_MAX_AMOUNT = 10_000;
export const HT_TO_TTC_STEP = 10;

/** Nombre exact de montants valides : ((10000 - 10) / 10) + 1 = 1000 */
export const HT_TO_TTC_AMOUNT_COUNT =
  Math.floor((HT_TO_TTC_MAX_AMOUNT - HT_TO_TTC_MIN_AMOUNT) / HT_TO_TTC_STEP) + 1;

export const HT_TO_TTC_HUB_PATH = "/montants-ht-en-ttc";
export const HT_TO_TTC_HUB_TITLE = "Montants HT en TTC";

/** Suffixe d'URL machine (sans espace / séparateur). */
export const HT_TO_TTC_SLUG_SUFFIX = "-euros-ht-en-ttc";

export function isValidHtToTtcAmount(amount: number): boolean {
  return (
    Number.isInteger(amount) &&
    amount >= HT_TO_TTC_MIN_AMOUNT &&
    amount <= HT_TO_TTC_MAX_AMOUNT &&
    amount % HT_TO_TTC_STEP === 0
  );
}

/** Liste complète des montants valides (générée, jamais hardcodée ligne à ligne). */
export function getAllHtToTtcAmounts(): number[] {
  const amounts: number[] = [];
  for (let value = HT_TO_TTC_MIN_AMOUNT; value <= HT_TO_TTC_MAX_AMOUNT; value += HT_TO_TTC_STEP) {
    amounts.push(value);
  }
  return amounts;
}

/**
 * Parse un slug machine du type "150-euros-ht-en-ttc".
 * Rejette les formes non canoniques (ex. "0150-euros-ht-en-ttc").
 */
export function parseHtToTtcSlug(slug: string): number | null {
  const match = /^(\d+)-euros-ht-en-ttc$/.exec(slug);
  if (!match) return null;
  const raw = match[1];
  const amount = Number.parseInt(raw, 10);
  if (!Number.isFinite(amount) || String(amount) !== raw) return null;
  if (!isValidHtToTtcAmount(amount)) return null;
  return amount;
}

export function htToTtcSlugFromAmount(amount: number): string {
  return `${amount}${HT_TO_TTC_SLUG_SUFFIX}`;
}
