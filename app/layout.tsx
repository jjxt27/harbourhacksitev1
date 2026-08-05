import type { Metadata } from "next";
import { Geist_Mono, Inter, Newsreader } from "next/font/google";
import { site } from "@/content/site";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { Sweep } from "@/components/Sweep";
import "./globals.css";

const inter = Inter({ variable: "--font-inter", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} - ${site.tagline}`, template: `%s - ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: ["go-to-market", "hackathon", "student hackathon", "startups", "distribution", site.city],
  openGraph: { type: "website", locale: "en_AU", url: site.url, siteName: site.name, title: `${site.name} - ${site.tagline}`, description: site.description },
  twitter: { card: "summary_large_image", title: `${site.name} - ${site.tagline}`, description: site.description },
  robots: { index: true, follow: true },
};

/**
 * Runs before paint so the reveal system and the intro never flash.
 *
 * `js` switches the CSS reveals from "always visible" to "hidden until shown".
 * `booting` gates the sweep intro — set only on a first visit in this session
 * and never under reduced motion, then cleared by the component or, if
 * scripting stalls, by the failsafe timeout below.
 */
const JS = `(function(){var r=document.documentElement;r.classList.add('js');var seen=false;try{seen=sessionStorage.getItem('harbourhack-intro-seen')==='1'}catch(e){}if(!seen&&!matchMedia('(prefers-reduced-motion: reduce)').matches){r.classList.add('booting');setTimeout(function(){r.classList.remove('booting')},3000)}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${geistMono.variable} ${newsreader.variable}`} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: JS }} /></head>
      <body className="min-h-[100dvh]">
        <Sweep />
        <a href="#main" className="skip-link">Skip to content</a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
