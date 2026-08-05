"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { chat, typingFor } from "@/content/thread";
import { facts, site } from "@/content/site";
import { Arrow } from "@/components/Arrow";

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribe = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

/** Beat before the sender starts typing, when a message does not set its own. */
const DEFAULT_PAUSE = 420;
/** How close to the bottom still counts as "following along". */
const STICK = 90;

/**
 * The conversation, delivered live.
 *
 * Undelivered messages are rendered but hidden by CSS behind `.js`, which does
 * three things at once: the reader cannot scroll ahead to skip the sequence
 * (there is nothing below the latest bubble to scroll to), search engines and
 * readers without scripting get the whole conversation, and there is no layout
 * shift as each bubble lands.
 *
 * Timing content out is a WCAG 2.2.1 problem, so the sequence is always
 * skippable, and anyone who has asked for reduced motion gets the whole thing
 * immediately rather than being made to wait.
 */
export function Chat() {
  const total = chat.messages.length;
  const [delivered, setDelivered] = useState(0);
  const [typing, setTyping] = useState(false);
  const [stuck, setStuck] = useState(true);

  const skipped = useRef(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const reduced = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(REDUCED).matches,
    () => false,
  );

  const shown = reduced ? total : delivered;
  const done = shown >= total;

  const skip = useCallback(() => {
    skipped.current = true;
    setTyping(false);
    setDelivered(total);
  }, [total]);

  // The delivery chain. Every state change happens inside a timer callback,
  // never in the effect body.
  useEffect(() => {
    if (reduced || skipped.current) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const step = (index: number) => {
      if (cancelled || skipped.current || index >= chat.messages.length) return;
      const message = chat.messages[index];

      timer = setTimeout(() => {
        if (cancelled || skipped.current) return;
        setTyping(true);

        timer = setTimeout(() => {
          if (cancelled || skipped.current) return;
          setTyping(false);
          setDelivered(index + 1);
          step(index + 1);
        }, message.typing ?? typingFor(message.text ?? ""));
      }, message.pause ?? DEFAULT_PAUSE);
    };

    step(0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reduced]);

  // Scrolls the container itself rather than an end marker, which would stop
  // short of the log's bottom padding and leave a gap under the last bubble.
  const toBottom = useCallback(
    (smooth: boolean) => {
      const el = scrollRef.current;
      if (!el) return;
      el.scrollTo({ top: el.scrollHeight, behavior: smooth ? "smooth" : "auto" });
    },
    [],
  );

  // Follow the conversation down, but never yank a reader who has scrolled up.
  useEffect(() => {
    if (!stuck) return;
    toBottom(!reduced);
  }, [shown, typing, stuck, reduced, toBottom]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setStuck(el.scrollHeight - el.scrollTop - el.clientHeight < STICK);
  };

  return (
    <div className="chat">
      <header className="chat-head">
        <span className="chat-avatar" aria-hidden="true">HH</span>
        <span className="chat-who">
          <b>{chat.sender}</b>
          <i data-typing={typing}>{typing ? chat.typingStatus : chat.status}</i>
        </span>
        {!done ? (
          <button type="button" className="chat-skip" onClick={skip}>{chat.skip}</button>
        ) : null}
      </header>

      <div className="chat-scroll" ref={scrollRef} onScroll={onScroll}>
        <div className="chat-log">
          <p className="chat-day">{chat.dayLabel}</p>

          <ol aria-live="polite" aria-relevant="additions">
            {chat.messages.map((message, i) => {
              const isShown = i < shown;
              const prev = chat.messages[i - 1];
              // A run of messages in the same minute reads as one burst, so
              // only the first of a run gets the tail.
              const starts = !prev || prev.time !== message.time;

              return (
                <li
                  key={message.id}
                  className="bubble-row"
                  data-shown={isShown}
                  data-start={starts}
                >
                  {message.kind === "cta" && message.card ? (
                    <div className="bubble bubble-card">
                      <Link href={message.card.href} className="card">
                        <b>{message.card.title}</b>
                        <span>{message.card.body}</span>
                        <em>{message.card.label} <Arrow /></em>
                      </Link>
                      <time>{message.time}</time>
                    </div>
                  ) : message.kind === "facts" ? (
                    <div className="bubble bubble-facts">
                      <dl>
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
                      <time>{message.time}</time>
                    </div>
                  ) : message.href ? (
                    <Link href={message.href} className="bubble bubble-link">
                      {message.text}
                      <Arrow />
                      <time>{message.time}</time>
                    </Link>
                  ) : (
                    <p className="bubble">
                      {message.text}
                      <time>{message.time}</time>
                    </p>
                  )}
                </li>
              );
            })}
          </ol>

          {typing ? (
            <div className="bubble bubble-typing" aria-hidden="true">
              <i /><i /><i />
            </div>
          ) : null}

        </div>
      </div>

      {!stuck ? (
        <button
          type="button"
          className="chat-jump"
          onClick={() => {
            setStuck(true);
            toBottom(true);
          }}
        >
          {chat.jump}
        </button>
      ) : null}

      <div className="chat-composer">
        <Link href={chat.composer.href} className="chat-input">
          {chat.composer.placeholder}
        </Link>
        <Link href={chat.composer.href} className="chat-send" data-ready={done}>
          <span>{chat.composer.action}</span>
          <Arrow />
        </Link>
      </div>

      <p className="sr-only">
        {site.name} — {site.description}
      </p>
    </div>
  );
}
