import type { ToolNavItem } from "./tools";
import { seoConfig } from "../seo.config";
import { NavDropdownMenu } from "./NavDropdownMenu";

interface ToolsNavMenuProps {
  items: ToolNavItem[];
}

export function ToolsNavMenu({ items }: ToolsNavMenuProps) {
  const hub = seoConfig.toolsHub;

  return (
    <NavDropdownMenu
      label="Nos outils"
      menuAriaLabel="Nos outils"
      items={[
        {
          href: hub.path,
          shortTitle: "Tous les outils",
          title: hub.title,
        },
        ...items,
      ]}
    />
  );
}
