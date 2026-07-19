import Image from "next/image";
import type { GuideCoverImage as GuideCoverImageType } from "./covers";

interface GuideCoverImageProps {
  cover: GuideCoverImageType;
  /** true uniquement pour LCP / above-the-fold */
  priority?: boolean;
  /** Carte avec titre et description : image décorative (alt vide) */
  decorative?: boolean;
  className?: string;
  sizes?: string;
}

/** Image de couverture : sidebar, listes de guides (hors contenu article) */
export function GuideCoverImage({
  cover,
  priority = false,
  decorative = false,
  className,
  sizes = "(max-width: 1023px) 100vw, 280px",
}: GuideCoverImageProps) {
  return (
    <Image
      src={cover.src}
      alt={decorative ? "" : cover.alt}
      width={cover.width}
      height={cover.height}
      sizes={sizes}
      className={className}
      loading={priority ? undefined : "lazy"}
      decoding="async"
      priority={priority}
    />
  );
}

interface GuideHeroImageProps {
  cover: GuideCoverImageType;
  /**
   * true uniquement si l'image est un candidat LCP probable
   * (ex. guide avec intro courte, image près du haut de page).
   */
  priority?: boolean;
}

/**
 * Illustration principale d'article : après l'introduction, avant quickSummary / sommaire.
 * Crédit affiché uniquement si renseigné dans le registre.
 */
export function GuideHeroImage({ cover, priority = false }: GuideHeroImageProps) {
  return (
    <figure className="guide-hero">
      <div className="guide-hero__frame">
        <GuideCoverImage
          cover={cover}
          priority={priority}
          className="guide-hero__img"
          sizes="(max-width: 639px) 100vw, (max-width: 1023px) 90vw, 720px"
        />
        {cover.credit ? (
          <figcaption className="guide-hero__credit">{cover.credit}</figcaption>
        ) : null}
      </div>
    </figure>
  );
}
