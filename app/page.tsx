import { Canvas } from "@/components/canvas/Canvas";
import { IntroGate } from "@/components/intro/IntroGate";
import { LiveRoom } from "@/components/live/LiveRoom";
import { RolePrompt } from "@/components/live/RolePrompt";
import { DryDock } from "@/components/zones/DryDock";
import { Shipyard } from "@/components/zones/Shipyard";
import { SettingSail } from "@/components/zones/SettingSail";

/**
 * The intro plate sits over the canvas and hands over to it. Everything inside
 * the gate is inert until the plate lifts, so the form in zone three is never
 * tabbable while it is hidden behind a full-screen backdrop.
 *
 * One child per zone, in the order declared in content/canvas.ts.
 */
export default function HomePage() {
  return (
    <>
      {/*
        Straight to the thing being asked for, rather than to the zone that
        mentions it. Registration is a page now, so the shortest keyboard route
        to it is a link — panning three zones to reach a button that leads
        somewhere else is a worse answer than going there.
      */}
      <a
        href="/eoi"
        className="press sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:border-2 focus:border-ink focus:bg-apricot focus:px-4 focus:py-2 focus:font-mono focus:text-xs focus:uppercase"
      >
        Skip to registration
      </a>
      <IntroGate>
        <LiveRoom>
          <RolePrompt />
          <Canvas>
            <DryDock />
            <Shipyard />
            <SettingSail />
          </Canvas>
        </LiveRoom>
      </IntroGate>
    </>
  );
}
