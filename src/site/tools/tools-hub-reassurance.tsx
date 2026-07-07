import { TOOL_HUB_REASSURANCE } from "./tools-hub-data";

/** Badges de réassurance sous les cartes calculateurs */
export function ToolsHubReassurance() {
  return (
    <ul className="tools-hub-reassurance" aria-label="Avantages de nos calculateurs">
      {TOOL_HUB_REASSURANCE.map((item) => (
        <li key={item} className="tools-hub-reassurance__item">
          <span className="tools-hub-reassurance__mark" aria-hidden="true">
            ✓
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
