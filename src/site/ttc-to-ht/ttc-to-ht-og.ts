import {
  coverCreditToOgShort,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
  TTC_TO_HT_SERIES_COVER,
} from "@/site/guides/covers";
import { ttcToHtSlugFromAmount } from "./ttc-to-ht-amounts";
import { buildTtcToHtPageContent } from "./ttc-to-ht-content";

/** Segment d'URL de la route OG dynamique TTC → HT. */
export const TTC_TO_HT_OG_ROUTE_PREFIX = "/og/ttc-en-ht";

/**
 * Base JPEG 1200×630 dérivée de Montants-TTC-en-HT.webp.
 * Utilisée uniquement par ImageResponse (Satori n'accepte pas WebP).
 */
export const TTC_TO_HT_OG_BASE_SRC = "/images/og/Montants-TTC-en-HT-og-base.jpg";

/** Crédit discret pour l'image Open Graph TTC → HT. */
export const TTC_TO_HT_OG_CREDIT_SHORT = coverCreditToOgShort(
  TTC_TO_HT_SERIES_COVER.credit ?? "",
);

export function ttcToHtOgImagePath(amountTtc: number): string {
  return `${TTC_TO_HT_OG_ROUTE_PREFIX}/${ttcToHtSlugFromAmount(amountTtc)}`;
}

export function ttcToHtOgImageInput(amountTtc: number) {
  const content = buildTtcToHtPageContent(amountTtc);
  const amountShort = content.primary.ttcShort;
  return {
    url: ttcToHtOgImagePath(amountTtc),
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    alt: `${amountShort} TTC = ${content.primary.htShort} HT`,
    type: "image/png",
  };
}

/** Données affichées sur l'image OG (même source que H1 / résultat principal). */
export function getTtcToHtOgVisualData(amountTtc: number) {
  const content = buildTtcToHtPageContent(amountTtc);
  return {
    amountTtc,
    amountShort: content.primary.ttcShort,
    htShort: content.primary.htShort,
    vatBadge: `TVA ${content.primary.rateLabel}`,
    siteLabel: "ht-vers-ttc.fr",
    credit: TTC_TO_HT_OG_CREDIT_SHORT,
    coverSrc: TTC_TO_HT_SERIES_COVER.src,
    ogBaseSrc: TTC_TO_HT_OG_BASE_SRC,
  };
}

export { TTC_TO_HT_SERIES_COVER, OG_IMAGE_WIDTH, OG_IMAGE_HEIGHT };
