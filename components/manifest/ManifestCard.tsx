import type { Ref } from "react";
import { manifest, site } from "@/content/canvas";
import { manifestNumber } from "@/lib/manifest";
import { Barcode } from "@/components/manifest/Barcode";

/*
  The shape now lives in lib/registration.ts alongside the registration it is
  half of, and is re-exported here so nothing that already imports it has to
  care. The split is the point: `ManifestData` is what gets printed and shared,
  `Registration` is that plus the email — which never reaches this component.
*/
export type { ManifestData } from "@/lib/registration";
import type { ManifestData } from "@/lib/registration";

/** Long names get a smaller setting rather than being allowed to overflow. */
function nameSize(name: string) {
  if (name.length > 20) return "text-lead";
  if (name.length > 13) return "text-[1.6rem]";
  return "text-[2.1rem]";
}

/**
 * The boarding card. A shipping label with a tech badge's manners.
 *
 * Every colour here is a solid token and every graphic is inline SVG, because
 * this node is rasterised by html-to-image — an opacity modifier or a webfont
 * barcode is exactly the sort of thing that survives on screen and disappears
 * in the export.
 */
export function ManifestCard({
  data,
  ref,
}: {
  data: ManifestData;
  ref?: Ref<HTMLDivElement>;
}) {
  const name = data.name.trim();
  const shown = name || "Your name";
  const number = manifestNumber(name || "unclaimed", data.role);
  const copy = manifest.card;

  return (
    <div
      ref={ref}
      className="w-[20.5rem] shrink-0 border-2 border-ink bg-paper font-display"
    >
      <div className="flex items-baseline justify-between bg-ink px-4 py-2.5 text-paper">
        <span className="text-small font-black uppercase tracking-tight">{copy.issuer}</span>
        <span className="font-mono text-micro uppercase tracking-[0.18em]">{site.year}</span>
      </div>

      <div className="flex items-center justify-between border-b-2 border-ink px-4 py-1.5 font-mono text-micro uppercase tracking-[0.14em] text-slate">
        <span>{copy.port}</span>
        <span>
          {copy.manifestLabel} <span className="text-ink">{number}</span>
        </span>
      </div>

      <div className="px-4 pb-4 pt-5">
        <p className="font-mono text-micro uppercase tracking-[0.18em] text-slate">Passenger</p>
        <p
          className={`mt-1.5 font-black uppercase leading-[0.92] tracking-[-0.03em] ${nameSize(shown)} ${
            name ? "text-ink" : "text-slate"
          }`}
          style={{ overflowWrap: "anywhere" }}
        >
          {shown}
        </p>
      </div>

      {/* Perforation. */}
      <div aria-hidden="true" className="border-t-2 border-dashed border-ink" />

      <div className="grid grid-cols-[auto_1fr]">
        <div className="border-r-2 border-ink px-4 py-3">
          <p className="font-mono text-micro uppercase tracking-[0.18em] text-slate">
            {copy.roleLabel}
          </p>
          <p className="mt-1.5 text-body font-black uppercase tracking-tight">{data.role}</p>
        </div>

        <div className="px-4 py-3">
          <p className="font-mono text-micro uppercase tracking-[0.18em] text-slate">
            {copy.skillsLabel}
          </p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {data.skills.length > 0 ? (
              data.skills.map((skill) => (
                <li
                  key={skill}
                  className="border-2 border-ink bg-apricot px-1.5 py-0.5 text-meta font-bold uppercase tracking-tight"
                >
                  {skill}
                </li>
              ))
            ) : (
              <li className="text-small font-bold uppercase tracking-tight text-slate">
                Empty hold
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="relative border-y-2 border-ink px-4 py-3.5">
        <Barcode seed={`${number}|${shown}`} className="h-9 w-full" />
        <p className="mt-1.5 font-mono text-micro uppercase tracking-[0.3em] text-slate">
          {number}
        </p>

        <span
          aria-hidden="true"
          className="absolute right-3 top-2 rotate-[-11deg] border-[3px] border-harbour px-2 py-1 text-center font-display text-micro font-black uppercase leading-tight tracking-[0.14em] text-harbour"
        >
          <span className="block border-y border-harbour py-0.5">{copy.stamp}</span>
        </span>
      </div>

      {/* Paper on harbour, not ink: ink on this blue is 2.67:1 and would fail.
          The ember fill on the same card takes the opposite foreground. */}
      <div className="bg-harbour px-4 py-3">
        <p className="font-mono text-micro uppercase tracking-[0.18em] text-paper">
          {copy.bannerLabel}
        </p>
        <p className="mt-0.5 text-[1.6rem] font-black uppercase leading-none tracking-[-0.03em] text-paper">
          {data.lookingFor}
        </p>
      </div>

      <p className="border-t-2 border-ink px-4 py-2 font-mono text-micro uppercase tracking-[0.16em] text-slate">
        {copy.footnote}
      </p>
    </div>
  );
}
