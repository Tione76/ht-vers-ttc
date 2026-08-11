/**
 * Index / tableau de conversion HT → TTC.
 * Source unique : montants published + calculateHtToTtc().
 *
 * Scalabilité :
 * - Aujourd'hui (~50 lignes) : tout le tableau sur la page mère.
 * - Demain (> HT_TO_TTC_TABLE_INDEX_MAX_ROWS) : la page mère n'affiche
 *   que les premières plages ; les autres seront des sous-routes
 *   via htToTtcTableRangePath() (non publiées tant que non créées).
 */

import { calculateHtToTtc, formatEuro2, formatHtEditorial } from "./ht-to-ttc-calc";
import { htToTtcPath } from "./ht-to-ttc-paths";
import { getPublishedHtToTtcAmounts, isHtToTtcPublished } from "./ht-to-ttc-publish";
import { PRIMARY_VAT_RATE, VAT_RATE_PRESETS, vatRatePctToNumber } from "./ht-to-ttc-rates";
import type { HtToTtcFaqItem } from "./ht-to-ttc-content";
import { faqItemsToSchema } from "./ht-to-ttc-content";
import type { FaqItem } from "@/framework/types";
import { getHtToTtcSiteLinks } from "./ht-to-ttc-site-links";
import { HT_TO_TTC_HUB_PATH } from "./ht-to-ttc-amounts";

export const HT_TO_TTC_TABLE_INDEX_PATH = "/tableau-conversion-ht-ttc";

/** Max de lignes HTML rendues sur la page mère (évite 10 000 lignes DOM). */
export const HT_TO_TTC_TABLE_INDEX_MAX_ROWS = 120;

export type HtToTtcTableRange = {
  id: string;
  /** Segment d'URL futur : `{min}-a-{max}` */
  slug: string;
  label: string;
  min: number;
  max: number;
  amounts: number[];
};

export type HtToTtcTableRow = {
  amountHt: number;
  amountLabel: string;
  path: string;
  isPublished: boolean;
  ttc20: string;
  ttc10: string;
  ttc55: string;
  ttc21: string;
};

export function getHtToTtcTableIndexMeta() {
  return {
    path: HT_TO_TTC_TABLE_INDEX_PATH,
    title: "Tableau de conversion HT en TTC : tous les montants",
    h1: "Tableau de conversion HT en TTC",
    description:
      "Consultez notre tableau de conversion HT en TTC selon les taux de TVA de 20 %, 10 %, 5,5 % et 2,1 %. Retrouvez rapidement le montant TTC correspondant.",
  };
}

/**
 * Taille de plage (€) pour le tableau Index.
 * Dérivée du pas réel (10 € aujourd'hui, 1 € demain) pour viser ~100 lignes/plage
 * et ne jamais produire une plage plus large que HT_TO_TTC_TABLE_INDEX_MAX_ROWS.
 */
export function getHtToTtcTableBucketSize(publishedCount: number, _span: number, stepHint = 10): number {
  const step = Math.max(1, stepHint);
  const targetRows = 100;
  const bucketFromStep = targetRows * step;
  const maxBucket = HT_TO_TTC_TABLE_INDEX_MAX_ROWS * step;

  // Catalogue encore affichable en entier : une ou peu de plages suffit.
  if (publishedCount <= HT_TO_TTC_TABLE_INDEX_MAX_ROWS) {
    return Math.max(bucketFromStep, 100);
  }

  // Toujours plafonner pour que chaque plage tienne sous le max de lignes DOM.
  return Math.min(bucketFromStep, maxBucket);
}

function inferStep(sorted: number[]): number {
  if (sorted.length < 2) return 10;
  let minGap = Number.POSITIVE_INFINITY;
  for (let i = 1; i < Math.min(sorted.length, 50); i += 1) {
    const gap = sorted[i] - sorted[i - 1];
    if (gap > 0 && gap < minGap) minGap = gap;
  }
  return Number.isFinite(minGap) ? minGap : 10;
}

/** Plages générées depuis published uniquement (prêtes pour futures sous-routes). */
export function buildHtToTtcTableRanges(
  amounts: number[] = getPublishedHtToTtcAmounts(),
): HtToTtcTableRange[] {
  const sorted = [...amounts].sort((a, b) => a - b);
  if (sorted.length === 0) return [];

  const span = sorted[sorted.length - 1] - sorted[0];
  const step = inferStep(sorted);
  const bucketSize = getHtToTtcTableBucketSize(sorted.length, span, step);
  const groups = new Map<number, number[]>();

  for (const amount of sorted) {
    const key = Math.ceil(amount / bucketSize);
    const list = groups.get(key) ?? [];
    list.push(amount);
    groups.set(key, list);
  }

  return [...groups.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, groupAmounts]) => {
      const min = groupAmounts[0];
      const max = groupAmounts[groupAmounts.length - 1];
      return {
        id: `plage-${min}-${max}`,
        slug: `${min}-a-${max}`,
        label: `${formatHtEditorial(min)} à ${formatHtEditorial(max)}`,
        min,
        max,
        amounts: groupAmounts,
      };
    });
}

/**
 * Chemin futur d'une plage (non routé tant que les sous-pages n'existent pas).
 * Ex. /tableau-conversion-ht-ttc/101-a-200
 */
export function htToTtcTableRangePath(min: number, max: number): string {
  return `${HT_TO_TTC_TABLE_INDEX_PATH}/${min}-a-${max}`;
}

