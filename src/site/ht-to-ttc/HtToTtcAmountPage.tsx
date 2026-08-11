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
import { coverToSchemaImage, HT_TO_TTC_SERIES_COVER } from "@/site/guides/covers";
import { formatDate } from "@/framework/utils";
import "@/site/ht-to-ttc/ht-to-ttc-page.css";
import { HtToTtcFaq } from "@/site/ht-to-ttc/HtToTtcFaq";
import { HtToTtcConversionTable } from "@/site/ht-to-ttc/HtToTtcConversionTable";
import { HtToTtcPrimaryAnswer } from "@/site/ht-to-ttc/HtToTtcPrimaryAnswer";
import { HtToTtcSecondaryRates } from "@/site/ht-to-ttc/HtToTtcSecondaryRates";
import { HtToTtcFormulaBlock } from "@/site/ht-to-ttc/HtToTtcFormulaBlock";
import { renderHtToTtcRichText } from "@/site/ht-to-ttc/HtToTtcRichText";
import { MiniHtToTtcCalculator } from "@/site/ht-to-ttc/MiniHtToTtcCalculator";
import { NearbyAmounts } from "@/site/ht-to-ttc/NearbyAmounts";
import { buildHtToTtcPageContent, faqItemsToSchema } from "@/site/ht-to-ttc/ht-to-ttc-content";
import {
  getHtToTtcPublishRecord,
  isHtToTtcHubPublished,
} from "@/site/ht-to-ttc/ht-to-ttc-publish";
import { HT_TO_TTC_HUB_PATH, HT_TO_TTC_HUB_TITLE } from "@/site/ht-to-ttc/ht-to-ttc-amounts";

/** Date éditoriale du template (fiches draft, sans fausse datePublished publique). */
const HT_TO_TTC_TEMPLATE_UPDATED_AT = "2026-08-11";

export function HtToTtcAmountPage({ amountHt }: { amountHt: number }) {
  const content = buildHtToTtcPageContent(amountHt);
  const publishRecord = getHtToTtcPublishRecord(amountHt);
  const updatedAt =
    publishRecord?.dateModified ?? publishRecord?.datePublished ?? HT_TO_TTC_TEMPLATE_UPDATED_AT;

  const author = getDefaultGuideAuthor();
  const ctx = createSchemaContext(config);
  const hubPublished = isHtToTtcHubPublished();
  const seriesImage = coverToSchemaImage(HT_TO_TTC_SERIES_COVER);

  const breadcrumbHtmlItems = hubPublished
    ? [
        { label: "Accueil", href: "/" },
        { label: HT_TO_TTC_HUB_TITLE, href: HT_TO_TTC_HUB_PATH },
        { label: content.breadcrumbLabel },
      ]
    : [
        { label: "Accueil", href: "/" },
        { label: content.breadcrumbLabel },
      ];

  const breadcrumbSchemaItems = hubPublished
    ? [
        { name: "Accueil", path: "/" },
        { name: HT_TO_TTC_HUB_TITLE, path: HT_TO_TTC_HUB_PATH },
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
    faqSchemaItems
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

          <HtToTtcPrimaryAnswer primary={content.primary} seoAnswer={content.seoAnswer} />

          <HtToTtcSecondaryRates secondary={content.secondary} />

          <MiniHtToTtcCalculator
            initialAmountHt={content.amountHt}
            mainCalculatorPath={content.links.mainCalculator.path}
          />

          <GuideHeroImage cover={HT_TO_TTC_SERIES_COVER} />

          <section className="ht-section" aria-labelledby="ht-to-ttc-h2-20">
            <h2 id="ht-to-ttc-h2-20">{content.primarySection.h2}</h2>
            {content.primarySection.paragraphs.map((paragraph, idx) => (
              <p key={idx}>{renderHtToTtcRichText(paragraph)}</p>
            ))}
            <HtToTtcFormulaBlock
              lines={[content.primarySection.formulaTtc, content.primarySection.formulaVat]}
            />
            <p className="ht-section__note">
              {renderHtToTtcRichText(content.primarySection.afterNote)}
            </p>
          </section>

          <section className="ht-section" aria-labelledby="ht-to-ttc-table-title">
            <h2 id="ht-to-ttc-table-title">{content.tableSection.h2}</h2>
            <HtToTtcConversionTable amountHt={content.amountHt} />
          </section>

          <section className="ht-section ht-which-rate" aria-labelledby="ht-which-rate-title">
            <h2 id="ht-which-rate-title">{content.whichRateSection.h2}</h2>
            <p>{renderHtToTtcRichText(content.whichRateSection.body)}</p>
            <p>
              <Link href={content.whichRateSection.guideHref} className="ht-which-rate__link">
                {content.whichRateSection.guideLabel}
              </Link>
            </p>
            <p>{renderHtToTtcRichText(content.whichRateSection.deductibleNote)}</p>
          </section>

          <NearbyAmounts amountHt={content.amountHt} />

          <HtToTtcFaq items={content.faqItems} />

          <p className="ht-note">
            Les résultats sont calculés automatiquement à partir du montant HT et du taux sélectionné.
          </p>
        </div>
      </GuidePageLayout>
    </>
  );
}
