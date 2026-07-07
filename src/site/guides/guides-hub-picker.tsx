import Link from "next/link";
import { GUIDE_PICKER } from "./guides-hub-data";

/** Bloc d'aide au choix du guide : placé juste après la grille de cartes */
export function GuidesHubPicker() {
  return (
    <section id="quel-guide" className="guides-hub-picker-section" aria-labelledby="guides-hub-picker-title">
      <h2 id="guides-hub-picker-title">Quel guide est fait pour vous ?</h2>
      <p className="guides-hub-picker-section__intro">
        Identifiez votre situation en un coup d&apos;œil, puis accédez directement au guide adapté.
      </p>

      <div className="guides-hub-picker">
        {GUIDE_PICKER.map((item) => (
          <article key={item.href} className="guides-hub-picker__card">
            <span className="guides-hub-picker__icon" aria-hidden="true">
              {item.icon}
            </span>
            <p className="guides-hub-picker__question">{item.question}</p>
            <p className="guides-hub-picker__cta">
              <Link href={item.href} className="guides-hub-cta">
                → Consultez notre {item.linkLabel}
              </Link>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
