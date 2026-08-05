import { shipyard } from "@/content/canvas";

/** Zone 2. The Kanban board lands in step 4. */
export function Shipyard() {
  return (
    <div className="flex h-full flex-col justify-center gap-6 p-6 md:p-14">
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink/60">
        {shipyard.kicker}
      </p>
      <h2 className="font-display text-[clamp(2.2rem,5vw,4.5rem)] font-black uppercase leading-[0.9] tracking-[-0.04em]">
        {shipyard.headline}
      </h2>
      <p className="max-w-[46ch] text-lg leading-snug">{shipyard.subtext}</p>
      <ul className="flex flex-wrap gap-3">
        {shipyard.columns.map((column) => (
          <li
            key={column.id}
            className="border-2 border-ink bg-paper px-4 py-3 font-display text-sm font-bold uppercase shadow-hard"
          >
            {column.title}
            <span className="ml-2 font-mono text-[10px] font-normal tracking-[0.14em] text-ink/60">
              {column.time}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
