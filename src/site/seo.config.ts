/**
 * SEO du site — titres, descriptions, pages supplémentaires.
 */
export const seoConfig = {
  titleTemplate: "%s | Simulateur en ligne",
  defaultDescription: "Simulateur en ligne gratuit. Saisissez vos données, obtenez un résultat immédiat.",
  keywords: ["simulateur", "calcul", "estimation", "outil en ligne"],
  twitterHandle: undefined as string | undefined,

  home: {
    title: "Simulateur en ligne",
    description: "Simulateur gratuit et immédiat. Saisissez vos données, obtenez un résultat détaillé.",
  },

  legal: {
    contact: { title: "Contact", description: "Contactez l'équipe éditoriale." },
    privacy: { title: "Politique de confidentialité", description: "Informations sur vos données personnelles." },
    cookies: { title: "Politique de cookies", description: "Détail des cookies et gestion de vos préférences." },
    mentions: { title: "Mentions légales", description: "Informations légales sur l'éditeur et l'hébergeur." },
    faq: { title: "Questions fréquentes", description: "Réponses aux questions les plus posées sur le simulateur." },
    sitemap: { title: "Plan du site", description: "Liste de toutes les pages du site." },
    simulators: { title: "Tous les simulateurs", description: "Découvrez l'ensemble de nos outils en ligne." },
    cookiePrefs: { title: "Gestion des cookies", description: "Gérez vos préférences de cookies." },
    notFound: { title: "Page introuvable", description: "La page demandée n'existe pas ou a été déplacée." },
    error: { title: "Erreur serveur", description: "Une erreur est survenue. Veuillez réessayer plus tard." },
  },

  /** Pages complémentaires optionnelles (max ~5). Le framework génère routes + sitemap automatiquement. */
  extraPages: [] as {
    slug: string;
    title: string;
    description: string;
    sections: { title: string; content: string }[];
  }[],
};
