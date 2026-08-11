import type { Metadata } from "next";
import { JsonLd } from "@/framework/JsonLd";
import { buildPageMetadata } from "@/framework/seo/metadata";
import {
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildWebPageSchema,
  buildSiteGraph,
} from "@/framework/seo/json-ld";
import { createSchemaContext } from "@/framework/seo/schema-context";
import { config, seoConfig } from "@/site";
import { coverToOgInput, HT_TO_TTC_SERIES_COVER } from "@/site/guides/covers";
import { HtToTtcTableIndexPage } from "@/site/ht-to-ttc/HtToTtcTableIndexPage";
import {
  getHtToTtcTableIndexFaqSchemaItems,
  getHtToTtcTableIndexMeta,
} from "@/site/ht-to-ttc/ht-to-ttc-table-index";

const page = getHtToTtcTableIndexMeta();

export const metadata: Metadata = buildPageMetadata(config, seoConfig, {
  title: page.title,
  description: page.description,
  path: page.path,
  robots: { index: true, follow: true },
  ogImage: coverToOgInput(HT_TO_TTC_SERIES_COVER),
});

export default function TableauConversionHtTtcPage() {
  const ctx = createSchemaContext(config);
  const faqItems = getHtToTtcTableIndexFaqSchemaItems();
  const faqSchema = buildFaqPageSchema(ctx, page.title, page.description, page.path, faqItems);
  const faqSchemaId = (faqSchema as { "@id": string })["@id"];

  const webPage = {
    ...buildWebPageSchema(ctx, page.title, page.description, page.path),
    mainEntity: { "@id": faqSchemaId },
  };

  const graph = [
    ...buildSiteGraph(ctx),
    webPage,
    faqSchema,
    buildBreadcrumbSchema(ctx, page.path, [
      { name: "Accueil", path: "/" },
      { name: page.h1, path: page.path },
    ]),
  ];

  return (
    <>
      <JsonLd data={graph} />
      <HtToTtcTableIndexPage />
    </>
  );
}
