import { TOOL_HUB_FAQ } from "./tools-hub-data";

/** FAQ SEO du hub /nos-outils */
export function ToolsHubFaq() {
  return (
    <div className="tools-hub-faq faq-list">
      {TOOL_HUB_FAQ.map((item) => (
        <details key={item.question} className="faq-item">
          <summary className="faq-item__summary">
            <span>{item.question}</span>
            <span className="faq-chevron" aria-hidden="true">
              ▾
            </span>
          </summary>
          <div className="faq-item__body">
            <p>{item.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
