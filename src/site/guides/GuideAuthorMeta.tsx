import Link from "next/link";
import { formatDate } from "@/framework/utils";
import { getDefaultGuideAuthor } from "@/site/seo/entities";

interface GuideAuthorMetaProps {
  updatedAt: string;
  readingTime: number;
}

/** Métadonnées éditoriales sous le fil d'Ariane : auteur cliquable + date + lecture */
export function GuideAuthorMeta({ updatedAt, readingTime }: GuideAuthorMetaProps) {
  const author = getDefaultGuideAuthor();

  return (
    <p className="guide-meta">
      <em>
        Par{" "}
        <Link href={author.path} className="guide-meta__author">
          {author.givenName}
        </Link>
        {" • "}
        Mis à jour le {formatDate(updatedAt)} · {readingTime} min de lecture
      </em>
    </p>
  );
}
