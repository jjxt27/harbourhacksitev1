"use client";

import Link from "next/link";
import { createContext, useContext, type ReactNode } from "react";
import { zones } from "@/content/canvas";
import { useIsDesktop } from "@/hooks/useMediaQuery";

type DeckNav = {
  goToZone: (index: number) => void;
  activeZone: number;
};

const DeckContext = createContext<DeckNav>({ goToZone: () => {}, activeZone: 0 });

export function DeckProvider({ value, children }: { value: DeckNav; children: ReactNode }) {
  return <DeckContext.Provider value={value}>{children}</DeckContext.Provider>;
}

export const useDeckNav = () => useContext(DeckContext);

/**
 * A link from one chapter to another.
 *
 * On desktop it pans the deck; on mobile, where the chapters are an ordinary
 * column, it falls through to the browser's own anchor jump. Rendering a real
 * anchor either way means it works before hydration and shows a destination on
 * hover, which a button never does.
 */
export function ChapterLink({
  to,
  className,
  children,
}: {
  to: string;
  className?: string;
  children: ReactNode;
}) {
  const { goToZone } = useDeckNav();
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
