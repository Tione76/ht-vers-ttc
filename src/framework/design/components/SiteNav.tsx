import Link from "next/link";
import type { NavLink } from "@/framework/types";

interface SiteNavProps {
  siteName: string;
  nav: NavLink[];
}

export function SiteNav({ siteName, nav }: SiteNavProps) {
  return (
    <header className="site-header">
      <Link href="/" className="site-brand">
        {siteName}
      </Link>
      <nav aria-label="Navigation principale" className="site-nav">
        <ul>
          {nav.map((link) => (
            <li key={link.href}>
              {link.external ? (
                <a href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              ) : (
                <Link href={link.href}>{link.label}</Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
