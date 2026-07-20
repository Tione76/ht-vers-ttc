import { notFound } from "next/navigation";
import { config, seoConfig } from "@/site";
import { ContentPageLayout } from "@/framework/layouts/ContentPageLayout";
import { LegalContent } from "@/framework/LegalContent";
import { JsonLd } from "@/framework/JsonLd";
import { buildPageMetadata } from "@/framework/seo/metadata";
import { buildStandardPageGraph } from "@/framework/seo/page-schemas";
import { getExtraPage, getExtraPageSlugs } from "@/framework/seo/pages";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getExtraPageSlugs(seoConfig).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const page = getExtraPage(seoConfig, slug);
  if (!page) return {};
  return buildPageMetadata(config, seoConfig, {
    title: page.title,
    description: page.description,
    path: `/${slug}`,
  });
}

export default async function ExtraPage({ params }: Props) {
  const { slug } = await params;
  const page = getExtraPage(seoConfig, slug);
  if (!page) notFound();

  return (
    <>
      <JsonLd
        data={buildStandardPageGraph(config, {
          title: page.title,
          description: page.description,
          path: `/${slug}`,
          breadcrumbs: [
            { name: "Accueil", path: "/" },
            { name: page.title, path: `/${slug}` },
          ],
        })}
      />
      <ContentPageLayout meta="Guide" title={page.title}>
        <LegalContent sections={page.sections} />
      </ContentPageLayout>
    </>
  );
}
