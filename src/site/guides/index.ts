export type {
  Guide,
  GuideBlock,
  GuideCallout,
  GuideCalloutVariant,
  GuideConclusion,
  GuideImagePlaceholder,
  GuideInternalLink,
  GuideLinkVariant,
  GuideProfessionFaq,
  GuideQuickSummary,
  GuideSection,
  GuideSidebarLinks,
  GuideSubsection,
  GuideTocEntry,
} from "./types";

export { GUIDE_CALLOUT_LABELS } from "./types";
export { OFFICIAL_GUIDE_MODEL } from "./template";
export { guideFactureConforme } from "./guide-facture-conforme";
export { guideTauxTva } from "./guide-taux-tva";
export { guideFranchiseTva } from "./guide-franchise-tva";
export { guideTvaAutoEntrepreneur } from "./guide-tva-auto-entrepreneur";
export { guideTvaDeductibleCollectee } from "./guide-tva-deductible-collectee";
export {
  guides,
  GUIDE_MODEL_SLUG,
  getAllGuideSlugs,
  getGuideBySlug,
  getPublishedGuideSlugs,
} from "./registry";
export { buildArticleSchema } from "./schema";
export { buildGuideToc, buildGuideTocH2, computeReadingTime } from "./utils";
export {
  attachGuideCover,
  coverToOgInput,
  coverToSchemaImage,
  getGuideCover,
  getGuideCoverByHref,
  GUIDE_COVERS,
  GUIDES_HUB_COVER,
  TOOLS_HUB_COVER,
  FAQ_COVER,
  HOME_COVER,
  MARGIN_CALCULATOR_COVER,
  resolveGuideCover,
} from "./covers";
export type { GuideCoverImage } from "./covers";
export { GuideArticle, GuideInlineToc, GuideSidebar } from "./GuideRenderer";
export {
  SiteSidebar,
  GuidePageSidebar,
  GuidesHubSidebar,
  ToolsHubSidebar,
  HomePageSidebar,
  FaqPageSidebar,
  ToolPageSidebar,
} from "./GuidePageSidebar";
export {
  getAllSidebarTools,
  getSidebarGuides,
  getSidebarTools,
  getGuidesSidebarLinks,
  getRelatedGuidesForSlug,
  SIDEBAR_CALCULATOR,
  SIDEBAR_LIMITS,
  SIDEBAR_TOOLS,
} from "./sidebar";
export type { GuideSidebarLink, SidebarContext, SidebarPageType, SidebarTool } from "./sidebar";
export { GuideCoverImage as GuideCoverImageComponent, GuideHeroImage } from "./GuideCoverImage";
export { GuideListCard } from "./GuideListCard";
export { GuidesHubEditorial } from "./guides-hub-editorial";
export { GuidesHubPicker } from "./guides-hub-picker";
export { getGuideHubTeaser, GUIDE_HUB_TEASERS } from "./guides-hub-data";
export { GuidePageLayout } from "./GuidePageLayout";
