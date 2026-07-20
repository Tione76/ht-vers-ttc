import Link from "next/link";
import { formatDate } from "@/framework/utils";
import type { Guide } from "./types";
import { GuideCoverImage } from "./GuideCoverImage";
import { getGuideHubTeaser } from "./guides-hub-data";

interface GuideListCardProps {
  guide: Guide;
  /** Affiche la date de mise à jour sous la description (page auteur, etc.) */
  showUpdatedAt?: boolean;
}

/** Carte guide : hub /guides et future page liste */
export function GuideListCard({ guide, showUpdatedAt = false }: GuideListCardProps) {
  const cover = guide.coverImage;
  if (!cover) return null;

  const teaser = getGuideHubTeaser(guide.slug);

  return (
    <Link href={`/guides/${guide.slug}`} className="guide-list-card">
      <span className="guide-list-card__cover">
        <GuideCoverImage
          cover={cover}
          decorative
          className="guide-list-card__cover-img"
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 320px"
        />
      </span>
      <span className="guide-list-card__body">
        <span className="guide-list-card__title">{guide.title}</span>
        {teaser && <span className="guide-list-card__desc">{teaser}</span>}
        {showUpdatedAt && (
          <span className="guide-list-card__meta">
            Mis à jour le {formatDate(guide.updatedAt)}
          </span>
        )}
        <span className="guide-list-card__cta" aria-hidden="true">
          → Lire le guide
        </span>
      </span>
    </Link>
  );
}
