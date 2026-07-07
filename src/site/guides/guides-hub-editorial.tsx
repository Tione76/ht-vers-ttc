import type { ReactNode } from "react";
import Link from "next/link";
import { seoConfig } from "../seo.config";
import { VatCalculationIllustration } from "./illustrations/VatCalculationIllustration";
import {
  COMMON_ERRORS,
  ERROR_GUIDE_LINKS,
  GUIDE_PATHS,
  START_PATH,
  TRUST_POINTS,
} from "./guides-hub-data";

const MARGIN_CALC = seoConfig.calculators.marginHtTtc.path;

function HubIllustration({
  children,
  caption,
}: {
  children: ReactNode;
  caption?: string;
}) {
  return (
    <figure className="guides-hub-illus">
      {children}
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

/** Contenu éditorial hub /guides : aéré, orienté clics vers les guides */
export function GuidesHubEditorial() {
  return (
    <section id="guides-hub-editorial" className="guides-hub-editorial prose">
      <div className="guides-hub-section">
        <h2>Les principaux sujets à connaître sur la TVA en France</h2>
        <p>
          Trois notions reviennent dans presque toutes les situations professionnelles.
          Chaque sujet est détaillé dans un guide dédié.
        </p>

        <div className="guides-hub-key-grid">
          <article className="guides-hub-key-card">
            <h3>Calcul TVA : HT et TTC</h3>
            <p>
              Le <strong>prix HT</strong> est hors taxes ; le <strong>TTC</strong> inclut la
              taxe. Formule : TTC = HT × (1 + taux).
            </p>
            <Link href={GUIDE_PATHS.taux} className="guides-hub-key-card__link">
              → Guide des taux de TVA
            </Link>
          </article>
          <article className="guides-hub-key-card">
            <h3>Taux de TVA et facturation</h3>
            <p>
              Quatre <strong>taux de TVA</strong> coexistent en France. Chaque ligne de{" "}
              <strong>facture</strong> doit ventiler HT, TVA et TTC.
            </p>
            <Link href={GUIDE_PATHS.facture} className="guides-hub-key-card__link">
              → Guide facture conforme
            </Link>
          </article>
          <article className="guides-hub-key-card">
            <h3>Franchise, collectée et déductible</h3>
            <p>
              La <strong>franchise en base</strong> dispense de facturer la TVA sous certains
              seuils. Une fois assujetti, vous gérez collectée et déductible.
            </p>
            <Link href={GUIDE_PATHS.franchise} className="guides-hub-key-card__link">
              → Guide franchise en base
            </Link>
          </article>
        </div>

        <HubIllustration caption="Exemple de calcul HT → TVA → TTC à 20 %">
          <VatCalculationIllustration />
        </HubIllustration>

        <aside className="prose-callout prose-callout--hint">
          <strong>À retenir</strong>
          <p>
            Retirer 20 % d&apos;un montant TTC pour obtenir le HT est une erreur fréquente, la
            TVA se calcule toujours sur le hors taxes.
          </p>
        </aside>
      </div>

      <div className="guides-hub-section">
        <h2>Les erreurs les plus fréquentes concernant la TVA</h2>
        <p>
          Ces confusions reviennent souvent. Les reconnaître vous évite des régularisations
          coûteuses.
        </p>

        <aside className="guide-checklist guides-hub-errors">
          <p className="guide-checklist__title">Erreurs à éviter</p>
          <ul>
            {COMMON_ERRORS.map((error) => (
              <li key={error}>
                <span className="guide-checklist__mark" aria-hidden="true">
                  ✓
                </span>
                {error}
              </li>
            ))}
          </ul>
        </aside>

        <p className="guides-hub-errors__transition">
          Chaque erreur est expliquée en détail dans le guide correspondant :{" "}
          {ERROR_GUIDE_LINKS.map((link, index) => (
            <span key={link.href}>
              {index > 0 && (index === ERROR_GUIDE_LINKS.length - 1 ? " et " : ", ")}
              <Link href={link.href} className="guides-hub-inline-link">
                {link.label}
              </Link>
            </span>
          ))}
          .
        </p>
      </div>

      <div className="guides-hub-section">
        <h2>Calculateurs gratuits en complément des guides</h2>
        <p>
          Les guides expliquent les règles ; les outils appliquent les formules en temps réel.
        </p>

        <div className="guides-hub-tools">
          <article className="guides-hub-tools__card">
            <h3>Calculateur HT → TTC</h3>
            <p>
              Convertissez un <strong>prix HT</strong> en <strong>TTC</strong> (et l&apos;inverse)
              selon le taux choisi.
            </p>
            <Link href="/" className="guides-hub-cta guides-hub-cta--button">
              Ouvrir le calculateur HT → TTC
            </Link>
          </article>
          <article className="guides-hub-tools__card">
            <h3>Calculateur de marge HT / TTC</h3>
            <p>
              Fixez votre prix de vente à partir d&apos;un coût d&apos;achat, avec marge et TVA
              intégrés.
            </p>
            <Link href={MARGIN_CALC} className="guides-hub-cta guides-hub-cta--button">
              Ouvrir le calculateur de marge
            </Link>
          </article>
        </div>
      </div>

      <div className="guides-hub-section guides-hub-section--path">
        <h2>Par où commencer ?</h2>
        <p>Un parcours progressif si vous souhaitez tout parcourir dans l&apos;ordre.</p>

        <ol className="guides-hub-path">
          {START_PATH.map((step) => (
            <li key={step.href} className="guides-hub-path__step">
              <p className="guides-hub-path__profile">{step.profile}</p>
              <p className="guides-hub-path__action">
                {step.action}{" "}
                <Link href={step.href} className="guides-hub-inline-link">
                  {step.linkLabel}
                </Link>
                .
              </p>
            </li>
          ))}
        </ol>
      </div>

      <aside className="guides-hub-trust">
        <h2>Pourquoi consulter nos guides TVA ?</h2>
        <ul className="guides-hub-trust__list">
          {TRUST_POINTS.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </aside>
    </section>
  );
}
