import type { Role } from "@/content/canvas";

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

const ROLE_CODE: Record<Role, string> = {
  Tech: "TCH",
  Biz: "BIZ",
  Design: "DSN",
};

/** Container-marking style: HH26-TCH-4821. */
export function manifestNumber(name: string, role: Role): string {
  const seed = hash(`${name.trim().toLowerCase()}|${role}`);
  const digits = String(seed % 10000).padStart(4, "0");
  return `HH26-${ROLE_CODE[role]}-${digits}`;
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
