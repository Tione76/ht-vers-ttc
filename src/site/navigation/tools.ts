import { getAllCalculators } from "./calculators-registry";

/**
 * Menu « Nos outils » : dérivé automatiquement du registre des calculateurs.
 */
export const toolsNavigation = getAllCalculators().map((calc) => ({
  href: calc.path,
  shortTitle: calc.shortTitle,
  title: calc.title,
}));

export type ToolNavItem = (typeof toolsNavigation)[number];
