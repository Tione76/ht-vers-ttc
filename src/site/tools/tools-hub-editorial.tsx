import Link from "next/link";
import { ToolsHubFaq } from "./tools-hub-faq";
import {
  HT_TTC_PATH,
  TOOL_HUB_BENEFITS,
  TOOL_HUB_CALCULATIONS,
  TOOL_HUB_ERRORS,
  TOOL_HUB_GUIDE_LINKS,
  TOOL_MATCH_ROWS,
} from "./tools-hub-data";

/** Contenu éditorial hub /nos-outils */
export function ToolsHubEditorial() {
  return (
    <section id="tools-hub-editorial" className="tools-hub-editorial prose">
      <div className="tools-hub-section tools-hub-section--tinted">
        <h2>Pourquoi utiliser un calculateur ?</h2>
        <p>
          Un devis à chiffrer, une facture à contrôler, un tarif à fixer : les calculateurs
          appliquent les bonnes formules tout de suite, sans tableur.
        </p>

        <aside className="guide-checklist tools-hub-benefits">
          <p className="guide-checklist__title">Ce que vous gagnez concrètement</p>
          <ul>
            {TOOL_HUB_BENEFITS.map((benefit) => (
              <li key={benefit}>
                <span className="guide-checklist__mark" aria-hidden="true">
                  ✓
                </span>
                {benefit}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="tools-hub-section">
        <h2>Que peut-on calculer ?</h2>
        <p>
          Nos outils en ligne couvrent les opérations du quotidien. Chaque résultat se met à jour
          dès que vous modifiez une valeur.
        </p>

        <aside className="guide-checklist tools-hub-checklist">
          <p className="guide-checklist__title">Calculs disponibles</p>
          <ul>
            {TOOL_HUB_CALCULATIONS.map((item) => (
              <li key={item}>
                <span className="guide-checklist__mark" aria-hidden="true">
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <div className="tools-hub-section tools-hub-section--tinted">
        <h2>Quel outil utiliser ?</h2>
        <p>
          Ce tableau vous oriente vers le calculateur adapté à votre besoin.
        </p>

        <div className="tools-hub-table-wrap">
          <table className="tools-hub-table">
            <thead>
              <tr>
                <th scope="col">Votre besoin</th>
                <th scope="col">Outil recommandé</th>
              </tr>
            </thead>
            <tbody>
              {TOOL_MATCH_ROWS.map((row) => (
                <tr key={row.need}>
                  <td>{row.need}</td>
                  <td>
                    <Link href={row.href}>{row.tool}</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="tools-hub-section">
        <h2>Les erreurs fréquentes à éviter</h2>
        <p>
          Ces confusions reviennent souvent. Les repérer vous évite des régularisations ou des
          écarts de prix difficiles à corriger.
        </p>

        <aside className="guide-checklist tools-hub-errors">
          <p className="guide-checklist__title">Points de vigilance</p>
          <ul>
            {TOOL_HUB_ERRORS.map((error) => (
              <li key={error}>
                <span className="guide-checklist__mark" aria-hidden="true">
                  ✓
                </span>
                {error}
              </li>
            ))}
          </ul>
        </aside>

        <aside className="prose-callout prose-callout--hint">
          <strong>À retenir</strong>
          <p>
            Retirer 20 % d&apos;un montant TTC pour obtenir le HT est une erreur classique. La
            formule correcte est HT = TTC ÷ 1,20. Le{" "}
            <Link href={HT_TTC_PATH}>calculateur HT → TTC</Link> applique cette règle
            automatiquement.
          </p>
        </aside>
      </div>

      <div className="tools-hub-section">
        <h2>Nos guides pour aller plus loin</h2>
        <p>
          Retrouvez nos ressources les plus consultées sur la TVA, la facturation et les régimes
          applicables.
        </p>

        <ul className="tools-hub-guides">
          {TOOL_HUB_GUIDE_LINKS.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="tools-hub-guides__link">
                → Guide {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="tools-hub-section tools-hub-section--tinted tools-hub-section--faq">
        <p className="tools-hub-faq-transition">
          Pour un calcul ponctuel (TVA, HT, TTC, marge commerciale), les outils ci-dessus
          suffisent : le résultat s&apos;affiche en direct. Lorsque le sujet devient plus
          technique (taux applicables, franchise en base, mentions obligatoires sur facture), les
          guides reprennent chaque règle avec des exemples concrets. La FAQ ci-dessous répond aux
          questions les plus courantes avant d&apos;ouvrir un calculateur.
        </p>

        <h2>Questions fréquentes sur nos calculateurs</h2>
        <ToolsHubFaq />
      </div>
    </section>
  );
}
