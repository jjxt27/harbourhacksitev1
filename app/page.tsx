import { Route } from "@/components/experience/Route";
import { Fit } from "@/components/sections/Fit";
import { Trust } from "@/components/sections/Trust";
import { FinalCta } from "@/components/sections/FinalCta";

export default function HomePage() {
  return (
    <>
      <Route />
      <Fit />
      <Trust />
      <FinalCta />
    </>
  );
}
