import type { FaqItem } from "@/framework/types";
import {
  calculateHtToTtc,
  formatEuro2,
  formatHtEditorial,
  type VatRatePct,
} from "./ht-to-ttc-calc";
import {
  PRIMARY_VAT_RATE,
  SECONDARY_VAT_RATES,
  VAT_RATE_PRESETS,
  vatRatePctToNumber,
} from "./ht-to-ttc-rates";
import { htToTtcPath } from "./ht-to-ttc-paths";
import { getHtToTtcSiteLinks } from "./ht-to-ttc-site-links";

export { PRIMARY_VAT_RATE, SECONDARY_VAT_RATES, formatHtEditorial };

export type HtToTtcFaqAnswerSegment = string | { href: string; text: string };
export type HtToTtcFaqItem = {
  question: string;
  answer: HtToTtcFaqAnswerSegment[];
};
export type HtToTtcRichTextSegment = string | { href: string; text: string };

/** @deprecated Prefer getHtToTtcSiteLinks().guideTaux.path */
export function getGuideTauxPath() {
  return getHtToTtcSiteLinks().guideTaux.path;
}

/** @deprecated Prefer getHtToTtcSiteLinks().mainCalculator.path */
export function getMainCalculatorPath() {
  return getHtToTtcSiteLinks().mainCalculator.path;
}

export const GUIDE_TAUX_TVA_PATH = "/guides/quels-sont-les-taux-de-tva-en-france";
export const MAIN_CALCULATOR_PATH = "/";

/** Coefficient TVA affiché en français (ex. 1,20). */
export function formatVatCoefficient(vatRatePct: number) {
  const coeff = 1 + vatRatePct / 100;
  return new Intl.NumberFormat("fr-FR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 3,
  }).format(coeff);
}

export function formatVatRateLabel(rate: VatRatePct) {
  const preset = VAT_RATE_PRESETS.find((item) => item.value === rate);
  return preset?.label ?? `${rate} %`;
}

export function getRateConversion(amountHt: number, rate: VatRatePct) {
  const rateNumber = vatRatePctToNumber(rate);
  const calc = calculateHtToTtc(amountHt, rateNumber);
  return {
    rate,
    rateNumber,
    rateLabel: formatVatRateLabel(rate),
    coefficient: formatVatCoefficient(rateNumber),
    ht: calc.ht,
    vatAmount: calc.vatAmount,
    ttc: calc.ttc,
    htFormatted: formatEuro2(calc.ht),
    htShort: formatHtEditorial(calc.ht),
    vatFormatted: formatEuro2(calc.vatAmount),
    vatShort: formatHtEditorial(calc.vatAmount),
    ttcFormatted: formatEuro2(calc.ttc),
    ttcShort: formatHtEditorial(calc.ttc),
  };
}

/**
 * Contenu paramétré d'une fiche "X € HT en TTC".
 * Source unique pour title, H1, meta, FAQ, formules et textes chiffrés.
 */
