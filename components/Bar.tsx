"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { site } from "@/content/site";
import { thread } from "@/content/thread";
import { useSeen } from "@/components/SeenContext";

/**
 * The persistent header: who sent this, how much of it you have read, and the
 * way to reply.
 *
 * Deliberately not a nav. A thread does not have a menu — the FAQ is reachable
 * from inside the thread and from the footer, which is where a reader would
 * look for it anyway.
 */
export function Bar() {
  const { count, total } = useSeen();
  const pathname = usePathname();
  const onReply = pathname === "/apply";
  // The count belongs to the thread, so it only appears where the thread is.
  const onThread = pathname === "/";

  return (
    <header className="bar">
      <Link href="/" className="bar-sender">
        <span className="full">{site.name}</span>
        <span className="short">HH</span>
        <span className="sr-only">Back to the thread</span>
      </Link>

      <div className="bar-right">
        {onThread ? (
          <p className="bar-count" aria-live="polite">
            <span className="label">{thread.seenLabel}</span>
            <span>
              <b>{String(count).padStart(2, "0")}</b>
              <span aria-hidden="true"> / </span>
              <span className="sr-only"> of </span>
              {total}
            </span>
          </p>
        ) : null}

        {onReply ? (
          <Link href="/" className="bar-reply">Thread</Link>
        ) : (
          <Link href={thread.reply.href} className="bar-reply">{thread.reply.label}</Link>
        )}
      </div>
    </header>
  );
}
