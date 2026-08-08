import type { Metadata, Viewport } from "next";
import { Geist, JetBrains_Mono, Kalam } from "next/font/google";
import { site } from "@/content/canvas";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const kalam = Kalam({
  variable: "--font-kalam",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} ${site.year} — ${site.tagline}`, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: ["hackathon", "go-to-market", "students", "startup", site.city],
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: site.url,
    siteName: site.name,
    title: `${site.name} ${site.year} — ${site.tagline}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: `${site.name} ${site.year}`, description: site.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  // The canvas owns horizontal movement; pinch-zoom stays available.
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${geist.variable} ${jetbrains.variable} ${kalam.variable}`}>
      <body>
        <a
          href="#setting-sail"
          className="press sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:border-2 focus:border-ink focus:bg-highlighter focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase"
        >
          Skip to registration
        </a>
        {children}
      </body>
    </html>
  );
}
