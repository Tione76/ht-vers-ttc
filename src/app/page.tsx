import { config, seoConfig, Calculator } from "@/site";
import { CalculatorPageLayout } from "@/framework/layouts/CalculatorPageLayout";
import { JsonLd } from "@/framework/JsonLd";
import { buildPageMetadata } from "@/framework/seo/metadata";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildOrganizationSchema,
  buildWebApplicationSchema,
} from "@/framework/seo/json-ld";

export const metadata = buildPageMetadata(config, seoConfig, {
  title: seoConfig.home.title,
  description: seoConfig.home.description,
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebApplicationSchema(config, seoConfig.home.title, seoConfig.home.description),
          buildOrganizationSchema(config),
          buildBreadcrumbSchema(config, [{ name: "Accueil", path: "/" }]),
          buildFaqSchema(config.faq),
        ]}
      />
      <CalculatorPageLayout Calculator={Calculator} />
    </>
  );
}
