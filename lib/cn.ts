/** Join class names. Deliberately not clsx — this is all we need. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
