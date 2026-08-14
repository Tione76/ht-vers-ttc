/**
 * Contenu et navigation du Hub /montants-ttc-en-ht.
 * Tout est dérivé de TTC_TO_HT_PUBLISHED (aucun draft).
 */

import type { FaqItem } from "@/framework/types";
import { getGuideBySlug } from "@/site/guides/registry";
import { calculateTtcToHt, formatEuro2, formatHtEditorial } from "../ht-to-ttc/ht-to-ttc-calc";
import { getPublishedTtcToHtAmounts } from "./ttc-to-ht-publish";
import { getTtcToHtSiteLinks } from "./ttc-to-ht-site-links";
import type { TtcToHtFaqItem } from "./ttc-to-ht-content";
import { faqItemsToSchema } from "./ttc-to-ht-content";

export type TtcToHtHubRange = {
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
export const TTC_TO_HT_COMMON_AMOUNT_CANDIDATES = [
  10, 20, 50, 100, 150, 200, 250, 300, 400, 500, 750, 1000, 1500, 2000, 2500, 3000, 5000, 7500,
  10000,
] as const;

/** Taille de plage adaptée au volume published (scalable jusqu'à 1000 fiches). */
export function getTtcToHtHubBucketSize(publishedCount: number, span: number): number {
  if (publishedCount <= 120 && span <= 2500) return 100;
  if (publishedCount <= 400 && span <= 6000) return 500;
  return 1000;
}

/**
 * Plages générées depuis les montants published uniquement.
 * Ex. lot 10→500 : 10–100, 110–200, …, 410–500.
 */
export function buildTtcToHtHubRanges(amounts: number[] = getPublishedTtcToHtAmounts()): TtcToHtHubRange[] {
  const sorted = [...amounts].sort((a, b) => a - b);
  if (sorted.length === 0) return [];

  const span = sorted[sorted.length - 1] - sorted[0];
  const bucketSize = getTtcToHtHubBucketSize(sorted.length, span);
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
export function getTtcToHtCommonPublishedAmounts(limit = 10): number[] {
  const published = new Set(getPublishedTtcToHtAmounts());
  return TTC_TO_HT_COMMON_AMOUNT_CANDIDATES.filter((amount) => published.has(amount)).slice(
    0,
    Math.min(Math.max(limit, 6), 10),
  );
}

export function getTtcToHtHubIntroParagraphs(): string[] {
  return [
    "Chaque fiche présente la conversion d'un montant TTC selon les quatre principaux taux de TVA en France. Choisissez un montant pour afficher les résultats HT, la TVA correspondante et le détail du calcul.",
    "Pour un montant qui n'apparaît pas encore dans la liste, utilisez directement le calculateur TTC → HT.",
  ];
}

export function getTtcToHtHubFeatureItems(): { title: string; text: string }[] {
  return [
    {
      title: "Résultat à 20 %",
      text: "Le HT au taux normal, avec le montant de TVA.",
    },
    {
      title: "Autres taux",
      text: "Les conversions à 10 %, 5,5 % et 2,1 %.",
    },
    {
      title: "Formule et détail",
      text: "Le calcul TTC ÷ (1 + taux) expliqué clairement.",
    },
    {
      title: "Mini-calculateur",
      text: "Testez un autre montant sans quitter la fiche.",
    },
  ];
}

/** Paragraphe pédagogique HT / TTC (exemple calculé dynamiquement). */
export function getTtcToHtHubDiffParagraph(): string {
  const example = calculateTtcToHt(120, 20);
  return (
    "HT est le prix avant TVA. TTC est le prix après ajout de la TVA. " +
    "Pour obtenir le HT : TTC ÷ (1 + taux de TVA). " +
    `Exemple : 120 € TTC à 20 % = ${formatEuro2(example.ht)} HT (${formatEuro2(example.vatAmount)} de TVA).`
  );
}

/** 2–3 guides stratégiques (la sidebar liste le reste). */
export function getTtcToHtHubGuideHighlights() {
  const links = getTtcToHtSiteLinks();
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

export function buildTtcToHtHubFaqItems(): TtcToHtFaqItem[] {
  const links = getTtcToHtSiteLinks();

  return [
    {
      question: "Comment convertir un montant TTC en HT ?",
      answer: [
        "Divisez le montant TTC par (1 + taux de TVA). Exemple à 20 % : HT = TTC ÷ 1,20. Parcourez les plages ci-dessus ou ouvrez directement la fiche du montant recherché.",
      ],
    },
    {
      question: "Quel taux de TVA faut-il utiliser pour calculer le HT ?",
      answer: [
        "Le taux dépend de la nature du bien ou du service. Chaque fiche calcule le HT à 20 %, 10 %, 5,5 % et 2,1 %. Pour choisir le bon taux, consultez le ",
        { href: links.guideTaux.path, text: "guide des taux de TVA en France" },
        ".",
      ],
    },
    {
      question: "Pourquoi le montant HT change-t-il selon le taux de TVA ?",
      answer: [
        "La TVA est incluse dans le TTC. Plus le taux est élevé, plus la part de TVA est importante et plus le HT correspondant est bas pour un même montant TTC.",
      ],
    },
    {
      question: "Que faire si mon montant TTC n'apparaît pas dans la liste ?",
      answer: [
        "Utilisez le ",
        { href: links.mainCalculator.path, text: "calculateur TTC → HT" },
        " : sélectionnez « TTC vers HT », saisissez votre montant et choisissez le taux de TVA.",
      ],
    },
  ];
}

export function getTtcToHtHubFaqSchemaItems(): FaqItem[] {
  return faqItemsToSchema(buildTtcToHtHubFaqItems());
}
