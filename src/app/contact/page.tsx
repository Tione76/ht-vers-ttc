import { config, seoConfig } from "@/site";
import { ContactPageLayout } from "@/framework/layouts/ContactPageLayout";
import { ContactForm } from "@/framework/ContactForm";
import { JsonLd } from "@/framework/JsonLd";
import { buildPageMetadata } from "@/framework/seo/metadata";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/framework/seo/json-ld";

const page = seoConfig.legal.contact;

export const metadata = buildPageMetadata(config, seoConfig, {
  title: page.title,
  description: page.description,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema(config, page.title, page.description, "/contact"),
          buildBreadcrumbSchema(config, [
            { name: "Accueil", path: "/" },
            { name: page.title, path: "/contact" },
          ]),
        ]}
      />
      <ContactPageLayout title={page.title} subtitle={config.contact.intro}>
        <ContactForm
          email={config.contact.email}
          subjects={config.contact.subjects}
          trustNote={config.contact.trustNote}
        />
      </ContactPageLayout>
    </>
  );
}
