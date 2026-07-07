import type { ToolNavItem } from "./tools";
import { NavDropdownMenu } from "./NavDropdownMenu";

interface ToolsNavMenuProps {
  items: ToolNavItem[];
}

export function ToolsNavMenu({ items }: ToolsNavMenuProps) {
  return (
    <NavDropdownMenu
      label="Nos outils"
      menuAriaLabel="Nos outils"
      items={items}
    />
  );
}
