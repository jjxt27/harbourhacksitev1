import Image from "next/image";
import Link from "next/link";
import { trust } from "@/content/site";
import { Container, Label } from "@/components/ui";

/**
 * Renders nothing until `trust` in content/site.ts holds verified details.
 * The program should not imply organisers, mentors or a venue it cannot name.
 */
export function Trust() {
  const people = [...trust.organisers, ...trust.mentors, ...trust.judges];
  const hasVenue = Boolean(trust.venue.name || trust.venue.address || trust.venue.image);
  const hasDetails = Boolean(trust.places || trust.weeklyCommitment || trust.selectionDate.iso);

  if (!people.length && !hasVenue && !hasDetails) return null;

  return (
    <section aria-labelledby="trust-title" className="ground-light border-t border-hairline py-20 md:py-28">
      <Container>
        <Label as="p" className="text-ink-muted">The crew and the port</Label>
        <h2 id="trust-title" className="mt-5 max-w-[13ch] font-display text-display-2 font-extrabold uppercase">
          Know who is on the dock.
        </h2>

        {people.length ? (
          <div className="mt-14 grid gap-px border-y border-hairline bg-hairline sm:grid-cols-2 lg:grid-cols-3">
            {people.map((person) => {
              const card = (
                <article className="h-full bg-paper py-7 sm:px-6">
                  {person.image ? <Image src={person.image} alt="" width={560} height={420} className="mb-6 aspect-[4/3] w-full object-cover" /> : null}
                  <h3 className="font-display text-display-3 font-bold">{person.name}</h3>
                  <p className="mt-2 font-mono text-label uppercase text-ink-muted">{person.role}</p>
                  {person.bio ? <p className="mt-5 text-body-sm text-ink-70">{person.bio}</p> : null}
                </article>
              );
              return person.href
                ? <Link key={`${person.name}-${person.role}`} href={person.href} className="block">{card}</Link>
                : <div key={`${person.name}-${person.role}`}>{card}</div>;
            })}
          </div>
        ) : null}

        {trust.venue.image ? <Image src={trust.venue.image} alt="" width={1400} height={720} className="mt-14 aspect-[16/7] w-full object-cover" /> : null}

        {(hasVenue || hasDetails) ? (
          <dl className="mt-14 grid border-t border-hairline md:grid-cols-3">
            {(trust.venue.name || trust.venue.address) ? <Detail term="Venue" value={trust.venue.name ?? trust.venue.address ?? ""} note={trust.venue.name ? trust.venue.address : null} /> : null}
            {trust.places ? <Detail term="Berths" value={`${trust.places}`} /> : null}
            {trust.weeklyCommitment ? <Detail term="Commitment" value={trust.weeklyCommitment} /> : null}
            {trust.selectionDate.iso ? <Detail term="Decisions" value={trust.selectionDate.label} /> : null}
          </dl>
        ) : null}
      </Container>
    </section>
  );
}

function Detail({ term, value, note }: { term: string; value: string; note?: string | null }) {
  return (
    <div className="border-b border-hairline py-6 md:pr-8">
      <dt className="font-mono text-label uppercase text-ink-muted">{term}</dt>
      <dd className="mt-3 text-lead font-bold">{value}</dd>
      {note ? <dd className="mt-2 text-body-sm text-ink-70">{note}</dd> : null}
    </div>
  );
}
