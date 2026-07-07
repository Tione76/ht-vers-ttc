import { seoConfig } from "../seo.config";
import { HOME_COVER, MARGIN_CALCULATOR_COVER, type GuideCoverImage } from "../guides/covers";

/** Entrée calculateur : source unique pour menu, sidebar, sitemap et page Nos outils */
export interface CalculatorEntry {
  id: string;
  path: string;
  title: string;
  shortTitle: string;
  description: string;
  h1: string;
  cover: GuideCoverImage;
  icon: string;
}

const CALCULATOR_COVERS: Record<string, GuideCoverImage> = {
  marginHtTtc: MARGIN_CALCULATOR_COVER,
};

function getHomeCalculator(): CalculatorEntry {
  return {
    id: "ht-ttc",
    path: "/",
    title: seoConfig.home.title,
    shortTitle: "Calculateur HT → TTC",
    description: seoConfig.home.description,
    h1: seoConfig.home.h1,
    cover: HOME_COVER,
    icon: "€",
  };
}

/**
 * Tous les calculateurs publics du site.
 * Ajouter une entrée dans seoConfig.calculators suffit pour l'intégrer partout.
 */
export function getAllCalculators(): CalculatorEntry[] {
  const home = getHomeCalculator();
  const secondary = Object.entries(seoConfig.calculators).map(([id, calc]) => ({
    id,
    path: calc.path,
    title: calc.title,
    shortTitle: calc.h1,
    description: calc.description,
    h1: calc.h1,
    cover: CALCULATOR_COVERS[id] ?? HOME_COVER,
    icon: "€",
  }));
  return [home, ...secondary];
}
