import { containers, type ContainerId } from "@/content/customs";

/**
 * A small, stable string hash.
 *
 * Everything derived from it — the manifest number, the barcode — has to be
 * deterministic: the card is rendered live as the reader types, and a value
 * that reshuffled on every keystroke would read as broken rather than as a
 * document being filled in.
 */
export function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * The class letters in the middle of a manifest number, read off the cargo:
 * all build containers, all market containers, or a mixed load.
 */
export function cargoClass(cargo: readonly ContainerId[]): string {
  if (cargo.length === 0) return "STD";
  const classes = new Set(
    cargo.map((id) => containers.find((container) => container.id === id)?.class),
  );
  if (classes.size > 1) return "MIX";
  return classes.has("build") ? "BLD" : "MKT";
}

/** Container-marking style: HH26-BLD-4821. */
export function manifestNumber(name: string, cargo: readonly ContainerId[]): string {
  const code = cargoClass(cargo);
  const seed = hash(`${name.trim().toLowerCase()}|${[...cargo].sort().join(",")}`);
  const digits = String(seed % 10000).padStart(4, "0");
  return `HH26-${code}-${digits}`;
}

/**
 * The number painted on the side of a container, e.g. `CRG-417`.
 *
 * Derived from the label rather than from a counter, so a card keeps its
 * markings wherever it ends up in the schedule and two builds of the site never
 * disagree about which box is which.
 */
export function crateCode(label: string, prefix = "CRG"): string {
  return `${prefix}-${String((hash(label) % 900) + 100)}`;
}

/**
 * Bar widths for the barcode, derived from the same seed.
 *
 * Not a real symbology — it encodes nothing and is decorative, which is why it
 * is drawn as plain rects rather than set in a barcode font. A font would not
 * survive the PNG export.
 */
export function barcodeBars(seed: string, count = 46): number[] {
  let h = hash(seed);
  const bars: number[] = [];
  for (let i = 0; i < count; i += 1) {
    h = Math.imul(h ^ (h >>> 15), 2246822507);
    h = (h ^ (h >>> 13)) >>> 0;
    bars.push((h % 3) + 1);
  }
  return bars;
}
