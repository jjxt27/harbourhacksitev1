"use client";

import { X } from "lucide-react";
import { useRef } from "react";
import { MAX_CARGO, containers, customs, type ContainerId } from "@/content/customs";
import { Crate } from "@/components/customs/Crate";

type CargoLoaderProps = {
  cargo: readonly ContainerId[];
  error?: string;
  errorId: string;
  onLoad: (id: ContainerId) => void;
  onUnload: (id: ContainerId) => void;
  onToggle: (id: ContainerId, loaded: boolean) => void;
  onRefused: () => void;
  disabled: boolean;
};

/** Part B — the yard, and the barge you load it onto. */
export function CargoLoader({
  cargo,
  error,
  errorId,
  onLoad,
  onUnload,
  onToggle,
  onRefused,
  disabled,
}: CargoLoaderProps) {
  const bargeRef = useRef<HTMLDivElement>(null);
  const full = cargo.length >= MAX_CARGO;
  const loaded = containers.filter((container) => cargo.includes(container.id));

  return (
    <section aria-labelledby="cargo-title" className="grid gap-4">
      <div>
        <h3
          id="cargo-title"
          className="font-display text-heading font-black uppercase leading-none tracking-[-0.03em]"
        >
          {customs.loaderTitle}
        </h3>
        <p className="mt-2 max-w-[52ch] text-small leading-snug text-slate">
          {customs.loaderHint}
        </p>
      </div>

      <div
        className="flex flex-wrap gap-2.5"
        aria-describedby={error ? errorId : undefined}
      >
        {containers.map((container) => {
          const isLoaded = cargo.includes(container.id);
          return (
            <Crate
              key={container.id}
              container={container}
              loaded={isLoaded}
              blocked={!isLoaded && (full || disabled)}
              bargeRef={bargeRef}
              onToggle={() => {
                if (disabled) return;
                if (!isLoaded && full) return onRefused();
                onToggle(container.id, isLoaded);
              }}
              onDropOnBarge={() => {
                if (disabled) return;
                if (full) return onRefused();
                onLoad(container.id);
              }}
              onMissBarge={onRefused}
            />
          );
        })}
      </div>

      {/* The barge. `data-no-pan` so a drag that starts on it does not take the
          camera with it. */}
      <div
        ref={bargeRef}
        data-no-pan=""
        className={`relative border-2 border-dashed p-4 transition-colors ${
          error ? "border-alert bg-alert/5" : "border-ink bg-paper-off"
        }`}
      >
        <div className="flex items-baseline justify-between gap-3">
          <p className="font-display text-meta font-black uppercase tracking-[0.14em]">
            {customs.bargeLabel}
          </p>
          <p className="font-mono text-meta uppercase tracking-[0.14em] text-slate">
            {cargo.length}/{MAX_CARGO}
          </p>
        </div>

        <ul className="mt-3 flex min-h-[3.75rem] flex-wrap items-start gap-2.5">
          {loaded.length === 0 ? (
            <li className="self-center font-mono text-small uppercase tracking-[0.12em] text-slate">
              {customs.bargeEmpty}
            </li>
          ) : (
            loaded.map((container) => (
              <li key={container.id}>
                <button
                  type="button"
                  onClick={() => onUnload(container.id)}
                  disabled={disabled}
                  className="press flex items-center gap-2 border-2 border-ink bg-highlighter px-2.5 py-2 font-display text-small font-black uppercase tracking-tight disabled:opacity-50"
                >
                  <span className="font-mono text-micro tracking-[0.16em] opacity-70">
                    {container.code}
                  </span>
                  {container.label}
                  <X aria-hidden="true" className="size-3.5" strokeWidth={3} />
                  <span className="sr-only">— {customs.unloadHint}</span>
                </button>
              </li>
            ))
          )}
        </ul>

        {full ? (
          <p className="mt-3 font-mono text-meta uppercase tracking-[0.12em] text-slate">
            {customs.bargeFull}
          </p>
        ) : null}
      </div>

      {/* One live region for the whole loader, so a load, an unload and a
          refusal all announce through the same channel in order. */}
      <p aria-live="polite" className="sr-only">
        {loaded.length === 0
          ? customs.bargeEmpty
          : `On the barge: ${loaded.map((container) => container.label).join(", ")}.`}
      </p>

      {error ? (
        <p
          id={errorId}
          className="font-mono text-meta uppercase tracking-[0.1em] text-alert"
        >
          {error}
        </p>
      ) : null}
    </section>
  );
}
