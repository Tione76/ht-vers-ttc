import type { MetadataRoute } from "next";
import { config, seoConfig } from "@/site";
import { getAllPages } from "@/framework/seo/pages";

export default function sitemap(): MetadataRoute.Sitemap {
  return getAllPages(seoConfig).map((page) => ({
    url: `${config.url}${page.path === "/" ? "" : page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changefreq,
    priority: page.priority,
  }));
}
