/** Flux TVA collectée / déductible : schéma pédagogique vertical */
export function VatFlowDiagramIllustration() {
  return (
    <div
      className="vat-balance-flow"
      role="img"
      aria-label="Schéma du flux de TVA : collectée sur les ventes, déductible sur les achats, TVA nette reversée à l'État"
    >
      <div className="vat-balance-flow__flow">
        <article className="vat-balance-flow__block vat-balance-flow__block--sales">
          <p className="vat-balance-flow__tag">VENTES</p>
          <h4 className="vat-balance-flow__title">TVA collectée</h4>
          <p className="vat-balance-flow__desc">Facturée au client</p>
        </article>

        <div className="vat-balance-flow__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>

        <div className="vat-balance-flow__split">
          <article className="vat-balance-flow__block vat-balance-flow__block--company">
            <p className="vat-balance-flow__tag">ENTREPRISE</p>
            <h4 className="vat-balance-flow__title">Calcul du solde</h4>
            <p className="vat-balance-flow__desc">Additionne la TVA collectée et impute la TVA déductible</p>
          </article>

          <div className="vat-balance-flow__h-connector" aria-hidden="true">
            <span className="vat-balance-flow__h-line" />
            <span className="vat-balance-flow__h-arrows">↔</span>
            <span className="vat-balance-flow__h-line" />
          </div>

          <article className="vat-balance-flow__block vat-balance-flow__block--purchases">
            <p className="vat-balance-flow__tag">ACHATS</p>
            <h4 className="vat-balance-flow__title">TVA déductible</h4>
            <p className="vat-balance-flow__desc">Payée sur les achats professionnels</p>
          </article>
        </div>

        <div className="vat-balance-flow__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>

        <article className="vat-balance-flow__block vat-balance-flow__block--net">
          <p className="vat-balance-flow__tag">SOLDE</p>
          <h4 className="vat-balance-flow__title">TVA nette à reverser</h4>
          <p className="vat-balance-flow__desc">
            <strong>TVA collectée − TVA déductible</strong>
          </p>
        </article>

        <div className="vat-balance-flow__arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <polyline points="19 12 12 19 5 12" />
          </svg>
        </div>

        <article className="vat-balance-flow__block vat-balance-flow__block--state">
          <p className="vat-balance-flow__tag">ÉTAT</p>
          <h4 className="vat-balance-flow__title">Paiement ou crédit de TVA</h4>
          <p className="vat-balance-flow__desc">
            Reversement à l&apos;administration, ou crédit si la TVA déductible est supérieure
          </p>
        </article>
      </div>
    </div>
  );
}
