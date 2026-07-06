import Link from "next/link";
import { config, seoConfig } from "@/site";
import { getPlanDuSiteSections } from "@/site/public-pages";
import { PageBreadcrumb } from "@/framework/design/components/PageBreadcrumb";
import { ContentPageLayout } from "@/framework/layouts/ContentPageLayout";
import { JsonLd } from "@/framework/JsonLd";
import { buildPageMetadata } from "@/framework/seo/metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/framework/seo/json-ld";

const page = seoConfig.legal.sitemap;

export const metadata = buildPageMetadata(config, seoConfig, {
  title: page.title,
  description: page.description,
  path: "/plan-du-site",
});

export default function SitemapPage() {
  const sections = getPlanDuSiteSections();

  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema(config, page.title, page.description, "/plan-du-site"),
          buildBreadcrumbSchema(config, [
            { name: "Accueil", path: "/" },
            { name: page.title, path: "/plan-du-site" },
          ]),
        ]}
      />
      <ContentPageLayout meta="Navigation" title={page.title}>
        <PageBreadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: page.title },
          ]}
        />
        {sections.map((section) => (
          <section key={section.title} className="sitemap-section">
            <h2>{section.title}</h2>
            <ul>
              {section.pages.map((entry) => (
                <li key={entry.path}>
                  <Link href={entry.path}>{entry.title}</Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </ContentPageLayout>
    </>
  );
}
