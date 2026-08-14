/**
 * Ensemble des montants de la série « X € TTC en HT ».
 * Même grille que HT → TTC (10 → 10 000, pas de 10) en attendant une évolution éventuelle.
 */

export const TTC_TO_HT_MIN_AMOUNT = 10;
export const TTC_TO_HT_MAX_AMOUNT = 10_000;
export const TTC_TO_HT_STEP = 10;

/** Nombre exact de montants valides : ((10000 - 10) / 10) + 1 = 1000 */
export const TTC_TO_HT_AMOUNT_COUNT =
  Math.floor((TTC_TO_HT_MAX_AMOUNT - TTC_TO_HT_MIN_AMOUNT) / TTC_TO_HT_STEP) + 1;

/** Futur Hub TTC → HT (non routé tant que non créé). */
export const TTC_TO_HT_HUB_PATH = "/montants-ttc-en-ht";
export const TTC_TO_HT_HUB_TITLE = "Montants TTC en HT";

/** Suffixe d'URL machine (sans espace / séparateur). */
export const TTC_TO_HT_SLUG_SUFFIX = "-euros-ttc-en-ht";

export function isValidTtcToHtAmount(amount: number): boolean {
  return (
    Number.isInteger(amount) &&
    amount >= TTC_TO_HT_MIN_AMOUNT &&
    amount <= TTC_TO_HT_MAX_AMOUNT &&
    amount % TTC_TO_HT_STEP === 0
  );
}

/** Liste complète des montants valides (générée, jamais hardcodée ligne à ligne). */
export function getAllTtcToHtAmounts(): number[] {
  const amounts: number[] = [];
  for (let value = TTC_TO_HT_MIN_AMOUNT; value <= TTC_TO_HT_MAX_AMOUNT; value += TTC_TO_HT_STEP) {
    amounts.push(value);
  }
  return amounts;
}

/**
 * Parse un slug machine du type "150-euros-ttc-en-ht".
 * Rejette les formes non canoniques (ex. "0150-euros-ttc-en-ht").
 */
export function parseTtcToHtSlug(slug: string): number | null {
  const match = /^(\d+)-euros-ttc-en-ht$/.exec(slug);
  if (!match) return null;
  const raw = match[1];
  const amount = Number.parseInt(raw, 10);
  if (!Number.isFinite(amount) || String(amount) !== raw) return null;
  if (!isValidTtcToHtAmount(amount)) return null;
  return amount;
}

export function ttcToHtSlugFromAmount(amount: number): string {
  return `${amount}${TTC_TO_HT_SLUG_SUFFIX}`;
}
