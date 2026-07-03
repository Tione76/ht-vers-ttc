import type { Metadata, Viewport } from "next";
import { Source_Sans_3 } from "next/font/google";
import { config, seoConfig } from "@/site";
import { SiteProvider } from "@/framework/SiteProvider";
import { ThemeStyles } from "@/framework/ThemeStyles";
import { SkipLink } from "@/framework/SkipLink";
import { buildRootMetadata } from "@/framework/seo/metadata";
import "./globals.css";

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
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
