import Link from "next/link";
import { config, seoConfig } from "@/site";
import { ContentPageLayout } from "@/framework/layouts/ContentPageLayout";
import { JsonLd } from "@/framework/JsonLd";
import { buildPageMetadata } from "@/framework/seo/metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/framework/seo/json-ld";
import { getAllPages } from "@/framework/seo/pages";

const page = seoConfig.legal.sitemap;

const pageLabels: Record<string, string> = {
  "/": "Accueil",
  "/contact": "Contact",
  "/faq": "Questions fréquentes",
  "/simulateurs": "Tous les simulateurs",
  "/plan-du-site": "Plan du site",
  "/gestion-des-cookies": "Gestion des cookies",
  "/politique-de-confidentialite": "Politique de confidentialité",
  "/politique-de-cookies": "Politique de cookies",
  "/mentions-legales": "Mentions légales",
};

export const metadata = buildPageMetadata(config, seoConfig, {
  title: page.title,
  description: page.description,
  path: "/plan-du-site",
});

export default function SitemapPage() {
  const pages = getAllPages(seoConfig);

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
        <ul>
          {pages.map((entry) => (
            <li key={entry.path}>
              <Link href={entry.path}>
                {pageLabels[entry.path] ??
                  seoConfig.extraPages.find((p) => `/${p.slug}` === entry.path)?.title ??
                  entry.path}
              </Link>
            </li>
          ))}
        </ul>
      </ContentPageLayout>
    </>
  );
}
