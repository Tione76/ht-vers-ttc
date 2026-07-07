/** Données éditoriales du hub /guides : teasers, picker, parcours */

export const GUIDE_HUB_TEASERS: Record<string, string> = {
  "comment-faire-une-facture-conforme":
    "Mentions obligatoires, numérotation et erreurs à éviter sur vos factures.",
  "quels-sont-les-taux-de-tva-en-france":
    "Les 4 taux en vigueur, avec exemples de calcul HT et TTC.",
  "franchise-en-base-de-tva":
    "Seuils de CA, facturation sans TVA et sortie de franchise.",
  "tva-et-auto-entrepreneur":
    "Franchise, seuils et obligations TVA pour micro-entrepreneurs.",
  "tva-deductible-et-tva-collectee":
    "TVA collectée, TVA déductible et déclaration CA3 simplifiés.",
};

export function getGuideHubTeaser(slug: string): string | undefined {
  return GUIDE_HUB_TEASERS[slug];
}

export const GUIDE_PATHS = {
  taux: "/guides/quels-sont-les-taux-de-tva-en-france",
  franchise: "/guides/franchise-en-base-de-tva",
  facture: "/guides/comment-faire-une-facture-conforme",
  ae: "/guides/tva-et-auto-entrepreneur",
  deductible: "/guides/tva-deductible-et-tva-collectee",
} as const;

export const GUIDE_PICKER = [
  {
    icon: "📄",
    question: "Vous devez créer une facture ?",
    linkLabel: "guide sur la facture conforme",
    href: GUIDE_PATHS.facture,
  },
  {
    icon: "🍽",
    question: "Vous cherchez le bon taux de TVA ?",
    linkLabel: "guide des taux de TVA en France",
    href: GUIDE_PATHS.taux,
  },
  {
    icon: "👨‍💼",
    question: "Vous êtes auto-entrepreneur ?",
    linkLabel: "guide TVA et auto-entrepreneur",
    href: GUIDE_PATHS.ae,
  },
  {
    icon: "🏢",
    question: "Vous créez une entreprise ?",
    linkLabel: "guide sur la franchise en base de TVA",
    href: GUIDE_PATHS.franchise,
  },
  {
    icon: "💶",
    question: "Vous devez comprendre la TVA que vous reversez ?",
    linkLabel: "guide TVA déductible et TVA collectée",
    href: GUIDE_PATHS.deductible,
  },
] as const;

export const COMMON_ERRORS = [
  "Confondre HT et TTC sur un devis ou une facture",
  "Appliquer un mauvais taux de TVA par habitude sectorielle",
  "Oublier une mention obligatoire sur une facture",
  "Facturer la TVA alors que l'on est en franchise en base",
  "Confondre TVA collectée et TVA déductible",
] as const;

/** Guides liés aux erreurs fréquentes : pour la phrase de transition */
export const ERROR_GUIDE_LINKS = [
  { label: "taux de TVA en France", href: GUIDE_PATHS.taux },
  { label: "facture conforme", href: GUIDE_PATHS.facture },
  { label: "franchise en base de TVA", href: GUIDE_PATHS.franchise },
  { label: "TVA déductible et TVA collectée", href: GUIDE_PATHS.deductible },
] as const;

export const START_PATH = [
  {
    profile: "Vous débutez ?",
    action: "Commencez par le",
    linkLabel: "guide sur les taux de TVA en France",
    href: GUIDE_PATHS.taux,
  },
  {
    profile: "Vous facturez des clients ?",
    action: "Consultez ensuite le",
    linkLabel: "guide sur la facture conforme",
    href: GUIDE_PATHS.facture,
  },
  {
    profile: "Vous êtes auto-entrepreneur ?",
    action: "Lisez ensuite le",
    linkLabel: "guide TVA et auto-entrepreneur",
    href: GUIDE_PATHS.ae,
  },
  {
    profile: "Vous déclarez votre TVA ?",
    action: "Terminez par le",
    linkLabel: "guide TVA déductible et TVA collectée",
    href: GUIDE_PATHS.deductible,
  },
] as const;

export const TRUST_POINTS = [
  "Explications claires et accessibles.",
  "Exemples concrets.",
  "Illustrations et schémas pédagogiques.",
  "Guides gratuits.",
  "Outils de calcul complémentaires.",
  "Contenus régulièrement mis à jour.",
] as const;
