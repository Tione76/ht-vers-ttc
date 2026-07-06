import { SiteNav, type SiteLogo } from "./SiteNav";
import { HeaderCurveDown } from "./Curves";
import type { NavLink } from "@/framework/types";
import type { GuideNavItem } from "@/site/guides/navigation";
import type { ToolNavItem } from "@/site/navigation/tools";

interface CompactPageHeaderProps {
  siteName: string;
  nav: NavLink[];
  logo?: SiteLogo;
  toolsNavigation?: ToolNavItem[];
  guidesNavigation?: GuideNavItem[];
  meta?: string;
  title: string;
  subtitle?: string;
}

/** Header compact (~200 px) — pages contenu, contact, légal */
export function CompactPageHeader({
  siteName,
  nav,
  logo,
  toolsNavigation,
  guidesNavigation,
  meta,
  title,
  subtitle,
}: CompactPageHeaderProps) {
  return (
    <section className="article-header">
      <SiteNav
        siteName={siteName}
        nav={nav}
        logo={logo}
        toolsNavigation={toolsNavigation}
        guidesNavigation={guidesNavigation}
      />
      <div className="article-header__inner">
        {meta && <p className="article-header__meta">{meta}</p>}
        <h1 className="article-header__title">{title}</h1>
        {subtitle && <p className="article-header__subtitle">{subtitle}</p>}
      </div>
      <HeaderCurveDown />
    </section>
  );
}
