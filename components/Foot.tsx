import Link from "next/link";
import { site } from "@/content/site";

export function Foot() {
  return (
    <footer className="foot">
      <div className="shell foot-inner">
        <p>
          {site.name} — a go-to-market hackathon. {site.city}.
        </p>
        <nav aria-label="Footer">
          <Link href="/">Thread</Link>
          <Link href="/faq">Replies</Link>
          <Link href="/apply">Apply</Link>
          {site.contactEmail ? <a href={`mailto:${site.contactEmail}`}>Contact</a> : null}
          {site.sponsorEmail ? <a href={`mailto:${site.sponsorEmail}`}>Sponsor</a> : null}
        </nav>
      </div>
    </footer>
  );
}
