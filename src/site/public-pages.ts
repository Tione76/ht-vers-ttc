/**
 * Registre central des pages publiques indexables.
 * Source unique pour sitemap.xml et plan du site HTML.
 *
 * Ajouter un guide dans guides/registry.ts ou un calculateur dans seoConfig.calculators
 * suffit pour les intégrer automatiquement ici.
 */
import type { SitemapEntry } from "@/framework/seo/pages";
import { guides } from "./guides/registry";
import { getAllCalculators } from "./navigation/calculators-registry";
import { getAuthorSlugs, getAuthor } from "./seo/entities";
import { seoConfig } from "./seo.config";

export type PublicPageCategory = "tools" | "guides" | "faq" | "utility";

export interface PublicPage {
  path: string;
  title: string;
  category: PublicPageCategory;
  changefreq: SitemapEntry["changefreq"];
  priority: number;
  indexable: boolean;
}

function calculatorPages(): PublicPage[] {
  return getAllCalculators().map((calc) => ({
    path: calc.path,
    title: calc.shortTitle,
    category: "tools" as const,
    changefreq: "monthly" as const,
    priority: calc.path === "/" ? 1 : 0.9,
    indexable: true,
  }));
}

/** Toutes les pages publiques connues du site (indexables et non indexables) */
export function getAllPublicPages(): PublicPage[] {
  const { guidesHub, toolsHub, legal, extraPages } = seoConfig;

  const guideHubPage: PublicPage = {
    path: guidesHub.path,
    title: guidesHub.title,
    category: "guides",
    changefreq: "weekly",
    priority: 0.85,
    indexable: true,
  };

  const guidePages: PublicPage[] = guides.map((guide) => ({
    path: `/guides/${guide.slug}`,
    title: guide.title,
    category: "guides",
    changefreq: "monthly",
    priority: 0.8,
    indexable: true,
  }));

  const toolsHubPage: PublicPage = {
    path: toolsHub.path,
    title: toolsHub.title,
    category: "tools",
    changefreq: "monthly",
    priority: 0.75,
    indexable: true,
  };

  const faqPage: PublicPage = {
    path: "/faq",
    title: "FAQ TVA",
    category: "faq",
    changefreq: "monthly",
    priority: 0.7,
    indexable: true,
  };

  const utilityPages: PublicPage[] = [
    {
      path: "/plan-du-site",
      title: legal.sitemap.title,
      category: "utility",
      changefreq: "monthly",
      priority: 0.4,
      indexable: true,
    },
    {
      path: "/contact",
      title: legal.contact.title,
      category: "utility",
      changefreq: "monthly",
      priority: 0.5,
      indexable: true,
    },
  ];

  const legalPages: PublicPage[] = [
    {
      path: "/mentions-legales",
      title: legal.mentions.title,
      category: "utility",
      changefreq: "yearly",
      priority: 0.3,
      indexable: true,
    },
    {
      path: "/politique-de-confidentialite",
      title: legal.privacy.title,
      category: "utility",
      changefreq: "yearly",
      priority: 0.3,
      indexable: true,
    },
    {
      path: "/gestion-des-cookies",
      title: legal.cookies.title,
      category: "utility",
      changefreq: "yearly",
      priority: 0.3,
      indexable: true,
    },
  ];

  const extra: PublicPage[] = extraPages.map((p) => ({
    path: `/${p.slug}`,
    title: p.title,
    category: "utility",
    changefreq: "monthly",
    priority: 0.6,
    indexable: true,
  }));

  const authorPages: PublicPage[] = getAuthorSlugs()
    .map((slug) => getAuthor(slug))
    .filter((author): author is NonNullable<typeof author> => Boolean(author))
    .map((author) => ({
      path: author.path,
      title: author.seoTitle,
      category: "utility" as const,
      changefreq: "monthly" as const,
      priority: 0.5,
      indexable: true,
    }));

  return [
    ...calculatorPages(),
    toolsHubPage,
    guideHubPage,
    ...guidePages,
    faqPage,
    ...utilityPages,
    ...legalPages,
    ...authorPages,
    ...extra,
  ];
}

/** Entrées pour sitemap.xml : pages indexables uniquement */
export function getSitemapEntries(): SitemapEntry[] {
  return getAllPublicPages()
    .filter((page) => page.indexable)
    .map(({ path, changefreq, priority }) => ({ path, changefreq, priority }));
}

export interface PlanDuSiteSection {
  title: string;
  pages: { path: string; title: string }[];
}

/** Sections du plan du site HTML */
export function getPlanDuSiteSections(): PlanDuSiteSection[] {
  const pages = getAllPublicPages().filter((p) => p.indexable);
  const toLink = (p: PublicPage) => ({ path: p.path, title: p.title });
  const byCategory = (cat: PublicPageCategory) => pages.filter((p) => p.category === cat).map(toLink);

  const guideHub = pages.find((p) => p.path === seoConfig.guidesHub.path);
  const guideArticles = pages
    .filter((p) => p.category === "guides" && p.path !== seoConfig.guidesHub.path)
    .map(toLink);

  const toolsHubPath = seoConfig.toolsHub.path;
  const toolPages = pages.filter((p) => p.category === "tools").map(toLink);
  const toolsOrdered = [
    ...toolPages.filter((p) => p.path === toolsHubPath),
    ...toolPages.filter((p) => p.path !== toolsHubPath),
  ];

  return [
    { title: "Outils gratuits", pages: toolsOrdered },
    {
      title: "Guides TVA",
      pages: [...(guideHub ? [toLink(guideHub)] : []), ...guideArticles],
    },
    { title: "FAQ", pages: byCategory("faq") },
    { title: "Pages utiles", pages: byCategory("utility") },
  ].filter((section) => section.pages.length > 0);
}

/** Vérifie si une route doit être indexée */
export function isPathIndexable(path: string): boolean {
  const normalized = path === "/" ? "/" : path.replace(/\/$/, "");
  return getAllPublicPages().some(
    (p) => p.path === normalized && p.indexable,
  );
}
