import type { Ref } from "react";
import { site } from "@/content/canvas";
import { containers, customs, type ContainerId } from "@/content/customs";
import { Barcode } from "@/components/manifest/Barcode";

export type PassData = {
  name: string;
  university: string;
  cargo: readonly ContainerId[];
  manifestNo: string;
};

/** Long names get a smaller setting rather than being allowed to overflow. */
function nameSize(name: string) {
  if (name.length > 20) return "text-lead";
  if (name.length > 13) return "text-[1.6rem]";
  return "text-[2.1rem]";
}

/**
 * The boarding pass. A shipping label with a tech badge's manners.
 *
 * Built for the rasteriser, not for the screen: every colour is a solid token
 * and every graphic is inline SVG, because an opacity modifier or a webfont
 * barcode is exactly the sort of thing that survives on screen and disappears
 * in the export. The two hard-coded sizes are the one place in the codebase
 * that is allowed off the type scale — this card is a self-contained artefact
 * that leaves the site as a PNG, so it carries its own.
 *
 * The email address is collected but deliberately never printed here. The whole
 * point of the pass is that people post it publicly.
 */
export function BoardingPass({ data, ref }: { data: PassData; ref?: Ref<HTMLDivElement> }) {
  const copy = customs.pass;
  const name = data.name.trim() || "Your name";
  const origin = data.university.trim() || "TBC";
  const loaded = containers.filter((container) => data.cargo.includes(container.id));

  return (
    <div ref={ref} className="w-[20.5rem] shrink-0 border-2 border-ink bg-paper font-display">
      <div className="flex items-baseline justify-between bg-ink px-4 py-2.5 text-paper">
        <span className="text-small font-black uppercase tracking-tight">{copy.issuer}</span>
        <span className="font-mono text-micro uppercase tracking-[0.18em]">{site.year}</span>
      </div>

      <div className="flex items-center justify-between border-b-2 border-ink px-4 py-1.5 font-mono text-micro uppercase tracking-[0.14em] text-slate">
        <span>{copy.port}</span>
        <span>
          {copy.manifestLabel} <span className="text-ink">{data.manifestNo}</span>
        </span>
      </div>

      <div className="px-4 pb-4 pt-5">
        <p className="font-mono text-micro uppercase tracking-[0.18em] text-slate">
          {copy.passengerLabel}
        </p>
        <p
          className={`mt-1.5 font-black uppercase leading-[0.92] tracking-[-0.03em] ${nameSize(name)}`}
          style={{ overflowWrap: "anywhere" }}
        >
          {name}
        </p>
      </div>

      {/* Perforation. */}
      <div aria-hidden="true" className="border-t-2 border-dashed border-ink" />

      <div className="grid grid-cols-[auto_1fr]">
        <div className="border-r-2 border-ink px-4 py-3">
          <p className="font-mono text-micro uppercase tracking-[0.18em] text-slate">
            {copy.originLabel}
          </p>
          <p
            className="mt-1.5 max-w-[7.5rem] text-body font-black uppercase leading-tight tracking-tight"
            style={{ overflowWrap: "anywhere" }}
          >
            {origin}
          </p>
        </div>

        <div className="px-4 py-3">
          <p className="font-mono text-micro uppercase tracking-[0.18em] text-slate">
            {copy.cargoLabel}
          </p>
          <ul className="mt-1.5 flex flex-wrap gap-1.5">
            {loaded.map((container) => (
              <li
                key={container.id}
                className="border-2 border-ink bg-highlighter px-1.5 py-0.5 text-meta font-bold uppercase tracking-tight"
              >
                {container.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative border-y-2 border-ink px-4 py-3.5">
        <Barcode seed={`${data.manifestNo}|${name}`} className="h-9 w-full" />
        <p className="mt-1.5 font-mono text-micro uppercase tracking-[0.3em] text-slate">
          {data.manifestNo}
        </p>

        <span
          aria-hidden="true"
          className="absolute right-3 top-2 rotate-[-11deg] border-[3px] border-orange px-2 py-1 text-center font-display text-micro font-black uppercase leading-tight tracking-[0.14em] text-orange"
        >
          <span className="block border-y border-orange py-0.5">{copy.stamp}</span>
        </span>
      </div>

      <div className="bg-orange px-4 py-3">
        <p className="font-mono text-micro uppercase tracking-[0.18em] text-ink">
          {copy.bannerLabel}
        </p>
        <p className="mt-0.5 text-[1.6rem] font-black uppercase leading-none tracking-[-0.03em] text-ink">
          {copy.banner}
        </p>
      </div>

      <p className="border-t-2 border-ink px-4 py-2 font-mono text-micro uppercase tracking-[0.16em] text-slate">
        {copy.footnote}
      </p>
    </div>
  );
}
