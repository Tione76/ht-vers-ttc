import { seoConfig } from "@/site/seo.config";

export interface AuthorResourceLink {
  href: string;
  title: string;
  description: string;
  icon: string;
  cta: string;
}

/** Ressources mises en avant sur la page auteur (descriptions courtes) */
export function getAuthorPageResources(): AuthorResourceLink[] {
  const margin = seoConfig.calculators.marginHtTtc;

  return [
    {
      href: "/",
      title: "Calculateur HT → TTC",
      description: "Convertissez un montant HT en TTC, ou l'inverse, en quelques secondes.",
      icon: "€",
      cta: "Ouvrir le calculateur →",
    },
    {
      href: margin.path,
      title: "Calculateur de marge",
      description: "Estimez marge, prix de vente et TVA pour votre activité.",
      icon: "€",
      cta: "Ouvrir l'outil →",
    },
    {
      href: "/faq",
      title: "FAQ TVA",
      description: "Réponses courtes aux questions les plus fréquentes sur la TVA.",
      icon: "?",
      cta: "Consulter la FAQ →",
    },
    {
      href: seoConfig.guidesHub.path,
      title: "Tous les guides",
      description: "Retrouvez l'ensemble des guides TVA et facturation du site.",
      icon: "📘",
      cta: "Voir les guides →",
    },
  ];
}
