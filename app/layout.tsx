import type { Metadata } from "next";
import { DM_Mono, Schibsted_Grotesk } from "next/font/google";
import { site } from "@/content/site";
import "./globals.css";

const schibsted = Schibsted_Grotesk({
  variable: "--font-schibsted",
  subsets: ["latin"],
  display: "swap",
});

const dmMono = DM_Mono({
  variable: "--font-dm-mono",
  subsets: ["latin"],
  weight: ["400"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  keywords: ["go-to-market", "hackathon", "distribution", "students", site.city],
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: site.url,
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: `${site.name} — ${site.tagline}`, description: site.description },
  robots: { index: true, follow: true },
};

/**
 * Runs before first paint. `.js` hides messages that have not been delivered
 * yet — which must never be the server-rendered state, or a reader without
 * scripting gets an empty page instead of the whole conversation.
 */
const PRE_PAINT = `document.documentElement.classList.add('js')`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // The pre-paint script adds `js` here, so the class list is expected to
    // differ from the server's.
    <html
      lang="en-AU"
      className={`${schibsted.variable} ${dmMono.variable}`}
      suppressHydrationWarning
    >
      <head><script dangerouslySetInnerHTML={{ __html: PRE_PAINT }} /></head>
      <body>
        <a href="#main" className="skip-link">Skip to the conversation</a>
        <main id="main">{children}</main>
      </body>
    </html>
  );
}
