import { SiteNav } from "./SiteNav";
import { HeaderCurveDown } from "./Curves";
import type { NavLink } from "@/framework/types";

interface CompactPageHeaderProps {
  siteName: string;
  nav: NavLink[];
  meta?: string;
  title: string;
  subtitle?: string;
}

/** Header compact (~200 px) — pages contenu, contact, légal */
export function CompactPageHeader({
  siteName,
  nav,
  meta,
  title,
  subtitle,
}: CompactPageHeaderProps) {
  return (
    <section className="article-header">
      <div className="article-header__inner">
        <SiteNav siteName={siteName} nav={nav} />
        {meta && <p className="article-header__meta">{meta}</p>}
        <h1 className="article-header__title">{title}</h1>
        {subtitle && <p className="article-header__subtitle">{subtitle}</p>}
      </div>
      <HeaderCurveDown />
    </section>
  );
}
