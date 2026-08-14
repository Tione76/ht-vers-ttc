import Link from "next/link";
import { config } from "@/site";
import { PageBreadcrumb } from "@/framework/design/components/PageBreadcrumb";
import { JsonLd } from "@/framework/JsonLd";
import {
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildWebPageSchema,
  buildSiteGraph,
} from "@/framework/seo/json-ld";
import { createSchemaContext } from "@/framework/seo/schema-context";
import { getDefaultGuideAuthor, getPersonRecord } from "@/site/seo/entities";
import { GuidePageLayout, GuideHeroImage, SiteSidebar } from "@/site/guides";
import { coverToSchemaImage, TTC_TO_HT_SERIES_COVER } from "@/site/guides/covers";
import { formatDate } from "@/framework/utils";
import "@/site/ht-to-ttc/ht-to-ttc-page.css";
import { HtToTtcFaq } from "@/site/ht-to-ttc/HtToTtcFaq";
import type { HtToTtcFaqItem } from "@/site/ht-to-ttc/ht-to-ttc-content";
import { HtToTtcFormulaBlock } from "@/site/ht-to-ttc/HtToTtcFormulaBlock";
import { renderHtToTtcRichText } from "@/site/ht-to-ttc/HtToTtcRichText";
import { MiniTtcToHtCalculator } from "@/site/ttc-to-ht/MiniTtcToHtCalculator";
import { NearbyTtcToHtAmounts } from "@/site/ttc-to-ht/NearbyTtcToHtAmounts";
import { TtcToHtConversionTable } from "@/site/ttc-to-ht/TtcToHtConversionTable";
import { TtcToHtPrimaryAnswer } from "@/site/ttc-to-ht/TtcToHtPrimaryAnswer";
import { TtcToHtSecondaryRates } from "@/site/ttc-to-ht/TtcToHtSecondaryRates";
import { buildTtcToHtPageContent, faqItemsToSchema } from "@/site/ttc-to-ht/ttc-to-ht-content";
import {
  getTtcToHtPublishRecord,
  isTtcToHtHubPublished,
} from "@/site/ttc-to-ht/ttc-to-ht-publish";
import { TTC_TO_HT_HUB_PATH, TTC_TO_HT_HUB_TITLE } from "@/site/ttc-to-ht/ttc-to-ht-amounts";

/** Date éditoriale du template (fiches draft, sans fausse datePublished publique). */
const TTC_TO_HT_TEMPLATE_UPDATED_AT = "2026-08-11";

