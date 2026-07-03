import { formatDate } from "@/framework/utils";

export function LegalContent({
  lastUpdated,
  sections,
}: {
  lastUpdated?: string;
  sections: { title: string; content: string }[];
}) {
  return (
    <>
      {lastUpdated && (
        <p>
          <em>Dernière mise à jour : {formatDate(lastUpdated)}</em>
        </p>
      )}
      {sections.map((section) => (
        <section key={section.title}>
          <h2>{section.title}</h2>
          <p>{section.content}</p>
        </section>
      ))}
    </>
  );
}
