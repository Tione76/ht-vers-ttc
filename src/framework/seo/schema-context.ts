import type { SiteConfigShape } from "@/site/seo/entities";
import {
  getOrganizationRecord,
  getWebSiteRecord,
  schemaId,
  SCHEMA_FRAGMENT,
} from "@/site/seo/entities";

/** Contexte Schema.org dérivé de site.config : évite de recalculer les @id */
export interface SchemaContext {
  siteUrl: string;
  language: string;
  organizationId: string;
  websiteId: string;
  organization: ReturnType<typeof getOrganizationRecord>;
  website: ReturnType<typeof getWebSiteRecord>;
}

export function createSchemaContext(site: SiteConfigShape): SchemaContext {
  const siteUrl = site.url.replace(/\/$/, "");
  return {
    siteUrl,
    language: site.language,
    organizationId: schemaId(siteUrl, SCHEMA_FRAGMENT.organization),
    websiteId: schemaId(siteUrl, SCHEMA_FRAGMENT.website),
    organization: getOrganizationRecord(site),
    website: getWebSiteRecord(site),
  };
}
