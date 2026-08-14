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
import { coverToOgInput, TTC_TO_HT_SERIES_COVER } from "@/site/guides/covers";
import { TtcToHtHubPage } from "@/site/ttc-to-ht/TtcToHtHubPage";
import {
  getTtcToHtHubMeta,
  getTtcToHtHubRobots,
} from "@/site/ttc-to-ht/ttc-to-ht-publish";
import { getTtcToHtHubFaqSchemaItems } from "@/site/ttc-to-ht/ttc-to-ht-hub-content";

const hub = getTtcToHtHubMeta();

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(config, seoConfig, {
    title: hub.title,
    description: hub.description,
    path: hub.path,
    robots: getTtcToHtHubRobots(),
    ogImage: coverToOgInput(TTC_TO_HT_SERIES_COVER),
  });
}

export default function MontantsTtcEnHtHubRoute() {
  const ctx = createSchemaContext(config);
  const faqItems = getTtcToHtHubFaqSchemaItems();
  const faqSchema = buildFaqPageSchema(ctx, hub.title, hub.description, hub.path, faqItems);
  const faqSchemaId = (faqSchema as { "@id": string })["@id"];

  const webPage = {
    ...buildWebPageSchema(ctx, hub.title, hub.description, hub.path),
    mainEntity: { "@id": faqSchemaId },
  };

  const graph = [
    ...buildSiteGraph(ctx),
    webPage,
    faqSchema,
    buildBreadcrumbSchema(ctx, hub.path, [
      { name: "Accueil", path: "/" },
      { name: hub.h1, path: hub.path },
    ]),
  ];

  return (
    <>
      <JsonLd data={graph} />
      <TtcToHtHubPage />
    </>
  );
}
