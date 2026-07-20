import type { FaqItem } from "@/framework/types";
import type { GuideCoverImage } from "@/site/guides/covers";
import type { AuthorRecord } from "@/site/seo/entities";
import { entityUrl, getPersonRecord, personSchemaId } from "@/site/seo/entities";
import type { Guide } from "@/site/guides/types";
import { getCanonicalUrl } from "./metadata";
import type { SchemaContext } from "./schema-context";

export interface SchemaImageInput {
  url: string;
  width?: number;
  height?: number;
  caption?: string;
}

/** ImageObject Schema.org depuis le registre covers.ts */
export function buildImageObjectFromCover(
  siteUrl: string,
  cover: GuideCoverImage,
): Record<string, unknown> {
  return {
    "@type": "ImageObject",
    url: entityUrl(siteUrl, cover.src),
    width: cover.width,
    height: cover.height,
    caption: cover.alt,
  };
}

export function buildImageObject(
  siteUrl: string,
  image: SchemaImageInput,
): Record<string, unknown> {
  return {
    "@type": "ImageObject",
    url: image.url.startsWith("http") ? image.url : entityUrl(siteUrl, image.url),
    ...(image.width && { width: image.width }),
    ...(image.height && { height: image.height }),
    ...(image.caption && { caption: image.caption }),
  };
}

function pageId(siteUrl: string, path: string): string {
  return `${getCanonicalUrl(siteUrl, path)}#webpage`;
}

function breadcrumbId(siteUrl: string, path: string): string {
  return `${getCanonicalUrl(siteUrl, path)}#breadcrumb`;
}

export function buildBreadcrumbSchema(
  ctx: SchemaContext,
  path: string,
  items: { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": breadcrumbId(ctx.siteUrl, path),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(ctx.siteUrl, item.path),
    })),
  };
}

export function buildWebPageSchema(
  ctx: SchemaContext,
  title: string,
  description: string,
  path: string,
  image?: SchemaImageInput,
) {
  const url = getCanonicalUrl(ctx.siteUrl, path);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": pageId(ctx.siteUrl, path),
    name: title,
    description,
    url,
    inLanguage: ctx.language,
    isPartOf: { "@id": ctx.websiteId },
    publisher: { "@id": ctx.organizationId },
    breadcrumb: { "@id": breadcrumbId(ctx.siteUrl, path) },
    ...(image && { primaryImageOfPage: buildImageObject(ctx.siteUrl, image) }),
  };
}

/** Pages listant des guides ou outils */
export function buildCollectionPageSchema(
  ctx: SchemaContext,
  title: string,
  description: string,
  path: string,
  image?: SchemaImageInput,
) {
  const url = getCanonicalUrl(ctx.siteUrl, path);
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": pageId(ctx.siteUrl, path),
    name: title,
    description,
    url,
    inLanguage: ctx.language,
    isPartOf: { "@id": ctx.websiteId },
    publisher: { "@id": ctx.organizationId },
    breadcrumb: { "@id": breadcrumbId(ctx.siteUrl, path) },
    ...(image && { image: buildImageObject(ctx.siteUrl, image) }),
  };
}

export function buildWebApplicationSchema(
  ctx: SchemaContext,
  title: string,
  description: string,
  path: string,
  options?: { dateModified?: string; image?: SchemaImageInput },
) {
  const url = getCanonicalUrl(ctx.siteUrl, path);
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    description,
    url,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
    inLanguage: ctx.language,
    publisher: { "@id": ctx.organizationId },
    isPartOf: { "@id": ctx.websiteId },
    ...(options?.dateModified && { dateModified: options.dateModified }),
    ...(options?.image && { image: buildImageObject(ctx.siteUrl, options.image) }),
  };
}

export function buildArticleSchema(
  ctx: SchemaContext,
  guide: Guide,
  path: string,
  author: AuthorRecord,
  cover?: GuideCoverImage,
) {
  const url = getCanonicalUrl(ctx.siteUrl, path);
  const personId = personSchemaId(ctx.siteUrl, author);

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt,
    author: { "@id": personId },
    publisher: { "@id": ctx.organizationId },
    mainEntityOfPage: { "@type": "WebPage", "@id": pageId(ctx.siteUrl, path) },
    url,
    inLanguage: ctx.language,
    about: { "@type": "Thing", name: "TVA" },
    ...(cover && { image: buildImageObjectFromCover(ctx.siteUrl, cover) }),
  };
}

/** FAQPage : uniquement pour la page /faq */
export function buildFaqPageSchema(
  ctx: SchemaContext,
  title: string,
  description: string,
  path: string,
  faq: FaqItem[],
) {
  const url = getCanonicalUrl(ctx.siteUrl, path);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${url}#faq`,
    name: title,
    description,
    url,
    inLanguage: ctx.language,
    isPartOf: { "@id": ctx.websiteId },
    publisher: { "@id": ctx.organizationId },
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function buildProfilePageSchema(
  ctx: SchemaContext,
  author: AuthorRecord,
) {
  const url = entityUrl(ctx.siteUrl, author.path);
  const personId = personSchemaId(ctx.siteUrl, author);

  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "@id": pageId(ctx.siteUrl, author.path),
    name: author.seoTitle,
    description: author.seoDescription,
    url,
    inLanguage: ctx.language,
    isPartOf: { "@id": ctx.websiteId },
    publisher: { "@id": ctx.organizationId },
    breadcrumb: { "@id": breadcrumbId(ctx.siteUrl, author.path) },
    mainEntity: { "@id": personId },
  };
}

/** Graphe JSON-LD complet pour la page auteur */
export function buildAuthorPageGraph(
  ctx: SchemaContext,
  site: Parameters<typeof getPersonRecord>[0],
  author: AuthorRecord,
) {
  return [
    ctx.organization,
    ctx.website,
    getPersonRecord(site, author),
    buildProfilePageSchema(ctx, author),
    buildBreadcrumbSchema(ctx, author.path, [
      { name: "Accueil", path: "/" },
      { name: author.name, path: author.path },
    ]),
  ];
}

/** Graphe de base : Organization + WebSite (page d'accueil ou pages clés) */
export function buildSiteGraph(ctx: SchemaContext) {
  return [ctx.organization, ctx.website];
}
