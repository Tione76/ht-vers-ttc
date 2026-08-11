export type VatRatePct = "20" | "10" | "5.5" | "2.1";

/**
 * Source unique pour le calcul HT <-> TTC.
 * - Formule HT->TTC : TTC = HT * (1 + taux / 100)
 * - TVA = TTC - HT
 * - Arrondi : centime (2 décimales) identique au calculateur existant
 */
export function calculateHtToTtc(ht: number, vatRatePct: number) {
  const vatAmount = roundCent(ht * (vatRatePct / 100));
  const ttc = roundCent(ht + vatAmount);
  return { ht, vatAmount, ttc };
}

/**
 * Mode inverse (pour compatibilité future) :
 * - HT = TTC / (1 + taux / 100)
 * - TVA = TTC - HT
 */
export function calculateTtcToHt(ttc: number, vatRatePct: number) {
  const ht = roundCent(ttc / (1 + vatRatePct / 100));
  const vatAmount = roundCent(ttc - ht);
  return { ttc, ht, vatAmount };
}

/** Arrondi arithmétique au centime d'euro. */
export function roundCent(value: number) {
  return Math.round(value * 100) / 100;
}

const currencyFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const currencyFormatterInt = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const integerFormatter = new Intl.NumberFormat("fr-FR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

/** Espaces typographiques FR (NBSP / NNBSP) → espace normale pour l'éditorial SEO. */
function toEditorialSpaces(value: string) {
  return value.replace(/[\u202f\u00a0]/g, " ");
}

/**
 * Format éditorial français des montants (espace milliers, symbole €).
 * Ex. 1000 → "1 000 €", 10.5 → "10,50 €"
 * Ne pas utiliser pour les slugs / URLs.
 */
export function formatHtEditorial(amount: number) {
  const isInt = Math.abs(amount - Math.round(amount)) < 1e-12;
  if (isInt) {
    return `${toEditorialSpaces(integerFormatter.format(Math.round(amount)))} €`;
  }
  return toEditorialSpaces(currencyFormatter.format(amount));
}

/** Formateur "affichage court" pour les montants entiers (ex. 10 € au lieu de 10,00 €). */
export function formatEuroShort(amount: number) {
  const isInt = Math.abs(amount - Math.round(amount)) < 1e-12;
  const raw = isInt ? currencyFormatterInt.format(amount) : currencyFormatter.format(amount);
  return toEditorialSpaces(raw);
}

export function formatEuro2(amount: number) {
  return toEditorialSpaces(currencyFormatter.format(amount));
}

