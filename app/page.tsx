import { Canvas } from "@/components/canvas/Canvas";
import { DryDock } from "@/components/zones/DryDock";
import { Shipyard } from "@/components/zones/Shipyard";
import { SettingSail } from "@/components/zones/SettingSail";

/** One child per zone, in the order declared in content/canvas.ts. */
export default function HomePage() {
  return (
    <Canvas>
      <DryDock />
      <Shipyard />
      <SettingSail />
    </Canvas>
  );
}
