import { settingSail } from "@/content/canvas";

/** Zone 3. The manifest generator lands in step 5. */
export function SettingSail() {
  return (
    <div className="flex h-full flex-col justify-center gap-6 p-6 md:p-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">
        {settingSail.kicker}
      </p>
      <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
        {settingSail.headline}
      </h2>
      <p className="max-w-[42ch] text-lg leading-snug">{settingSail.subtext}</p>
    </div>
  );
}
