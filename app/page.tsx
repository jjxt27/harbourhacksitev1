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
  );
}
