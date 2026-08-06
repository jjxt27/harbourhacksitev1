"use client";

import { Minus, Plus, Volume2, VolumeX, Crosshair } from "lucide-react";
import { docks } from "@/content/map";
import { ZOOM } from "@/content/map";
import { site } from "@/content/canvas";
import { useSound } from "@/hooks/useSound";
import type { MapCamera } from "@/hooks/useMapCamera";

const PLATE =
  "press border-2 border-ink bg-paper font-mono text-meta uppercase tracking-[0.16em] hover:bg-highlighter";

/**
 * Everything pinned to the glass: the wordmark, the dock index, the zoom
 * controls and the sound switch.
 *
 * The dock index is not decoration. On a surface with no scrollbar it is the
 * only affordance that tells you how much there is and where you are in it,
 * and it is the fallback for anyone who cannot drag.
 */
export function MapChrome({ camera }: { camera: MapCamera }) {
  const { activeDock, goToDock, zoomBy, resetView } = camera;
  const sound = useSound();

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex items-start justify-between gap-4 p-4 md:p-5">
        <a
          href="#dry-dock"
          onClick={(event) => {
            event.preventDefault();
            goToDock(0);
          }}
          className="press pointer-events-auto border-2 border-ink bg-ink px-3 py-2 font-display text-small font-black uppercase tracking-tight text-paper"
        >
          {site.name}
          <span className="ml-2 font-mono text-meta font-normal tracking-[0.14em] text-highlighter">
            {site.year}
          </span>
        </a>

        <nav aria-label="Docks" className="pointer-events-auto hidden md:block">
          <ul className="flex border-2 border-ink bg-paper shadow-hard">
            {docks.map((dock, index) => (
              <li key={dock.id} className="border-r-2 border-ink last:border-r-0">
                <button
                  type="button"
                  onClick={() => {
                    goToDock(index);
                    sound.play("crate");
                  }}
                  aria-current={activeDock === index ? "true" : undefined}
                  className={`px-3.5 py-2 font-mono text-meta uppercase tracking-[0.16em] transition-colors ${
                    activeDock === index ? "bg-ink text-paper" : "hover:bg-highlighter"
                  }`}
                >
                  <span className="mr-1.5 opacity-60">{String(index + 1).padStart(2, "0")}</span>
                  {dock.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <div className="pointer-events-none fixed bottom-4 right-4 z-40 hidden flex-col items-end gap-3 md:flex md:bottom-5 md:right-5">
        <p className="pointer-events-none max-w-[15rem] text-right font-mono text-micro uppercase leading-relaxed tracking-[0.14em] text-paper/80">
          Drag to pan · wheel to zoom · arrows, 1–3 and +/− do the same
        </p>

        <div className="pointer-events-auto flex items-stretch gap-2">
          <button
            type="button"
            onClick={sound.toggle}
            aria-pressed={sound.on}
            className={`${PLATE} px-3 py-2`}
          >
            <span className="flex items-center gap-2">
              {sound.on ? (
                <Volume2 aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
              ) : (
                <VolumeX aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
              )}
              Sound {sound.on ? "on" : "off"}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              resetView();
              sound.play("crate");
            }}
            className={`${PLATE} px-3 py-2`}
          >
            <span className="flex items-center gap-2">
              <Crosshair aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
              Recentre
            </span>
          </button>

          <div className="flex border-2 border-ink bg-paper shadow-hard">
            <button
              type="button"
              onClick={() => zoomBy(1 / ZOOM.step)}
              aria-label="Zoom out"
              className="border-r-2 border-ink px-3 py-2 hover:bg-highlighter"
            >
              <Minus aria-hidden="true" className="size-3.5" strokeWidth={3} />
            </button>
            <button
              type="button"
              onClick={() => zoomBy(ZOOM.step)}
              aria-label="Zoom in"
              className="px-3 py-2 hover:bg-highlighter"
            >
              <Plus aria-hidden="true" className="size-3.5" strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
