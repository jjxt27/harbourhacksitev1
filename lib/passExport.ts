/** Ceiling on rasterising the pass, in ms. */
const EXPORT_TIMEOUT = 12000;

/** Ceiling on fetching and inlining the webfonts, separately from the render. */
const FONT_TIMEOUT = 6000;

/** 3x on a 328px card is a ~984px PNG — enough for a LinkedIn post. */
const PIXEL_RATIO = 3;

/**
 * Rasterisation can hang rather than reject. A webfont that never resolves, or
 * a tab that is not compositing, leaves the promise pending forever, and the
 * button sits on "printing" with no way back.
 */
function withTimeout<T>(work: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    work,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("export timed out")), ms),
    ),
  ]);
}

/**
 * One frame, or 60ms, whichever comes first.
 *
 * `requestAnimationFrame` does not fire in a backgrounded tab, and switching
 * tabs while the pass prints is an entirely normal thing to do. Waiting on rAF
 * alone would stall until the reader came back and then time out on them.
 */
const nextFrame = () =>
  new Promise<void>((resolve) => {
    requestAnimationFrame(() => resolve());
    setTimeout(resolve, 60);
  });

/**
 * Hold until the tab is actually on screen.
 *
 * html-to-image finishes inside a `requestAnimationFrame`, so starting a render
 * in a hidden tab does not fail — it simply never returns, and the timeout
 * downstream would report a jam that never happened. Waiting is deliberately
 * unbounded: there is nobody watching a hidden tab, and deferring the work
 * costs them nothing.
 */
function whenVisible(): Promise<void> {
  if (typeof document === "undefined" || !document.hidden) return Promise.resolve();
  return new Promise((resolve) => {
    const check = () => {
      if (document.hidden) return;
      document.removeEventListener("visibilitychange", check);
      resolve();
    };
    document.addEventListener("visibilitychange", check);
  });
}

/**
 * Turn the boarding pass into a PNG data URL.
 *
 * Three things here are not optional:
 *
 *   `document.fonts.ready` — the card is set in a webfont. Rasterise before it
 *   resolves and the export silently falls back to a system font, which is the
 *   sort of bug that only ever shows up in someone else's download.
 *
 *   Two animation frames — the pass mounts in the same commit that triggers
 *   this, so without them we can measure a node the browser has not laid out.
 *
 * One thing it cannot do anything about: html-to-image resolves inside a
 * `requestAnimationFrame`, which never fires while the tab is hidden. Print,
 * switch tabs, and this stalls until the reader comes back — hence the timeout,
 * and hence the retry the caller offers when it expires with nothing to show.
 */
export async function renderPass(node: HTMLElement): Promise<string> {
  const { toPng, getFontEmbedCSS } = await import("html-to-image");

  await whenVisible();
  if (document.fonts?.ready) await document.fonts.ready;
  await nextFrame();
  await nextFrame();

  // Inline the webfaces ourselves, ahead of the render.
  //
  // Left to itself, `toPng` fetches every @font-face in the document while it
  // rasterises, and in WebKit it routinely finishes first — which is why the
  // usual advice is to render twice and keep the second. Doing the fetch here
  // fixes the race properly rather than papering over it, and it means the
  // fonts are fetched once instead of twice.
  //
  // If it fails or takes too long, carry on with `""`, which tells `toPng` to
  // skip fonts entirely. A pass in a fallback face beats no pass at all.
  let fontEmbedCSS = "";
  try {
    fontEmbedCSS = await withTimeout(getFontEmbedCSS(node), FONT_TIMEOUT);
  } catch {
    fontEmbedCSS = "";
  }

  return withTimeout(
    toPng(node, {
      pixelRatio: PIXEL_RATIO,
      backgroundColor: "#ffffff",
      fontEmbedCSS,
    }),
    EXPORT_TIMEOUT,
  );
}

/**
 * Ask the browser to save it.
 *
 * Returns whether the click was dispatched at all, not whether a file landed on
 * disk — nothing can tell us that. It is deliberately called from the caller's
 * failure path too, because a programmatic download this far from the original
 * click is exactly what Safari blocks.
 */
export function downloadPass(url: string, filename: string): boolean {
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.rel = "noopener";
    document.body.append(link);
    link.click();
    link.remove();
    return true;
  } catch {
    return false;
  }
}

export const passFilename = (name: string) =>
  `harbourhack-boarding-pass-${
    name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "crew"
  }.png`;
