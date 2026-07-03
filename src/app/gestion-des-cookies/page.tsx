import { config, seoConfig } from "@/site";
import { ContentPageLayout } from "@/framework/layouts/ContentPageLayout";
import { CookiePreferencesPanel } from "@/framework/CookiePreferencesPanel";
import { LegalContent } from "@/framework/LegalContent";
import { JsonLd } from "@/framework/JsonLd";
import { buildPageMetadata } from "@/framework/seo/metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/framework/seo/json-ld";

const page = seoConfig.legal.cookiePrefs;

export const metadata = buildPageMetadata(config, seoConfig, {
  title: page.title,
  description: page.description,
  path: "/gestion-des-cookies",
});

export default function CookiePreferencesPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema(config, page.title, page.description, "/gestion-des-cookies"),
          buildBreadcrumbSchema(config, [
            { name: "Accueil", path: "/" },
            { name: page.title, path: "/gestion-des-cookies" },
          ]),
        ]}
      />
      <ContentPageLayout meta="Informations légales" title={page.title}>
        <CookiePreferencesPanel />
        <LegalContent sections={config.legal.cookies.sections} />
      </ContentPageLayout>
    </>
  );
}
