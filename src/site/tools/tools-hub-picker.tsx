import Link from "next/link";
import { TOOL_PICKER } from "./tools-hub-data";

/** Parcours utilisateur : trouver le bon outil */
export function ToolsHubPicker() {
  return (
    <section
      id="quel-outil"
      className="tools-hub-picker-section tools-hub-section--tinted"
      aria-labelledby="tools-hub-picker-title"
    >
      <h2 id="tools-hub-picker-title">Quel outil correspond à votre besoin ?</h2>
      <p className="tools-hub-picker-section__intro">
        Identifiez votre situation en un coup d&apos;œil, puis accédez directement au calculateur
        ou au guide adapté.
      </p>

      <div className="tools-hub-picker">
        {TOOL_PICKER.map((item) => (
          <article key={item.href} className="tools-hub-picker__card">
            <span className="tools-hub-picker__icon" aria-hidden="true">
              {item.icon}
            </span>
            <p className="tools-hub-picker__question">{item.question}</p>
            <p className="tools-hub-picker__cta">
              <Link href={item.href} className="tools-hub-cta">
                {"isGuide" in item && item.isGuide
                  ? `→ Consultez notre ${item.linkLabel}`
                  : `→ ${item.linkLabel}`}
              </Link>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
