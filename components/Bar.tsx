import Link from "next/link";
import { site } from "@/content/site";

/**
 * Header for the pages that are not the chat. Deliberately not a nav — the
 * conversation is the navigation, and this is the way back into it.
 */
export function Bar({ action }: { action: { label: string; href: string } }) {
  return (
    <header className="bar">
      <Link href="/" className="bar-sender">
        {site.name}
        <span className="sr-only">— back to the conversation</span>
      </Link>
      <Link href={action.href} className="bar-reply">{action.label}</Link>
    </header>
  );
}
