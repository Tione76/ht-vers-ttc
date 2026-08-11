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
import { HtToTtcHubPage } from "@/site/ht-to-ttc/HtToTtcHubPage";
import {
  getHtToTtcHubMeta,
  getHtToTtcHubRobots,
} from "@/site/ht-to-ttc/ht-to-ttc-publish";
import { getHtToTtcHubFaqSchemaItems } from "@/site/ht-to-ttc/ht-to-ttc-hub-content";

const hub = getHtToTtcHubMeta();

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata(config, seoConfig, {
    title: hub.title,
    description: hub.description,
    path: hub.path,
    robots: getHtToTtcHubRobots(),
  });
}

export default function MontantsHtEnTtcHubRoute() {
  const ctx = createSchemaContext(config);
  const faqItems = getHtToTtcHubFaqSchemaItems();
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
      <HtToTtcHubPage />
    </>
  );
}
