import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { config, seoConfig } from "@/site";
import { SiteProvider } from "@/framework/SiteProvider";
import { ThemeStyles } from "@/framework/ThemeStyles";
import { SkipLink } from "@/framework/SkipLink";
import { buildRootMetadata } from "@/framework/seo/metadata";
import "./globals.css";

/** Polices self-hostées : le build Vercel ne dépend plus de fonts.gstatic.com. */
const sourceSans = localFont({
  src: [
    {
      path: "./fonts/source-sans-3-latin-400-normal.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/source-sans-3-latin-500-normal.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/source-sans-3-latin-600-normal.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/source-sans-3-latin-700-normal.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-source-sans",
  display: "swap",
  preload: true,
});

export const metadata: Metadata = buildRootMetadata(config, seoConfig);

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: config.colors.primary,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={config.language} className={sourceSans.variable}>
      <head>
        <ThemeStyles colors={config.colors} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
            gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',functionality_storage:'denied',security_storage:'granted',wait_for_update:500});`,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col font-sans antialiased">
        <SiteProvider config={config}>
          <SkipLink />
          {children}
        </SiteProvider>
      </body>
    </html>
  );
}
