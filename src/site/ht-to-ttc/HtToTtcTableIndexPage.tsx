import Link from "next/link";
import { GuidePageLayout } from "@/site/guides";
import { PageBreadcrumb } from "@/framework/design/components/PageBreadcrumb";
import { HtToTtcFaq } from "@/site/ht-to-ttc/HtToTtcFaq";
import {
  buildHtToTtcTableIndexFaqItems,
  getHtToTtcTableIndexIntro,
  getHtToTtcTableIndexLinks,
  getHtToTtcTableIndexMeta,
  getHtToTtcTableIndexView,
  htToTtcTableRangePath,
} from "@/site/ht-to-ttc/ht-to-ttc-table-index";
import "@/site/ht-to-ttc/ht-to-ttc-table-index.css";

/**
 * Page Index / tableau : largeur prioritaire (pas de sidebar latérale)
 * pour conserver 5 colonnes lisibles sur desktop.
 */
export function HtToTtcTableIndexPage() {
  const meta = getHtToTtcTableIndexMeta();
  const view = getHtToTtcTableIndexView();
  const intro = getHtToTtcTableIndexIntro();
  const links = getHtToTtcTableIndexLinks();
  const faqItems = buildHtToTtcTableIndexFaqItems();

  return (
    <GuidePageLayout
      title={meta.h1}
      subtitle="Consultez rapidement le montant TTC correspondant à un prix HT selon les principaux taux de TVA en France."
      prose={false}
      bodyClassName="ht-to-ttc-table-index-body"
    >
      <div className="ht-table-index">
        <PageBreadcrumb items={[{ label: "Accueil", href: "/" }, { label: meta.h1 }]} />

        <div className="ht-table-index__intro">
          {intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        {view.rows.length === 0 ? (
          <p className="ht-table-index__empty">
            Aucun montant publié pour le moment. Utilisez le{" "}
            <Link href={links.calculator.path}>{links.calculator.title}</Link>.
          </p>
        ) : (
          <>
            <section className="ht-table-index__nav" aria-labelledby="ht-table-index-nav-title">
              <h2 id="ht-table-index-nav-title">Choisir une plage</h2>
              <nav className="ht-table-index__toc" aria-label="Plages du tableau">
                <ul>
                  {view.displayedRanges.map((range) => (
                    <li key={range.id}>
                      <a href={`#${range.id}`}>{range.label}</a>
                      <span className="ht-table-index__toc-count">({range.amounts.length})</span>
                    </li>
                  ))}
                  {/* Sous-routes futures : htToTtcTableRangePath(min, max). Pas de lien 404. */}
                  {view.deferredRanges.map((range) => (
                    <li key={range.id}>
                      <span className="ht-table-index__toc-deferred" title={htToTtcTableRangePath(range.min, range.max)}>
                        {range.label}
                      </span>
                      <span className="ht-table-index__toc-count">({range.amounts.length})</span>
                    </li>
                  ))}
                </ul>
              </nav>
              {view.truncated ? (
                <p className="ht-table-index__truncation">
                  Cette page affiche les premières plages pour rester rapide. D&apos;autres plages
                  pourront être ouvertes séparément lorsque le catalogue s&apos;étendra.
                </p>
              ) : null}
            </section>

            {view.displayedRanges.map((range) => {
              const rangeRows = view.rows.filter(
                (row) => row.amountHt >= range.min && row.amountHt <= range.max,
              );
              return (
                <section key={range.id} id={range.id} className="ht-table-index__range" aria-labelledby={`${range.id}-title`}>
                  <h3 id={`${range.id}-title`} className="ht-table-index__range-title">
                    {range.label}
                  </h3>
                  <div className="ht-table-index__scroll-hint" aria-hidden="true">
                    Faites défiler horizontalement pour voir tous les taux
                  </div>
                  <div className="ht-table-index__scroll">
                    <table className="ht-table-index__table">
                      <caption className="sr-only">
                        Conversion de {range.label} HT en TTC selon les taux de TVA
                      </caption>
                      <thead>
                        <tr>
                          <th scope="col">Montant HT</th>
                          <th scope="col" className="ht-table-index__col-primary">
                            TTC à 20 %
                          </th>
                          <th scope="col">TTC à 10 %</th>
                          <th scope="col">TTC à 5,5 %</th>
                          <th scope="col">TTC à 2,1 %</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rangeRows.map((row) => (
                          <tr key={row.amountHt}>
                            <th scope="row">
                              {row.isPublished ? (
                                <Link href={row.path} className="ht-table-index__amount-link">
                                  {row.amountLabel}
                                </Link>
                              ) : (
                                <span>{row.amountLabel}</span>
                              )}
                            </th>
                            <td className="ht-table-index__col-primary">{row.ttc20}</td>
                            <td>{row.ttc10}</td>
                            <td>{row.ttc55}</td>
                            <td>{row.ttc21}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              );
            })}

            <section className="ht-table-index__cta" aria-labelledby="ht-table-index-cta-title">
              <h2 id="ht-table-index-cta-title">Vous ne trouvez pas votre montant ?</h2>
              <p>
                Utilisez le calculateur HT → TTC pour convertir n&apos;importe quel montant et
                choisir votre taux de TVA.
              </p>
              <Link href={links.calculator.path} className="ht-table-index__cta-button">
                Calculer un montant HT → TTC
              </Link>
            </section>
          </>
        )}

        <section className="ht-table-index__howto" aria-labelledby="ht-table-index-howto-title">
          <h2 id="ht-table-index-howto-title">Comment lire le tableau de conversion HT/TTC ?</h2>
          <p>
            Choisissez le montant HT, repérez le taux de TVA applicable, puis lisez le TTC dans la
            colonne correspondante. Exemple : 100 € HT avec 20 % de TVA = 120 € TTC.
          </p>
        </section>

        <section className="ht-table-index__formula" aria-labelledby="ht-table-index-formula-title">
          <h2 id="ht-table-index-formula-title">Comment passer du HT au TTC ?</h2>
          <p>
            Formule : TTC = HT × (1 + taux de TVA). Coefficients : 20 % → × 1,20 ; 10 % → × 1,10 ;
            5,5 % → × 1,055 ; 2,1 % → × 1,021.
          </p>
        </section>

        <section className="ht-table-index__rate" aria-labelledby="ht-table-index-rate-title">
          <h2 id="ht-table-index-rate-title">Quel taux de TVA utiliser ?</h2>
          <p>
            Le taux applicable dépend du bien ou du service concerné.{" "}
            <Link href={links.guideTaux.path}>Quels sont les taux de TVA en France ?</Link>.
          </p>
        </section>

        <p className="ht-table-index__hub-link">
          <Link href={links.hub.path}>{links.hub.label}</Link>
        </p>

        <HtToTtcFaq items={faqItems} />
      </div>
    </GuidePageLayout>
  );
}
