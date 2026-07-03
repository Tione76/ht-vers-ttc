import Link from "next/link";
import { seoConfig } from "@/site";
import { ContentPageLayout } from "@/framework/layouts/ContentPageLayout";

export default function NotFound() {
  return (
    <ContentPageLayout
      meta="Erreur"
      title={seoConfig.legal.notFound.title}
      subtitle={seoConfig.legal.notFound.description}
    >
      <p>
        <Link href="/" className="ds-btn ds-btn--primary">
          Retour à l&apos;accueil
        </Link>
      </p>
      <p>
        Consultez le <Link href="/plan-du-site">plan du site</Link> pour trouver la page
        recherchée.
      </p>
    </ContentPageLayout>
  );
}
