import { MapCanvas } from "@/components/map/MapCanvas";
import { LiveRoom } from "@/components/live/LiveRoom";
import { RolePrompt } from "@/components/live/RolePrompt";
import { DryDock } from "@/components/zones/DryDock";
import { Shipyard } from "@/components/zones/Shipyard";
import { CustomsOffice } from "@/components/customs/CustomsOffice";

/** One child per dock, in the order declared in content/map.ts. */
export default function HomePage() {
  return (
    <LiveRoom>
      <RolePrompt />
      <MapCanvas>
        <DryDock />
        <Shipyard />
        <CustomsOffice />
      </MapCanvas>
    </LiveRoom>
  );
}
