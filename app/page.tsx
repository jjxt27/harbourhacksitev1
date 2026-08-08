import { Canvas } from "@/components/canvas/Canvas";
import { LiveRoom } from "@/components/live/LiveRoom";
import { RolePrompt } from "@/components/live/RolePrompt";
import { DryDock } from "@/components/zones/DryDock";
import { Shipyard } from "@/components/zones/Shipyard";
import { SettingSail } from "@/components/zones/SettingSail";

/** One child per zone, in the order declared in content/canvas.ts. */
export default function HomePage() {
  return (
    <LiveRoom>
      <RolePrompt />
      <Canvas>
        <DryDock />
        <Shipyard />
        <SettingSail />
      </Canvas>
    </LiveRoom>
  );
}
