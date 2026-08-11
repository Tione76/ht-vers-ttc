export function HtToTtcFormulaBlock({
  title = "Calcul",
  lines,
}: {
  title?: string;
  lines: string[];
}) {
  return (
    <aside className="ht-formula" aria-label={title}>
      <div className="ht-formula__label">{title}</div>
      {lines.map((line) => (
        <div key={line} className="ht-formula__line">
          {line}
        </div>
      ))}
    </aside>
  );
}
