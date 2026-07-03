import { config, seoConfig } from "@/site";
import { ContentPageLayout } from "@/framework/layouts/ContentPageLayout";
import { LegalContent } from "@/framework/LegalContent";
import { JsonLd } from "@/framework/JsonLd";
import { buildPageMetadata } from "@/framework/seo/metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/framework/seo/json-ld";

const page = seoConfig.legal.mentions;

export const metadata = buildPageMetadata(config, seoConfig, {
  title: page.title,
  description: page.description,
  path: "/mentions-legales",
});

export default function LegalPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema(config, page.title, page.description, "/mentions-legales"),
          buildBreadcrumbSchema(config, [
            { name: "Accueil", path: "/" },
            { name: page.title, path: "/mentions-legales" },
          ]),
        ]}
      />
      <ContentPageLayout meta="Informations légales" title={page.title}>
        <LegalContent {...config.legal.mentions} />
      </ContentPageLayout>
    </>
  );
}