export function TtcToHtAmountPage({ amountTtc }: { amountTtc: number }) {
  const content = buildTtcToHtPageContent(amountTtc);
  const publishRecord = getTtcToHtPublishRecord(amountTtc);
  const updatedAt =
    publishRecord?.dateModified ?? publishRecord?.datePublished ?? TTC_TO_HT_TEMPLATE_UPDATED_AT;

  const author = getDefaultGuideAuthor();
  const ctx = createSchemaContext(config);
  const hubPublished = isTtcToHtHubPublished();
  const seriesImage = coverToSchemaImage(TTC_TO_HT_SERIES_COVER);

  const breadcrumbHtmlItems = hubPublished
    ? [
        { label: "Accueil", href: "/" },
        { label: TTC_TO_HT_HUB_TITLE, href: TTC_TO_HT_HUB_PATH },
        { label: content.breadcrumbLabel },
      ]
    : [
        { label: "Accueil", href: "/" },
        { label: content.breadcrumbLabel },
      ];

  const breadcrumbSchemaItems = hubPublished
    ? [
        { name: "Accueil", path: "/" },
        { name: TTC_TO_HT_HUB_TITLE, path: TTC_TO_HT_HUB_PATH },
        { name: content.breadcrumbLabel, path: content.path },
      ]
    : [
        { name: "Accueil", path: "/" },
        { name: content.breadcrumbLabel, path: content.path },
      ];

  const faqSchemaItems = faqItemsToSchema(content.faqItems);
  const faqSchema = buildFaqPageSchema(
    ctx,
    content.title,
    content.metaDescription,
    content.path,
    faqSchemaItems,
  );

  const personId = `${ctx.siteUrl}${author.path}#person`;
  const faqSchemaId = (faqSchema as { "@id": string })["@id"];
  const webPage = {
    ...buildWebPageSchema(
      ctx,
      content.title,
      content.metaDescription,
      content.path,
      seriesImage,
    ),
    author: { "@id": personId },
    mainEntity: { "@id": faqSchemaId },
    ...(publishRecord
      ? {
          datePublished: publishRecord.datePublished,
          dateModified: publishRecord.dateModified ?? publishRecord.datePublished,
        }
      : {}),
  };

  const graph = [
    ...buildSiteGraph(ctx),
    getPersonRecord(config, author),
    webPage,
    faqSchema,
    buildBreadcrumbSchema(ctx, content.path, breadcrumbSchemaItems),
  ];

  return (
    <>
      <JsonLd data={graph} />
      <GuidePageLayout
        title={content.h1}
        subtitle={content.heroSubtitle}
        prose={false}
        bodyClassName="ht-to-ttc-body"
        sidebar={<SiteSidebar pageType="faq" currentPath={content.path} />}
      >
        <div className="ht-to-ttc-page">
          <PageBreadcrumb items={breadcrumbHtmlItems} />
          <p className="guide-meta">
            <em>
              Par{" "}
              <Link href={author.path} className="guide-meta__author">
                {author.givenName}
              </Link>
              {" · "}
              Mis à jour le {formatDate(updatedAt)}
            </em>
          </p>

          <TtcToHtPrimaryAnswer primary={content.primary} seoAnswer={content.seoAnswer} />

          <TtcToHtSecondaryRates secondary={content.secondary} />

          <MiniTtcToHtCalculator
            initialAmountTtc={content.amountTtc}
            mainCalculatorPath={content.links.mainCalculator.path}
          />

          <GuideHeroImage cover={TTC_TO_HT_SERIES_COVER} />

          <section className="ht-section" aria-labelledby="ttc-to-ht-h2-20">
            <h2 id="ttc-to-ht-h2-20">{content.primarySection.h2}</h2>
            {content.primarySection.paragraphs.map((paragraph, idx) => (
              <p key={idx}>{renderHtToTtcRichText(paragraph)}</p>
            ))}
            <HtToTtcFormulaBlock
              lines={[content.primarySection.formulaHt, content.primarySection.formulaVat]}
            />
            <p className="ht-section__note">
              {renderHtToTtcRichText(content.primarySection.afterNote)}
            </p>
          </section>

          <section className="ht-section" aria-labelledby="ttc-to-ht-table-title">
            <h2 id="ttc-to-ht-table-title">{content.tableSection.h2}</h2>
            <TtcToHtConversionTable amountTtc={content.amountTtc} />
          </section>

          <section className="ht-section ht-which-rate" aria-labelledby="ttc-which-rate-title">
            <h2 id="ttc-which-rate-title">{content.whichRateSection.h2}</h2>
            <p>{renderHtToTtcRichText(content.whichRateSection.body)}</p>
            <p>
              <Link href={content.whichRateSection.guideHref} className="ht-which-rate__link">
                {content.whichRateSection.guideLabel}
              </Link>
            </p>
            <p>{renderHtToTtcRichText(content.whichRateSection.deductibleNote)}</p>
          </section>

          <NearbyTtcToHtAmounts amountTtc={content.amountTtc} />

          <HtToTtcFaq items={content.faqItems as HtToTtcFaqItem[]} />

          <p className="ht-note">
            Les résultats sont calculés automatiquement à partir du montant TTC et du taux
            sélectionné.
          </p>
        </div>
      </GuidePageLayout>
    </>
  );
}
