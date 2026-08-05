import Link from "next/link";
import { nav, site, sponsors } from "@/content/site";
import { BrandMark } from "@/components/BrandMark";
import { Container } from "@/components/ui";

export function Footer() {
  return (
    <footer className="hh-footer border-t border-hairline py-10">
      <Container>
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/" className="inline-flex">
              <BrandMark />
              <span className="sr-only">{site.name} home</span>
            </Link>
            <p className="mt-3 text-body-sm text-ink-70">A go-to-market hackathon. {site.city}.</p>
          </div>

          <div className="flex flex-wrap gap-x-8 gap-y-3 text-body-sm text-ink-70">
            {nav.map((item) => <Link key={item.href} href={item.href} className="transition-colors hover:text-ink">{item.label}</Link>)}
            {site.contactEmail ? <a href={`mailto:${site.contactEmail}`} className="transition-colors hover:text-ink">Contact</a> : null}
            {sponsors.cta.href ? <a href={sponsors.cta.href} className="transition-colors hover:text-ink">Sponsor</a> : null}
          </div>
        </div>
      </Container>
    </footer>
  );
}
