import Link from "next/link";
import { config, seoConfig } from "@/site";
import { getAllCalculators } from "@/site/navigation/calculators-registry";
import { PageBreadcrumb } from "@/framework/design/components/PageBreadcrumb";
import { ContentPageLayout } from "@/framework/layouts/ContentPageLayout";
import { JsonLd } from "@/framework/JsonLd";
import { buildPageMetadata } from "@/framework/seo/metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/framework/seo/json-ld";

const hub = seoConfig.toolsHub;

export const metadata = buildPageMetadata(config, seoConfig, {
  title: hub.title,
  description: hub.description,
  path: hub.path,
});

export default function ToolsHubPage() {
  const calculators = getAllCalculators();

  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema(config, hub.title, hub.description, hub.path),
          buildBreadcrumbSchema(config, [
            { name: "Accueil", path: "/" },
            { name: hub.title, path: hub.path },
          ]),
        ]}
      />
      <ContentPageLayout
        meta="Nos outils"
        title={hub.title}
        subtitle={hub.description}
        prose={false}
      >
        <PageBreadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: hub.title },
          ]}
        />
        <div className="tools-grid">
          {calculators.map((tool) => (
            <Link key={tool.id} href={tool.path} className="tool-card tool-card--content">
              <span className="tool-card__icon" aria-hidden="true">
                {tool.icon}
              </span>
              <span className="tool-card__title">{tool.shortTitle}</span>
              <span className="tool-card__desc">{tool.description}</span>
            </Link>
          ))}
        </div>
      </ContentPageLayout>
    </>
  );
}
