"use client";

import Link from "next/link";
import { createContext, useContext, type ReactNode } from "react";
import { zones } from "@/content/canvas";
import { useIsDesktop } from "@/hooks/useMediaQuery";

type CanvasNav = {
  goToZone: (index: number) => void;
  activeZone: number;
};

const CanvasContext = createContext<CanvasNav>({ goToZone: () => {}, activeZone: 0 });

export function CanvasProvider({ value, children }: { value: CanvasNav; children: ReactNode }) {
  return <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>;
}

export const useCanvasNav = () => useContext(CanvasContext);

/**
 * A link between zones.
 *
 * On desktop it pans the canvas; on mobile, where the zones are a normal
 * column, it falls through to the browser's own anchor jump. Rendering a real
 * anchor either way means it still works before hydration and shows a target
 * on hover.
 */
export function ZoneLink({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: ReactNode;
}) {
  const { goToZone } = useCanvasNav();
  const isDesktop = useIsDesktop();
  const index = zones.findIndex((zone) => zone.id === to);

  return (
    <Link
      href={`#${to}`}
      className={className}
      onClick={(event) => {
        if (!isDesktop || index < 0) return;
        event.preventDefault();
        goToZone(index);
      }}
    >
      {children}
    </Link>
  );
}
