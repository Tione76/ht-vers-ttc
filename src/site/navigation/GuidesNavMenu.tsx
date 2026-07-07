import type { GuideNavItem } from "@/site/guides/navigation";
import { NavDropdownMenu } from "./NavDropdownMenu";

interface GuidesNavMenuProps {
  items: GuideNavItem[];
}

export function GuidesNavMenu({ items }: GuidesNavMenuProps) {
  return (
    <NavDropdownMenu
      label="Guides"
      menuAriaLabel="Guides"
      items={items.map((item) => ({
        href: `/guides/${item.slug}`,
        shortTitle: item.shortTitle,
        title: item.title,
      }))}
    />
  );
}
