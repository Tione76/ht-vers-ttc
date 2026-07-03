import { config, seoConfig } from "@/site";
import { ContentPageLayout } from "@/framework/layouts/ContentPageLayout";
import { LegalContent } from "@/framework/LegalContent";
import { JsonLd } from "@/framework/JsonLd";
import { buildPageMetadata } from "@/framework/seo/metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/framework/seo/json-ld";

const page = seoConfig.legal.privacy;

export const metadata = buildPageMetadata(config, seoConfig, {
  title: page.title,
  description: page.description,
  path: "/politique-de-confidentialite",
});

export default function PrivacyPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema(config, page.title, page.description, "/politique-de-confidentialite"),
          buildBreadcrumbSchema(config, [
            { name: "Accueil", path: "/" },
            { name: page.title, path: "/politique-de-confidentialite" },
          ]),
        ]}
      />
      <ContentPageLayout meta="Informations légales" title={page.title}>
        <LegalContent {...config.legal.privacy} />
      </ContentPageLayout>
    </>
  );
}
