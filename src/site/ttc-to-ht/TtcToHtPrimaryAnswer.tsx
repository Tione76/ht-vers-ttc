import type { getTtcToHtRateConversion } from "./ttc-to-ht-content";

type RateConversion = ReturnType<typeof getTtcToHtRateConversion>;

export function TtcToHtPrimaryAnswer({
  primary,
  seoAnswer,
}: {
  primary: RateConversion;
  seoAnswer: string;
}) {
  return (
    <section className="ht-answer" aria-labelledby="ht-answer-title">
      <p id="ht-answer-title" className="ht-answer__eyebrow">
        Résultat avec une TVA à 20 %
      </p>

      <div className="ht-answer__flow">
        <div className="ht-answer__ht">
          <span className="ht-answer__ht-value">{primary.ttcShort}</span>
          <span className="ht-answer__ht-label">TTC</span>
        </div>

        <div className="ht-answer__arrow" aria-hidden="true">
          <span className="ht-answer__badge">TVA {primary.rateLabel}</span>
          <span className="ht-answer__arrow-icon">↓</span>
        </div>

        <div className="ht-answer__ttc">
          <span className="ht-answer__ttc-value">{primary.htFormatted}</span>
          <span className="ht-answer__ttc-label">HT</span>
        </div>
      </div>

      <p className="ht-answer__vat">
        TVA : <strong>{primary.vatFormatted}</strong>
      </p>

      <p className="ht-answer__seo">{seoAnswer}</p>

      <p className="ht-answer__cta-wrap">
        <a href="#calculateur-ttc-ht" className="ht-answer__cta">
          Calculer un autre montant ↓
        </a>
      </p>
    </section>
  );
}
