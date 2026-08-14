import type { getTtcToHtRateConversion } from "./ttc-to-ht-content";

type RateConversion = ReturnType<typeof getTtcToHtRateConversion>;

export function TtcToHtSecondaryRates({ secondary }: { secondary: RateConversion[] }) {
  return (
    <section className="ht-secondary" aria-labelledby="ht-secondary-title">
      <h2 id="ht-secondary-title" className="ht-secondary__title">
        Et avec les autres taux de TVA ?
      </h2>

      <div className="ht-secondary__grid">
        {secondary.map((item) => (
          <article key={item.rate} className="ht-secondary__card">
            <div className="ht-secondary__badge">TVA {item.rateLabel}</div>
            <div className="ht-secondary__ttc">{item.htFormatted}</div>
            <div className="ht-secondary__ttc-label">HT</div>
            <div className="ht-secondary__vat">TVA : {item.vatFormatted}</div>
          </article>
        ))}
      </div>
    </section>
  );
}
