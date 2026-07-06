import { seoConfig } from "../seo.config";

/**
 * Navigation des outils — source unique pour le menu « Nos outils ».
 * Ajouter une entrée ici pour qu'un nouveau calculateur apparaisse automatiquement dans le menu.
 */
export interface ToolNavItem {
  href: string;
  shortTitle: string;
  title: string;
}

export const toolsNavigation: ToolNavItem[] = [
  {
    href: "/",
    shortTitle: "Calculateur HT → TTC",
    title: "Calculateur HT vers TTC — Prix TTC et montant de TVA",
  },
  {
    href: seoConfig.calculators.marginHtTtc.path,
    shortTitle: "Calculateur de marge HT / TTC",
    title: seoConfig.calculators.marginHtTtc.title,
  },
];