/** Lignes du tableau pour une liste de montants. */
export function buildHtToTtcTableRows(amounts: number[]): HtToTtcTableRow[] {
  return amounts.map((amountHt) => {
    const rateValues = VAT_RATE_PRESETS.map((preset) => {
      const { ttc } = calculateHtToTtc(amountHt, vatRatePctToNumber(preset.value));
      return formatEuro2(ttc);
    });
    return {
      amountHt,
      amountLabel: formatHtEditorial(amountHt),
      path: htToTtcPath(amountHt),
      isPublished: isHtToTtcPublished(amountHt),
      ttc20: rateValues[0],
      ttc10: rateValues[1],
      ttc55: rateValues[2],
      ttc21: rateValues[3],
    };
  });
}

/**
 * Vue de la page mère : plages + montants réellement rendus (capés).
 * Aucune sous-route n'est générée ici.
 */
export function getHtToTtcTableIndexView(amounts: number[] = getPublishedHtToTtcAmounts()) {
  const ranges = buildHtToTtcTableRanges(amounts);
  if (amounts.length <= HT_TO_TTC_TABLE_INDEX_MAX_ROWS) {
    return {
      ranges,
      displayedRanges: ranges,
      deferredRanges: [] as HtToTtcTableRange[],
      amounts,
      rows: buildHtToTtcTableRows(amounts),
      truncated: false,
    };
  }

  const displayedAmounts: number[] = [];
  const displayedRanges: HtToTtcTableRange[] = [];
  const deferredRanges: HtToTtcTableRange[] = [];
  let splitHandled = false;

  for (let i = 0; i < ranges.length; i += 1) {
    const range = ranges[i];
    if (splitHandled) {
      deferredRanges.push(range);
      continue;
    }

    const remaining = HT_TO_TTC_TABLE_INDEX_MAX_ROWS - displayedAmounts.length;
    if (remaining <= 0) {
      deferredRanges.push(range);
      splitHandled = true;
      continue;
    }

    if (range.amounts.length <= remaining) {
      displayedAmounts.push(...range.amounts);
      displayedRanges.push(range);
      continue;
    }

    // Sécurité : ne jamais dépasser le plafond DOM, même si une plage est trop large.
    const shown = range.amounts.slice(0, remaining);
    const rest = range.amounts.slice(remaining);
    const shownMin = shown[0];
    const shownMax = shown[shown.length - 1];
    displayedAmounts.push(...shown);
    displayedRanges.push({
      id: `plage-${shownMin}-${shownMax}`,
      slug: `${shownMin}-a-${shownMax}`,
      label: `${formatHtEditorial(shownMin)} à ${formatHtEditorial(shownMax)}`,
      min: shownMin,
      max: shownMax,
      amounts: shown,
    });
    if (rest.length > 0) {
      const restMin = rest[0];
      const restMax = rest[rest.length - 1];
      deferredRanges.push({
        id: `plage-${restMin}-${restMax}`,
        slug: `${restMin}-a-${restMax}`,
        label: `${formatHtEditorial(restMin)} à ${formatHtEditorial(restMax)}`,
        min: restMin,
        max: restMax,
        amounts: rest,
      });
    }
    splitHandled = true;
  }

  return {
    ranges,
    displayedRanges,
    deferredRanges,
    amounts: displayedAmounts,
    rows: buildHtToTtcTableRows(displayedAmounts),
    truncated: deferredRanges.length > 0,
  };
}

export function getHtToTtcTableIndexIntro(): string[] {
  return [
    "Ce tableau indique, pour chaque montant HT publié, le prix TTC correspondant aux taux de TVA de 20 %, 10 %, 5,5 % et 2,1 %. Cliquez sur un montant HT pour ouvrir la fiche détaillée.",
    "Pour un montant libre qui n'apparaît pas encore, utilisez le calculateur HT → TTC.",
  ];
}

export function buildHtToTtcTableIndexFaqItems(): HtToTtcFaqItem[] {
  const links = getHtToTtcSiteLinks();
  return [
    {
      question: "Comment convertir un montant HT en TTC ?",
      answer: [
        "Multipliez le montant HT par (1 + taux de TVA). Exemple à 20 % : HT × 1,20. Vous pouvez aussi lire directement le résultat dans le tableau ci-dessus.",
      ],
    },
    {
      question: "Quel taux de TVA utiliser pour passer du HT au TTC ?",
      answer: [
        "Le taux dépend du bien ou du service. Le taux normal est de 20 %. Pour les cas particuliers, consultez le ",
        { href: links.guideTaux.path, text: "guide des taux de TVA en France" },
        ".",
      ],
    },
    {
      question: "Comment utiliser le tableau de conversion HT/TTC ?",
      answer: [
        "Repérez le montant HT dans la première colonne, puis lisez le TTC dans la colonne du taux applicable. Le taux de 20 % est mis en évidence car c'est le cas le plus fréquent.",
      ],
    },
    {
      question: "Que faire si mon montant n'apparaît pas dans le tableau ?",
      answer: [
        "Utilisez le ",
        { href: links.mainCalculator.path, text: "calculateur HT → TTC" },
        " pour convertir n'importe quel montant.",
      ],
    },
  ];
}

export function getHtToTtcTableIndexFaqSchemaItems(): FaqItem[] {
  return faqItemsToSchema(buildHtToTtcTableIndexFaqItems());
}

export function getHtToTtcTableIndexLinks() {
  const links = getHtToTtcSiteLinks();
  return {
    calculator: links.mainCalculator,
    hub: { path: HT_TO_TTC_HUB_PATH, label: "Voir la liste des montants HT en TTC" },
    guideTaux: links.guideTaux,
  };
}

export { PRIMARY_VAT_RATE, VAT_RATE_PRESETS };
