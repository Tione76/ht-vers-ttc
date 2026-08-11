import Link from "next/link";
import { GuidePageLayout, SiteSidebar } from "@/site/guides";
import { PageBreadcrumb } from "@/framework/design/components/PageBreadcrumb";
import { formatHtEditorial } from "@/site/ht-to-ttc/ht-to-ttc-calc";
import { htToTtcPath } from "@/site/ht-to-ttc/ht-to-ttc-paths";
import {
  getPublishedHtToTtcAmounts,
  isHtToTtcHubPublished,
} from "@/site/ht-to-ttc/ht-to-ttc-publish";
import { HT_TO_TTC_HUB_TITLE } from "@/site/ht-to-ttc/ht-to-ttc-amounts";
import "@/site/ht-to-ttc/ht-to-ttc-hub.css";

type AmountRange = {
  id: string;
  label: string;
  min: number;
  max: number;
};

const HUB_RANGES: AmountRange[] = [
  { id: "10-300", label: "10 € à 300 €", min: 10, max: 300 },
  { id: "310-600", label: "310 € à 600 €", min: 310, max: 600 },
  { id: "610-900", label: "610 € à 900 €", min: 610, max: 900 },
  { id: "910-1500", label: "910 € à 1 500 €", min: 910, max: 1500 },
  { id: "1510-3000", label: "1 510 € à 3 000 €", min: 1510, max: 3000 },
  { id: "3010-5000", label: "3 010 € à 5 000 €", min: 3010, max: 5000 },
  { id: "5010-7500", label: "5 010 € à 7 500 €", min: 5010, max: 7500 },
  { id: "7510-10000", label: "7 510 € à 10 000 €", min: 7510, max: 10000 },
];

export function HtToTtcHubPage() {
  const published = getPublishedHtToTtcAmounts();
  const hubLive = isHtToTtcHubPublished();

  const ranges = HUB_RANGES.map((range) => ({
    ...range,
    amounts: published.filter((amount) => amount >= range.min && amount <= range.max),
  })).filter((range) => range.amounts.length > 0);

  return (
    <GuidePageLayout
      title={HT_TO_TTC_HUB_TITLE}
      subtitle="Convertissez un montant hors taxes en TTC selon les principaux taux de TVA."
      prose={false}
      bodyClassName="ht-to-ttc-hub-body"
      sidebar={<SiteSidebar pageType="faq" currentPath="/montants-ht-en-ttc" />}
    >
      <div className="ht-hub">
        <PageBreadcrumb
          items={[{ label: "Accueil", href: "/" }, { label: HT_TO_TTC_HUB_TITLE }]}
        />

        <p className="ht-hub__intro">
          Chaque fiche indique le montant TTC pour 20 %, 10 %, 5,5 % et 2,1 %, avec un
          mini-calculateur et un tableau de conversion.
        </p>

        {!hubLive || published.length === 0 ? (
          <p className="ht-hub__empty">
            Les montants HT en TTC seront publiés progressivement. En attendant, utilisez le{" "}
            <Link href="/">calculateur HT → TTC</Link>.
          </p>
        ) : (
          <>
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
                <h2>{range.label}</h2>
                <ul className="ht-hub__list">
                  {range.amounts.map((amount) => (
                    <li key={amount}>
                      <Link href={htToTtcPath(amount)}>
                        {formatHtEditorial(amount)} HT en TTC
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </>
        )}
      </div>
    </GuidePageLayout>
  );
}
