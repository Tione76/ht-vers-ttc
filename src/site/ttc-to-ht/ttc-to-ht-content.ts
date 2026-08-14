import type { FaqItem } from "@/framework/types";
import {
  calculateTtcToHt,
  formatEuro2,
  formatHtEditorial,
  type VatRatePct,
} from "../ht-to-ttc/ht-to-ttc-calc";
import {
  PRIMARY_VAT_RATE,
  SECONDARY_VAT_RATES,
  VAT_RATE_PRESETS,
  vatRatePctToNumber,
} from "../ht-to-ttc/ht-to-ttc-rates";
import { ttcToHtPath } from "./ttc-to-ht-paths";
import { getTtcToHtSiteLinks } from "./ttc-to-ht-site-links";

export { PRIMARY_VAT_RATE, SECONDARY_VAT_RATES, formatHtEditorial };

export type TtcToHtFaqAnswerSegment = string | { href: string; text: string };
export type TtcToHtFaqItem = {
  question: string;
  answer: TtcToHtFaqAnswerSegment[];
};
export type TtcToHtRichTextSegment = string | { href: string; text: string };

/** Coefficient diviseur affiché en français (ex. 1,20). */
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

export function getTtcToHtRateConversion(amountTtc: number, rate: VatRatePct) {
  const rateNumber = vatRatePctToNumber(rate);
  const calc = calculateTtcToHt(amountTtc, rateNumber);
  return {
    rate,
    rateNumber,
    rateLabel: formatVatRateLabel(rate),
    coefficient: formatVatCoefficient(rateNumber),
    ttc: calc.ttc,
    ht: calc.ht,
    vatAmount: calc.vatAmount,
    ttcFormatted: formatEuro2(calc.ttc),
    ttcShort: formatHtEditorial(calc.ttc),
    htFormatted: formatEuro2(calc.ht),
    htShort: formatHtEditorial(calc.ht),
    vatFormatted: formatEuro2(calc.vatAmount),
    vatShort: formatHtEditorial(calc.vatAmount),
  };
}

/**
 * Contenu paramétré d'une fiche "X € TTC en HT".
 * Source unique pour title, H1, meta, FAQ, formules et textes chiffrés.
 */
export function buildTtcToHtPageContent(amountTtc: number) {
  const path = ttcToHtPath(amountTtc);
  const primary = getTtcToHtRateConversion(amountTtc, PRIMARY_VAT_RATE);
  const secondary = SECONDARY_VAT_RATES.map((rate) => getTtcToHtRateConversion(amountTtc, rate));
  const allRates = [primary, ...secondary];
  const links = getTtcToHtSiteLinks();

  const amountShort = formatHtEditorial(amountTtc);
  const title = `Combien font ${amountShort} TTC en HT ?`;
  const h1 = `Conversion de ${amountShort} TTC en HT`;
  const metaDescription =
    `Convertissez ${amountShort} TTC en HT selon les différents taux de TVA : 20 %, 10 %, 5,5 % et 2,1 %. ` +
    `Calcul, tableau et convertisseur TTC/HT.`;
  const heroSubtitle =
    `${amountShort} TTC correspondent à ${primary.htShort} HT avec le taux normal de TVA à 20 %. ` +
    `Retrouvez également les résultats pour les taux de 10 %, 5,5 % et 2,1 %.`;
  const seoAnswer =
    `Avec le taux normal de TVA de 20 %, ${amountShort} TTC correspondent à ${primary.htShort} HT. ` +
    `Le montant de TVA est de ${primary.vatShort}.`;

  const breadcrumbLabel = `${amountShort} TTC en HT`;

  const faqItems: TtcToHtFaqItem[] = [
    {
      question: `Quel est le montant HT de ${amountShort} TTC avec 20 % de TVA ?`,
      answer: [`${primary.htShort} HT. La TVA comprise s'élève à ${primary.vatShort}.`],
    },
    {
      question: `Quelle est la TVA comprise dans ${amountShort} TTC ?`,
      answer: [
        `À 20 % : ${primary.vatShort}. À 10 % : ${secondary[0].vatShort}. À 5,5 % : ${secondary[1].vatShort}. À 2,1 % : ${secondary[2].vatShort}.`,
      ],
    },
    {
      question: "Comment calculer le HT à partir du TTC ?",
      answer: [
        "Divisez le montant TTC par (1 + taux de TVA). Exemple à 20 % : TTC ÷ 1,20. ",
        { href: "#calculateur-ttc-ht", text: "Utiliser le mini-calculateur" },
        ".",
      ],
    },
    {
      question: `Quel taux de TVA utiliser pour convertir ${amountShort} TTC en HT ?`,
      answer: [
        "Le taux dépend du bien ou du service. Le taux normal est de 20 %. ",
        {
          href: links.guideTaux.path,
          text: "Consultez le guide des taux de TVA en France",
        },
        ".",
      ],
    },
  ];

  return {
    amountTtc,
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
      h2: `Comment calculer ${amountShort} TTC en HT ?`,
      paragraphs: [
        [
          "Le ",
          { href: links.guideTaux.path, text: "taux normal de TVA en France" },
          " est de 20 %.",
        ],
        ["Formule : HT = TTC ÷ (1 + taux de TVA)."],
      ] as TtcToHtRichTextSegment[][],
      formulaHt: `${primary.ttcFormatted} ÷ ${primary.coefficient} = ${primary.htFormatted} HT`,
      formulaVat: `${primary.ttcFormatted} − ${primary.htFormatted} = ${primary.vatFormatted} de TVA`,
      afterNote: [
        "Pour d'autres montants, ouvrez aussi le ",
        { href: links.mainCalculator.path, text: "calculateur HT → TTC" },
        " (mode TTC vers HT).",
      ] as TtcToHtRichTextSegment[],
    },
    tableSection: {
      h2: `Tableau de conversion de ${amountShort} TTC en HT selon le taux de TVA`,
    },
    whichRateSection: {
      h2: "Quel taux de TVA utiliser ?",
      body: [
        "Le taux dépend du produit ou du service. 20 % est le taux normal. Les taux de 10 %, 5,5 % et 2,1 % concernent des catégories précises.",
      ] as TtcToHtRichTextSegment[],
      guideHref: links.guideTaux.path,
      guideLabel: "Quels sont les taux de TVA en France ?",
      deductibleNote: [
        "Sur une facture, ne confondez pas TVA collectée et ",
        { href: links.guideDeductible.path, text: "TVA déductible" },
        ".",
      ] as TtcToHtRichTextSegment[],
    },
  };
}

export function faqItemsToSchema(items: TtcToHtFaqItem[]): FaqItem[] {
  return items.map((item) => ({
    question: item.question,
    answer: item.answer.map((seg) => (typeof seg === "string" ? seg : seg.text)).join(""),
  }));
}
