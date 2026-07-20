import type { FaqItem } from "@/framework/types";
import type { GuideCoverImage } from "@/site/guides/covers";
import type { AuthorRecord } from "@/site/seo/entities";
import type { SiteConfigShape } from "@/site/seo/entities";
import { getPersonRecord } from "@/site/seo/entities";
import type { Guide } from "@/site/guides/types";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildCollectionPageSchema,
  buildFaqPageSchema,
  buildSiteGraph,
  buildWebApplicationSchema,
  buildWebPageSchema,
  type SchemaImageInput,
} from "./json-ld";
import { createSchemaContext, type SchemaContext } from "./schema-context";

export interface StandardPageSchemaInput {
  title: string;
  description: string;
  path: string;
  breadcrumbs: { name: string; path: string }[];
  image?: SchemaImageInput;
}

export interface GuidePageSchemaInput extends StandardPageSchemaInput {
  guide: Guide;
  author: AuthorRecord;
  cover?: GuideCoverImage;
}

export interface CalculatorPageSchemaInput extends StandardPageSchemaInput {
  dateModified?: string;
}

function withSiteGraph(ctx: SchemaContext, nodes: Record<string, unknown>[]) {
  return [...buildSiteGraph(ctx), ...nodes];
}

/** WebPage standard + fil d'Ariane + entités site */
export function buildStandardPageGraph(site: SiteConfigShape, input: StandardPageSchemaInput) {
  const ctx = createSchemaContext(site);
  return [
    ...buildSiteGraph(ctx),
    buildWebPageSchema(ctx, input.title, input.description, input.path, input.image),
    buildBreadcrumbSchema(ctx, input.path, input.breadcrumbs),
  ];
}

/** Hub guides ou outils : CollectionPage */
export function buildHubPageGraph(site: SiteConfigShape, input: StandardPageSchemaInput) {
  const ctx = createSchemaContext(site);
  return [
    ...buildSiteGraph(ctx),
    buildCollectionPageSchema(ctx, input.title, input.description, input.path, input.image),
    buildBreadcrumbSchema(ctx, input.path, input.breadcrumbs),
  ];
}

/** Page guide : Article + WebPage implicite via mainEntityOfPage + Person (réf. @id) */
export function buildGuidePageGraph(site: SiteConfigShape, input: GuidePageSchemaInput) {
  const ctx = createSchemaContext(site);
  return [
    ...buildSiteGraph(ctx),
    getPersonRecord(site, input.author),
    buildWebPageSchema(ctx, input.title, input.description, input.path, input.image),
    buildArticleSchema(ctx, input.guide, input.path, input.author, input.cover),
    buildBreadcrumbSchema(ctx, input.path, input.breadcrumbs),
  ];
}

/** Calculateur : WebApplication + WebPage + site graph */
export function buildCalculatorPageGraph(site: SiteConfigShape, input: CalculatorPageSchemaInput) {
  const ctx = createSchemaContext(site);
  return withSiteGraph(ctx, [
    buildWebPageSchema(ctx, input.title, input.description, input.path, input.image),
    buildWebApplicationSchema(ctx, input.title, input.description, input.path, {
      dateModified: input.dateModified,
      image: input.image,
    }),
    buildBreadcrumbSchema(ctx, input.path, input.breadcrumbs),
  ]);
}

/** Page FAQ dédiée : FAQPage complet */
export function buildFaqPageGraph(
  site: SiteConfigShape,
  input: StandardPageSchemaInput,
  faq: FaqItem[],
) {
  const ctx = createSchemaContext(site);
  return [
    ...buildSiteGraph(ctx),
    buildWebPageSchema(ctx, input.title, input.description, input.path, input.image),
    buildFaqPageSchema(ctx, input.title, input.description, input.path, faq),
    buildBreadcrumbSchema(ctx, input.path, input.breadcrumbs),
  ];
}

export { createSchemaContext };
