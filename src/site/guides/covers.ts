import type { Guide } from "./types";

/** Dimensions standard Open Graph */
export const OG_IMAGE_WIDTH = 1200;
export const OG_IMAGE_HEIGHT = 630;
export const OG_IMAGE_TYPE = "image/webp";

export interface GuideCoverImage {
  /** Chemin public vers le fichier .webp */
  src: string;
  /** Texte alternatif utile (jamais le crédit) */
  alt: string;
  width: number;
  height: number;
  /** Crédit photo affiché en bandeau bas (optionnel) */
  credit?: string;
}

function ogPath(...parts: string[]): string {
  return `/images/og/${parts.map((part) => encodeURIComponent(part)).join("/")}`;
}

function cover(
  filename: string,
  alt: string,
  credit: string,
  ...subdir: string[]
): GuideCoverImage {
  return {
    src: ogPath(...subdir, filename),
    alt,
    width: OG_IMAGE_WIDTH,
    height: OG_IMAGE_HEIGHT,
    credit,
  };
}

/** Image de couverture : page d'accueil / calculateur */
export const HOME_COVER: GuideCoverImage = cover(
  "Calculateur-ht-vers-ttc.webp",
  "Conversion d'un montant HT en prix TTC",
  "Photo de RDNE Stock project via Pexels",
);

/** Image de couverture officielle : calculateur de marge HT / TTC */
export const MARGIN_CALCULATOR_COVER: GuideCoverImage = cover(
  "Calculateur-marge-HT-TTC.webp",
  "Calcul de la marge HT et TTC",
  "Photo de Jakub Zerdzicki via Pexels",
);

/** Open Graph : hub /guides */
export const GUIDES_HUB_COVER: GuideCoverImage = cover(
  "Guides-entreprenariat-TVA.webp",
  "Guides pratiques sur la TVA",
  "Photo de Marta Branco via Pexels",
);

/** Open Graph : hub /nos-outils */
export const TOOLS_HUB_COVER: GuideCoverImage = cover(
  "Calculateurs-HT-TTC-TVA.webp",
  "Outils de calcul TVA",
  "Photo de Yan Krukau via Pexels",
);

/** Open Graph / illustration : page FAQ */
export const FAQ_COVER: GuideCoverImage = cover(
  "Questions-TVA.webp",
  "Questions fréquentes sur la TVA",
  "Photo de Ann H via Pexels",
);

/** Couvertures par slug de guide : source unique pour article, OG, sidebar et listes */
export const GUIDE_COVERS: Record<string, GuideCoverImage> = {
  "quels-sont-les-taux-de-tva-en-france": cover(
    "Taux-TVA-France.webp",
    "Les taux de TVA en France",
    "Photo de Nataliya Vaitkevich via Pexels",
    "guides",
  ),
  "franchise-en-base-de-tva": cover(
    "Franchise-en-base-de-TVA.webp",
    "Franchise en base de TVA",
    "Photo de SHVETS production via Pexels",
    "guides",
  ),
  "comment-faire-une-facture-conforme": cover(
    "Rédiger-facture-conforme.webp",
    "Rédiger une facture conforme",
    "Photo de Kindel Media via Pexels",
    "guides",
  ),
  "tva-et-auto-entrepreneur": cover(
    "TVA-et-auto-entrepreneur.webp",
    "TVA et auto-entrepreneur",
    "Photo de Kampus Production via Pexels",
    "guides",
  ),
  "tva-deductible-et-tva-collectee": cover(
    "TVA-déductible-et-collectée.webp",
    "TVA déductible et TVA collectée",
    "Photo de Kampus Production via Pexels",
    "guides",
  ),
};

export function getGuideCover(slug: string): GuideCoverImage | undefined {
  return GUIDE_COVERS[slug];
}

export function getGuideCoverByHref(href: string): GuideCoverImage | undefined {
  const match = href.match(/^\/guides\/([^/]+)\/?$/);
  if (!match) return undefined;
  return getGuideCover(match[1]);
}

export function resolveGuideCover(guide: Pick<Guide, "slug" | "coverImage">): GuideCoverImage | undefined {
  return guide.coverImage ?? getGuideCover(guide.slug);
}

/** Attache la couverture au guide (source unique pour tout le site) */
export function attachGuideCover<T extends Guide>(guide: T): T {
  const coverImage = getGuideCover(guide.slug);
  return coverImage ? { ...guide, coverImage } : guide;
}

export function coverToOgInput(coverImage: GuideCoverImage) {
  return {
    url: coverImage.src,
    width: coverImage.width,
    height: coverImage.height,
    alt: coverImage.alt,
    type: OG_IMAGE_TYPE,
  };
}

export function coverToSchemaImage(coverImage: GuideCoverImage) {
  return {
    url: coverImage.src,
    width: coverImage.width,
    height: coverImage.height,
    caption: coverImage.alt,
  };
}
