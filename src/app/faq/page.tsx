import Link from "next/link";
import { config, seoConfig } from "@/site";
import { ContentPageLayout } from "@/framework/layouts/ContentPageLayout";
import { JsonLd } from "@/framework/JsonLd";
import { buildPageMetadata } from "@/framework/seo/metadata";
import { buildBreadcrumbSchema, buildFaqSchema, buildWebPageSchema } from "@/framework/seo/json-ld";

const page = seoConfig.legal.faq;

export const metadata = buildPageMetadata(config, seoConfig, {
  title: page.title,
  description: page.description,
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema(config, page.title, page.description, "/faq"),
          buildBreadcrumbSchema(config, [
            { name: "Accueil", path: "/" },
            { name: page.title, path: "/faq" },
          ]),
          buildFaqSchema(config.faq),
        ]}
      />
      <ContentPageLayout meta="Aide" title={page.title} subtitle="Réponses aux questions les plus fréquentes." prose={false}>
        <div className="faq-list faq-list--flush">
          {config.faq.map((item) => (
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
        <p style={{ marginTop: "24px" }}>
          Vous ne trouvez pas votre réponse ?{" "}
          <Link href="/contact">Contactez-nous</Link>.
        </p>
      </ContentPageLayout>
    </>
  );
}
