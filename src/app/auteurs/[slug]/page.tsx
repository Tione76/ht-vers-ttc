import { notFound } from "next/navigation";
import { config, seoConfig } from "@/site";
import { AuthorPageContent } from "@/site/authors/AuthorPageContent";
import { getGuidesByAuthor } from "@/site/authors/guides-by-author";
import { GuidePageLayout } from "@/site/guides/GuidePageLayout";
import { PageBreadcrumb } from "@/framework/design/components/PageBreadcrumb";
import { JsonLd } from "@/framework/JsonLd";
import { buildPageMetadata } from "@/framework/seo/metadata";
import { buildAuthorPageGraph } from "@/framework/seo/json-ld";
import { createSchemaContext } from "@/framework/seo/schema-context";
import { getAuthor, getAuthorSlugs } from "@/site/seo/entities";
import "@/site/guides/guide-page.css";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAuthorSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) return {};

  return buildPageMetadata(config, seoConfig, {
    title: author.seoTitle,
    description: author.seoDescription,
    path: author.path,
  });
}

export default async function AuthorPage({ params }: Props) {
  const { slug } = await params;
  const author = getAuthor(slug);
  if (!author) notFound();

  const ctx = createSchemaContext(config);
  const guides = getGuidesByAuthor(slug);

  return (
    <>
      <JsonLd data={buildAuthorPageGraph(ctx, config, author)} />
      <GuidePageLayout
        title={author.name}
        subtitle={author.description}
        sidebar={undefined}
        prose={false}
        bodyClassName="article-body--author"
      >
        <PageBreadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: author.name },
          ]}
        />
        <AuthorPageContent author={author} guides={guides} />
      </GuidePageLayout>
    </>
  );
}
