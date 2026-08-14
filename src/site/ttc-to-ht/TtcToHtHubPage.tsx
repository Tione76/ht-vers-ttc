import Link from "next/link";
import { GuidePageLayout, SiteSidebar } from "@/site/guides";
import { PageBreadcrumb } from "@/framework/design/components/PageBreadcrumb";
import { formatHtEditorial } from "@/site/ht-to-ttc/ht-to-ttc-calc";
import { HtToTtcFaq } from "@/site/ht-to-ttc/HtToTtcFaq";
import { ttcToHtPath } from "@/site/ttc-to-ht/ttc-to-ht-paths";
import {
  getPublishedTtcToHtAmounts,
  getTtcToHtHubMeta,
  isTtcToHtHubPublished,
} from "@/site/ttc-to-ht/ttc-to-ht-publish";
import { getTtcToHtSiteLinks } from "@/site/ttc-to-ht/ttc-to-ht-site-links";
import {
  buildTtcToHtHubFaqItems,
  buildTtcToHtHubRanges,
  getTtcToHtCommonPublishedAmounts,
  getTtcToHtHubDiffParagraph,
  getTtcToHtHubFeatureItems,
  getTtcToHtHubGuideHighlights,
  getTtcToHtHubIntroParagraphs,
} from "@/site/ttc-to-ht/ttc-to-ht-hub-content";
import "@/site/ht-to-ttc/ht-to-ttc-hub.css";

function AmountChip({ amount, emphasized = false }: { amount: number; emphasized?: boolean }) {
  const label = formatHtEditorial(amount);
  return (
    <Link
      href={ttcToHtPath(amount)}
      className={emphasized ? "ht-hub__chip ht-hub__chip--emphasis" : "ht-hub__chip"}
      aria-label={`Conversion de ${label} TTC en HT`}
    >
      <span className="ht-hub__chip-amount">{label}</span>
    </Link>
  );
}

export function TtcToHtHubPage() {
  const hub = getTtcToHtHubMeta();
  const published = getPublishedTtcToHtAmounts();
  const hubLive = isTtcToHtHubPublished();
  const ranges = buildTtcToHtHubRanges(published);
  const common = getTtcToHtCommonPublishedAmounts(10);
  const links = getTtcToHtSiteLinks();
  const intro = getTtcToHtHubIntroParagraphs();
  const features = getTtcToHtHubFeatureItems();
  const guideHighlights = getTtcToHtHubGuideHighlights();
  const faqItems = buildTtcToHtHubFaqItems();
  const diffParagraph = getTtcToHtHubDiffParagraph();

  return (
    <GuidePageLayout
      title={hub.h1}
      subtitle="Retrouvez rapidement la conversion d'un montant toutes taxes comprises en hors taxes selon les principaux taux de TVA."
      prose={false}
      bodyClassName="ht-to-ttc-hub-body"
      sidebar={<SiteSidebar pageType="faq" currentPath={hub.path} />}
    >
      <div className="ht-hub">
        <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: hub.h1 }]} />

        <div className="ht-hub__intro">
          {intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {!hubLive || published.length === 0 ? (
          <p className="ht-hub__empty">
            Les montants TTC en HT seront publiés progressivement. En attendant, utilisez le{" "}
            <Link href={links.mainCalculator.path}>{links.mainCalculator.title}</Link> et
            sélectionnez « TTC vers HT ».
          </p>
        ) : (
          <>
            {common.length > 0 ? (
              <section className="ht-hub__common" aria-labelledby="ht-hub-common-title">
                <h2 id="ht-hub-common-title">Conversions courantes</h2>
                <p className="ht-hub__lead">Accédez directement à une sélection de montants courants.</p>
                <ul className="ht-hub__chips ht-hub__chips--common">
                  {common.map((amount) => (
                    <li key={amount}>
                      <AmountChip amount={amount} emphasized />
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="ht-hub__find" aria-labelledby="ht-hub-find-title">
              <h2 id="ht-hub-find-title">Trouver un montant TTC</h2>
              <p className="ht-hub__lead">
                Sélectionnez une plage, puis ouvrez la fiche du montant recherché.
              </p>
              <nav className="ht-hub__toc" aria-label="Plages de montants">
                <ul>
                  {ranges.map((range) => (
                    <li key={range.id}>
                      <a href={`#${range.id}`}>{range.label}</a>
                      <span className="ht-hub__toc-count">({range.amounts.length})</span>
                    </li>
                  ))}
                </ul>
              </nav>

              {ranges.map((range) => (
                <section key={range.id} id={range.id} className="ht-hub__range">
                  <h3 className="ht-hub__range-title">{range.label}</h3>
                  <ul className="ht-hub__chips">
                    {range.amounts.map((amount) => (
                      <li key={amount}>
                        <AmountChip amount={amount} />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </section>

            <section className="ht-hub__cta" aria-labelledby="ht-hub-cta-title">
              <h2 id="ht-hub-cta-title">Votre montant n&apos;est pas dans la liste ?</h2>
              <p>
                Entrez directement votre montant TTC et choisissez le taux de TVA dans notre
                calculateur.
              </p>
              <Link href={links.mainCalculator.path} className="ht-hub__cta-button">
                Calculer un montant TTC → HT
              </Link>
            </section>

            <section className="ht-hub__features" aria-labelledby="ht-hub-features-title">
              <h2 id="ht-hub-features-title">Que contient chaque fiche de conversion ?</h2>
              <ul className="ht-hub__feature-grid">
                {features.map((feature) => (
                  <li key={feature.title} className="ht-hub__feature">
                    <h3 className="ht-hub__feature-title">{feature.title}</h3>
                    <p>{feature.text}</p>
                  </li>
                ))}
              </ul>
            </section>

            <section className="ht-hub__diff" aria-labelledby="ht-hub-diff-title">
              <h2 id="ht-hub-diff-title">HT et TTC : quelle différence ?</h2>
              <p>{diffParagraph}</p>
            </section>

            {guideHighlights.length > 0 ? (
              <section className="ht-hub__guides" aria-labelledby="ht-hub-guides-title">
                <h2 id="ht-hub-guides-title">Comprendre la TVA</h2>
                <p className="ht-hub__lead">
                  Quelques guides pour choisir le bon taux et comprendre la TVA sur une facture. La
                  sidebar liste aussi d&apos;autres ressources.
                </p>
                <ul className="ht-hub__guide-list">
                  {guideHighlights.map((guide) => (
                    <li key={guide.slug}>
                      <Link href={guide.path} className="ht-hub__guide-link">
                        <span className="ht-hub__guide-title">{guide.title}</span>
                        <span className="ht-hub__guide-desc">{guide.description}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <HtToTtcFaq items={faqItems} />
          </>
        )}
      </div>
    </GuidePageLayout>
  );
}
