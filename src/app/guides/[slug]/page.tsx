import { notFound } from "next/navigation";
import { config, seoConfig } from "@/site";
import {
  buildGuideTocH2,
  computeReadingTime,
  getGuideBySlug,
  getPublishedGuideSlugs,
  GUIDE_MODEL_SLUG,
  GuideArticle,
  GuideAuthorMeta,
  GuidePageLayout,
  GuidePageSidebar,
} from "@/site/guides";
import { PageBreadcrumb } from "@/framework/design/components/PageBreadcrumb";
import { JsonLd } from "@/framework/JsonLd";
import { buildPageMetadata } from "@/framework/seo/metadata";
import { buildGuidePageGraph } from "@/framework/seo/page-schemas";
import { coverToOgInput, coverToSchemaImage, resolveGuideCover } from "@/site/guides/covers";
import { getGuideSeoMetadata } from "@/site/guides/guide-seo-metadata";
import { getDefaultGuideAuthor } from "@/site/seo/entities";

interface Props {
  params: Promise<{ slug: string }>;
}

const IS_DEV = process.env.NODE_ENV === "development";

export function generateStaticParams() {
  const slugs = getPublishedGuideSlugs();
  if (IS_DEV) {
    return [...slugs, GUIDE_MODEL_SLUG].map((slug) => ({ slug }));
  }
  return slugs.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) return {};

  const cover = guide.isTemplate ? undefined : resolveGuideCover(guide);
  const seoMeta = getGuideSeoMetadata(slug);

  return buildPageMetadata(config, seoConfig, {
    title: guide.isTemplate ? "Modèle officiel de guide" : (seoMeta?.title ?? guide.title),
    description: seoMeta?.description ?? guide.description,
    path: `/guides/${slug}`,
    ogImage: cover ? coverToOgInput(cover) : undefined,
    ...(guide.isTemplate && { robots: { index: false, follow: false } }),
  });
}

export default async function GuidePage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);
  if (!guide) notFound();

  if (guide.isTemplate && !IS_DEV) {
    notFound();
  }

  const path = `/guides/${slug}`;
  const readingTime = computeReadingTime(guide);
  const toc = buildGuideTocH2(guide);
  const cover = guide.isTemplate ? undefined : resolveGuideCover(guide);
  const author = getDefaultGuideAuthor();
  const seoMeta = getGuideSeoMetadata(slug);

  const breadcrumbItems = guide.isTemplate
    ? [
        { label: "Accueil", href: "/" },
        { label: "Modèle de guide" },
      ]
    : [
        { label: "Accueil", href: "/" },
        { label: "Guides TVA", href: seoConfig.guidesHub.path },
        { label: guide.title },
      ];

  const schemaBreadcrumbs = guide.isTemplate
    ? [
        { name: "Accueil", path: "/" },
        { name: "Modèle de guide", path },
      ]
    : [
        { name: "Accueil", path: "/" },
        { name: "Guides TVA", path: seoConfig.guidesHub.path },
        { name: guide.title, path },
      ];

  return (
    <>
      <JsonLd
        data={
          guide.isTemplate
            ? []
            : buildGuidePageGraph(config, {
                title: seoMeta?.title ?? guide.title,
                description: seoMeta?.description ?? guide.description,
                path,
                image: cover ? coverToSchemaImage(cover) : undefined,
                breadcrumbs: schemaBreadcrumbs,
                guide,
                author,
                cover,
              })
        }
      />
      <GuidePageLayout
        title={guide.isTemplate ? "Modèle officiel de guide" : guide.title}
        subtitle={guide.subtitle}
        sidebar={guide.isTemplate ? undefined : <GuidePageSidebar slug={slug} />}
      >
        <PageBreadcrumb items={breadcrumbItems} />
        {guide.isTemplate ? (
          <p className="guide-meta">
            <em>Modèle éditorial (non indexé)</em>
          </p>
        ) : (
          <GuideAuthorMeta updatedAt={guide.updatedAt} readingTime={readingTime} />
        )}
        {guide.isTemplate && (
          <aside className="prose-callout">
            <strong>Modèle éditorial</strong>
            <p>
              Cette page présente la structure officielle que chaque guide devra respecter.
              Les textes entre crochets sont des placeholders à remplacer par le contenu
              définitif. Elle n&apos;est accessible qu&apos;en environnement de développement
              et n&apos;est pas indexée par les moteurs de recherche.
            </p>
          </aside>
        )}
        <GuideArticle
          cover={cover}
          introduction={guide.introduction}
          quickSummary={guide.quickSummary}
          toc={toc}
          sections={guide.sections}
          faq={guide.faq}
          faqTitle={guide.faqTitle}
          conclusion={guide.conclusion}
          isTemplate={guide.isTemplate}
        />
      </GuidePageLayout>
    </>
  );
}
