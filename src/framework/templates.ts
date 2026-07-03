/**
 * Templates officiels du framework — sélection automatique selon le type de page.
 */
export const PageTemplate = {
  /** Accueil / simulateur principal */
  CALCULATOR: "calculator",
  /** Articles, guides, légal, FAQ, 404, plan du site */
  CONTENT: "content",
  /** Contact, assistance, support */
  CONTACT: "contact",
} as const;

export type PageTemplateType = (typeof PageTemplate)[keyof typeof PageTemplate];

/** Correspondance type de page → layout framework */
export const PAGE_TEMPLATE_MAP = {
  home: PageTemplate.CALCULATOR,
  contact: PageTemplate.CONTACT,
  legal: PageTemplate.CONTENT,
  article: PageTemplate.CONTENT,
  guide: PageTemplate.CONTENT,
  faq: PageTemplate.CONTENT,
  sitemap: PageTemplate.CONTENT,
  simulators: PageTemplate.CONTENT,
  error: PageTemplate.CONTENT,
  notFound: PageTemplate.CONTENT,
} as const;
