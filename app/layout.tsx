import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { site } from "@/content/canvas";
import "./globals.css";

/** The two weights the intro uses, plus the italic it loads for pull quotes. */
const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

/**
 * Runs before first paint.
 *
 * Adds `.js` so progressive-enhancement rules can key off it, then decides
 * whether the intro plays — here rather than after hydration, so the page
 * underneath never flashes into view and back out.
 *
 * Two separate signals, which is the part worth not collapsing:
 *
 *   `data-boot`  should the intro play. Only the component clears it.
 *   `.booting`   is the page scroll-locked. The timeout below clears it no
 *                matter what, so a JavaScript failure downstream cannot leave
 *                anyone staring at a page they cannot scroll.
 *
 * They started as one class and it was subtly wrong: on a slow first load the
 * failsafe fired before React had mounted, and the intro was cancelled rather
 * than merely unlocked. The lock needs a short leash; the decision does not.
 *
 * Reduced motion skips the whole thing — an unskippable timed gate is a WCAG
 * 2.2.1 problem, and the intro carries no information anyway.
 */
const BOOT_SCRIPT = `(function(){var r=document.documentElement;r.classList.add('js');var seen=false;try{seen=sessionStorage.getItem('hh-intro-seen')==='1'}catch(e){}if(!seen&&!matchMedia('(prefers-reduced-motion: reduce)').matches){r.setAttribute('data-boot','1');r.classList.add('booting');setTimeout(function(){r.classList.remove('booting')},6000)}})();`;

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
  themeColor: "#061e3c",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-AU"
      className={`${cormorant.variable} ${inter.variable}`}
      // The inline script above adds `.js` before React sees the document.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
      </head>
      <body>
        <a
          href="#register"
          className="eyebrow sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[200] focus:bg-brass focus:px-5 focus:py-3 focus:text-night"
        >
          Skip to registration
        </a>
        {children}
      </body>
    </html>
  );
}
