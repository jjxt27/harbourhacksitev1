"use client";

import Link from "next/link";
import { createContext, useContext, type ReactNode } from "react";
import { useIsDesktop } from "@/hooks/useMediaQuery";

type MapNav = {
  /** Fly the camera to a dock by id. */
  goToDockId: (id: string) => void;
  activeDock: number;
};

const MapContext = createContext<MapNav>({ goToDockId: () => {}, activeDock: 0 });

export function MapProvider({ value, children }: { value: MapNav; children: ReactNode }) {
  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
}

export const useMapNav = () => useContext(MapContext);

/**
 * A link from one dock to another.
 *
 * On desktop it flies the camera; on mobile, where the docks are a normal
 * column, it falls through to the browser's own anchor jump. Rendering a real
 * anchor either way means it still works before hydration and shows a target on
 * hover.
 */
export function DockLink({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: ReactNode;
}) {
  const { goToDockId } = useMapNav();
  const isDesktop = useIsDesktop();

  return (
    <Link
      href={`#${to}`}
      className={className}
      onClick={(event) => {
        if (!isDesktop) return;
        event.preventDefault();
        goToDockId(to);
      }}
    >
      {children}
    </Link>
  );
}
