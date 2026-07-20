/**
 * Registre central des entités Schema.org du site.
 * Modifier une information ici la propage via les helpers JSON-LD.
 */
import type { siteConfig } from "../site.config";

export type SiteConfigShape = typeof siteConfig;

export const SCHEMA_FRAGMENT = {
  organization: "organization",
  website: "website",
} as const;

export function schemaId(siteUrl: string, fragment: string): string {
  return `${siteUrl}/#${fragment}`;
}

export function entityUrl(siteUrl: string, path: string): string {
  return `${siteUrl}${path === "/" ? "" : path}`;
}

/** Organization : source unique pour publisher, copyrightHolder, worksFor */
export function getOrganizationRecord(site: SiteConfigShape) {
  const id = schemaId(site.url, SCHEMA_FRAGMENT.organization);
  const logoUrl = entityUrl(site.url, site.logo.src);
  const imageUrl = entityUrl(site.url, site.ogImage);

  return {
    "@type": "Organization" as const,
    "@id": id,
    name: site.footerBrandName,
    url: site.url,
    logo: {
      "@type": "ImageObject" as const,
      url: logoUrl,
      width: site.logo.width,
      height: site.logo.height,
    },
    image: imageUrl,
    description: site.footerDescription,
    email: site.contact.email,
    inLanguage: site.language,
    /** Réseaux sociaux : ajouter les URLs ici lorsque disponibles */
    sameAs: [] as string[],
  };
}

/** WebSite global : référencé par isPartOf sur chaque WebPage */
export function getWebSiteRecord(site: SiteConfigShape) {
  const orgId = schemaId(site.url, SCHEMA_FRAGMENT.organization);
  const websiteId = schemaId(site.url, SCHEMA_FRAGMENT.website);

  return {
    "@type": "WebSite" as const,
    "@id": websiteId,
    name: site.name,
    url: site.url,
    inLanguage: site.language,
    publisher: { "@id": orgId },
    copyrightHolder: { "@id": orgId },
    /** Préparé pour une future recherche interne (SearchAction) */
    potentialAction: {
      "@type": "SearchAction" as const,
      target: {
        "@type": "EntryPoint" as const,
        urlTemplate: `${site.url}/plan-du-site?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export interface AuthorMethodStep {
  title: string;
  description: string;
}

export interface AuthorRecord {
  slug: string;
  givenName: string;
  name: string;
  path: string;
  jobTitle: string;
  description: string;
  /** Biographie courte affichée dans la carte de profil (3 à 5 lignes max) */
  profileBio: string;
  /** Présentation éditoriale compacte sous la carte de profil */
  presentation: string;
  methodology: AuthorMethodStep[];
  expertise: string[];
  /** Chemin public vers la photo (ex. /images/authors/antoine.webp) */
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  seoTitle: string;
  seoDescription: string;
}

/** Auteur par défaut des guides */
export const DEFAULT_GUIDE_AUTHOR_SLUG = "antoine";

export const AUTHORS: Record<string, AuthorRecord> = {
  antoine: {
    slug: "antoine",
    givenName: "Antoine",
    name: "Antoine",
    path: "/auteurs/antoine",
    jobTitle: "Rédacteur des guides TVA et facturation",
    description:
      "Antoine rédige les guides pratiques publiés sur HT-VERS-TTC.fr : TVA, facturation et calculateurs HT / TTC.",
    profileBio:
      "Antoine conçoit les guides pratiques du site pour rendre la TVA et la facturation plus accessibles au quotidien. Il privilégie un langage direct, des exemples concrets et des liens vers les calculateurs pour passer à l'action.",
    presentation:
      "Les contenus sont revus régulièrement et s'appuient sur les références fiscales officielles dès que le sujet l'exige. L'objectif : vous aider à comprendre les règles et à les appliquer sereinement.",
    methodology: [
      {
        title: "Recherche",
        description: "Collecte des règles, pratiques courantes et cas fréquents.",
      },
      {
        title: "Vérification",
        description: "Recoupement avec les sources officielles lorsque nécessaire.",
      },
      {
        title: "Explication claire",
        description: "Vulgarisation avec exemples chiffrés et schémas.",
      },
      {
        title: "Mise à jour",
        description: "Relecture régulière pour intégrer les évolutions.",
      },
    ],
    expertise: [
      "TVA en France",
      "Calcul HT et TTC",
      "Facturation conforme",
      "Franchise en base de TVA",
      "Auto-entrepreneur et TVA",
    ],
    seoTitle: "Antoine, auteur des guides TVA sur HT-VERS-TTC.fr",
    seoDescription:
      "Découvrez Antoine, rédacteur des guides pratiques sur la TVA, le HT, le TTC et la facturation publiés sur HT-VERS-TTC.fr.",
  },
};

export function getAuthor(slug: string): AuthorRecord | undefined {
  return AUTHORS[slug];
}

export function getDefaultGuideAuthor(): AuthorRecord {
  return AUTHORS[DEFAULT_GUIDE_AUTHOR_SLUG];
}

export function getAuthorSlugs(): string[] {
  return Object.keys(AUTHORS);
}

export function personSchemaId(siteUrl: string, author: AuthorRecord): string {
  return `${entityUrl(siteUrl, author.path)}#person`;
}

/** Person : entité auteur réutilisable dans Article et ProfilePage */
export function getPersonRecord(site: SiteConfigShape, author: AuthorRecord) {
  const orgId = schemaId(site.url, SCHEMA_FRAGMENT.organization);
  const id = personSchemaId(site.url, author);

  return {
    "@type": "Person" as const,
    "@id": id,
    name: author.name,
    givenName: author.givenName,
    url: entityUrl(site.url, author.path),
    jobTitle: author.jobTitle,
    description: author.description,
    knowsAbout: author.expertise,
    worksFor: { "@id": orgId },
    ...(author.image && {
      image: {
        "@type": "ImageObject" as const,
        url: entityUrl(site.url, author.image),
        ...(author.imageWidth && { width: author.imageWidth }),
        ...(author.imageHeight && { height: author.imageHeight }),
      },
    }),
  };
}
