"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { thread } from "@/content/thread";
import { facts } from "@/content/site";
import { useSeen } from "@/components/SeenContext";
import { Arrow } from "@/components/Arrow";

const id = (group: number, message: number) => `${group}-${message}`;

/**
 * The homepage thread.
 *
 * Messages start dim and turn bone as they are marked seen, which is the
 * page's one piece of choreography: reading it lights it up, and the bar
 * counts what you have read.
 *
 * Both states are legible on their own — dim is contrast-checked, not a way of
 * hiding text — and the dim state lives behind `.js`, so a reader without
 * scripting gets the whole thread at full contrast.
 */
export function Thread() {
  const { isSeen, mark, reduced, count, total } = useSeen();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    // Under reduced motion every message is already seen, so there is nothing
    // to observe.
    if (!root || reduced) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const arrived: string[] = [];
        for (const entry of entries) {
          // Count a message once it reaches the reading band, and also once it
          // has passed above it — otherwise a fast scroll reaches the closing
          // line with half the thread still unread, which reads as a bug
          // rather than as an honest count.
          const passed =
            !entry.isIntersecting &&
            entry.rootBounds !== null &&
            entry.boundingClientRect.bottom <= entry.rootBounds.top;

          if (!entry.isIntersecting && !passed) continue;

          const key = (entry.target as HTMLElement).dataset.msgId;
          if (key) arrived.push(key);
          observer.unobserve(entry.target);
        }
        mark(arrived);
      },
      // The lower bound stays shallow on purpose: the closing group sits just
      // above the footer, and a deeper band would leave the thread reading
      // 20 of 22 at the exact moment the last line claims it reached you.
      { rootMargin: "-10% 0px -8% 0px", threshold: 0.35 },
    );

    for (const node of root.querySelectorAll("[data-msg-id]")) observer.observe(node);
    return () => observer.disconnect();
  }, [mark, reduced]);

  return (
    <div ref={containerRef} className="thread">
      <div className="receipts" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span key={i} data-on={i < count} />
        ))}
      </div>

      {thread.groups.map((group, g) => {
        const groupSeen = group.messages.some((_, m) => isSeen(id(g, m)));

        return (
          <section key={group.time} className="group" data-seen={groupSeen}>
            <div className="group-rail">
              <time dateTime={`2026-10-01T${group.time}`}>{group.time}</time>
              <span className="group-mark" aria-hidden="true" />
            </div>

            <div className="group-messages">
              {group.messages.map((message, m) => {
                const key = id(g, m);
                const className = [
                  "msg",
                  message.tone === "lead" && "msg-lead",
                  message.tone === "aside" && "msg-aside",
                ]
                  .filter(Boolean)
                  .join(" ");

                // Staggered so a group entering the viewport together arrives
                // one message at a time, the way it would have been sent.
                const style = { transitionDelay: `${m * 90}ms` };

                if (message.href) {
                  return (
                    <Link
                      key={key}
                      href={message.href}
                      className={className}
                      style={style}
                      data-msg-id={key}
                      data-seen={isSeen(key)}
                    >
                      {message.text}
                    </Link>
                  );
                }

                return (
                  <p
                    key={key}
                    className={className}
                    style={style}
                    data-msg-id={key}
                    data-seen={isSeen(key)}
                  >
                    {message.text}
                  </p>
                );
              })}

              {group.attachment === "facts" ? (
                <dl className="facts">
                  {facts.map((fact) => (
                    <div key={fact.key}>
                      <dt>{fact.key}</dt>
                      <dd>
                        {fact.date?.iso ? (
                          <time dateTime={fact.date.iso}>{fact.value}</time>
                        ) : (
                          fact.value
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
              ) : null}

              {g === thread.groups.length - 1 ? (
                <Link href={thread.reply.href} className="action">
                  {thread.reply.label}
                  <Arrow />
                </Link>
              ) : null}
            </div>
          </section>
        );
      })}
    </div>
  );
}
