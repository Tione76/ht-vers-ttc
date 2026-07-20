import { config, seoConfig, Calculator } from "@/site";
import { coverToOgInput, coverToSchemaImage, HOME_COVER } from "@/site/guides/covers";
import { CalculatorPageLayout } from "@/framework/layouts/CalculatorPageLayout";
import { JsonLd } from "@/framework/JsonLd";
import { buildPageMetadata } from "@/framework/seo/metadata";
import { buildCalculatorPageGraph } from "@/framework/seo/page-schemas";

export const metadata = buildPageMetadata(config, seoConfig, {
  title: seoConfig.home.title,
  description: seoConfig.home.description,
  path: "/",
  ogImage: coverToOgInput(HOME_COVER),
});

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={buildCalculatorPageGraph(config, {
          title: seoConfig.home.title,
          description: seoConfig.home.description,
          path: "/",
          image: coverToSchemaImage(HOME_COVER),
          dateModified: config.legal.privacy.lastUpdated,
          breadcrumbs: [{ name: "Accueil", path: "/" }],
        })}
      />
      <CalculatorPageLayout Calculator={Calculator} />
    </>
  );
}
