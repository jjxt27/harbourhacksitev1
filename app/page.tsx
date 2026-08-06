import { Boot } from "@/components/Boot";
import { HarbourScene } from "@/components/art/HarbourScene";
import { Grain } from "@/components/art/Grain";
import { Deck } from "@/components/deck/Deck";
import { Brief } from "@/components/sections/Brief";
import { Weekend } from "@/components/sections/Weekend";
import { Register } from "@/components/sections/Register";

/**
 * The site behind the intro.
 *
 * One chapter per zone, in the order declared in content/canvas.ts. The scene
 * and the grain sit behind everything and never move, so panning the deck reads
 * as travelling along one harbour rather than as changing slides.
 */
export default function HomePage() {
  return (
    <>
      <Boot />
      <HarbourScene />
      <div className="scene-veil" aria-hidden="true" />
      <Grain />

      <main>
        <Deck>
          <Brief />
          <Weekend />
          <Register />
        </Deck>
      </main>
    </>
  );
}
