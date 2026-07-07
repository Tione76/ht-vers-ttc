import Link from "next/link";
import type { PlanDuSiteSection } from "@/site/public-pages";

export function SitemapPageContent({ sections }: { sections: PlanDuSiteSection[] }) {
  return (
    <>
      {sections.map((section) => (
        <section key={section.title} className="guide-section">
          <h2>{section.title}</h2>
          <ul>
            {section.pages.map((entry) => (
              <li key={entry.path}>
                <Link href={entry.path}>{entry.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
