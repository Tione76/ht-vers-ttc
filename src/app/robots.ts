import type { MetadataRoute } from "next";
import { config } from "@/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${config.url}/sitemap.xml`,
  };
}
