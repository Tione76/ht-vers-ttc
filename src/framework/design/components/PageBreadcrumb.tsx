import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[];
}

/** Fil d'Ariane visuel : réutilisable sur guides, calculateurs, FAQ, etc. */
export function PageBreadcrumb({ items }: PageBreadcrumbProps) {
  return (
    <nav aria-label="Fil d'Ariane" className="guide-breadcrumb">
      <ol className="guide-breadcrumb__list">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="guide-breadcrumb__item">
            {index > 0 && (
              <span className="guide-breadcrumb__sep" aria-hidden="true">
                ›
              </span>
            )}
            {item.href ? (
              <Link href={item.href} className="guide-breadcrumb__label">
                {item.label}
              </Link>
            ) : (
              <span className="guide-breadcrumb__label" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
