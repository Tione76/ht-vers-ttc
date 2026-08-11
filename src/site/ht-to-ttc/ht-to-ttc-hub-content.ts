/**
 * Contenu et navigation du Hub /montants-ht-en-ttc.
 * Tout est dérivé de HT_TO_TTC_PUBLISHED (aucun draft).
 */

import type { FaqItem } from "@/framework/types";
import { getGuideBySlug } from "@/site/guides/registry";
import { formatHtEditorial } from "./ht-to-ttc-calc";
import { getPublishedHtToTtcAmounts } from "./ht-to-ttc-publish";
import { getHtToTtcSiteLinks } from "./ht-to-ttc-site-links";
import type { HtToTtcFaqItem } from "./ht-to-ttc-content";
import { faqItemsToSchema } from "./ht-to-ttc-content";

export type HtToTtcHubRange = {
  id: string;
  label: string;
  min: number;
  max: number;
  amounts: number[];
};

/**
 * Candidats « conversions courantes » (ordre de priorité).
 * Seuls les montants réellement published sont retenus.
 */
export const HT_TO_TTC_COMMON_AMOUNT_CANDIDATES = [
  10, 20, 50, 100, 150, 200, 250, 300, 400, 500, 750, 1000, 1500, 2000, 2500, 3000, 5000, 7500,
  10000,
] as const;

/** Taille de plage adaptée au volume published (scalable jusqu'à 1000 fiches). */
export function getHtToTtcHubBucketSize(publishedCount: number, span: number): number {
  if (publishedCount <= 120 && span <= 2500) return 100;
  if (publishedCount <= 400 && span <= 6000) return 500;
  return 1000;
}

/**
 * Plages générées depuis les montants published uniquement.
 * Ex. lot 10→500 : 10–100, 110–200, …, 410–500.
 */
export function buildHtToTtcHubRanges(amounts: number[] = getPublishedHtToTtcAmounts()): HtToTtcHubRange[] {
  const sorted = [...amounts].sort((a, b) => a - b);
  if (sorted.length === 0) return [];

  const span = sorted[sorted.length - 1] - sorted[0];
  const bucketSize = getHtToTtcHubBucketSize(sorted.length, span);
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
        id: `montant-${min}-${max}`,
        label: `${formatHtEditorial(min)} à ${formatHtEditorial(max)}`,
        min,
        max,
        amounts: groupAmounts,
      };
    });
}

/** 6 à 10 montants courants parmi les published. */
export function getHtToTtcCommonPublishedAmounts(limit = 10): number[] {
  const published = new Set(getPublishedHtToTtcAmounts());
  return HT_TO_TTC_COMMON_AMOUNT_CANDIDATES.filter((amount) => published.has(amount)).slice(
    0,
    Math.min(Math.max(limit, 6), 10),
  );
}

export function getHtToTtcHubIntroParagraphs(): string[] {
  return [
    "Chaque fiche présente la conversion d'un montant HT selon les quatre principaux taux de TVA en France. Choisissez un montant pour afficher les résultats TTC, la TVA correspondante et le détail du calcul.",
    "Pour un montant qui n'apparaît pas encore dans la liste, utilisez directement le calculateur HT → TTC.",
  ];
}

export function getHtToTtcHubFeatureItems(): { title: string; text: string }[] {
  return [
    {
      title: "Résultat à 20 %",
      text: "Le TTC au taux normal, avec le montant de TVA.",
    },
    {
      title: "Autres taux",
      text: "Les conversions à 10 %, 5,5 % et 2,1 %.",
    },
    {
      title: "Formule et détail",
      text: "Le calcul HT × (1 + taux) expliqué clairement.",
    },
    {
      title: "Mini-calculateur",
      text: "Testez un autre montant sans quitter la fiche.",
    },
  ];
}

/** 2–3 guides stratégiques (la sidebar liste le reste). */
export function getHtToTtcHubGuideHighlights() {
  const links = getHtToTtcSiteLinks();
  const slugs = [links.guideTaux.slug, links.guideDeductible.slug, "tva-et-auto-entrepreneur"];

  return slugs
    .map((slug) => {
      const guide = getGuideBySlug(slug);
      if (!guide) return null;
      return {
        slug: guide.slug,
        path: `/guides/${guide.slug}`,
        title: guide.title,
        description: guide.description,
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);
}

export function buildHtToTtcHubFaqItems(): HtToTtcFaqItem[] {
  const links = getHtToTtcSiteLinks();

  return [
    {
      question: "Comment choisir un montant HT à convertir ?",
      answer: [
        "Parcourez les plages ci-dessus ou les conversions courantes, puis ouvrez la fiche correspondant à votre montant.",
      ],
    },
    {
      question: "Quels taux de TVA sont utilisés dans les fiches ?",
      answer: [
        "Chaque fiche calcule le TTC à 20 %, 10 %, 5,5 % et 2,1 %. Pour savoir quel taux appliquer, consultez le ",
        { href: links.guideTaux.path, text: "guide des taux de TVA en France" },
        ".",
      ],
    },
    {
      question: "Comment convertir un montant qui n'est pas encore disponible ?",
      answer: [
        "Utilisez le ",
        { href: links.mainCalculator.path, text: "calculateur HT → TTC" },
        " : saisissez votre montant HT et choisissez le taux de TVA.",
      ],
    },
    {
      question: "Quelle différence entre HT et TTC ?",
      answer: [
        "HT est le prix avant TVA. TTC est le prix après ajout de la TVA. Formule : TTC = HT × (1 + taux de TVA).",
      ],
    },
  ];
}

export function getHtToTtcHubFaqSchemaItems(): FaqItem[] {
  return faqItemsToSchema(buildHtToTtcHubFaqItems());
}
