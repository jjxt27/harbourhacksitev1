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
  keywords: ["hackathon", "go-to-market", "builders", "startup", site.city],
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
  themeColor: "#08192e",
  // The canvas owns horizontal movement; pinch-zoom stays available.
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${geist.variable} ${jetbrains.variable} ${kalam.variable}`}>
      {/* The skip link lives on the canvas page rather than here: it points at
          registration, which is now a page of its own, and a layout-level link
          to `#setting-sail` would be a dead anchor on every route that is not
          the canvas. */}
      <body>{children}</body>
    </html>
  );
}
