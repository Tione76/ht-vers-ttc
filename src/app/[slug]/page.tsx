import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { config, seoConfig } from "@/site";
import { ContentPageLayout } from "@/framework/layouts/ContentPageLayout";
import { LegalContent } from "@/framework/LegalContent";
import { JsonLd } from "@/framework/JsonLd";
import { buildPageMetadata } from "@/framework/seo/metadata";
import { buildStandardPageGraph } from "@/framework/seo/page-schemas";
import { getExtraPage, getExtraPageSlugs } from "@/framework/seo/pages";
import { HtToTtcAmountPage } from "@/site/ht-to-ttc/HtToTtcAmountPage";
import { parseHtToTtcSlug, htToTtcSlugFromAmount } from "@/site/ht-to-ttc/ht-to-ttc-amounts";
import { buildHtToTtcPageContent } from "@/site/ht-to-ttc/ht-to-ttc-content";
import { htToTtcOgImageInput } from "@/site/ht-to-ttc/ht-to-ttc-og";
import {
  getHtToTtcRobots,
  getPublishedHtToTtcAmounts,
} from "@/site/ht-to-ttc/ht-to-ttc-publish";

interface Props {
  params: Promise<{ slug: string }>;
}

/**
 * Stratégie Next.js pour ~1000 montants :
 * - generateStaticParams pré-génère uniquement les pages extra + fiches published (0 aujourd'hui)
 * - dynamicParams=true : les drafts sont générés à la demande puis mis en cache (SSG on-demand)
 * - évite de pré-rendre 1000 HTML à chaque build tant qu'ils sont draft
 */
export function generateStaticParams() {
  const extra = getExtraPageSlugs(seoConfig).map((slug) => ({ slug }));
  const amounts = getPublishedHtToTtcAmounts().map((amount) => ({
    slug: htToTtcSlugFromAmount(amount),
  }));
  return [...extra, ...amounts];
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const amount = parseHtToTtcSlug(slug);
  if (amount !== null) {
    const content = buildHtToTtcPageContent(amount);
    return buildPageMetadata(config, seoConfig, {
      title: content.title,
      description: content.metaDescription,
      path: content.path,
      robots: getHtToTtcRobots(amount),
      ogImage: htToTtcOgImageInput(amount),
    });
  }

  const page = getExtraPage(seoConfig, slug);
  if (!page) return {};
  return buildPageMetadata(config, seoConfig, {
    title: page.title,
    description: page.description,
    path: `/${slug}`,
  });
}

export default async function DynamicRootSlugPage({ params }: Props) {
  const { slug } = await params;

  const amount = parseHtToTtcSlug(slug);
  if (amount !== null) {
    return <HtToTtcAmountPage amountHt={amount} />;
  }

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
