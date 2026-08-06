/**
 * The yard's sound effects, synthesised rather than sampled.
 *
 * Two reasons there are no audio files here. Practically, a metallic clank is a
 * noise burst through a band-pass plus a couple of detuned partials, which is
 * about forty lines — cheaper than shipping and decoding a sprite. Structurally,
 * it means the sound scales with the interaction: the crane's clank is the same
 * function as the crate's, an octave down and twice as long.
 *
 * Nothing here runs until the reader turns sound on, and turning it on is the
 * gesture that unlocks the AudioContext.
 */

export type Clank = "crate" | "drop" | "crane" | "deny";

type Recipe = {
  /** Fundamental of the metallic ring, in Hz. */
  pitch: number;
  /** Seconds. */
  decay: number;
  /** Centre of the band-pass on the noise transient. */
  body: number;
  gain: number;
};

const RECIPES: Record<Clank, Recipe> = {
  crate: { pitch: 320, decay: 0.24, body: 2400, gain: 0.5 },
  drop: { pitch: 190, decay: 0.42, body: 1500, gain: 0.7 },
  crane: { pitch: 104, decay: 0.9, body: 900, gain: 0.85 },
  deny: { pitch: 128, decay: 0.2, body: 600, gain: 0.6 },
};

let context: AudioContext | null = null;
let noise: AudioBuffer | null = null;

function ensure(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!context) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    context = new Ctor();
  }
  // Browsers suspend the context when it is created outside a gesture, and
  // again when the tab is backgrounded.
  if (context.state === "suspended") void context.resume();
  return context;
}

/** A quarter-second of white noise, generated once and reused as the transient. */
function transient(ctx: AudioContext): AudioBuffer {
  if (noise) return noise;
  const frames = Math.floor(ctx.sampleRate * 0.25);
  const buffer = ctx.createBuffer(1, frames, ctx.sampleRate);
  const channel = buffer.getChannelData(0);
  for (let i = 0; i < frames; i += 1) channel[i] = Math.random() * 2 - 1;
  noise = buffer;
  return buffer;
}

export function playClank(kind: Clank) {
  const ctx = ensure();
  if (!ctx) return;

  const { pitch, decay, body, gain } = RECIPES[kind];
  const now = ctx.currentTime;

  const out = ctx.createGain();
  out.gain.value = gain * 0.35;
  out.connect(ctx.destination);

  // The strike: filtered noise, gone in a few tens of milliseconds.
  const hit = ctx.createBufferSource();
  hit.buffer = transient(ctx);
  const band = ctx.createBiquadFilter();
  band.type = "bandpass";
  band.frequency.value = body;
  band.Q.value = 1.4;
  const hitGain = ctx.createGain();
  hitGain.gain.setValueAtTime(1, now);
  hitGain.gain.exponentialRampToValueAtTime(0.001, now + decay * 0.35);
  hit.connect(band).connect(hitGain).connect(out);
  hit.start(now);
  hit.stop(now + decay);

  // The ring: three inharmonic partials, which is what stops it sounding like
  // a musical note and starts it sounding like a steel box.
  [1, 2.37, 3.71].forEach((ratio, index) => {
    const osc = ctx.createOscillator();
    osc.type = index === 0 ? "triangle" : "sine";
    osc.frequency.value = pitch * ratio;
    const level = ctx.createGain();
    const peak = 0.5 / (index + 1.4);
    level.gain.setValueAtTime(peak, now);
    level.gain.exponentialRampToValueAtTime(0.0001, now + decay * (1 - index * 0.18));
    osc.connect(level).connect(out);
    osc.start(now);
    osc.stop(now + decay + 0.05);
  });
}
