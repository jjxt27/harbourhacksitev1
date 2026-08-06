import { Boot } from "@/components/Boot";
import { HarbourScene } from "@/components/art/HarbourScene";
import { Grain } from "@/components/art/Grain";
import { Hero } from "@/components/sections/Hero";

/**
 * The site behind the intro.
 *
 * A vertical read over one fixed painting, rather than the pannable canvas this
 * replaced. The scene and the grain are siblings of the content and never
 * scroll — the sections travel across the harbour, which is what holds the
 * whole page in a single evening.
 */
export default function HomePage() {
  return (
    <>
      <Boot />
      <HarbourScene />
      <div className="scene-veil" aria-hidden="true" />
      <Grain />

      <main>
        <Hero />
      </main>
    </>
  );
}
