/** Données éditoriales du hub /nos-outils */

import { seoConfig } from "../seo.config";

export const HT_TTC_PATH = "/";
export const MARGIN_PATH = seoConfig.calculators.marginHtTtc.path;
export const GUIDE_TAUX_PATH = "/guides/quels-sont-les-taux-de-tva-en-france";

export const TOOL_HUB_TEASERS: Record<string, string> = {
  "ht-ttc":
    "Convertissez un prix HT en TTC (et l'inverse) selon le taux de TVA choisi.",
  marginHtTtc:
    "Fixez votre prix de vente à partir d'un coût d'achat, avec marge et TVA intégrés.",
};

export function getToolHubTeaser(id: string): string | undefined {
  return TOOL_HUB_TEASERS[id];
}

export const TOOL_HUB_REASSURANCE = [
  "Gratuit",
  "Sans inscription",
  "Calcul instantané",
] as const;

export const TOOL_PICKER = [
  {
    icon: "🔄",
    question: "Vous souhaitez convertir un prix HT en TTC ?",
    linkLabel: "Calculateur HT → TTC",
    href: HT_TTC_PATH,
  },
  {
    icon: "📊",
    question: "Vous souhaitez calculer une marge commerciale ?",
    linkLabel: "Calculateur de marge HT / TTC",
    href: MARGIN_PATH,
  },
  {
    icon: "📋",
    question: "Vous cherchez le bon taux de TVA ?",
    linkLabel: "guide sur les taux de TVA en France",
    href: GUIDE_TAUX_PATH,
    isGuide: true,
  },
] as const;

export const TOOL_HUB_BENEFITS = [
  "Gagner du temps sur un devis ou un tarif",
  "Éviter les erreurs de calcul HT / TTC",
  "Vérifier une facture avant envoi",
  "Préparer un prix de vente fiable",
  "Contrôler un montant TTC affiché au client",
  "Estimer une marge commerciale en quelques secondes",
] as const;

export const TOOL_MATCH_ROWS = [
  { need: "Convertir un prix HT en TTC", tool: "Calculateur HT → TTC", href: HT_TTC_PATH },
  { need: "Retrouver un prix HT", tool: "Calculateur HT → TTC", href: HT_TTC_PATH },
  { need: "Calculer un montant de TVA", tool: "Calculateur HT → TTC", href: HT_TTC_PATH },
  { need: "Déterminer un prix de vente", tool: "Calculateur de marge HT / TTC", href: MARGIN_PATH },
  { need: "Calculer une marge commerciale", tool: "Calculateur de marge HT / TTC", href: MARGIN_PATH },
] as const;

export const TOOL_HUB_GUIDE_LINKS = [
  { label: "taux de TVA en France", href: GUIDE_TAUX_PATH },
  { label: "facture conforme", href: "/guides/comment-faire-une-facture-conforme" },
  { label: "franchise en base de TVA", href: "/guides/franchise-en-base-de-tva" },
  { label: "TVA et auto-entrepreneur", href: "/guides/tva-et-auto-entrepreneur" },
  {
    label: "TVA déductible et TVA collectée",
    href: "/guides/tva-deductible-et-tva-collectee",
  },
] as const;

export const TOOL_HUB_ERRORS = [
  "Confondre HT et TTC sur un devis ou une facture",
  "Retirer 20 % d'un prix TTC au lieu de diviser par 1,20",
  "Appliquer le mauvais taux de TVA par habitude sectorielle",
  "Oublier que la marge se calcule sur le hors taxes",
  "Confondre taux de marge et taux de marque",
] as const;

export const TOOL_HUB_CALCULATIONS = [
  "Convertir un prix HT en TTC",
  "Retrouver un prix HT à partir du TTC",
  "Calculer le montant de TVA",
  "Appliquer les taux de TVA courants (20 %, 10 %, 5,5 %, 2,1 %)",
  "Estimer un prix de vente à partir d'un coût d'achat",
  "Calculer une marge commerciale en euros",
  "Comparer marge, taux de marge et taux de marque",
] as const;

export interface ToolsHubFaqItem {
  question: string;
  answer: string;
}

export const TOOL_HUB_FAQ: ToolsHubFaqItem[] = [
  {
    question: "Comment calculer un prix TTC ?",
    answer:
      "Multipliez le prix HT par (1 + taux de TVA). Exemple à 20 % : 100 € HT × 1,20 = 120 € TTC. Le montant de TVA est alors de 20 €. Notre calculateur HT → TTC applique cette formule automatiquement et arrondit au centime.",
  },
  {
    question: "Comment retrouver un prix HT ?",
    answer:
      "Divisez le prix TTC par (1 + taux de TVA). Exemple : 120 € TTC ÷ 1,20 = 100 € HT à 20 %. Ne soustrayez pas 20 % du TTC : ce serait une erreur fréquente. Le calculateur HT → TTC propose aussi le mode TTC vers HT.",
  },
  {
    question: "Comment calculer la TVA ?",
    answer:
      "La TVA = prix HT × taux de TVA (ou TTC − HT). Sur 100 € HT à 20 %, la TVA est de 20 €. Le taux dépend de votre activité : 20 %, 10 %, 5,5 % ou 2,1 % en France métropolitaine. Choisissez le bon taux avant de calculer.",
  },
  {
    question: "Comment fonctionne le calculateur HT → TTC ?",
    answer:
      "Saisissez un montant, sélectionnez le sens (HT vers TTC ou TTC vers HT), choisissez le taux de TVA : le résultat se met à jour en direct. Aucune inscription n'est requise et les calculs restent dans votre navigateur.",
  },
  {
    question: "Comment calculer une marge commerciale ?",
    answer:
      "Partez du coût d'achat HT, indiquez la marge souhaitée (en euros ou en taux de marge) : le calculateur de marge affiche le prix de vente HT, la TVA et le TTC. Il distingue aussi le taux de marque et le coefficient multiplicateur.",
  },
  {
    question: "Quel outil utiliser selon mon besoin ?",
    answer:
      "Pour convertir HT/TTC ou obtenir un montant de TVA, utilisez le calculateur HT → TTC. Pour fixer un prix de vente à partir d'un coût d'achat, préférez le calculateur de marge HT / TTC. Le tableau « Quel outil utiliser ? » sur cette page résume les cas les plus courants.",
  },
  {
    question: "Les calculateurs sont-ils gratuits ?",
    answer:
      "Oui. Tous nos calculateurs en ligne sont gratuits et accessibles sans abonnement. Vous pouvez les utiliser autant de fois que nécessaire pour vos devis, factures ou contrôles de prix.",
  },
  {
    question: "Les résultats sont-ils fiables ?",
    answer:
      "Les formules appliquées sont les règles standard du calcul HT, TTC et de marge. Les montants sont arrondis au centime d'euro. Pour une décision fiscale engageante, croisez toujours le résultat avec les règles applicables à votre activité.",
  },
  {
    question: "Les outils fonctionnent-ils sur mobile ?",
    answer:
      "Oui. Les calculateurs sont conçus pour fonctionner sur smartphone, tablette et ordinateur. L'interface s'adapte à la taille de l'écran pour saisir un montant et lire le résultat confortablement.",
  },
  {
    question: "Dois-je créer un compte ?",
    answer:
      "Non. Aucun compte n'est nécessaire. Ouvrez l'outil, saisissez vos montants et consultez le résultat immédiatement. Aucune donnée de calcul n'est stockée sur nos serveurs.",
  },
];
