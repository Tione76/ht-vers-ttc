import { config, seoConfig } from "@/site";
import {
  guides,
  GuideListCard,
  GuidesHubEditorial,
  GuidesHubPicker,
  GuidesHubSidebar,
} from "@/site/guides";
import { coverToOgInput, coverToSchemaImage, GUIDES_HUB_COVER } from "@/site/guides/covers";
import { PageBreadcrumb } from "@/framework/design/components/PageBreadcrumb";
import { GuidePageLayout } from "@/site/guides/GuidePageLayout";
import { JsonLd } from "@/framework/JsonLd";
import { buildPageMetadata } from "@/framework/seo/metadata";
import { buildHubPageGraph } from "@/framework/seo/page-schemas";
import "@/site/guides/guide-page.css";

const hub = seoConfig.guidesHub;

export const metadata = buildPageMetadata(config, seoConfig, {
  title: hub.title,
  description: hub.description,
  path: hub.path,
  ogImage: coverToOgInput(GUIDES_HUB_COVER),
});

export default function GuidesHubPage() {
  return (
    <>
      <JsonLd
        data={buildHubPageGraph(config, {
          title: hub.title,
          description: hub.description,
          path: hub.path,
          image: coverToSchemaImage(GUIDES_HUB_COVER),
          breadcrumbs: [
            { name: "Accueil", path: "/" },
            { name: hub.h1, path: hub.path },
          ],
        })}
      />
      <GuidePageLayout
        title={hub.h1}
        subtitle={hub.subtitle}
        sidebar={<GuidesHubSidebar />}
      >
        <PageBreadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: "Guides TVA" },
          ]}
        />
        <div className="guide-list-grid">
          {guides.map((guide) => (
            <GuideListCard key={guide.slug} guide={guide} />
          ))}
        </div>
        <GuidesHubPicker />
        <GuidesHubEditorial />
      </GuidePageLayout>
    </>
  );
}
