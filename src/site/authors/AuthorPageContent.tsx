import Image from "next/image";
import Link from "next/link";
import { GuideListCard } from "@/site/guides/GuideListCard";
import type { Guide } from "@/site/guides/types";
import type { AuthorRecord } from "@/site/seo/entities";
import { getAuthorPageResources } from "./author-resources";

interface AuthorPageContentProps {
  author: AuthorRecord;
  guides: Guide[];
}

function AuthorAvatar({ author }: { author: AuthorRecord }) {
  if (author.image) {
    return (
      <Image
        src={author.image}
        alt=""
        width={author.imageWidth ?? 160}
        height={author.imageHeight ?? 160}
        className="author-profile__photo"
      />
    );
  }

  return (
    <span className="author-profile__avatar" aria-hidden="true">
      {author.givenName.charAt(0)}
    </span>
  );
}

export function AuthorPageContent({ author, guides }: AuthorPageContentProps) {
  const resources = getAuthorPageResources();

  return (
    <div className="author-page">
      <section className="author-profile" aria-labelledby="author-profile-name">
        <div className="author-profile__media">
          <AuthorAvatar author={author} />
        </div>
        <div className="author-profile__body">
          <h2 id="author-profile-name" className="author-profile__name">
            {author.name}
          </h2>
          <p className="author-profile__role">{author.jobTitle}</p>
          <p className="author-profile__bio">{author.profileBio}</p>
          <ul className="author-profile__topics" aria-label="Domaines traités">
            {author.expertise.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="author-block author-block--presentation" aria-label="Présentation">
        <p className="author-block__text">{author.presentation}</p>
      </section>

      <section className="author-block" aria-labelledby="author-guides">
        <h2 id="author-guides" className="author-block__title">
          Guides rédigés
        </h2>
        {guides.length > 0 ? (
          <div className="author-page__guides-grid">
            {guides.map((guide) => (
              <GuideListCard key={guide.slug} guide={guide} showUpdatedAt />
            ))}
          </div>
        ) : (
          <p className="author-block__empty">Aucun guide publié pour le moment.</p>
        )}
      </section>

      <section className="author-block" aria-labelledby="author-methodology">
        <h2 id="author-methodology" className="author-block__title">
          Méthode éditoriale
        </h2>
        <div className="author-method-grid">
          {author.methodology.map((step, index) => (
            <article key={step.title} className="author-method-card">
              <span className="author-method-card__index" aria-hidden="true">
                {index + 1}
              </span>
              <h3 className="author-method-card__title">{step.title}</h3>
              <p className="author-method-card__desc">{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="author-block" aria-labelledby="author-resources">
        <h2 id="author-resources" className="author-block__title">
          Ressources utiles
        </h2>
        <div className="author-resources-grid">
          {resources.map((resource) => (
            <Link key={resource.href} href={resource.href} className="author-resource-card">
              <span className="author-resource-card__icon" aria-hidden="true">
                {resource.icon}
              </span>
              <span className="author-resource-card__body">
                <span className="author-resource-card__title">{resource.title}</span>
                <span className="author-resource-card__desc">{resource.description}</span>
                <span className="author-resource-card__cta">{resource.cta}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
