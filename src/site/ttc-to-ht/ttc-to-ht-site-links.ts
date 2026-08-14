import { guides } from "../guides/registry";
import { getAllCalculators } from "../navigation/calculators-registry";

/** Slugs guides utilisés par la série TTC → HT (source unique). */
export const TTC_TO_HT_GUIDE_SLUGS = {
  taux: "quels-sont-les-taux-de-tva-en-france",
  deductible: "tva-deductible-et-tva-collectee",
} as const;

function guidePathFromRegistry(slug: string) {
  const guide = guides.find((item) => item.slug === slug);
  return `/guides/${guide?.slug ?? slug}`;
}

/**
 * Liens internes de la série, dérivés des registres calculateurs / guides.
 */
export function getTtcToHtSiteLinks() {
  const calculators = getAllCalculators();
  const mainCalculator = calculators.find((calc) => calc.id === "ht-ttc");
  const marginCalculator = calculators.find((calc) => calc.id === "marginHtTtc");

  return {
    mainCalculator: {
      path: mainCalculator?.path ?? "/",
      title: mainCalculator?.shortTitle ?? "Calculateur HT → TTC",
      description:
        mainCalculator?.description ??
        "Convertissez n'importe quel montant avec le taux de TVA de votre choix.",
    },
    marginCalculator: {
      path: marginCalculator?.path ?? "/calculateurs/calculateur-marge-ht-ttc",
      title: marginCalculator?.shortTitle ?? "Calculateur de marge HT / TTC",
      description: marginCalculator?.description ?? "",
    },
    guideTaux: {
      path: guidePathFromRegistry(TTC_TO_HT_GUIDE_SLUGS.taux),
      slug: TTC_TO_HT_GUIDE_SLUGS.taux,
    },
    guideDeductible: {
      path: guidePathFromRegistry(TTC_TO_HT_GUIDE_SLUGS.deductible),
      slug: TTC_TO_HT_GUIDE_SLUGS.deductible,
    },
  };
}
