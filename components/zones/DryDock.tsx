import { dryDock } from "@/content/canvas";

/** Zone 1. Content lands in step 4; this is the structural shell. */
export function DryDock() {
  return (
    <div className="flex h-full flex-col justify-center gap-8 p-6 md:p-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">
        {dryDock.kicker}
      </p>
      <h1 className="font-display text-[clamp(3rem,9vw,9rem)] font-black uppercase leading-[0.84] tracking-[-0.045em]">
        {dryDock.headline.map((line, i) => (
          <span key={line} className="block">
            {i === dryDock.headline.length - 1 ? (
              <mark className="bg-highlighter px-2">{line}</mark>
            ) : (
              line
            )}
          </span>
        ))}
      </h1>
      <p className="max-w-[46ch] text-lg leading-snug md:text-xl">{dryDock.subtext}</p>
    </div>
  );
}
