import type { Ref } from "react";
import { manifest, site, type LookingFor, type Role, type Skill } from "@/content/canvas";
import { manifestNumber } from "@/lib/manifest";
import { Barcode } from "@/components/manifest/Barcode";

export type ManifestData = {
  name: string;
  role: Role;
  skills: readonly Skill[];
  lookingFor: LookingFor;
};

/** Long names get a smaller setting rather than being allowed to overflow. */
function nameSize(name: string) {
  if (name.length > 20) return "text-[1.5rem]";
  if (name.length > 13) return "text-[2rem]";
  return "text-[2.6rem]";
}

/**
 * The boarding pass.
 *
 * Every colour is a literal hex and every graphic is inline SVG, because this
 * node is rasterised by html-to-image — a CSS custom property resolves fine on
 * screen and can come out unset in the clone, and an opacity modifier is
 * exactly the sort of thing that survives here and vanishes in the export.
 *
 * It is a printed document rather than a screen component, so it keeps its own
 * type sizes: this is the one artefact on the site that leaves it, and it has
 * to hold together at 3x on someone else's timeline.
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
      className="w-[21rem] shrink-0 font-sans"
      style={{ background: "#061e3c", border: "1px solid rgba(248,246,240,0.22)" }}
    >
      <div
        className="flex items-baseline justify-between px-6 pb-4 pt-5"
        style={{ borderBottom: "1px solid rgba(248,246,240,0.14)" }}
      >
        <span
          className="font-display text-[1.3rem] font-bold leading-none"
          style={{ color: "#f8f6f0", letterSpacing: "-0.03em" }}
        >
          {copy.issuer}
        </span>
        <span
          className="text-[0.6rem] font-medium uppercase"
          style={{ color: "#8d99ac", letterSpacing: "0.28em" }}
        >
          {site.year}
        </span>
      </div>

      <div
        className="flex items-center justify-between px-6 py-3 text-[0.6rem] font-medium uppercase"
        style={{ color: "#8d99ac", letterSpacing: "0.2em", borderBottom: "1px solid rgba(248,246,240,0.14)" }}
      >
        <span>{copy.port}</span>
        <span style={{ color: "#c8a24a" }}>{number}</span>
      </div>

      <div className="px-6 pb-6 pt-7">
        <p
          className="text-[0.6rem] font-medium uppercase"
          style={{ color: "#8d99ac", letterSpacing: "0.28em" }}
        >
          Passenger
        </p>
        <p
          className={`mt-3 font-display font-bold ${nameSize(shown)}`}
          style={{
            color: name ? "#f8f6f0" : "#8d99ac",
            letterSpacing: "-0.035em",
            lineHeight: 0.9,
            overflowWrap: "anywhere",
          }}
        >
          {shown}
        </p>
      </div>

      <div className="grid grid-cols-2" style={{ borderTop: "1px solid rgba(248,246,240,0.14)" }}>
        <div className="px-6 py-4" style={{ borderRight: "1px solid rgba(248,246,240,0.14)" }}>
          <p
            className="text-[0.6rem] font-medium uppercase"
            style={{ color: "#8d99ac", letterSpacing: "0.28em" }}
          >
            {copy.roleLabel}
          </p>
          <p className="mt-2 font-display text-[1.15rem] font-semibold" style={{ color: "#f8f6f0" }}>
            {data.role}
          </p>
        </div>

        <div className="px-6 py-4">
          <p
            className="text-[0.6rem] font-medium uppercase"
            style={{ color: "#8d99ac", letterSpacing: "0.28em" }}
          >
            {copy.skillsLabel}
          </p>
          <p
            className="mt-2 font-display text-[1.15rem] font-semibold leading-tight"
            style={{ color: data.skills.length ? "#f8f6f0" : "#8d99ac" }}
          >
            {data.skills.length > 0 ? data.skills.join(" · ") : "—"}
          </p>
        </div>
      </div>

      <div className="px-6 py-4" style={{ borderTop: "1px solid rgba(248,246,240,0.14)" }}>
        <p
          className="text-[0.6rem] font-medium uppercase"
          style={{ color: "#8d99ac", letterSpacing: "0.28em" }}
        >
          {copy.bannerLabel}
        </p>
        <p className="mt-2 font-display text-[1.6rem] font-bold leading-none" style={{ color: "#c8a24a", letterSpacing: "-0.03em" }}>
          {data.lookingFor}
        </p>
      </div>

      <div className="px-6 pb-5 pt-4" style={{ borderTop: "1px solid rgba(248,246,240,0.14)" }}>
        <Barcode seed={`${number}|${shown}`} className="h-8 w-full" />
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <p
            className="text-[0.58rem] font-medium uppercase"
            style={{ color: "#8d99ac", letterSpacing: "0.2em" }}
          >
            {copy.footnote}
          </p>
          <p
            className="whitespace-nowrap text-[0.58rem] font-medium uppercase"
            style={{ color: "#c8a24a", letterSpacing: "0.2em" }}
          >
            {copy.stamp}
          </p>
        </div>
      </div>
    </div>
  );
}
