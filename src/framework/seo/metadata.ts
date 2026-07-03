import type { Metadata } from "next";

export interface SeoPageInput {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
}

export interface SiteSeoInput {
  url: string;
  name: string;
  author: string;
  locale: string;
  favicon: string;
  ogImage: string;
  analytics: { googleSearchConsoleId?: string };
}

export interface SeoDefaultsInput {
  titleTemplate: string;
  defaultDescription: string;
  keywords: string[];
  twitterHandle?: string;
  home: { title: string };
}

export function getCanonicalUrl(url: string, path: string): string {
  return `${url}${path === "/" ? "" : path}`;
}

export function buildPageMetadata(
  site: SiteSeoInput,
  seo: SeoDefaultsInput,
  page: SeoPageInput,
): Metadata {
  const canonical = getCanonicalUrl(site.url, page.path);
  const ogImage = page.ogImage ?? site.ogImage;
  const ogImageUrl = ogImage.startsWith("http") ? ogImage : `${site.url}${ogImage}`;

  return {
    title: page.title,
    description: page.description,
    keywords: seo.keywords,
    authors: [{ name: site.author }],
    alternates: { canonical },
    openGraph: {
      type: "website",
      locale: site.locale.replace("-", "_"),
      url: canonical,
      siteName: site.name,
      title: page.title,
      description: page.description,
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: page.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: [ogImageUrl],
      ...(seo.twitterHandle && { site: seo.twitterHandle }),
    },
    ...(site.analytics.googleSearchConsoleId && {
      verification: { google: site.analytics.googleSearchConsoleId },
    }),
  };
}

export function buildRootMetadata(
  site: SiteSeoInput,
  seo: SeoDefaultsInput,
): Metadata {
  return {
    metadataBase: new URL(site.url),
    title: { default: seo.home.title, template: seo.titleTemplate },
    description: seo.defaultDescription,
    keywords: seo.keywords,
    authors: [{ name: site.author }],
    icons: { icon: site.favicon },
    manifest: "/manifest.webmanifest",
    ...(site.analytics.googleSearchConsoleId && {
      verification: { google: site.analytics.googleSearchConsoleId },
    }),
  };
}
