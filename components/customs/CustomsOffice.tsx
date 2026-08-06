"use client";

import { Anchor, Download, Loader2, Pencil, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useId, useRef } from "react";
import { customs, type ContainerId } from "@/content/customs";
import { submitDeclaration } from "@/lib/customs";
import { downloadPass, passFilename, renderPass } from "@/lib/passExport";
import { useDeclaration, validate } from "@/hooks/useDeclaration";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { useSound } from "@/hooks/useSound";
import { DeckPanel } from "@/components/map/DeckPanel";
import { DeclarationForm } from "@/components/customs/DeclarationForm";
import { CargoLoader } from "@/components/customs/CargoLoader";
import { BoardingPass } from "@/components/customs/BoardingPass";

/**
 * Dock 03 — the Customs Office.
 *
 * Declaration on the left, cargo loader under it, boarding pass on the right.
 * The whole dock is one `<form>`, so Enter submits from any input and the
 * browser's own validation and autofill still apply; the crane is its submit
 * button rather than a click handler pretending to be one.
 */
export function CustomsOffice() {
  const { state, dispatch, setField, load, unload, toggle } = useDeclaration();
  const sound = useSound();
  const reduced = usePrefersReducedMotion();

  const passRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLParagraphElement>(null);
  const idBase = useId();
  const cargoErrorId = `${idBase}-cargo-error`;

  const busy = state.phase === "clearing" || state.phase === "printing";
  const printed = state.phase === "done" || state.phase === "jammed";
  const outstanding = validate(state.fields, state.cargo);
  const clear = Object.keys(outstanding).length === 0;

  const onCrane = useCallback(async () => {
    if (busy) return;

    const errors = validate(state.fields, state.cargo);
    dispatch({ type: "submit" });

    if (Object.keys(errors).length > 0) {
      sound.play("deny");
      // Send focus to the first thing that is actually wrong, in document
      // order, rather than announcing a list and leaving them to find it.
      const first = ["name", "email", "university", "linkedin"].find((name) => name in errors);
      const target = first
        ? document.getElementById(`${idBase}-${first}`)
        : document.getElementById(cargoErrorId);
      target?.focus?.();
      target?.scrollIntoView?.({ block: "center", behavior: reduced ? "auto" : "smooth" });
      return;
    }

    sound.play("crane");
    const result = await submitDeclaration({ ...state.fields, cargo: state.cargo });
    if (!result.ok) {
      dispatch({ type: "rejected" });
      sound.play("deny");
      return;
    }
    dispatch({ type: "clearedCustoms", manifestNo: result.manifestNo });
  }, [busy, cargoErrorId, dispatch, idBase, reduced, sound, state.cargo, state.fields]);

  // Print the pass once it is on screen. This is the one thing here that has to
  // be an effect: the node being rasterised does not exist until the commit
  // that reveals it, so the work cannot run inside the handler that caused it.
  useEffect(() => {
    if (state.phase !== "printing") return;
    const node = passRef.current;
    if (!node) return;

    let live = true;

    void (async () => {
      try {
        const url = await renderPass(node);
        if (!live) return;
        const saved = downloadPass(url, passFilename(state.fields.name));
        dispatch(saved ? { type: "printed", url } : { type: "jammed", url });
      } catch {
        // Kept as `jammed` rather than a hard failure: the pass is on screen and
        // correct, it is only the file that did not appear.
        if (live) dispatch({ type: "jammed", url: null });
      }
    })();

    return () => {
      live = false;
    };
  }, [dispatch, state.fields.name, state.phase]);

  // Confetti and a clank when the file lands, and only then.
  useEffect(() => {
    if (state.phase !== "done") return;
    sound.play("drop");
    resultRef.current?.focus();
    if (reduced) return;

    void (async () => {
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 90,
        spread: 78,
        startVelocity: 42,
        origin: { y: 0.7 },
        colors: ["#ff4f00", "#e2ff31", "#008542", "#0a0a0a"],
        disableForReducedMotion: true,
      });
    })();
  }, [reduced, sound, state.phase]);

  const onLoad = useCallback(
    (id: ContainerId) => {
      load(id);
      sound.play("drop");
    },
    [load, sound],
  );

  return (
    <>
      {/* Painted on the loading dock, lying in the ground plane. */}
      <p
        aria-hidden="true"
        className="ground-paint stencil absolute whitespace-nowrap font-display font-black uppercase leading-none tracking-[-0.02em] text-ink opacity-20"
        style={{ left: 120, top: 300, fontSize: 190 }}
      >
        {customs.headline}
      </p>

      {/* The terminal itself stands up. A declaration form lying in the ground
          plane is not styled badly, it is unusable — this is exactly the case
          the billboard exists for. */}
      <DeckPanel x={110} y={1180} width={1420} className="bg-highlighter">
      <div className="px-7 py-6">
      <header className="mb-6">
        <p className="font-mono text-meta uppercase tracking-[0.2em] text-slate">
          {customs.kicker}
        </p>
        <p className="mt-2 max-w-[42ch] -rotate-1 border-2 border-ink bg-paper px-4 py-3 font-hand text-lead leading-snug shadow-hard-sm">
          {customs.subtext}
        </p>
      </header>

      <div className="grid gap-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12">
        {/* `data-no-pan` covers the whole working area: selecting text in an
            input must not drag the harbour out from under it. */}
        <form
          data-no-pan=""
          noValidate
          onSubmit={(event) => {
            event.preventDefault();
            void onCrane();
          }}
          className="grid gap-8"
        >
          <fieldset disabled={busy || printed} className="grid gap-8 border-0 p-0">
            <DeclarationForm
              fields={state.fields}
              errors={state.errors}
              idBase={idBase}
              onChange={setField}
              disabled={busy || printed}
            />

            <CargoLoader
              cargo={state.cargo}
              error={state.errors.cargo}
              errorId={cargoErrorId}
              onLoad={onLoad}
              onUnload={unload}
              onToggle={toggle}
              onRefused={() => sound.play("deny")}
              disabled={busy || printed}
            />
          </fieldset>

          {!printed ? (
            <div className="flex flex-wrap items-center gap-x-6 gap-y-4">
              <Crane busy={busy} clear={clear} phase={state.phase} />
              {!clear ? (
                <p className="max-w-[26ch] font-mono text-meta uppercase leading-relaxed tracking-[0.12em] text-slate">
                  {customs.craneBlocked}
                </p>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              {state.passUrl ? (
                <button
                  type="button"
                  onClick={() =>
                    state.passUrl &&
                    downloadPass(state.passUrl, passFilename(state.fields.name))
                  }
                  className="press inline-flex items-center gap-2.5 border-2 border-ink bg-ink px-5 py-3 font-display text-small font-black uppercase tracking-tight text-paper"
                >
                  <Download aria-hidden="true" className="size-4" strokeWidth={3} />
                  {customs.downloadAgain}
                </button>
              ) : (
                // A jam with no pass to show. The only useful control is another
                // go at the rasteriser — offering a download here would point at
                // a file that does not exist.
                <button
                  type="button"
                  onClick={() => dispatch({ type: "retryPrint" })}
                  className="press inline-flex items-center gap-2.5 border-2 border-ink bg-orange px-5 py-3 font-display text-small font-black uppercase tracking-tight text-ink"
                >
                  <RefreshCw aria-hidden="true" className="size-4" strokeWidth={3} />
                  {customs.printAgain}
                </button>
              )}

              <button
                type="button"
                onClick={() => dispatch({ type: "amend" })}
                className="inline-flex items-center gap-2 border-b-2 border-ink pb-0.5 font-mono text-meta uppercase tracking-[0.14em]"
              >
                <Pencil aria-hidden="true" className="size-3.5" strokeWidth={2.5} />
                {customs.amend}
              </button>
            </div>
          )}

          <p
            ref={resultRef}
            tabIndex={-1}
            aria-live="polite"
            className="font-mono text-meta uppercase leading-relaxed tracking-[0.12em] outline-none"
          >
            {state.phase === "done" ? (
              <span className="text-ink">
                {customs.cleared} {customs.clearedNote}
              </span>
            ) : state.phase === "jammed" ? (
              <span className="text-alert">
                {state.passUrl ? customs.errors.print : customs.errors.printRetry}
              </span>
            ) : state.phase === "rejected" ? (
              <span className="text-alert">{customs.errors.submit}</span>
            ) : null}
          </p>
        </form>

        <div className="lg:sticky lg:top-6">
          <h3 className="mb-3 font-mono text-meta uppercase tracking-[0.18em] text-slate">
            {customs.pass.label}
          </h3>

          {state.manifestNo ? (
            <BoardingPass
              ref={passRef}
              data={{
                name: state.fields.name,
                university: state.fields.university,
                cargo: state.cargo,
                manifestNo: state.manifestNo,
              }}
            />
          ) : (
            <PassPlaceholder />
          )}
        </div>
      </div>
      </div>
      </DeckPanel>
    </>
  );
}

/**
 * The crane.
 *
 * Inert until the declaration clears, but `aria-disabled` rather than
 * `disabled`: a real `disabled` button drops out of the tab order and refuses
 * to say why it cannot be pressed, which on the one control that completes a
 * registration is a dead end. This one stays focusable, announces its state,
 * and pressing it shows exactly what is outstanding.
 */
function Crane({
  busy,
  clear,
  phase,
}: {
  busy: boolean;
  clear: boolean;
  phase: string;
}) {
  const label =
    phase === "clearing"
      ? customs.cranePending
      : phase === "printing"
        ? customs.cranePrinting
        : customs.crane;

  const live = clear && !busy;

  return (
    <button
      type="submit"
      aria-disabled={!clear || busy}
      // A machined switch, not a rectangle of colour: lit top edge, shadowed
      // bottom, and the whole face travels 4px into its own shadow on press.
      className={`switch relative inline-flex items-center gap-3 px-7 py-4 font-display text-lead font-black uppercase tracking-tight ${
        live ? "!bg-orange text-ink" : "text-paper"
      }`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-x-0 top-0 h-2 ${live ? "hazard" : "bg-ink/30"}`}
      />
      {busy ? (
        <Loader2 aria-hidden="true" className="size-5 animate-spin" strokeWidth={3} />
      ) : (
        <Anchor aria-hidden="true" className="size-5" strokeWidth={3} />
      )}
      {label}
    </button>
  );
}

/** What sits in the pass slot before customs has cleared anything. */
function PassPlaceholder() {
  return (
    <div className="grid h-[27rem] w-[20.5rem] shrink-0 place-items-center border-2 border-dashed border-ink bg-paper/40 px-8 text-center">
      <p className="font-mono text-meta uppercase leading-relaxed tracking-[0.16em] text-slate">
        Awaiting clearance
        <span className="mt-2 block text-ink">
          Your pass prints here and downloads itself
        </span>
      </p>
    </div>
  );
}
