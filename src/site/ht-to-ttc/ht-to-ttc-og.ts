import {
  HT_TO_TTC_SERIES_COVER,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
} from "@/site/guides/covers";
import { htToTtcSlugFromAmount } from "./ht-to-ttc-amounts";
import { buildHtToTtcPageContent } from "./ht-to-ttc-content";

/** Segment d'URL de la route OG dynamique (hors pages [slug] partagées). */
export const HT_TO_TTC_OG_ROUTE_PREFIX = "/og/ht-en-ttc";

/** Crédit discret pour l'image Open Graph (licence Pexels). */
export const HT_TO_TTC_OG_CREDIT_SHORT = "Photo : Pavel Danilyuk / Pexels";

/**
 * Chemin relatif de l'image OG individualisée.
 * Générée à la demande (pas de 1000 fichiers au build).
 */
export function htToTtcOgImagePath(amountHt: number): string {
  return `${HT_TO_TTC_OG_ROUTE_PREFIX}/${htToTtcSlugFromAmount(amountHt)}`;
}

/**
 * Entrée Open Graph / Twitter pour buildPageMetadata.
 * L'image visible de la fiche reste HT_TO_TTC_SERIES_COVER (WebP sans texte).
 */
export function htToTtcOgImageInput(amountHt: number) {
  const content = buildHtToTtcPageContent(amountHt);
  const amountShort = content.primary.htShort;
  return {
    url: htToTtcOgImagePath(amountHt),
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    /** Alt de l'asset graphique OG (montants visibles sur l'image générée). */
    alt: `${amountShort} HT = ${content.primary.ttcShort} TTC`,
    type: "image/png",
  };
}

/** Données affichées sur l'image OG (même source que H1 / résultat principal). */
export function getHtToTtcOgVisualData(amountHt: number) {
  const content = buildHtToTtcPageContent(amountHt);
  return {
    amountHt,
    amountShort: content.primary.htShort,
    ttcShort: content.primary.ttcShort,
    vatBadge: `TVA ${content.primary.rateLabel}`,
    siteLabel: "ht-vers-ttc.fr",
    credit: HT_TO_TTC_OG_CREDIT_SHORT,
    coverSrc: HT_TO_TTC_SERIES_COVER.src,
  };
}

export { HT_TO_TTC_SERIES_COVER, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT };
