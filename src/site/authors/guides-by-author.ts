import { guides } from "@/site/guides/registry";
import { DEFAULT_GUIDE_AUTHOR_SLUG } from "@/site/seo/entities";

/** Guides publiés par un auteur (extensible via authorSlug sur Guide) */
export function getGuidesByAuthor(authorSlug: string = DEFAULT_GUIDE_AUTHOR_SLUG) {
  if (authorSlug !== DEFAULT_GUIDE_AUTHOR_SLUG) return [];
  return guides;
}