export function buildHtToTtcPageContent(amountHt: number) {
  const path = htToTtcPath(amountHt);
  const primary = getRateConversion(amountHt, PRIMARY_VAT_RATE);
  const secondary = SECONDARY_VAT_RATES.map((rate) => getRateConversion(amountHt, rate));
  const allRates = [primary, ...secondary];
  const links = getHtToTtcSiteLinks();

  const amountShort = formatHtEditorial(amountHt);
  const title = `Combien font ${amountShort} HT en TTC ?`;
  const h1 = `Conversion de ${amountShort} HT en TTC`;
  const metaDescription =
    `Convertissez ${amountShort} HT en TTC selon les différents taux de TVA : 20 %, 10 %, 5,5 % et 2,1 %. ` +
    `Calcul, tableau et convertisseur HT/TTC.`;
  const heroSubtitle =
    `${amountShort} HT correspondent à ${primary.ttcShort} TTC avec le taux normal de TVA à 20 %. ` +
    `Retrouvez également les résultats pour les taux de 10 %, 5,5 % et 2,1 %.`;
  const seoAnswer =
    `Avec le taux normal de TVA de 20 %, ${amountShort} HT correspondent à ${primary.ttcShort} TTC. ` +
    `Le montant de TVA est de ${primary.vatShort}.`;

  const breadcrumbLabel = `${amountShort} HT en TTC`;

  const faqItems: HtToTtcFaqItem[] = [
    {
      question: `Quel est le montant TTC de ${amountShort} HT avec 20 % de TVA ?`,
      answer: [`${primary.ttcShort} TTC. La TVA s'élève à ${primary.vatShort}.`],
    },
    {
      question: `Quel est le montant de TVA sur ${amountShort} HT ?`,
      answer: [
        `À 20 % : ${primary.vatShort}. À 10 % : ${secondary[0].vatShort}. À 5,5 % : ${secondary[1].vatShort}. À 2,1 % : ${secondary[2].vatShort}.`,
      ],
    },
    {
      question: `Comment passer de ${amountShort} HT à TTC ?`,
      answer: [
        "Multipliez le montant HT par (1 + taux de TVA). Exemple à 20 % : HT × 1,20. ",
        { href: "#calculateur-ht-ttc", text: "Utiliser le mini-calculateur" },
        ".",
      ],
    },
    {
      question: "Quel taux de TVA faut-il appliquer ?",
      answer: [
        "Cela dépend du bien ou du service. Le taux normal est de 20 % ; certains cas relèvent de 10 %, 5,5 % ou 2,1 %. ",
        {
          href: links.guideTaux.path,
          text: "Consultez le guide des taux de TVA en France",
        },
        ".",
      ],
    },
  ];

  return {
    amountHt,
    path,
    title,
    h1,
    metaDescription,
    heroSubtitle,
    seoAnswer,
    breadcrumbLabel,
    updatedAt: "2026-08-11",
    primary,
    secondary,
    allRates,
    faqItems,
    links,
    primarySection: {
      h2: `Comment calculer ${amountShort} HT en TTC ?`,
      paragraphs: [
        [
          "Le ",
          { href: links.guideTaux.path, text: "taux normal de TVA en France" },
          " est de 20 %.",
        ],
        ["Formule : TTC = HT × (1 + taux de TVA)."],
      ] as HtToTtcRichTextSegment[][],
      formulaTtc: `${primary.htFormatted} × ${primary.coefficient} = ${primary.ttcFormatted} TTC`,
      formulaVat: `${primary.ttcFormatted} − ${primary.htFormatted} = ${primary.vatFormatted} de TVA`,
      afterNote: [
        "Pour d'autres montants, ouvrez aussi le ",
        { href: links.mainCalculator.path, text: "calculateur HT → TTC" },
        ".",
      ] as HtToTtcRichTextSegment[],
    },
    tableSection: {
      h2: `Tableau de conversion de ${amountShort} HT en TTC selon le taux de TVA`,
    },
    whichRateSection: {
      h2: "Quel taux de TVA utiliser ?",
      body: [
        "Le taux dépend du produit ou du service. 20 % est le taux normal. Les taux de 10 %, 5,5 % et 2,1 % concernent des catégories précises.",
      ] as HtToTtcRichTextSegment[],
      guideHref: links.guideTaux.path,
      guideLabel: "Consultez le guide des taux de TVA en France",
      deductibleNote: [
        "Sur une facture, ne confondez pas TVA collectée et ",
        { href: links.guideDeductible.path, text: "TVA déductible" },
        ".",
      ] as HtToTtcRichTextSegment[],
    },
  };
}

export function faqItemsToSchema(items: HtToTtcFaqItem[]): FaqItem[] {
  return items.map((item) => ({
    question: item.question,
    answer: item.answer.map((seg) => (typeof seg === "string" ? seg : seg.text)).join(""),
  }));
}
