import { config, seoConfig } from "@/site";
import { FaqPageSidebar, GuidePageLayout } from "@/site/guides";
import { ContactPageContent } from "@/site/contact/ContactPageContent";
import { PageBreadcrumb } from "@/framework/design/components/PageBreadcrumb";
import { JsonLd } from "@/framework/JsonLd";
import { buildPageMetadata } from "@/framework/seo/metadata";
import { buildStandardPageGraph } from "@/framework/seo/page-schemas";
import "@/site/guides/guide-page.css";

const page = seoConfig.legal.contact;
const path = "/contact";

export const metadata = buildPageMetadata(config, seoConfig, {
  title: page.title,
  description: page.description,
  path,
});

export default function ContactPage() {
  const { contact } = config;

  return (
    <>
      <JsonLd
        data={buildStandardPageGraph(config, {
          title: page.title,
          description: page.description,
          path,
          breadcrumbs: [
            { name: "Accueil", path: "/" },
            { name: page.title, path },
          ],
        })}
      />
      <GuidePageLayout
        title={page.title}
        subtitle={contact.intro}
        sidebar={<FaqPageSidebar />}
        prose={false}
      >
        <PageBreadcrumb
          items={[
            { label: "Accueil", href: "/" },
            { label: page.title },
          ]}
        />
        <ContactPageContent
          email={contact.email}
          subjects={contact.subjects}
          trustNote={contact.trustNote}
        />
      </GuidePageLayout>
    </>
  );
}
