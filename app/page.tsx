import { Crossing } from "@/components/experience/Crossing";
import { Fit } from "@/components/sections/Fit";
import { Trust } from "@/components/sections/Trust";
import { FinalCta } from "@/components/sections/FinalCta";

export default function HomePage() {
  return (
    <>
      <Crossing />
      <Fit />
      <Trust />
      <FinalCta />
    </>
  );
}
