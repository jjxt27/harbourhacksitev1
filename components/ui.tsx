import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[86rem] px-5 sm:px-8 lg:px-12", className)}>{children}</div>;
}

export function Label({
  children,
  className,
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: "span" | "h2" | "h3" | "p";
}) {
  return <Tag className={cn("font-mono text-label font-medium uppercase text-ink-muted", className)}>{children}</Tag>;
}

type ButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "text";
  className?: string;
} & Omit<ComponentPropsWithoutRef<"a">, "href" | "className" | "children">;

export function Button({ children, href, variant = "primary", className, ...rest }: ButtonProps) {
  const external = href.startsWith("mailto:") || href.startsWith("http");
  const Tag = external ? "a" : Link;

  return (
    <Tag
      href={href}
      className={cn(
        variant === "primary"
          ? "inline-flex rounded-md bg-signal px-7 py-4 text-body-sm font-bold uppercase tracking-[0.08em] text-[#05080d] transition-transform hover:scale-[0.985] active:scale-[0.97]"
          : "border-b border-signal pb-1 font-mono text-label font-medium uppercase text-ink transition-colors hover:text-signal",
        className,
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}
