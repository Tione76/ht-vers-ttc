import type { GuideNavItem } from "@/site/guides/navigation";
import { seoConfig } from "../seo.config";
import { NavDropdownMenu } from "./NavDropdownMenu";

interface GuidesNavMenuProps {
  items: GuideNavItem[];
}

export function GuidesNavMenu({ items }: GuidesNavMenuProps) {
  const hub = seoConfig.guidesHub;

  return (
    <NavDropdownMenu
      label="Guides"
      menuAriaLabel="Guides"
      items={[
        {
          href: hub.path,
          shortTitle: "Tous les guides",
          title: hub.title,
        },
        ...items.map((item) => ({
          href: `/guides/${item.slug}`,
          shortTitle: item.shortTitle,
          title: item.title,
        })),
      ]}
    />
  );
}
