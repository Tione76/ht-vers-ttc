import type { MetadataRoute } from "next";
import { config } from "@/site";
import { getSitemapEntries } from "@/site/public-pages";

export default function sitemap(): MetadataRoute.Sitemap {
  return getSitemapEntries().map((page) => ({
    url: `${config.url}${page.path === "/" ? "" : page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changefreq,
    priority: page.priority,
  }));
}
