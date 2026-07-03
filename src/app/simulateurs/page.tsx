import Link from "next/link";
import { config, seoConfig } from "@/site";
import { ContentPageLayout } from "@/framework/layouts/ContentPageLayout";
import { JsonLd } from "@/framework/JsonLd";
import { buildPageMetadata } from "@/framework/seo/metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/framework/seo/json-ld";

const page = seoConfig.legal.simulators;

export const metadata = buildPageMetadata(config, seoConfig, {
  title: page.title,
  description: page.description,
  path: "/simulateurs",
});

export default function SimulatorsPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema(config, page.title, page.description, "/simulateurs"),
          buildBreadcrumbSchema(config, [
            { name: "Accueil", path: "/" },
            { name: page.title, path: "/simulateurs" },
          ]),
        ]}
      />
      <ContentPageLayout
        meta="Nos outils"
        title={page.title}
        subtitle={config.recommendedSites.description}
        prose={false}
      >
        <div className="tools-grid">
          {config.tools.map((tool) => (
            <Link key={tool.title} href={tool.href} className="tool-card tool-card--content">
              <span className="tool-card__icon" aria-hidden="true">
                {tool.icon}
              </span>
              <span className="tool-card__title">{tool.title}</span>
              <span className="tool-card__desc">{tool.description}</span>
            </Link>
          ))}
        </div>
      </ContentPageLayout>
    </>
  );
}
