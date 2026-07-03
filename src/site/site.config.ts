/**
 * Configuration du site — modifiez ce fichier pour chaque nouveau site.
 */
export const siteConfig = {
  name: "Simulateur en ligne",
  domain: "example.com",
  url: "https://example.com",
  author: "Éditeur du site",
  language: "fr",
  locale: "fr-FR",

  colors: {
    primary: "#1a4b7c",
    primaryHover: "#153d66",
    primaryLight: "#f7f9fb",
    accent: "#e1000f",
    background: "#ffffff",
    surface: "#f7f9fb",
    border: "#e4e8ed",
    text: "#161616",
    textMuted: "#6b7280",
    textInverse: "#ffffff",
    focus: "#1a4b7c",
    success: "#18753c",
    error: "#ce0500",
  },

  logo: { src: "/logo.svg", alt: "Simulateur en ligne", width: 160, height: 32 },
  logoLetter: "S",
  favicon: "/icon.svg",
  ogImage: "/og-image.png",

  footerDescription:
    "Outils gratuits en ligne permettant de réaliser rapidement vos calculs et simulations.",

  home: {
    h1: "Simulateur en ligne",
    intro: [
      "Saisissez vos données ci-dessous pour obtenir une estimation immédiate.",
      "Les résultats sont fournis à titre indicatif.",
    ] as [string, string?],
  },

  explanations: [
    {
      title: "Comment lire le résultat ?",
      content:
        "Le résultat correspond à une estimation basée sur vos données. Vérifiez vos entrées avant de vous fier au résultat.",
    },
    {
      title: "Limites du simulateur",
      content:
        "Ce simulateur ne couvre pas toutes les situations particulières. Il ne remplace pas l'avis d'un professionnel qualifié.",
    },
  ],

  blogPosts: [] as {
    title: string;
    excerpt: string;
    date: string;
    readTime: string;
    href: string;
  }[],

  tools: [
    {
      title: "Outil A",
      description: "Description courte du simulateur complémentaire.",
      href: "/simulateurs",
      icon: "€",
    },
    {
      title: "Outil B",
      description: "Description courte du simulateur complémentaire.",
      href: "/simulateurs",
      icon: "◫",
    },
  ],

  recommendedSites: {
    title: "Autres outils",
    description: "Découvrez nos calculateurs complémentaires, tous gratuits et sans inscription.",
    links: [
      { title: "Outil A", description: "Description courte.", href: "https://example.com/a", external: true },
      { title: "Outil B", description: "Description courte.", href: "https://example.com/b", external: true },
    ],
  },

  contact: {
    email: "contact@example.com",
    companyName: "[Raison sociale]",
    address: "[Adresse complète]",
    intro:
      "Une question concernant ce simulateur ? Vous pouvez nous contacter grâce au formulaire ci-dessous.",
    trustNote:
      "Vos informations sont utilisées uniquement pour répondre à votre demande. Aucune utilisation commerciale.",
    infoItems: ["Réponse sous 48 h", "Gratuit", "Aucune donnée revendue"],
    subjects: [
      "Question sur le simulateur",
      "Signaler une erreur",
      "Suggestion d'amélioration",
      "Autre demande",
    ],
    faqLinks: [
      { label: "Consulter la FAQ complète", href: "/faq" },
      { label: "Politique de confidentialité", href: "/politique-de-confidentialite" },
      { label: "Politique de cookies", href: "/politique-de-cookies" },
    ],
  },

  legal: {
    privacy: {
      lastUpdated: "2026-01-01",
      sections: [
        { title: "Responsable du traitement", content: "Le responsable du traitement est l'éditeur du site." },
        { title: "Données collectées", content: "Aucune donnée n'est collectée via le formulaire de simulation." },
        { title: "Vos droits", content: "Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et d'effacement." },
      ],
    },
    cookies: {
      lastUpdated: "2026-01-01",
      sections: [
        { title: "Qu'est-ce qu'un cookie ?", content: "Un cookie est un petit fichier texte déposé sur votre terminal." },
        { title: "Gérer vos préférences", content: 'Cliquez sur « Gérer les cookies » en bas de page ou visitez la page de gestion des cookies.' },
      ],
    },
    mentions: {
      lastUpdated: "2026-01-01",
      sections: [
        { title: "Éditeur du site", content: "[Raison sociale], [adresse]. Contact : contact@example.com." },
        { title: "Hébergeur", content: "Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis." },
        { title: "Limitation de responsabilité", content: "Les simulateurs fournissent des estimations indicatives." },
      ],
    },
  },

  navigation: {
    header: [
      { label: "Accueil", href: "/" },
      { label: "FAQ", href: "/faq" },
      { label: "Contact", href: "/contact" },
    ],
    footer: [
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Confidentialité", href: "/politique-de-confidentialite" },
      { label: "Cookies", href: "/politique-de-cookies" },
      { label: "Plan du site", href: "/plan-du-site" },
      { label: "Contact", href: "/contact" },
    ],
  },

  analytics: {
    googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
    googleSearchConsoleId: process.env.NEXT_PUBLIC_GSC_ID,
    googleAdsenseClientId: process.env.NEXT_PUBLIC_ADSENSE_ID,
  },

  ads: {
    slots: {
      "under-h1": { enabled: false, adSlot: process.env.NEXT_PUBLIC_AD_SLOT_UNDER_H1 ?? "", format: "horizontal" as const },
      "after-result": { enabled: true, adSlot: process.env.NEXT_PUBLIC_AD_SLOT_AFTER_RESULT ?? "", format: "auto" as const },
      "before-footer": { enabled: true, adSlot: process.env.NEXT_PUBLIC_AD_SLOT_BEFORE_FOOTER ?? "", format: "horizontal" as const },
    },
  },
};
