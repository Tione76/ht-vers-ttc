"use client";

import { useSite } from "@/framework/SiteProvider";
import { ContentPageLayout } from "@/framework/layouts/ContentPageLayout";

interface ContactPageLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

/** Template officiel : contact, assistance, support */
export function ContactPageLayout({ title, subtitle, children }: ContactPageLayoutProps) {
  const site = useSite();
  const { contact } = site;

  const sidebar = (
    <>
      {contact.infoItems.length > 0 && (
        <div className="sidebar-block">
          <p className="sidebar-block__title">Informations</p>
          <ul className="sidebar-list">
            {contact.infoItems.map((item) => (
              <li key={item} className="sidebar-list__item">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {contact.faqLinks.length > 0 && (
        <div className="sidebar-block">
          <p className="sidebar-block__title">Questions fréquentes</p>
          {contact.faqLinks.map((link) => (
            <a key={link.href} href={link.href} className="sidebar-guide">
              <p className="sidebar-guide__title">{link.label}</p>
            </a>
          ))}
        </div>
      )}
    </>
  );

  return (
    <ContentPageLayout meta="Assistance" title={title} subtitle={subtitle} sidebar={sidebar} prose={false}>
      {children}
    </ContentPageLayout>
  );
}
